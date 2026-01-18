import { useState, useEffect } from 'react'
import { api } from './services/api'
import { Plus, Trash2, Edit2, Check, X, Clock, Sun, Moon, ArrowRight, User } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

type FilterType = 'all' | 'pending' | 'completed';

export default function App() {
  // --- ESTADOS GERAIS ---
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  
  // --- ESTADOS DO FORMULÁRIO DE TAREFA ---
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  
  // --- UX: IDENTIDADE, HORA E TEMA ---
  const [userName, setUserName] = useState('')
  const [tempName, setTempName] = useState('') // O que o usuário está digitando
  const [isNameSet, setIsNameSet] = useState(false) // Se já configurou o nome
  
  const [greeting, setGreeting] = useState('Olá')
  const [currentTime, setCurrentTime] = useState('')
  const [darkMode, setDarkMode] = useState(true)

  // 1. EFEITO INICIAL: RECUPERAR NOME SALVO E TEMA
  useEffect(() => {
    // Tenta pegar o nome do navegador
    const savedName = localStorage.getItem('taskManagerUser')
    if (savedName) {
      setUserName(savedName)
      setIsNameSet(true)
    }
  }, [])

  // 2. EFEITO: RELÓGIO E SAUDAÇÃO
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      const timeString = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      setCurrentTime(timeString)
      
      const hour = now.getHours()
      if (hour >= 5 && hour < 12) setGreeting('Bom dia')
      else if (hour >= 12 && hour < 18) setGreeting('Boa tarde')
      else setGreeting('Boa noite')
    }
    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [])

  // 3. API: BUSCAR TAREFAS
  const fetchTasks = async (status?: boolean) => {
    setLoading(true)
    try {
      const params = status !== undefined ? { completed: status } : {}
      const response = await api.get('/tasks/', { params })
      setTasks(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isNameSet) { // Só busca tarefas se já tiver entrado no app
      if (filter === 'all') fetchTasks()
      if (filter === 'pending') fetchTasks(false)
      if (filter === 'completed') fetchTasks(true)
    }
  }, [filter, isNameSet])

  // --- ACTIONS ---
  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!tempName.trim()) return
    localStorage.setItem('taskManagerUser', tempName) // Salva pra sempre
    setUserName(tempName)
    setIsNameSet(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('taskManagerUser')
    setIsNameSet(false)
    setUserName('')
    setTempName('')
  }

  const handleSaveTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title) return

    try {
      if (editingTask) {
        await api.patch(`/tasks/${editingTask.id}`, { title, description })
      } else {
        await api.post('/tasks/', { title, description })
      }
      setIsModalOpen(false)
      
      if (filter === 'all') {
        fetchTasks()
      } else {
        fetchTasks(filter === 'completed')
      }
      
    } catch (error) {
      console.error(error)
    }
  }

  const toggleTask = async (task: Task) => {
    const newStatus = !task.completed
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, completed: newStatus } : t))
    await api.patch(`/tasks/${task.id}`, { completed: newStatus })
  }

  const deleteTask = async (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id))
    await api.delete(`/tasks/${id}`)
  }

  // ABRIR MODAL
  const openModal = (task?: Task) => {
    if (task) {
      setEditingTask(task)
      setTitle(task.title)
      setDescription(task.description || '')
    } else {
      setEditingTask(null)
      setTitle('')
      setDescription('')
    }
    setIsModalOpen(true)
  }

  // --- RENDERIZAÇÃO ---

  // TELA 1: ONBOARDING (PERGUNTA O NOME)
  if (!isNameSet) {
    return (
      <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4 text-white font-sans relative overflow-hidden">
        {/* Fundo Decorativo */}
        <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-brand-green/10 rounded-full blur-[120px] pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-sm z-10"
        >
          <div className="mb-8 text-center">
            <div className="w-16 h-16 bg-brand-surface rounded-2xl flex items-center justify-center mx-auto mb-4 border border-brand-green/20 shadow-[0_0_30px_rgba(26,178,110,0.2)]">
              <User className="text-brand-green" size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">Bem-vindo</h1>
            <p className="text-gray-400">Como você gostaria de ser chamado?</p>
          </div>

          <form onSubmit={handleNameSubmit} className="space-y-4">
            <div className="relative">
              <input 
                autoFocus
                type="text" 
                placeholder="Seu nome..." 
                value={tempName}
                onChange={e => setTempName(e.target.value)}
                className="w-full bg-[#1E1E1E] border border-gray-700 rounded-xl p-4 pl-4 text-white text-lg focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition-all"
              />
            </div>
            <button 
              type="submit"
              disabled={!tempName.trim()} 
              className="w-full bg-brand-green text-brand-dark font-bold text-lg py-4 rounded-xl hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Começar <ArrowRight size={20} />
            </button>
          </form>
        </motion.div>
      </div>
    )
  }

  // TELA 2: O APP (JÁ COM O NOME)
  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className={`min-h-screen transition-colors duration-500 flex items-center justify-center p-4 font-sans 
        ${darkMode ? 'bg-[#121212] text-brand-light' : 'bg-gray-100 text-gray-800'} relative overflow-hidden`}
      >
        
        {/* BACKGROUND DEGRADÊ */}
        {darkMode && (
          <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[120px] pointer-events-none" />
        )}

        <div className="w-full max-w-md min-h-[800px] relative flex flex-col z-10">
          
          {/* HEADER */}
          <header className="pt-8 pb-6 px-4 flex justify-between items-end">
            <div>
              <motion.div 
                key={greeting}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2"
              >
                <h1 className={`text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {greeting}, {userName}
                </h1>
                {/* Botão Sair/Trocar nome (pequeno e discreto) */}
                <button onClick={handleLogout} className="opacity-0 hover:opacity-100 transition-opacity text-xs text-red-400 underline ml-2">
                  (sair)
                </button>
              </motion.div>
              <p className={`text-sm font-medium mt-1 ${darkMode ? 'text-brand-green/80' : 'text-green-600'}`}>
                {currentTime} • {tasks.length} tarefas hoje
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-full transition-colors ${darkMode ? 'bg-white/10 text-yellow-300' : 'bg-gray-200 text-gray-600'}`}
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              {/* Botão (+) Desktop (Header) */}
              {tasks.length > 0 && (
                <motion.button
                  initial={{ scale: 0 }} animate={{ scale: 1 }}
                  onClick={() => openModal()}
                  className="hidden md:flex bg-brand-green text-brand-dark p-3 rounded-xl hover:bg-[#15965A] transition-colors shadow-lg items-center gap-2 font-bold"
                >
                  <Plus size={20} strokeWidth={3} />
                </motion.button>
              )}
            </div>
          </header>

          {/* FILTROS */}
          <div className="px-4 mb-6 flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[
              { id: 'all', label: 'Todas' },
              { id: 'pending', label: 'Pendentes' },
              { id: 'completed', label: 'Concluídas' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as FilterType)}
                className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap border ${
                  filter === tab.id 
                    ? 'bg-brand-green text-brand-dark border-brand-green shadow-lg shadow-brand-green/20' 
                    : darkMode 
                      ? 'bg-black/30 text-gray-400 border-white/10 hover:border-white/30' 
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* LISTA DE TAREFAS */}
          <div className="flex-1 px-4 pb-24 overflow-y-auto space-y-3 custom-scrollbar">
            
            {/* EMPTY STATE (BOTÃO NO MEIO - AGORA SÓ O SÍMBOLO) */}
            {!loading && tasks.length === 0 && (
              <div className="flex flex-col items-center justify-center h-[300px] gap-6">
                <p className={`text-lg ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>
                  Lista vazia. Comece agora!
                </p>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => openModal()}
                  className="w-20 h-20 bg-brand-green text-brand-dark rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(26,178,110,0.3)] transition-all"
                >
                  <Plus size={40} strokeWidth={2.5} />
                </motion.button>
              </div>
            )}

            <AnimatePresence mode='popLayout'>
              {tasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group p-4 rounded-2xl border transition-all shadow-sm relative overflow-hidden ${
                    darkMode 
                      ? 'bg-[#1E1E1E]/80 backdrop-blur-sm border-white/5 hover:border-brand-green/30' 
                      : 'bg-white border-gray-100 hover:border-green-300 hover:shadow-md'
                  }`}
                >
                  {task.completed && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-green shadow-[0_0_10px_#1AB26E]"></div>
                  )}

                  <div className="flex items-start gap-4">
                    <button 
                      onClick={() => toggleTask(task)}
                      className={`mt-1 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        task.completed 
                          ? 'bg-brand-green border-brand-green text-brand-dark' 
                          : darkMode ? 'border-gray-600 hover:border-brand-green' : 'border-gray-300 hover:border-green-500'
                      }`}
                    >
                      {task.completed && <Check size={14} strokeWidth={4} />}
                    </button>

                    <div className="flex-1">
                      <h3 className={`font-semibold text-lg leading-tight transition-all ${
                        task.completed 
                          ? 'text-gray-500 line-through' 
                          : darkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {task.title}
                      </h3>
                      
                      {task.description && (
                        <p className={`text-sm mt-1 line-clamp-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                          {task.description}
                        </p>
                      )}

                      <div className={`flex items-center gap-4 mt-3 text-xs ${darkMode ? 'text-brand-light/50' : 'text-gray-400'}`}>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{currentTime}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openModal(task)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode ? 'bg-black/40 text-brand-light hover:text-brand-green' : 'bg-gray-100 text-gray-600 hover:text-green-600'
                        }`}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => deleteTask(task.id)}
                        className={`p-2 rounded-lg transition-colors ${
                          darkMode ? 'bg-black/40 text-brand-light hover:text-red-500' : 'bg-gray-100 text-gray-600 hover:text-red-500'
                        }`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* BOTÃO MOBILE (FAB) */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => openModal()}
            className="md:hidden fixed bottom-8 right-8 w-14 h-14 bg-brand-green rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(26,178,110,0.5)] text-brand-dark z-20"
          >
            <Plus size={28} />
          </motion.button>

          {/* MODAL (FORMULÁRIO DE CRIAR/EDITAR) */}
          <AnimatePresence>
            {isModalOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                  onClick={() => setIsModalOpen(false)}
                />
                
                <motion.div
                  initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className={`fixed bottom-0 left-0 right-0 rounded-t-[30px] p-6 z-50 max-w-md mx-auto border-t ${
                    darkMode ? 'bg-[#1E1E1E] border-brand-green/20' : 'bg-white border-gray-200'
                  }`}
                >
                  <div className={`w-12 h-1 rounded-full mx-auto mb-6 ${darkMode ? 'bg-gray-700' : 'bg-gray-300'}`} />
                  
                  <div className="flex justify-between items-center mb-6">
                    <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className={darkMode ? 'text-gray-400' : 'text-gray-500'}>
                      <X size={24} />
                    </button>
                  </div>

                  <form onSubmit={handleSaveTask} className="space-y-4">
                    <div>
                      <input 
                        autoFocus
                        type="text" 
                        placeholder="O que vamos fazer?" 
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        className={`w-full border rounded-xl p-4 focus:outline-none focus:ring-1 transition-all ${
                          darkMode 
                            ? 'bg-[#121212] border-gray-700 text-white focus:border-brand-green focus:ring-brand-green' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500'
                        }`}
                      />
                    </div>
                    
                    <div>
                      <textarea 
                        placeholder="Detalhes (opcional)" 
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        className={`w-full border rounded-xl p-4 focus:outline-none focus:ring-1 transition-all resize-none ${
                          darkMode 
                            ? 'bg-[#121212] border-gray-700 text-white focus:border-brand-green focus:ring-brand-green' 
                            : 'bg-gray-50 border-gray-200 text-gray-900 focus:border-green-500 focus:ring-green-500'
                        }`}
                      />
                    </div>

                    <button 
                      type="submit" 
                      className="w-full bg-brand-green text-brand-dark font-bold text-lg py-4 rounded-xl mt-4 hover:brightness-110 transition-all shadow-lg"
                    >
                      {editingTask ? 'Salvar' : 'Criar Tarefa'}
                    </button>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}