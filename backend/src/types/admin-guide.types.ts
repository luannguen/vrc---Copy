export interface AdminGuide {
  id: string
  title: string
  summary: string
  content: string
  category: GuideCategory
  difficulty: DifficultyLevel
  tags?: string[]
  featured: boolean
  status: 'draft' | 'published'
  estimatedReadTime: number
  createdAt: string
  updatedAt: string
  publishedAt?: string
  author?: {
    id: string
    name: string
    email: string
  }
  relatedGuides?: string[]
  prerequisites?: string[]
  completionRate?: number
  viewCount?: number
  rating?: number
  feedback?: GuideFeedback[]
}

export type GuideCategory =
  | 'collections'
  | 'globals'
  | 'dashboard'
  | 'users'
  | 'media'
  | 'api'
  | 'customization'
  | 'troubleshooting'
  | 'best-practices'
  | 'security'

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'

export interface GuideFeedback {
  id: string
  rating: number
  comment?: string
  helpful: boolean
  createdAt: string
  author: {
    id: string
    name: string
  }
}

export interface GuideCardProps {
  guide: AdminGuide
  onClick: (guide: AdminGuide) => void
  variant?: 'default' | 'featured' | 'compact'
  className?: string
}

export interface SearchFilterProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  selectedCategory: GuideCategory | 'all'
  onCategoryChange: (category: GuideCategory | 'all') => void
  guidesCount: number
  className?: string
}

export interface InteractiveDashboardProps {
  onSectionClick: (section: string) => void
  className?: string
}

export interface QuickActionsProps {
  onStartTutorial: () => void
  className?: string
}

export interface StepTutorialProps {
  onClose: () => void
  guides: AdminGuide[]
  className?: string
}

export interface DashboardSection {
  id: string
  title: string
  description: string
  icon: string
  position: {
    x: number
    y: number
  }
  relatedGuides: string[]
  isActive?: boolean
}

export interface TutorialStep {
  id: string
  title: string
  description: string
  target?: string
  content: string
  action?: {
    type: 'click' | 'input' | 'wait'
    selector?: string
    value?: string
  }
  completion?: {
    condition: string
    message: string
  }
}

export interface GuideProgress {
  guideId: string
  userId: string
  progress: number // 0-100
  completedSteps: string[]
  startedAt: string
  lastAccessedAt: string
  completedAt?: string
  timeSpent: number // in minutes
}

export interface AdminGuideSettings {
  showOnDashboard: boolean
  autoStart: boolean
  preferredLanguage: 'vi' | 'en' | 'tr'
  theme: 'light' | 'dark' | 'auto'
  animations: boolean
  notifications: boolean
}

// Utility types
export type GuideStatus = AdminGuide['status']
export type GuideSort = 'title' | 'category' | 'difficulty' | 'updatedAt' | 'rating' | 'viewCount'
export type GuideSortOrder = 'asc' | 'desc'

// API Response types
export interface AdminGuidesResponse {
  docs: AdminGuide[]
  totalDocs: number
  page: number
  limit: number
  totalPages: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export interface GuideAnalytics {
  totalGuides: number
  publishedGuides: number
  averageRating: number
  totalViews: number
  popularCategories: Array<{
    category: GuideCategory
    count: number
  }>
  userEngagement: {
    dailyActiveUsers: number
    averageSessionTime: number
    completionRate: number
  }
}
