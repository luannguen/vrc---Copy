import { useState, useEffect } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

// Types for Projects API - cập nhật theo API response thực tế
export interface Project {
  id: string
  title: string
  slug: string
  description?: string
  summary?: string
  content?: any // Rich text content from Lexical editor
  categories: Array<{
    id: string
    title: string
    slug: string
    description?: string
  }>
  category?: {
    id: string
    title: string
    slug: string
    description?: string
  }
  client?: string
  location?: string
  area?: string
  capacity?: string
  timeframe?: {
    startDate: string
    endDate: string
    isOngoing: boolean
  }
  featuredImage?: {
    id: string
    url: string
    filename: string
    alt?: string
    sizes?: {
      thumbnail?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }
  gallery?: Array<{
    id: string
    image?: {
      id: string
      url: string
      alt?: string
      sizes?: {
        thumbnail?: { url: string }
        medium?: { url: string }
        large?: { url: string }
      }
    }
    // For backward compatibility
    url?: string
    alt?: string
    sizes?: {
      thumbnail?: { url: string }
      medium?: { url: string }
      large?: { url: string }
    }
  }>
  services?: Array<{
    id: string
    name: string
  }>
  achievements?: Array<{
    id: string
    description: string
  }>
  standards?: Array<{
    id: string
    name: string
  }>
  featured: boolean
  testimonial?: any
  status: 'draft' | 'published'
  meta?: any
  createdAt: string
  updatedAt: string
}

export interface ProjectCategory {
  id: string
  title: string
  slug: string
  description?: string
}

// Types for Projects Page Settings - đã được seeded
export interface ProjectsPageSettings {
  heroSection: {
    title: string
    subtitle: string
    backgroundImage?: {
      id: string
      url: string
      alt?: string
    }
  }
  categorySection: {
    title: string
    description: string
    enableCategories: boolean
  }
  featuredSection: {
    title: string
    showFeaturedProjects: boolean
    featuredProjectsLimit: number
  }
  statsSection: {
    enableStats: boolean
    stats: Array<{
      id: string
      value: string
      label: string
    }>
  }
  ctaSection: {
    title: string
    description: string
    primaryButton: {
      text: string
      link: string
    }
    secondaryButton: {
      text: string
      link: string
    }
  }
  specializedPage?: {
    title: string
    description: string
    heroImage?: {
      id: string
      url: string
      alt?: string
    }
  }
}

// API Response types
interface ProjectsApiResponse {
  success?: boolean
  data?: {
    projects?: Project[]
    pagination?: {
      total: number
      page: number
      pages: number
      limit: number
      hasNext: boolean
      hasPrev: boolean
    }
  }
}

interface CategoriesApiResponse {
  success?: boolean
  data?: ProjectCategory[]
  pagination?: any
}

// Hook to fetch projects
export const useProjects = (filters?: {
  category?: string
  featured?: boolean
  limit?: number
  page?: number
}) => {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchProjects = async () => {
      try {        setLoading(true)
        setError(null)

        const params = new URLSearchParams()
        if (filters?.category) params.append('where[category][slug][equals]', filters.category)
        if (filters?.featured !== undefined) params.append('where[featured][equals]', filters.featured.toString())
        if (filters?.limit) params.append('limit', filters.limit.toString())
        if (filters?.page) params.append('page', filters.page.toString())
        params.append('where[status][equals]', 'published')

        const response = await fetch(`${API_BASE_URL}/api/projects?${params}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch projects: ${response.statusText}`)
        }        const data: ProjectsApiResponse = await response.json()
        
        setProjects(data.data?.projects || [])
        setTotalPages(data.data?.pagination?.pages || 1)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch projects')
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [filters?.category, filters?.featured, filters?.limit, filters?.page])

  return { projects, loading, error, totalPages }
}

// Hook to fetch single project
export const useProject = (slug: string) => {  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return

    const fetchProject = async () => {
      try {
        setLoading(true)
        setError(null)

        // Properly encode the URL parameters
        const params = new URLSearchParams({
          'where[slug][equals]': slug,
          'limit': '1'
        })
        const url = `${API_BASE_URL}/api/projects?${params.toString()}`
        
        const response = await fetch(url)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch project: ${response.statusText}`)
        }

        const data: ProjectsApiResponse = await response.json()
        
        if (data.data?.projects && data.data.projects.length > 0) {
          setProject(data.data.projects[0])
        } else {
          setProject(null)
          setError('Project not found')
        }
      } catch (err) {
        console.error('❌ Error fetching project:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch project')
        setProject(null)
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [slug])

  return { project, loading, error }
}

// Hook to fetch project categories
export const useProjectCategories = () => {
  const [categories, setCategories] = useState<ProjectCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/api/project-categories`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`)
        }        const data: CategoriesApiResponse = await response.json()
        
        setCategories(data.data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch categories')
        setCategories([])
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  return { categories, loading, error }
}

// Hook to fetch projects page settings
export const useProjectsPageSettings = () => {
  const [settings, setSettings] = useState<ProjectsPageSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch(`${API_BASE_URL}/api/projects-page-settings`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch settings: ${response.statusText}`)
        }

        const data = await response.json()
        
        setSettings(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch settings')
        setSettings(null)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [])

  return { settings, loading, error }
}

// Utility functions for image URLs
export const getImageUrl = (image: any, size: 'thumbnail' | 'medium' | 'large' = 'medium') => {
  if (!image) return null
  
  // Check for sizes structure first
  if (image.sizes?.[size]?.url) {
    return `${API_BASE_URL}${image.sizes[size].url}`
  }
  
  // Fallback to original image URL
  if (image.url) {
    return `${API_BASE_URL}${image.url}`
  }
  
  return null
}

export const getImageAlt = (image: any, fallback = '') => {
  return image?.alt || fallback
}

// Utility function to extract text from Lexical content
export const extractTextFromLexicalContent = (content: any): string => {
  if (!content || !content.root || !content.root.children) {
    return ''
  }
  
  const extractText = (children: any[]): string => {
    return children.map(child => {
      if (child.type === 'text') {
        return child.text || ''
      } else if (child.children) {
        return extractText(child.children)
      }
      return ''
    }).join('')
  }
  
  return extractText(content.root.children)
}
