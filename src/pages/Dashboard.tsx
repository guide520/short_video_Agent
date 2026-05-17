
import React, { useEffect } from 'react';
import { useAppStore } from '../store';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, Play, Eye, ThumbsUp, Plus, Rocket } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { analytics, videos, fetchAnalytics, fetchVideos, setCurrentPage } = useAppStore();

  useEffect(() => {
    fetchAnalytics();
    fetchVideos();
  }, [fetchAnalytics, fetchVideos]);

  const StatCard = ({ title, value, icon: Icon, color, suffix = '' }: any) => (
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
  );

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
        <StatCard 
          title="视频总数" 
          value={analytics?.totalVideos || 0} 
          icon={Play}
          color={{ from: '#3b82f6', to: '#1d4ed8' }}
        />
        <StatCard 
          title="总播放量" 
          value={(analytics?.totalViews || 0).toLocaleString()} 
          icon={Eye}
          color={{ from: '#8b5cf6', to: '#6d28d9' }}
        />
        <StatCard 
          title="总点赞数" 
          value={(analytics?.totalLikes || 0).toLocaleString()} 
          icon={ThumbsUp}
          color={{ from: '#f97316', to: '#ea580c' }}
        />
        <StatCard 
          title="平均播放" 
          value={(analytics?.avgViews || 0).toLocaleString()} 
          icon={TrendingUp}
          color={{ from: '#10b981', to: '#059669' }}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">数据趋势</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics?.trendData || []}>
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
              <BarChart data={analytics?.platformStats || []}>
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
          <button
            onClick={() => setCurrentPage('videos')}
            className="text-blue-500 hover:text-blue-600 font-medium"
          >
            查看全部
          </button>
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
              {videos.slice(0, 5).map((video) => (
                <tr key={video.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900">{video.title}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-1">
                      {video.platforms.map((p, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{video.views.toLocaleString()}</td>
                  <td className="py-3 px-4 text-gray-600">{video.likes.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        video.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
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
  );
};

export default Dashboard;
