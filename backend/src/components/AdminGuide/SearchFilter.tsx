'use client'

import React, { useState } from 'react'
import { Search, Filter, X } from 'lucide-react'
import type { SearchFilterProps, GuideCategory } from '../../types/admin-guide.types'

export const SearchFilter: React.FC<SearchFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  guidesCount,
  className = ''
}) => {
  const [showFilters, setShowFilters] = useState(false)

  const categories: Array<{ value: GuideCategory | 'all'; label: string }> = [
    { value: 'all', label: 'Tất cả' },
    { value: 'collections', label: 'Collections' },
    { value: 'globals', label: 'Globals' },
    { value: 'dashboard', label: 'Dashboard' },
    { value: 'users', label: 'Người dùng' },
    { value: 'media', label: 'Media' },
    { value: 'api', label: 'API' },
    { value: 'customization', label: 'Tùy chỉnh' },
    { value: 'troubleshooting', label: 'Khắc phục sự cố' },
    { value: 'best-practices', label: 'Best Practices' },
    { value: 'security', label: 'Bảo mật' }
  ]

  const handleClearSearch = () => {
    onSearchChange('')
  }

  const handleClearFilters = () => {
    onSearchChange('')
    onCategoryChange('all')
  }

  const hasActiveFilters = searchQuery.trim() !== '' || selectedCategory !== 'all'

  return (
    <div className={`search-filter ${className}`}>
      <div className="search-filter__main">
        {/* Search Input */}
        <div className="search-input-wrapper">
          <Search className="search-icon" size={20} />
          <input
            type="text"
            className="search-input"
            placeholder="Tìm kiếm hướng dẫn..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              className="clear-search-btn"
              onClick={handleClearSearch}
              aria-label="Xóa tìm kiếm"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Filter Toggle */}
        <button
          className={`filter-toggle ${showFilters ? 'active' : ''}`}
          onClick={() => setShowFilters(!showFilters)}
          aria-label="Hiển thị bộ lọc"
        >
          <Filter size={20} />
          Lọc
          {hasActiveFilters && <span className="filter-indicator" />}
        </button>

        {/* Results Count */}
        <div className="results-count">
          {guidesCount} hướng dẫn
        </div>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="filter-panel">
          <div className="filter-section">
            <h4 className="filter-title">Danh mục</h4>
            <div className="category-filters">
              {categories.map((category) => (
                <button
                  key={category.value}
                  className={`category-filter ${
                    selectedCategory === category.value ? 'active' : ''
                  }`}
                  onClick={() => onCategoryChange(category.value)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <div className="filter-actions">
              <button
                className="clear-filters-btn"
                onClick={handleClearFilters}
              >
                <X size={16} />
                Xóa tất cả bộ lọc
              </button>
            </div>
          )}
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="active-filters">
          {searchQuery && (
            <div className="active-filter">
              <span className="filter-label">Tìm kiếm:</span>
              <span className="filter-value">&quot;{searchQuery}&quot;</span>
              <button
                className="remove-filter"
                onClick={handleClearSearch}
                aria-label="Xóa bộ lọc tìm kiếm"
              >
                <X size={14} />
              </button>
            </div>
          )}

          {selectedCategory !== 'all' && (
            <div className="active-filter">
              <span className="filter-label">Danh mục:</span>
              <span className="filter-value">
                {categories.find(c => c.value === selectedCategory)?.label}
              </span>
              <button
                className="remove-filter"
                onClick={() => onCategoryChange('all')}
                aria-label="Xóa bộ lọc danh mục"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default SearchFilter
