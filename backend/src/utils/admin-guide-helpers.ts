import type { AdminGuide, GuideCategory, DifficultyLevel, GuideSort, GuideSortOrder } from '../types/admin-guide.types'

/**
 * Utility functions for Admin Guide components
 */

// =============================================================================
// FORMATTING UTILITIES
// =============================================================================

/**
 * Format difficulty level to Vietnamese label
 */
export const formatDifficulty = (difficulty: DifficultyLevel): string => {
  const difficultyMap: Record<DifficultyLevel, string> = {
    beginner: 'Cơ bản',
    intermediate: 'Trung cấp',
    advanced: 'Nâng cao'
  }
  return difficultyMap[difficulty] || difficulty
}

/**
 * Format category to Vietnamese label
 */
export const formatCategory = (category: GuideCategory): string => {
  const categoryMap: Record<GuideCategory, string> = {
    collections: 'Collections',
    globals: 'Globals',
    dashboard: 'Dashboard',
    users: 'Người dùng',
    media: 'Media',
    api: 'API',
    customization: 'Tùy chỉnh',
    troubleshooting: 'Khắc phục sự cố',
    'best-practices': 'Best Practices',
    security: 'Bảo mật'
  }
  return categoryMap[category] || category
}

/**
 * Format reading time with proper Vietnamese pluralization
 */
export const formatReadingTime = (minutes: number): string => {
  if (minutes < 1) return 'Dưới 1 phút'
  return `${minutes} phút`
}

/**
 * Format view count with proper number formatting
 */
export const formatViewCount = (count: number): string => {
  if (count < 1000) return count.toString()
  if (count < 1000000) return `${(count / 1000).toFixed(1)}K`
  return `${(count / 1000000).toFixed(1)}M`
}

/**
 * Format date to Vietnamese locale
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

/**
 * Format relative time (e.g., "2 ngày trước")
 */
export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

  if (diffInHours < 1) return 'Vừa xong'
  if (diffInHours < 24) return `${diffInHours} giờ trước`

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 7) return `${diffInDays} ngày trước`

  const diffInWeeks = Math.floor(diffInDays / 7)
  if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) return `${diffInMonths} tháng trước`

  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} năm trước`
}

// =============================================================================
// FILTERING & SORTING UTILITIES
// =============================================================================

/**
 * Filter guides by search query
 */
export const filterGuidesBySearch = (guides: AdminGuide[], query: string): AdminGuide[] => {
  if (!query.trim()) return guides

  const searchTerm = query.toLowerCase().trim()

  return guides.filter(guide => {
    const titleMatch = guide.title.toLowerCase().includes(searchTerm)
    const summaryMatch = guide.summary.toLowerCase().includes(searchTerm)
    const contentMatch = guide.content.toLowerCase().includes(searchTerm)
    const tagsMatch = guide.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    const categoryMatch = formatCategory(guide.category).toLowerCase().includes(searchTerm)

    return titleMatch || summaryMatch || contentMatch || tagsMatch || categoryMatch
  })
}

/**
 * Filter guides by category
 */
export const filterGuidesByCategory = (guides: AdminGuide[], category: GuideCategory | 'all'): AdminGuide[] => {
  if (category === 'all') return guides
  return guides.filter(guide => guide.category === category)
}

/**
 * Filter guides by difficulty
 */
export const filterGuidesByDifficulty = (guides: AdminGuide[], difficulty: DifficultyLevel | 'all'): AdminGuide[] => {
  if (difficulty === 'all') return guides
  return guides.filter(guide => guide.difficulty === difficulty)
}

/**
 * Filter guides by status
 */
export const filterGuidesByStatus = (guides: AdminGuide[], status: 'published' | 'draft' | 'all'): AdminGuide[] => {
  if (status === 'all') return guides
  return guides.filter(guide => guide.status === status)
}

/**
 * Sort guides by specified field and order
 */
export const sortGuides = (guides: AdminGuide[], sortBy: GuideSort, order: GuideSortOrder = 'asc'): AdminGuide[] => {
  const sortedGuides = [...guides].sort((a, b) => {
    let comparison = 0

    switch (sortBy) {
      case 'title':
        comparison = a.title.localeCompare(b.title, 'vi')
        break
      case 'category':
        comparison = formatCategory(a.category).localeCompare(formatCategory(b.category), 'vi')
        break
      case 'difficulty':
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 }
        comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
        break
      case 'updatedAt':
        comparison = new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
        break
      case 'rating':
        comparison = (a.rating || 0) - (b.rating || 0)
        break
      case 'viewCount':
        comparison = (a.viewCount || 0) - (b.viewCount || 0)
        break
      default:
        comparison = 0
    }

    return order === 'desc' ? -comparison : comparison
  })

  return sortedGuides
}

// =============================================================================
// SEARCH UTILITIES
// =============================================================================

/**
 * Highlight search terms in text
 */
export const highlightSearchTerms = (text: string, searchQuery: string): string => {
  if (!searchQuery.trim()) return text

  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

/**
 * Extract search suggestions from guides
 */
export const getSearchSuggestions = (guides: AdminGuide[], query: string, limit = 5): string[] => {
  if (!query.trim()) return []

  const suggestions = new Set<string>()
  const searchTerm = query.toLowerCase()

  guides.forEach(guide => {
    // Title suggestions
    if (guide.title.toLowerCase().includes(searchTerm)) {
      suggestions.add(guide.title)
    }

    // Tag suggestions
    guide.tags?.forEach(tag => {
      if (tag.toLowerCase().includes(searchTerm)) {
        suggestions.add(tag)
      }
    })

    // Category suggestions
    const categoryLabel = formatCategory(guide.category)
    if (categoryLabel.toLowerCase().includes(searchTerm)) {
      suggestions.add(categoryLabel)
    }
  })

  return Array.from(suggestions).slice(0, limit)
}

// =============================================================================
// ANALYTICS UTILITIES
// =============================================================================

/**
 * Calculate guide completion rate
 */
export const calculateCompletionRate = (guide: AdminGuide): number => {
  return guide.completionRate || 0
}

/**
 * Get popular categories from guides
 */
export const getPopularCategories = (guides: AdminGuide[]): Array<{ category: GuideCategory; count: number; label: string }> => {
  const categoryCounts = guides.reduce((acc, guide) => {
    acc[guide.category] = (acc[guide.category] || 0) + 1
    return acc
  }, {} as Record<GuideCategory, number>)

  return Object.entries(categoryCounts)
    .map(([category, count]) => ({
      category: category as GuideCategory,
      count,
      label: formatCategory(category as GuideCategory)
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * Get featured guides
 */
export const getFeaturedGuides = (guides: AdminGuide[], limit = 3): AdminGuide[] => {
  return guides
    .filter(guide => guide.featured && guide.status === 'published')
    .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    .slice(0, limit)
}

/**
 * Get recent guides
 */
export const getRecentGuides = (guides: AdminGuide[], limit = 5): AdminGuide[] => {
  return guides
    .filter(guide => guide.status === 'published')
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, limit)
}

/**
 * Get related guides based on tags and category
 */
export const getRelatedGuides = (guide: AdminGuide, allGuides: AdminGuide[], limit = 3): AdminGuide[] => {
  const relatedGuides = allGuides
    .filter(g => g.id !== guide.id && g.status === 'published')
    .map(g => {
      let score = 0

      // Same category gets higher score
      if (g.category === guide.category) score += 3

      // Shared tags get points
      const sharedTags = g.tags?.filter(tag => guide.tags?.includes(tag)) || []
      score += sharedTags.length * 2

      // Similar difficulty gets points
      if (g.difficulty === guide.difficulty) score += 1

      return { guide: g, score }
    })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.guide)

  return relatedGuides
}

// =============================================================================
// VALIDATION UTILITIES
// =============================================================================

/**
 * Validate guide data
 */
export const validateGuide = (guide: Partial<AdminGuide>): { isValid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!guide.title?.trim()) {
    errors.push('Tiêu đề là bắt buộc')
  }

  if (!guide.summary?.trim()) {
    errors.push('Tóm tắt là bắt buộc')
  }

  if (!guide.content?.trim()) {
    errors.push('Nội dung là bắt buộc')
  }

  if (!guide.category) {
    errors.push('Danh mục là bắt buộc')
  }

  if (!guide.difficulty) {
    errors.push('Độ khó là bắt buộc')
  }

  if (typeof guide.estimatedReadTime !== 'number' || guide.estimatedReadTime < 1) {
    errors.push('Thời gian đọc phải là số dương')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

// =============================================================================
// URL UTILITIES
// =============================================================================

/**
 * Generate slug from title
 */
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .trim()
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

/**
 * Generate guide URL
 */
export const generateGuideUrl = (guide: AdminGuide): string => {
  const slug = generateSlug(guide.title)
  return `/admin/guides/${guide.id}/${slug}`
}

// =============================================================================
// EXPORT UTILITIES
// =============================================================================

/**
 * Export guides to JSON
 */
export const exportGuidesToJson = (guides: AdminGuide[]): string => {
  return JSON.stringify(guides, null, 2)
}

/**
 * Export guides to CSV
 */
export const exportGuidesToCsv = (guides: AdminGuide[]): string => {
  const headers = ['ID', 'Tiêu đề', 'Danh mục', 'Độ khó', 'Trạng thái', 'Ngày cập nhật']
  const rows = guides.map(guide => [
    guide.id,
    guide.title,
    formatCategory(guide.category),
    formatDifficulty(guide.difficulty),
    guide.status === 'published' ? 'Đã xuất bản' : 'Bản nháp',
    formatDate(guide.updatedAt)
  ])

  return [headers, ...rows]
    .map(row => row.map(cell => `"${cell}"`).join(','))
    .join('\n')
}

// =============================================================================
// LOCAL STORAGE UTILITIES
// =============================================================================

/**
 * Save guide preferences to localStorage
 */
export const saveGuidePreferences = (preferences: {
  sortBy?: GuideSort
  sortOrder?: GuideSortOrder
  selectedCategory?: GuideCategory | 'all'
  viewMode?: 'grid' | 'list'
}): void => {
  try {
    localStorage.setItem('admin-guide-preferences', JSON.stringify(preferences))
  } catch (error) {
    console.warn('Failed to save guide preferences:', error)
  }
}

/**
 * Load guide preferences from localStorage
 */
export const loadGuidePreferences = (): {
  sortBy: GuideSort
  sortOrder: GuideSortOrder
  selectedCategory: GuideCategory | 'all'
  viewMode: 'grid' | 'list'
} => {
  try {
    const saved = localStorage.getItem('admin-guide-preferences')
    if (saved) {
      const preferences = JSON.parse(saved)
      return {
        sortBy: preferences.sortBy || 'updatedAt',
        sortOrder: preferences.sortOrder || 'desc',
        selectedCategory: preferences.selectedCategory || 'all',
        viewMode: preferences.viewMode || 'grid'
      }
    }
  } catch (error) {
    console.warn('Failed to load guide preferences:', error)
  }

  return {
    sortBy: 'updatedAt',
    sortOrder: 'desc',
    selectedCategory: 'all',
    viewMode: 'grid'
  }
}

/**
 * Track guide view
 */
export const trackGuideView = (guideId: string): void => {
  try {
    const viewHistory = JSON.parse(localStorage.getItem('admin-guide-views') || '[]')
    const now = new Date().toISOString()

    // Add to history (keep last 50 views)
    const updatedHistory = [{ guideId, timestamp: now }, ...viewHistory].slice(0, 50)
    localStorage.setItem('admin-guide-views', JSON.stringify(updatedHistory))
  } catch (error) {
    console.warn('Failed to track guide view:', error)
  }
}

/**
 * Get recently viewed guides
 */
export const getRecentlyViewedGuides = (guides: AdminGuide[], limit = 5): AdminGuide[] => {
  try {
    const viewHistory = JSON.parse(localStorage.getItem('admin-guide-views') || '[]')
    const recentGuideIds = viewHistory.slice(0, limit).map((item: any) => item.guideId)

    return recentGuideIds
      .map((id: string) => guides.find(guide => guide.id === id))
      .filter(Boolean) as AdminGuide[]
  } catch (error) {
    console.warn('Failed to get recently viewed guides:', error)
    return []
  }
}
