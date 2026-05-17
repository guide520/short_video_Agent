
import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store';
import { Rocket, CheckCircle, Loader2, Zap, FileText, Search, Film, MonitorSmartphone, BarChart3 } from 'lucide-react';

const Pipeline: React.FC = () => {
  const { 
    agents, 
    reasoningSteps, 
    isPipelineRunning, 
    currentStep, 
    pipelineProgress,
    fetchAgentStatus, 
    runPipeline 
  } = useAppStore();
  
  const [keywords, setKeywords] = useState('');

  useEffect(() => {
    fetchAgentStatus();
  }, [fetchAgentStatus]);

  const agentIcons: Record<string, any> = {
    '选题策划': Zap,
    '文案创作': FileText,
    '素材检索': Search,
    '视频剪辑': Film,
    '平台适配': MonitorSmartphone,
    '数据分析': BarChart3
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'running':
        return 'bg-blue-500 animate-pulse';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

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
            onClick={() => runPipeline(keywords || undefined)}
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
          const Icon = agentIcons[agent.name] || Zap;
          return (
            <div
              key={index}
              className={`bg-white p-5 rounded-xl border shadow-sm transition-all ${
                agent.status === 'running' ? 'border-blue-500 ring-2 ring-blue-100' : ''
              }`}
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
                {agent.status === 'completed' ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : agent.status === 'running' ? (
                  <Loader2 className="text-blue-500 animate-spin" size={20} />
                ) : null}
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${getStatusColor(agent.status)}`}
                  style={{ width: `${agent.progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2 text-right">{agent.progress}%</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">15步长链推理流程</h3>
        <div className="space-y-3">
          {reasoningSteps.map((step, index) => {
            const stepProgress = (index + 1) / reasoningSteps.length * 100;
            const isCompleted = stepProgress <= pipelineProgress;
            const isActive = Math.abs(stepProgress - pipelineProgress) < 10 || 
                            (stepProgress > pipelineProgress && stepProgress - pipelineProgress < 15);
            
            return (
              <div
                key={index}
                className={`flex items-center gap-4 p-3 rounded-lg transition-all ${
                  isCompleted ? 'bg-green-50' :
                  isActive && isPipelineRunning ? 'bg-blue-50 border border-blue-200' : 'bg-gray-50'
                }`}
              >
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted ? 'bg-green-500 text-white' :
                  isActive && isPipelineRunning ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {isCompleted ? <CheckCircle size={16} /> : index + 1}
                </div>
                <span className={`flex-1 ${
                  isCompleted ? 'text-green-700' :
                  isActive && isPipelineRunning ? 'text-blue-700 font-medium' : 'text-gray-500'
                }`}>
                  {step}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
