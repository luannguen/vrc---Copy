'use client'

import React, { useEffect, useState } from 'react'

interface ProjectCategoryCellProps {
  rowData: {
    id: string
    title: string
  }
}

const ProjectCategoryCell: React.FC<ProjectCategoryCellProps> = ({ rowData }) => {
  const [projectCount, setProjectCount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjectCount = async () => {
      try {
        setLoading(true)
        
        // Call API to get project count for this category
        // Use URLSearchParams to properly encode the query
        const params = new URLSearchParams({
          'where[categories][in][0]': rowData.id,
          'limit': '0'
        })
        
        const response = await fetch(`/api/projects?${params.toString()}`)
        
        if (response.ok) {
          const data = await response.json()
          console.log(`Project count for category ${rowData.id}:`, data.totalDocs)
          setProjectCount(data.totalDocs || 0)
        } else {
          console.error('Failed to fetch projects:', response.status, response.statusText)
          setProjectCount(0)
        }
      } catch (error) {
        console.error('Error fetching project count:', error)
        setProjectCount(0)
      } finally {
        setLoading(false)
      }
    }

    if (rowData?.id) {
      fetchProjectCount()
    }
  }, [rowData?.id])
  if (loading) {
    return (
      <div className="project-count-cell flex justify-center">
        <div className="animate-pulse">
          <div className="h-4 w-6 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  if (projectCount === null || projectCount === 0) {
    return (
      <div className="project-count-cell flex justify-center">
        <span className="text-gray-300 text-sm">—</span>
      </div>
    )
  }

  return (
    <div className="project-count-cell flex justify-center">
      <span 
        className={`inline-flex items-center justify-center px-2 py-1 rounded-full text-xs font-medium min-w-[24px] ${
          projectCount > 10 
            ? 'bg-red-100 text-red-800' 
            : projectCount > 5 
            ? 'bg-yellow-100 text-yellow-800'
            : projectCount > 0
            ? 'bg-blue-100 text-blue-800'
            : 'bg-gray-100 text-gray-800'
        }`}
        title={`${projectCount} dự án sử dụng danh mục này`}
      >
        {projectCount}
      </span>
    </div>
  )
}

export default ProjectCategoryCell
