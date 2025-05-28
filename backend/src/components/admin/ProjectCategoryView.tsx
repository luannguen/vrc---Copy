'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

interface ProjectCategoryViewProps {
  doc: {
    id: string
    title: string
    description?: string
    parent?: {
      id: string
      title: string
    }
    color?: string
    icon?: string
  }
}

interface SubCategory {
  id: string
  title: string
  description?: string
  color?: string
  icon?: string
}

interface Project {
  id: string
  title: string
  status: string
  createdAt: string
}

const ProjectCategoryView: React.FC<ProjectCategoryViewProps> = ({ doc }) => {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'subcategories' | 'projects'>('subcategories')
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)

        // Fetch subcategories
        const subCategoriesResponse = await fetch(`/api/project-categories?where[parent][equals]=${doc.id}&limit=50&depth=1`)
        if (subCategoriesResponse.ok) {
          const subCategoriesData = await subCategoriesResponse.json()
          setSubCategories(subCategoriesData.docs || [])
        }

        // Fetch projects using this category
        const projectsResponse = await fetch(`/api/projects?where[categories][in]=${doc.id}&limit=20&depth=0`)
        if (projectsResponse.ok) {
          const projectsData = await projectsResponse.json()
          setProjects(projectsData.docs || [])
        }
      } catch (error) {
        console.error('Error fetching category details:', error)
      } finally {
        setLoading(false)
      }
    }

    if (doc?.id) {
      fetchData()
    }
  }, [doc?.id])

  const handleSubCategoryClick = (subCategoryId: string) => {
    router.push(`/admin/collections/project-categories/${subCategoryId}`)
  }

  const handleProjectClick = (projectId: string) => {
    router.push(`/admin/collections/projects/${projectId}`)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="project-category-view p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          {doc.icon && (
            <span className="text-2xl">{doc.icon}</span>
          )}
          <h2 className="text-2xl font-bold text-gray-900">{doc.title}</h2>
          {doc.color && (
            <div 
              className="w-4 h-4 rounded-full border border-gray-300"
              style={{ backgroundColor: doc.color }}
              title={`Màu sắc: ${doc.color}`}
            />
          )}
        </div>
        
        {doc.description && (
          <p className="text-gray-600">{doc.description}</p>
        )}
        
        {doc.parent && (
          <div className="mt-2">
            <span className="text-sm text-gray-500">
              Danh mục cha: 
              <button 
                onClick={() => handleSubCategoryClick(doc.parent!.id)}
                className="ml-1 text-blue-600 hover:text-blue-800 underline"
              >
                {doc.parent.title}
              </button>
            </span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('subcategories')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subcategories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Danh mục con ({subCategories.length})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'projects'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Dự án ({projects.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'subcategories' && (
        <div className="subcategories-section">
          {subCategories.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Chưa có danh mục con</h3>
              <p className="text-sm text-gray-500">Danh mục này chưa có danh mục con nào.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {subCategories.map((subCategory) => (
                <div
                  key={subCategory.id}
                  onClick={() => handleSubCategoryClick(subCategory.id)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center gap-3 mb-2">
                    {subCategory.icon && (
                      <span className="text-lg">{subCategory.icon}</span>
                    )}
                    <h4 className="font-medium text-gray-900">{subCategory.title}</h4>
                    {subCategory.color && (
                      <div 
                        className="w-3 h-3 rounded-full border border-gray-300"
                        style={{ backgroundColor: subCategory.color }}
                      />
                    )}
                  </div>
                  {subCategory.description && (
                    <p className="text-sm text-gray-600 line-clamp-2">{subCategory.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'projects' && (
        <div className="projects-section">
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-gray-400 mb-2">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-sm font-medium text-gray-900">Chưa có dự án</h3>
              <p className="text-sm text-gray-500">Chưa có dự án nào sử dụng danh mục này.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => handleProjectClick(project.id)}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{project.title}</h4>
                      <p className="text-sm text-gray-500">
                        Tạo ngày: {new Date(project.createdAt).toLocaleDateString('vi-VN')}
                      </p>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        project.status === 'published' 
                          ? 'bg-green-100 text-green-800'
                          : project.status === 'draft'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {project.status === 'published' ? 'Đã xuất bản' : 
                         project.status === 'draft' ? 'Bản nháp' : project.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ProjectCategoryView
