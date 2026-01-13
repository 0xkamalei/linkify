# Linkify 重构规格说明书 (Spec v1.0)

## 📋 项目概述

将 Linkify 从社交链接聚合平台重构为**私人链接管理工具**，专注于个人知识管理和高效的链接组织。核心理念是"极简、快速、灵活"，帮助用户轻松保存、组织和激活收藏的网页内容。

### 核心定位转变

| 维度 | 原有定位 | 新定位 |
|------|---------|--------|
| **用户模式** | 公共社交平台 | 私人工具（可选择性分享） |
| **核心价值** | 内容聚合 + 社区讨论 | 个人知识管理 + 快速检索 |
| **组织方式** | 单一话题分类 | 多维度灵活组织 |
| **使用场景** | 浏览他人分享的链接 | 保存和管理自己的阅读列表 |

---

## 🎯 核心目标

### 主要目标
1. **极速体验**：从发现内容到保存完成 < 3 秒
2. **零焦虑管理**：通过阅读状态和智能集合，避免收藏内容"吃灰"
3. **灵活组织**：支持文件夹、标签、空间、智能集合、日期等多维度组织
4. **精美 UI**：紧凑列表视图 + 现代设计语言，提供愉悦的使用体验
5. **数据自主**：支持浏览器书签导入和数据导出，避免数据锁定

### 差异化特性
- ✨ **阅读状态管理**：像处理邮件一样处理链接（未读/已读/稍后读）
- 🧠 **智能集合**：基于规则自动分组（最近添加、未读、特定域名等）
- ⚡ **极简快速**：去除一切非必要功能，专注核心流程
- 🎨 **灵活组织**：同时支持层级结构和扁平标签，适应不同习惯
- 🔒 **隐私优先**：默认私密，可选择性公开分享

---

## 👤 用户故事

### 核心用户画像
- **知识工作者**：需要管理大量技术文档、教程、文章
- **研究人员**：按项目或主题组织参考资料
- **终身学习者**：收藏教程和课程，跟踪学习进度
- **内容创作者**：收集灵感和参考素材

### 典型使用场景

#### 场景 1：快速保存
> 张三在浏览技术博客时发现一篇好文章，点击浏览器扩展图标，快速选择"前端开发"文件夹和"React"标签，标记为"稍后读"，耗时 2 秒。

#### 场景 2：清空未读列表
> 李四周末打开 Linkify，查看"未读"智能集合，批量浏览本周保存的 15 篇文章，逐一标记为"已读"或"稍后读"，像清空收件箱一样获得满足感。

#### 场景 3：项目研究
> 王五正在学习 Web3，创建"Web3 学习"空间，下设"基础概念""开发教程""优秀项目"三个文件夹，通过标签 #solidity #ethereum 交叉组织，通过日期过滤查看最近添加的内容。

#### 场景 4：选择性分享
> 赵六整理了一份"2024 年最佳设计资源"收藏夹，将其设为公开，生成分享链接发送给团队成员，其他私密收藏保持隐私。

---

## 🔧 功能规格

### Phase 1: 核心功能（MVP）

#### 1.1 链接管理

##### 添加链接
- **方式**：
  - 浏览器扩展（Chrome/Firefox）：快速保存 + 标签选择
  - Web 页面手动输入：复制粘贴 URL
  - Bookmarklet：点击书签栏快速保存

- **自动抓取信息**：
  - URL
  - 页面标题（可手动编辑）
  - Favicon
  - 添加时间戳

- **手动字段**：
  - 选择文件夹（可选）
  - 添加标签（可选）
  - 选择空间（默认"个人空间"）
  - 阅读状态（默认"未读"）
  - 备注/描述（可选）

##### 查看链接
- **紧凑列表视图**：
  ```
  [Favicon] 链接标题                              [标签1] [标签2]
            domain.com • 2024-01-11 • 未读         📁 文件夹名
  ```

- **每行显示**：
  - Favicon + 标题
  - 域名 + 添加日期 + 阅读状态标识
  - 标签列表（pill 样式）
  - 所属文件夹（小图标）

- **交互**：
  - 点击标题：在新标签页打开链接
  - 悬停：显示描述（如有）
  - 右键：快捷菜单（编辑、删除、移动、分享）
  - 拖拽：移动到文件夹

##### 编辑/删除链接
- 快速编辑：inline 编辑标题、标签、状态
- 完整编辑：打开侧边栏编辑所有字段
- 批量操作：多选后批量添加标签、移动文件夹、删除

#### 1.2 组织系统

##### 文件夹（Folders）
- **层级结构**：支持无限嵌套
- **功能**：
  - 创建/重命名/删除/移动
  - 设置图标和颜色
  - 一个链接只能属于一个文件夹
  - 支持拖拽排序

##### 标签（Tags）
- **扁平结构**：无层级，自由组合
- **功能**：
  - 一个链接可以有多个标签
  - 自动补全已有标签
  - 显示标签使用次数
  - 批量管理：重命名、合并、删除标签

##### 空间（Spaces）
- **独立工作区**：每个空间有独立的文件夹和标签
- **预设空间**：
  - 个人空间（默认）
  - 工作空间
  - 学习空间
  - （用户可自定义）

- **功能**：
  - 快速切换空间
  - 每个空间独立设置公开/私密
  - 链接可在空间间移动

##### 智能集合（Smart Collections）
- **系统预设**：
  - 📥 未读（Read Status = Unread）
  - ⭐ 稍后读（Read Status = Read Later）
  - ✅ 已读（Read Status = Read）
  - 🕐 最近添加（Last 7 days）
  - 📅 本周添加（This week）
  - 📆 本月添加（This month）
  - 🌐 按域名分组（Group by domain）

- **自定义规则**（Phase 2）：
  - 用户可创建自定义规则
  - 条件：文件夹、标签、日期范围、域名、阅读状态
  - 逻辑：AND/OR 组合

#### 1.3 阅读状态管理

##### 三种状态
- **未读（Unread）**：默认状态，新添加的链接
- **稍后读（Read Later）**：标记为重要，计划稍后阅读
- **已读（Read）**：已完成阅读

##### 状态流转
```
添加链接 → 未读 ←→ 稍后读
              ↓
            已读
```

##### 快捷操作
- 列表中一键切换状态
- 键盘快捷键：`U`（未读）、`L`（稍后读）、`R`（已读）
- 批量标记

#### 1.4 搜索与过滤

##### 多维度过滤
- **过滤器**（可组合）：
  - 文件夹（单选或多选）
  - 标签（多选，AND/OR 逻辑）
  - 空间
  - 阅读状态
  - 日期范围（添加日期）
  - 域名

- **搜索**：
  - 关键词搜索：标题、URL、描述
  - 实时搜索（输入即搜索）
  - 高亮匹配结果

##### 排序选项
- 添加时间（降序/升序）
- 标题（A-Z）
- 域名分组

##### 保存过滤器（Phase 2）
- 保存常用过滤器组合为快捷访问

#### 1.5 浏览器扩展

##### 核心功能
- **Popup 界面**：
  - 显示当前页面信息（标题、URL、favicon）
  - 选择空间（下拉菜单）
  - 选择文件夹（下拉菜单，带层级）
  - 添加标签（输入框 + 自动补全）
  - 选择阅读状态（单选）
  - 添加备注（可选文本框）
  - 快速保存按钮

- **快捷键**：
  - `Cmd/Ctrl + Shift + D`：打开扩展 popup
  - 保存并关闭：`Enter`
  - 取消：`Esc`

- **右键菜单**：
  - 保存链接到默认文件夹
  - 保存链接到...（选择文件夹）

##### 技术实现
- Chrome Manifest V3
- 与后端 API 通信（需认证）
- 本地缓存文件夹/标签列表（减少 API 请求）

---

### Phase 2: 增强功能

#### 2.1 数据导入/导出

##### 导入
- **浏览器书签导入**：
  - 支持 Chrome/Firefox/Safari 书签 HTML 格式
  - 保持原有文件夹结构
  - 自动去重（基于 URL）

##### 导出
- **格式**：
  - JSON（完整数据，包含元数据）
  - HTML（标准书签格式）
  - Markdown（按文件夹/标签分组）
  - CSV（用于数据分析）

#### 2.2 选择性分享（Public Space）

##### 分享单个收藏夹
- 设置文件夹为"公开"
- 生成唯一分享链接：`https://linkify.app/shared/{userId}/{folderId}`
- 公开页面显示：
  - 文件夹名称和描述
  - 链接列表（只读）
  - 简洁的展示页面（无登录界面）

##### 分享整个空间
- 设置空间为"公开"
- 生成用户主页：`https://linkify.app/{username}`
- 展示该空间的所有公开文件夹

##### 权限控制
- 公开内容：任何人可访问
- 链接保护：可选密码保护
- SEO：可选择是否允许搜索引擎索引

#### 2.3 增强的智能集合

- 用户自定义规则
- 高级条件（域名正则、标签组合、日期计算）
- 保存为固定集合

#### 2.4 浏览器扩展增强

- 侧边栏面板（查看收藏列表）
- 全局搜索（快捷键打开搜索框）
- 检测重复链接（添加时提示已存在）

---

### Phase 3: 高级功能（未来扩展）

#### 3.1 内容增强
- 全文保存（防失效）
- 网页快照/截图
- 自动提取摘要（AI）

#### 3.2 协作功能（为 SAAS 铺路）
- 共享空间（多用户）
- 评论和协作笔记
- 团队订阅计划

#### 3.3 高级搜索
- AI 语义搜索
- 全文搜索（如果保存了内容）

#### 3.4 移动应用
- iOS Share Extension
- Android Share Intent
- 响应式 Web 应用

---

## 🗄️ 数据模型

### 核心实体

#### User
```typescript
interface User {
  id: string
  email: string
  username: string  // 用于公开页面 URL
  displayName: string
  avatar?: string
  createdAt: Timestamp
  updatedAt: Timestamp
  settings: UserSettings
}

interface UserSettings {
  defaultSpace: string
  defaultReadStatus: 'unread' | 'read_later' | 'read'
  theme: 'light' | 'dark' | 'auto'
  compactView: boolean
}
```

#### Space
```typescript
interface Space {
  id: string
  userId: string
  name: string
  icon?: string
  color?: string
  isPublic: boolean  // 是否公开
  order: number  // 排序
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### Folder
```typescript
interface Folder {
  id: string
  userId: string
  spaceId: string  // 所属空间
  name: string
  icon?: string
  color?: string
  parentId?: string  // 父文件夹 ID（支持嵌套）
  isPublic: boolean  // 是否公开（继承自 Space，可单独设置）
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

#### Tag
```typescript
interface Tag {
  id: string
  userId: string
  name: string
  color?: string
  usageCount: number  // 使用次数
  createdAt: Timestamp
}
```

#### Link
```typescript
interface Link {
  id: string
  userId: string
  spaceId: string
  folderId?: string  // 可选，链接可以不属于任何文件夹

  // 链接基本信息
  url: string
  title: string
  description?: string
  favicon?: string
  domain: string  // 从 URL 提取，用于分组和过滤

  // 组织信息
  tags: string[]  // Tag IDs

  // 阅读状态
  readStatus: 'unread' | 'read_later' | 'read'
  lastReadAt?: Timestamp

  // 时间戳
  createdAt: Timestamp
  updatedAt: Timestamp

  // 公开分享（继承自 Folder/Space）
  isPublic: boolean
}
```

#### SmartCollection
```typescript
interface SmartCollection {
  id: string
  userId: string
  name: string
  icon: string
  isSystem: boolean  // 系统预设 vs 用户自定义
  rules: CollectionRule[]
  order: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

interface CollectionRule {
  field: 'folderId' | 'tagId' | 'readStatus' | 'domain' | 'createdAt'
  operator: 'equals' | 'contains' | 'in' | 'gte' | 'lte'
  value: any
  logic?: 'AND' | 'OR'  // 与下一条规则的逻辑关系
}

// 示例：最近 7 天未读
{
  name: "Recent Unread",
  rules: [
    { field: 'readStatus', operator: 'equals', value: 'unread', logic: 'AND' },
    { field: 'createdAt', operator: 'gte', value: 'now-7d' }
  ]
}
```

---

## 🎨 UI/UX 设计原则

### 设计语言
- **极简主义**：去除一切非必要元素
- **信息密度**：紧凑列表视图，最大化屏幕利用率
- **快速响应**：所有操作提供即时反馈
- **键盘友好**：支持快捷键操作核心功能
- **现代美学**：清晰的层次、舒适的配色、流畅的动画

### 布局结构

#### 主界面布局
```
+--------------------------------------------------+
| [Logo] 🔍 搜索...          [+新建] [@用户]       |
+----------+---------------------------------------+
| 🏠 个人   | 📋 全部链接                 [列表▾] |
| 💼 工作   | ────────────────────────────────── |
| 📚 学习   | [🌐] React 18 新特性详解   [React]  |
|          |       dev.to • 2024-01-11 • 未读  📁前端|
| 📁 文件夹 | [🌐] TypeScript 5.0 发布   [TS]     |
|   前端    |       blog.com • 2024-01-10 • 稍后读    |
|   后端    |                                     |
|          |                                     |
| 🏷️ 标签  |                                     |
|   React  |                                     |
|   Node   |                                     |
|          |                                     |
| 📊 智能   |                                     |
|   未读   |                                     |
|   稍后读  |                                     |
+----------+---------------------------------------+
```

#### 浏览器扩展 Popup
```
+--------------------------------+
| 保存到 Linkify                  |
+--------------------------------+
| 标题: [React 18 新特性详解___] |
| URL:  dev.to/react-18          |
|                                |
| 空间: [个人空间 ▾]              |
| 文件夹: [前端开发 ▾]            |
| 标签: [React] [x]  [+添加]     |
| 状态: ⚪未读 ⚪稍后读 ⚪已读      |
|                                |
| 备注: [________________]       |
|                                |
|        [取消]    [保存✓]       |
+--------------------------------+
```

### 交互设计

#### 快捷键（全局）
- `Cmd/Ctrl + K`：打开全局搜索
- `Cmd/Ctrl + N`：新建链接
- `Esc`：关闭弹窗/清除搜索

#### 快捷键（列表视图）
- `↑/↓`：选择上/下一个链接
- `Enter`：打开选中的链接
- `U`：标记为未读
- `L`：标记为稍后读
- `R`：标记为已读
- `E`：编辑
- `Del`：删除

#### 右键菜单
- 在新标签页打开
- 复制链接
- 编辑
- 移动到文件夹...
- 添加标签...
- 标记为已读/未读/稍后读
- 分享
- 删除

### 响应式设计
- **桌面端**（>1024px）：双栏布局
- **平板端**（768px-1024px）：可折叠侧边栏
- **移动端**（<768px）：单栏布局 + 底部导航

---

## 🏗️ 技术架构

### 技术栈（保持现有）
- **前端**：React 19 + TypeScript + Vite + TailwindCSS
- **路由**：React Router v7
- **后端**：Hono (Bun runtime)
- **数据库**：Firebase Firestore
- **认证**：Firebase Authentication
- **部署**：Vercel
- **浏览器扩展**：Chrome Extension (Manifest V3)

### 架构改动

#### 数据库集合设计（Firestore）
```
users/{userId}
spaces/{spaceId}
  - userId (index)
folders/{folderId}
  - userId (index)
  - spaceId (index)
  - parentId (index)
tags/{tagId}
  - userId (index)
links/{linkId}
  - userId (index)
  - spaceId (index)
  - folderId (index)
  - tags (array-contains index)
  - readStatus (index)
  - createdAt (index)
  - domain (index)
smartCollections/{collectionId}
  - userId (index)
```

#### API 端点设计

##### 认证
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `GET /api/auth/me`

##### 链接管理
- `GET /api/links` - 查询参数：spaceId, folderId, tags, readStatus, search, domain, startDate, endDate, limit, offset
- `GET /api/links/:id`
- `POST /api/links` - 创建链接
- `PUT /api/links/:id` - 更新链接
- `PATCH /api/links/:id/status` - 快速更新阅读状态
- `DELETE /api/links/:id`
- `POST /api/links/batch` - 批量操作（更新状态、添加标签、移动文件夹等）

##### 文件夹管理
- `GET /api/folders?spaceId=xxx`
- `POST /api/folders`
- `PUT /api/folders/:id`
- `DELETE /api/folders/:id`
- `POST /api/folders/:id/move` - 移动到另一个父文件夹

##### 标签管理
- `GET /api/tags`
- `POST /api/tags`
- `PUT /api/tags/:id`
- `DELETE /api/tags/:id`
- `POST /api/tags/:id/merge` - 合并标签

##### 空间管理
- `GET /api/spaces`
- `POST /api/spaces`
- `PUT /api/spaces/:id`
- `DELETE /api/spaces/:id`

##### 智能集合
- `GET /api/collections`
- `GET /api/collections/:id/links` - 获取集合中的链接
- `POST /api/collections` - 创建自定义集合
- `PUT /api/collections/:id`
- `DELETE /api/collections/:id`

##### 导入/导出
- `POST /api/import/bookmarks` - 上传书签 HTML 文件
- `GET /api/export?format=json|html|markdown|csv`

##### 公开分享
- `GET /api/public/:username` - 用户公开主页
- `GET /api/public/:username/:folderId` - 公开文件夹

#### 前端状态管理
- **全局状态**（React Context）：
  - AuthContext：用户认证状态
  - SpaceContext：当前选中的空间
  - FilterContext：当前的过滤条件

- **本地状态**（useState）：
  - 组件内部 UI 状态

- **服务端状态**（手动 fetch + useEffect）：
  - 链接列表
  - 文件夹树
  - 标签列表

### 性能优化
- **虚拟滚动**：长列表使用虚拟滚动（react-window）
- **分页加载**：每次加载 50 条链接，滚动到底部加载更多
- **延迟加载**：文件夹树按需展开加载子文件夹
- **索引优化**：Firestore 复合索引（userId + spaceId + createdAt）
- **缓存策略**：浏览器扩展缓存文件夹/标签列表，5 分钟过期

---

## 🗺️ 实施路线图

### Phase 1: MVP（4-6 周）

#### Week 1-2: 数据模型和后端 API
- [ ] 设计并实现 Firestore 数据模型
- [ ] 创建所有 API 端点（链接、文件夹、标签、空间）
- [ ] 实现用户认证和授权
- [ ] 编写 API 单元测试

#### Week 3-4: 前端核心功能
- [ ] 重构路由结构（移除旧的社交功能）
- [ ] 实现主界面布局（侧边栏 + 列表视图）
- [ ] 链接列表组件（紧凑视图 + 交互）
- [ ] 文件夹树组件（可折叠、拖拽）
- [ ] 标签管理组件
- [ ] 搜索和过滤组件
- [ ] 阅读状态切换
- [ ] 新建/编辑链接表单

#### Week 5: 智能集合
- [ ] 实现系统预设智能集合
- [ ] 智能集合规则引擎（后端）
- [ ] 智能集合 UI

#### Week 6: 浏览器扩展（Phase 1）
- [ ] Chrome 扩展基础框架
- [ ] Popup 界面（保存表单）
- [ ] 与后端 API 集成
- [ ] 快捷键支持

### Phase 2: 增强功能（3-4 周）

#### Week 7-8: 数据迁移和导入导出
- [ ] 书签导入功能（HTML 解析）
- [ ] 数据导出（JSON/HTML/Markdown/CSV）
- [ ] 导入进度和错误处理
- [ ] 去重逻辑

#### Week 9: 公开分享
- [ ] 公开页面路由和布局
- [ ] 文件夹/空间公开设置
- [ ] 分享链接生成
- [ ] 公开页面 UI（简洁展示）

#### Week 10: 扩展增强 + 优化
- [ ] 浏览器扩展增强功能
- [ ] 性能优化（虚拟滚动、分页）
- [ ] UI 细节打磨
- [ ] Bug 修复和测试

### Phase 3: 高级功能（未来）
- 全文保存和搜索
- 协作功能
- 移动应用
- AI 增强功能

---

## 🚀 成功指标

### 用户体验指标
- 添加链接平均耗时 < 3 秒
- 搜索结果响应时间 < 500ms
- 页面加载时间 < 2 秒
- 移动端适配良好（响应式）

### 产品指标（MVP 后）
- 日活用户数（DAU）
- 人均保存链接数
- 链接打开率（避免吃灰）
- 用户留存率（7 天、30 天）

### 技术指标
- API 平均响应时间 < 200ms
- 错误率 < 0.1%
- 浏览器扩展评分 > 4.5 星

---

## 📝 未来 SAAS 扩展路径

虽然 Phase 1 专注个人版，但在架构上预留 SAAS 化的可能性：

### Freemium 模式（建议）
- **免费版**：
  - 最多 500 个链接
  - 基础功能（文件夹、标签、阅读状态）
  - 2 个空间
  - 浏览器扩展

- **Pro 版**（$5/月）：
  - 无限链接
  - 无限空间
  - 全文保存和搜索
  - 高级智能集合
  - 优先支持

- **Team 版**（$15/月/用户）：
  - Pro 所有功能
  - 共享空间（团队协作）
  - 权限管理
  - API 访问
  - 自定义域名

### 技术准备
- 用户计费字段（Firestore）
- 使用量限制中间件
- Stripe 支付集成（预留接口）
- 团队协作数据模型（预留）

---

## ✅ 验收标准（MVP）

- [ ] 用户可以通过 Web 和浏览器扩展添加链接
- [ ] 链接可以组织到文件夹（支持嵌套）和标签
- [ ] 支持多个空间，可快速切换
- [ ] 提供未读/稍后读/已读三种状态，可快速切换
- [ ] 智能集合自动分组链接（未读、最近添加等）
- [ ] 多维度过滤（文件夹、标签、日期、状态、域名）
- [ ] 关键词搜索标题和 URL
- [ ] 紧凑列表视图，UI 精美
- [ ] 可导入浏览器书签
- [ ] 可导出数据（JSON/HTML）
- [ ] 响应式设计，移动端可用
- [ ] 部署到生产环境，稳定运行

---

## 📚 参考竞品

### 对标产品
- **Raindrop.io**：灵感来源，功能丰富但略显复杂
- **Pinboard**：极简主义，但 UI 过时
- **Pocket**：稍后读功能，但缺乏灵活组织
- **Notion Web Clipper**：强大但依赖 Notion 生态

### 差异化策略
- 比 Raindrop 更简洁快速
- 比 Pinboard 更现代美观
- 比 Pocket 更灵活的组织系统
- 比 Notion 更专注于链接管理

---

## 🔒 隐私和安全

- 默认私密，用户完全控制数据可见性
- 公开分享需要明确用户操作
- 支持数据导出，避免锁定
- Firebase 安全规则严格限制数据访问
- 浏览器扩展仅请求必要权限

---

**文档版本**：v1.0
**最后更新**：2024-01-11
**负责人**：Lei
**状态**：待审核
