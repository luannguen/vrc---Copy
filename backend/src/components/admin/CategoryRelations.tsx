'use client'

import React, { useEffect, useState } from 'react'
import { Button } from '@payloadcms/ui'
import { Banner } from '@payloadcms/ui/elements/Banner'

interface Subcategory {
  id: string
  name: string
  slug: string
  description?: string
  title?: string
  icon?: string
  color?: string
}

interface Project {
  id: string
  title: string
  slug: string
  status: string
  categories?: string[]
  createdAt?: string
}

const CategoryRelations: React.FC = () => {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [categoryId, setCategoryId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'subcategories' | 'projects'>('subcategories')

  useEffect(() => {
    // Extract category ID from URL
    const pathParts = window.location.pathname.split('/')
    const id = pathParts[pathParts.length - 1]
    if (id && id !== 'create') {
      setCategoryId(id)
    }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!categoryId) return

      try {
        setLoading(true)
        
        // Fetch subcategories
        const subCategoriesParams = new URLSearchParams({
          'where[parent][equals]': categoryId,
          'limit': '50',
          'depth': '1'
        })
        const subCategoriesResponse = await fetch(`/api/project-categories?${subCategoriesParams.toString()}`)
        if (subCategoriesResponse.ok) {
          const subCategoriesData = await subCategoriesResponse.json()
          setSubcategories(subCategoriesData.docs || [])
        }

        // Fetch projects using this category
        const projectsParams = new URLSearchParams({
          'where[categories][in][0]': categoryId,
          'limit': '20'
        })
        
        const projectsResponse = await fetch(`/api/projects?${projectsParams.toString()}`)
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

    fetchData()
  }, [categoryId])

  const openInNewTab = (url: string) => {
    window.open(url, '_blank')
  }

  if (!categoryId) {
    return (
      <Banner type="info">
        <h4>Thông báo</h4>
        <p>Lưu danh mục trước để xem thông tin liên quan</p>
      </Banner>
    )
  }

  if (loading) {
    return (
      <div style={{ padding: '1rem' }}>
        <Banner type="info">
          <p>Đang tải dữ liệu...</p>
        </Banner>
      </div>
    )
  }

  return (
    <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', backgroundColor: '#fff' }}>
      {/* Navigation Tabs */}
      <div style={{ borderBottom: '1px solid #e5e7eb', backgroundColor: '#f9fafb', borderRadius: '8px 8px 0 0' }}>
        <nav style={{ display: 'flex', gap: '2rem', padding: '0 1rem' }}>          <button
            onClick={() => setActiveTab('subcategories')}
            style={{
              padding: '0.75rem 0.25rem',
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              borderBottom: activeTab === 'subcategories' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: '500',
              fontSize: '0.875rem',
              color: activeTab === 'subcategories' ? '#2563eb' : '#6b7280',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            Danh mục con ({subcategories.length})
          </button>          <button
            onClick={() => setActiveTab('projects')}
            style={{
              padding: '0.75rem 0.25rem',
              borderLeft: 'none',
              borderRight: 'none',
              borderTop: 'none',
              borderBottom: activeTab === 'projects' ? '2px solid #3b82f6' : '2px solid transparent',
              fontWeight: '500',
              fontSize: '0.875rem',
              color: activeTab === 'projects' ? '#2563eb' : '#6b7280',
              background: 'none',
              cursor: 'pointer'
            }}
          >
            Dự án liên quan ({projects.length})
          </button>
        </nav>
      </div>

      {/* Content */}
      <div style={{ padding: '1rem' }}>
        {activeTab === 'subcategories' && (
          <div>
            {subcategories.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Banner type="info">
                  <h4>Chưa có danh mục con</h4>
                  <p>Danh mục này chưa có danh mục con nào.</p>
                  <div style={{ marginTop: '1rem' }}>
                    <Button
                      buttonStyle="primary"
                      size="small"
                      onClick={() => openInNewTab('/admin/collections/project-categories/create')}
                    >
                      Tạo danh mục con
                    </Button>
                  </div>
                </Banner>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    Danh mục con ({subcategories.length})
                  </h3>
                  <Button
                    buttonStyle="primary"
                    size="small"
                    onClick={() => openInNewTab('/admin/collections/project-categories/create')}
                  >
                    Thêm mới
                  </Button>
                </div>
                
                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                          Danh mục
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                          Mô tả
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                          Trạng thái
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {subcategories.map((subCategory, index) => (
                        <tr key={subCategory.id} style={{ borderTop: index > 0 ? '1px solid #e5e7eb' : 'none' }}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              {subCategory.icon && (
                                <span style={{ fontSize: '1.125rem', marginRight: '0.75rem' }}>{subCategory.icon}</span>
                              )}
                              <div>
                                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                                  {subCategory.title || subCategory.name}
                                </div>
                                {subCategory.color && (
                                  <div style={{ display: 'flex', alignItems: 'center', marginTop: '0.25rem' }}>
                                    <div 
                                      style={{ 
                                        width: '0.75rem', 
                                        height: '0.75rem', 
                                        borderRadius: '50%', 
                                        border: '1px solid #d1d5db', 
                                        marginRight: '0.5rem',
                                        backgroundColor: subCategory.color 
                                      }}
                                    />
                                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>{subCategory.color}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ fontSize: '0.875rem', color: '#111827', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {subCategory.description || <span style={{ color: '#9ca3af', fontStyle: 'italic' }}>Chưa có mô tả</span>}
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              padding: '0.25rem 0.625rem', 
                              borderRadius: '9999px', 
                              fontSize: '0.75rem', 
                              fontWeight: '500',
                              backgroundColor: '#dcfce7',
                              color: '#166534'
                            }}>
                              Hoạt động
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <Button
                                buttonStyle="secondary"
                                size="small"
                                onClick={() => openInNewTab(`/admin/collections/project-categories/${subCategory.id}`)}
                              >
                                Xem
                              </Button>
                              <Button
                                buttonStyle="secondary"
                                size="small"
                                onClick={() => openInNewTab(`/admin/collections/project-categories/${subCategory.id}`)}
                              >
                                Sửa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'projects' && (
          <div>
            {projects.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem' }}>
                <Banner type="info">
                  <h4>Chưa có dự án</h4>
                  <p>Chưa có dự án nào sử dụng danh mục này.</p>
                  <div style={{ marginTop: '1rem' }}>
                    <Button
                      buttonStyle="primary"
                      size="small"
                      onClick={() => openInNewTab('/admin/collections/projects/create')}
                    >
                      Tạo dự án mới
                    </Button>
                  </div>
                </Banner>
              </div>
            ) : (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ margin: 0, fontSize: '0.875rem', fontWeight: '500', color: '#111827' }}>
                    Dự án liên quan ({projects.length})
                  </h3>
                  <Button
                    buttonStyle="primary"
                    size="small"
                    onClick={() => openInNewTab('/admin/collections/projects/create')}
                  >
                    Thêm mới
                  </Button>
                </div>

                <div style={{ border: '1px solid #e5e7eb', borderRadius: '8px', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ backgroundColor: '#f9fafb' }}>
                      <tr>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                          Dự án
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                          Trạng thái
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                          Ngày tạo
                        </th>
                        <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '500', color: '#6b7280', textTransform: 'uppercase' }}>
                          Thao tác
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {projects.map((project, index) => (
                        <tr key={project.id} style={{ borderTop: index > 0 ? '1px solid #e5e7eb' : 'none' }}>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <div style={{ 
                                flexShrink: 0, 
                                width: '2rem', 
                                height: '2rem', 
                                borderRadius: '0.5rem', 
                                background: 'linear-gradient(to right, #3b82f6, #8b5cf6)', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center' 
                              }}>
                                <svg style={{ width: '1rem', height: '1rem', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h4a1 1 0 011 1v5m-6 0V9a1 1 0 011-1h4a1 1 0 011 1v11" />
                                </svg>
                              </div>
                              <div style={{ marginLeft: '1rem' }}>
                                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: '#111827', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                  {project.title}
                                </div>
                                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                                  ID: {project.id.slice(-8)}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td style={{ padding: '1rem 1.5rem' }}>
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              padding: '0.25rem 0.625rem', 
                              borderRadius: '9999px', 
                              fontSize: '0.75rem', 
                              fontWeight: '500',
                              backgroundColor: project.status === 'published' ? '#dcfce7' : project.status === 'draft' ? '#fef3c7' : '#f3f4f6',
                              color: project.status === 'published' ? '#166534' : project.status === 'draft' ? '#92400e' : '#374151'
                            }}>
                              {project.status === 'published' ? 'Đã xuất bản' : 
                               project.status === 'draft' ? 'Bản nháp' : project.status}
                            </span>
                          </td>
                          <td style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                            {project.createdAt ? new Date(project.createdAt).toLocaleDateString('vi-VN') : 'N/A'}
                          </td>
                          <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                              <Button
                                buttonStyle="secondary"
                                size="small"
                                onClick={() => openInNewTab(`/admin/collections/projects/${project.id}`)}
                              >
                                Xem
                              </Button>
                              <Button
                                buttonStyle="secondary"
                                size="small"
                                onClick={() => openInNewTab(`/admin/collections/projects/${project.id}`)}
                              >
                                Sửa
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default CategoryRelations
