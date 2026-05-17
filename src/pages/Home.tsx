import React, { useState, useEffect } from 'react'
import { 
  LayoutDashboard, 
  Zap, 
  FileText, 
  Image as ImageIcon, 
  Video, 
  MonitorSmartphone, 
  BarChart3, 
  Settings,
  Rocket,
  CheckCircle,
  Loader2,
  Play,
  Eye,
  ThumbsUp,
  TrendingUp,
  Plus
} from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// 模拟数据
const mockProjects = [
  { id: '1', name: '科技新品测评', status: 'published', createdAt: '2024-01-15', updatedAt: '2024-01-20' },
  { id: '2', name: '生活小技巧', status: 'editing', createdAt: '2024-01-18', updatedAt: '2024-01-21' },
  { id: '3', name: '职场干货分享', status: 'planning', createdAt: '2024-01-20', updatedAt: '2024-01-21' }
]

const mockVideos = [
  { id: '1', title: '2024旗舰手机横评', platforms: ['抖音', 'B站', '小红书'], views: 158000, likes: 8200, status: 'published' },
  { id: '2', title: '厨房收纳教程', platforms: ['抖音', '小红书'], views: 76000, likes: 4500, status: 'published' }
]

const mockAnalytics = {
  totalVideos: 2,
  totalViews: 234000,
  totalLikes: 12700,
  avgViews: 117000,
  platformStats: [
    { platform: '抖音', views: 120000, likes: 6500 },
    { platform: 'B站', views: 64000, likes: 3500 },
    { platform: '小红书', views: 50000, likes: 2700 }
  ],
  trendData: [
    { date: '1/15', views: 45000, likes: 2400 },
    { date: '1/16', views: 52000, likes: 2800 },
    { date: '1/17', views: 48000, likes: 2600 },
    { date: '1/18', views: 61000, likes: 3200 },
    { date: '1/19', views: 55000, likes: 2900 },
    { date: '1/20', views: 58000, likes: 3100 },
    { date: '1/21', views: 63000, likes: 3400 }
  ]
}

const agentNames = ['选题策划', '文案创作', '素材检索', '视频剪辑', '平台适配', '数据分析']
const agentIcons = {
  '选题策划': Zap,
  '文案创作': FileText,
  '素材检索': ImageIcon,
  '视频剪辑': Video,
  '平台适配': MonitorSmartphone,
  '数据分析': BarChart3
}

const reasoningSteps = [
  '分析当前热点趋势',
  '收集用户画像数据',
  '识别内容风险点',
  '生成初步选题方向',
  '评估选题商业价值',
  '筛选最优选题方案',
  '设计内容结构框架',
  '撰写口播文案初稿',
  '生成分镜头脚本',
  '匹配相关素材资源',
  '进行内容合规检查',
  '优化文案表达方式',
  '准备视频剪辑工程',
  '配置多平台发布参数',
  '生成最终执行方案'
]

export default function Home() {
  const [currentPage, setCurrentPage] = useState('dashboard')
  const [isPipelineRunning, setIsPipelineRunning] = useState(false)
  const [currentStep, setCurrentStep] = useState('')
  const [pipelineProgress, setPipelineProgress] = useState(0)
  const [agents, setAgents] = useState(agentNames.map(name => ({ name, status: 'idle', progress: 0, output: null })))
  const [keywords, setKeywords] = useState('')

  // Dashboard组件
  const Dashboard = () => {
    const StatCard = ({ title, value, icon: Icon, color, suffix = '' }) => (
      <div 
        className="p-6 rounded-xl text-white shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
        style={{ background: `linear-gradient(135deg, ${color.from}, ${color.to})` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-white/20 rounded-lg">
            <Icon size={24} />
          </div>
        </div>
        <h3 className="text-white/80 text-sm font-medium">{title}</h3>
        <p className="text-3xl font-bold mt-2">{value}{suffix}</p>
      </div>
    )

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">数据看板</h1>
            <p className="text-gray-500 mt-1">多模态短视频内容自动化生产与分发系统</p>
          </div>
          <button
            onClick={() => setCurrentPage('pipeline')}
            className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition-all shadow-lg hover:shadow-xl"
          >
            <Rocket size={20} />
            启动流水线
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="视频总数" value={mockAnalytics.totalVideos} icon={Play} color={{ from: '#3b82f6', to: '#1d4ed8' }} />
          <StatCard title="总播放量" value={mockAnalytics.totalViews.toLocaleString()} icon={Eye} color={{ from: '#8b5cf6', to: '#6d28d9' }} />
          <StatCard title="总点赞数" value={mockAnalytics.totalLikes.toLocaleString()} icon={ThumbsUp} color={{ from: '#f97316', to: '#ea580c' }} />
          <StatCard title="平均播放" value={mockAnalytics.avgViews.toLocaleString()} icon={TrendingUp} color={{ from: '#10b981', to: '#059669' }} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">数据趋势</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockAnalytics.trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="views" stroke="#3b82f6" strokeWidth={2} name="播放量" />
                  <Line type="monotone" dataKey="likes" stroke="#f97316" strokeWidth={2} name="点赞数" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">平台分布</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mockAnalytics.platformStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="platform" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="views" fill="#3b82f6" name="播放量" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="likes" fill="#f97316" name="点赞数" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">最近视频</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">标题</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">平台</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">播放量</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">点赞数</th>
                  <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">状态</th>
                </tr>
              </thead>
              <tbody>
                {mockVideos.map((video) => (
                  <tr key={video.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4"><span className="font-medium text-gray-900">{video.title}</span></td>
                    <td className="py-3 px-4">
                      <div className="flex gap-1">
                        {video.platforms.map((p, i) => (
                          <span key={i} className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">{p}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600">{video.views.toLocaleString()}</td>
                    <td className="py-3 px-4 text-gray-600">{video.likes.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${video.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        {video.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  // Pipeline组件
  const Pipeline = () => {
    const runPipeline = async () => {
      setIsPipelineRunning(true)
      setPipelineProgress(0)
      setAgents(agentNames.map(name => ({ name, status: 'idle', progress: 0, output: null })))
      
      // 模拟流水线执行
      for (let i = 0; i < reasoningSteps.length; i++) {
        await new Promise(r => setTimeout(r, 300))
        setCurrentStep(reasoningSteps[i])
        const progress = Math.round(((i + 1) / reasoningSteps.length) * 100)
        setPipelineProgress(progress)
        
        // 更新Agent状态
        const agentIndex = Math.floor(i / 2.5)
        if (agentIndex < agents.length) {
          setAgents(prev => prev.map((a, idx) => {
            if (idx < agentIndex) return { ...a, status: 'completed', progress: 100 }
            if (idx === agentIndex) return { ...a, status: 'running', progress: Math.min(100, ((i % 3) + 1) * 33) }
            return a
          }))
        }
      }
      
      // 标记所有Agent为完成
      setAgents(agentNames.map(name => ({ name, status: 'completed', progress: 100, output: {} })))
      setIsPipelineRunning(false)
    }

    const getStatusColor = (status) => {
      switch (status) {
        case 'completed': return 'bg-green-500'
        case 'running': return 'bg-blue-500 animate-pulse'
        case 'error': return 'bg-red-500'
        default: return 'bg-gray-300'
      }
    }

    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Agent流水线</h1>
            <p className="text-gray-500 mt-1">15步长链推理流程自动生成短视频</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="text"
              placeholder="输入关键词（可选）"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              disabled={isPipelineRunning}
              className="flex-1 min-w-[200px] px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              onClick={runPipeline}
              disabled={isPipelineRunning}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPipelineRunning ? <Loader2 className="animate-spin" size={20} /> : <Rocket size={20} />}
              {isPipelineRunning ? '运行中...' : '启动流水线'}
            </button>
          </div>

          {isPipelineRunning && (
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">{currentStep}</span>
                <span className="font-medium text-blue-600">{pipelineProgress}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-orange-500 transition-all duration-300"
                  style={{ width: `${pipelineProgress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, index) => {
            const Icon = agentIcons[agent.name]
            return (
              <div
                key={index}
                className={`bg-white p-5 rounded-xl border shadow-sm transition-all ${agent.status === 'running' ? 'border-blue-500 ring-2 ring-blue-100' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      agent.status === 'completed' ? 'bg-green-100' :
                      agent.status === 'running' ? 'bg-blue-100' : 'bg-gray-100'
                    }`}>
                      <Icon
                        size={20}
                        className={
                          agent.status === 'completed' ? 'text-green-600' :
                          agent.status === 'running' ? 'text-blue-600' : 'text-gray-500'
                        }
                      />
                    </div>
                    <h3 className="font-semibold text-gray-900">{agent.name}Agent</h3>
                  </div>
                  {agent.status === 'completed' ? <CheckCircle className="text-green-500" size={20} /> :
                   agent.status === 'running' ? <Loader2 className="text-blue-500 animate-spin" size={20} /> : null}
                </div>
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${getStatusColor(agent.status)}`}
                    style={{ width: `${agent.progress}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-right">{agent.progress}%</p>
              </div>
            )
          })}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">15步长链推理流程</h3>
          <div className="space-y-3">
            {reasoningSteps.map((step, index) => {
              const stepProgress = (index + 1) / reasoningSteps.length * 100
              const isCompleted = stepProgress <= pipelineProgress
              const isActive = Math.abs(stepProgress - pipelineProgress) < 10 || (stepProgress > pipelineProgress && stepProgress - pipelineProgress < 15)
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                    isCompleted ? 'bg-green-50' : isActive && isPipelineRunning ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    isCompleted ? 'bg-green-500 text-white' : isActive && isPipelineRunning ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                  }`}>
                    {isCompleted ? <CheckCircle size={16} /> : index + 1}
                  </div>
                  <span className={`flex-1 ${
                    isCompleted ? 'text-green-700' : isActive && isPipelineRunning ? 'text-blue-700 font-medium' : 'text-gray-500'
                  }`}>
                    {step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // 占位页面组件
  const PlaceholderPage = ({ title }) => (
    <div className="p-6">
      <div className="bg-white p-12 rounded-xl shadow-sm border text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500">此页面正在开发中，敬请期待...</p>
      </div>
    </div>
  )

  // 渲染当前页面
  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard': return <Dashboard />
      case 'pipeline': return <Pipeline />
      case 'topics': return <PlaceholderPage title="选题策划" />
      case 'materials': return <PlaceholderPage title="素材管理" />
      case 'editing': return <PlaceholderPage title="视频剪辑" />
      case 'platforms': return <PlaceholderPage title="多平台适配" />
      case 'analytics': return <PlaceholderPage title="数据分析" />
      case 'settings': return <PlaceholderPage title="系统设置" />
      default: return <Dashboard />
    }
  }

  const navItems = [
    { id: 'dashboard', label: '数据看板', icon: LayoutDashboard },
    { id: 'pipeline', label: 'Agent流水线', icon: Zap },
    { id: 'topics', label: '选题策划', icon: FileText },
    { id: 'materials', label: '素材管理', icon: ImageIcon },
    { id: 'editing', label: '视频剪辑', icon: Video },
    { id: 'platforms', label: '多平台适配', icon: MonitorSmartphone },
    { id: 'analytics', label: '数据分析', icon: BarChart3 },
    { id: 'settings', label: '系统设置', icon: Settings }
  ]

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-64 bg-gradient-to-b from-slate-900 to-slate-800 text-white flex-shrink-0">
        <div className="p-6">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Zap className="text-orange-500" />
            短视频Agent
          </h1>
          <p className="text-slate-400 text-sm mt-1">智能内容生产平台</p>
        </div>
        
        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <button
                key={item.id}
                onClick={() => setCurrentPage(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  currentPage === item.id ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            )
          })}
        </nav>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b px-6 py-4 flex items-center justify-between">
          <div></div>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold">
              U
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  )
}
