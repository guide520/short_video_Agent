
import { create } from 'zustand';

interface Project {
  id: string;
  name: string;
  status: 'draft' | 'planning' | 'writing' | 'editing' | 'published';
  createdAt: string;
  updatedAt: string;
}

interface Topic {
  id: string;
  title: string;
  description: string;
  tags: string[];
  hotScore: number;
}

interface Shot {
  id: string;
  order: number;
  duration: number;
  description: string;
  voiceover: string;
}

interface Video {
  id: string;
  projectId: string;
  title: string;
  platforms: string[];
  duration: number;
  views: number;
  likes: number;
  status: 'draft' | 'published';
  createdAt: string;
}

interface AgentState {
  name: string;
  status: 'idle' | 'running' | 'completed' | 'error';
  progress: number;
  output?: any;
}

interface AnalyticsData {
  totalVideos: number;
  totalViews: number;
  totalLikes: number;
  avgViews: number;
  platformStats: { platform: string; views: number; likes: number }[];
  trendData: { date: string; views: number; likes: number }[];
}

interface AppState {
  projects: Project[];
  topics: Topic[];
  shots: Shot[];
  videos: Video[];
  analytics: AnalyticsData | null;
  agents: AgentState[];
  reasoningSteps: string[];
  currentPage: string;
  isPipelineRunning: boolean;
  currentStep: string;
  pipelineProgress: number;
  setCurrentPage: (page: string) => void;
  fetchProjects: () => Promise<void>;
  fetchTopics: () => Promise<void>;
  fetchVideos: () => Promise<void>;
  fetchAnalytics: () => Promise<void>;
  fetchAgentStatus: () => Promise<void>;
  createProject: (name: string) => Promise<void>;
  generateTopics: (keywords?: string) => Promise<Topic[]>;
  generateCopy: (topic: string) => Promise<Shot[]>;
  runPipeline: (keywords?: string) => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  projects: [],
  topics: [],
  shots: [],
  videos: [],
  analytics: null,
  agents: [],
  reasoningSteps: [],
  currentPage: 'dashboard',
  isPipelineRunning: false,
  currentStep: '',
  pipelineProgress: 0,

  setCurrentPage: (page: string) => set({ currentPage: page }),

  fetchProjects: async () => {
    try {
      const res = await fetch('/api/projects');
      const projects = await res.json();
      set({ projects });
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  },

  fetchTopics: async () => {
    try {
      const res = await fetch('/api/topics');
      const topics = await res.json();
      set({ topics });
    } catch (error) {
      console.error('Failed to fetch topics:', error);
    }
  },

  fetchVideos: async () => {
    try {
      const res = await fetch('/api/videos');
      const videos = await res.json();
      set({ videos });
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    }
  },

  fetchAnalytics: async () => {
    try {
      const res = await fetch('/api/analytics');
      const analytics = await res.json();
      set({ analytics });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  },

  fetchAgentStatus: async () => {
    try {
      const res = await fetch('/api/agents/status');
      const data = await res.json();
      set({ agents: data.agents, reasoningSteps: data.steps });
    } catch (error) {
      console.error('Failed to fetch agent status:', error);
    }
  },

  createProject: async (name: string) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, status: 'draft' })
      });
      const newProject = await res.json();
      set(state => ({ projects: [...state.projects, newProject] }));
    } catch (error) {
      console.error('Failed to create project:', error);
    }
  },

  generateTopics: async (keywords?: string) => {
    try {
      const res = await fetch('/api/topics/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      });
      const topics = await res.json();
      set({ topics });
      return topics;
    } catch (error) {
      console.error('Failed to generate topics:', error);
      return [];
    }
  },

  generateCopy: async (topic: string) => {
    try {
      const res = await fetch('/api/copywriting/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic })
      });
      const shots = await res.json();
      set({ shots });
      return shots;
    } catch (error) {
      console.error('Failed to generate copy:', error);
      return [];
    }
  },

  runPipeline: async (keywords?: string) => {
    set({ isPipelineRunning: true, pipelineProgress: 0, currentStep: '' });
    
    try {
      const res = await fetch('/api/agents/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keywords })
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = JSON.parse(line.slice(6));
              
              if (data.type === 'progress') {
                set({ currentStep: data.step, pipelineProgress: data.progress });
              } else if (data.type === 'complete') {
                set({ agents: data.agents });
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Pipeline failed:', error);
    } finally {
      set({ isPipelineRunning: false });
    }
  }
}));
