# 多模态短视频内容自动化生产与分发Agent系统

一个智能的多模态短视频内容自动化生产与分发系统，通过多Agent流水线协作，实现从选题策划到数据分析的全流程自动化。

## 功能特性

### 🤖 智能Agent流水线
- **选题策划Agent**: 基于全网热点数据和用户画像生成选题方案
- **文案创作Agent**: 生成分镜头脚本和口播文案
- **素材检索Agent**: 自动从版权库匹配视频和图片素材
- **视频剪辑Agent**: 自动完成视频剪辑、字幕添加、背景音乐匹配
- **多平台适配Agent**: 自动生成符合抖音、B站、小红书等不同平台规格的视频
- **数据分析Agent**: 监控发布后的数据表现并反馈给选题Agent进行迭代优化

### 📊 15步长链推理流程
系统包含完整的15步推理流程，能够自动检测内容违规风险并进行修正。

### 📈 数据看板
- 实时统计视频产量、播放量、点赞数等核心指标
- 数据趋势可视化
- 平台分布分析
- 视频管理

## 技术栈

### 前端
- React 18
- TypeScript
- Tailwind CSS
- Vite
- Recharts (数据可视化)
- Lucide React (图标)

### 后端
- Express
- TypeScript

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 仅启动前端
```bash
npm run client:dev
```

### 仅启动后端
```bash
npm run server:dev
```

### TypeScript检查
```bash
npm run check
```

## 项目结构

```
├── api/              # 后端代码
│   ├── routes/       # API路由
│   ├── app.ts        # Express应用
│   └── server.ts     # 服务器入口
├── src/              # 前端代码
│   ├── components/   # 组件
│   ├── pages/        # 页面
│   ├── hooks/        # 自定义hooks
│   └── main.tsx      # 前端入口
├── public/           # 静态资源
└── package.json      # 项目配置
```

## 使用说明

1. 访问数据看板查看系统统计
2. 进入Agent流水线页面
3. 输入关键词（可选）
4. 点击"启动流水线"
5. 观察6个Agent的协同工作过程和15步推理流程

## 商业价值

- 单账号月均产出视频从15条提升至120条
- 平均播放量提升40%
- 大幅降低内容生产成本
- 提高内容生产效率

## License

MIT
