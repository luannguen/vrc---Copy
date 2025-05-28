'use client';

import React, { useState, useEffect } from 'react';
import './styles.css';

/**
 * Component để hiển thị cây danh mục sản phẩm
 */
const ProductCategoryViewer: React.FC = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Hàm để tạo cây danh mục từ danh sách phẳng
  const buildCategoryTree = (items: any[]) => {
    const itemMap = new Map();
    const rootItems: any[] = [];

    // Đầu tiên, tạo bản đồ của tất cả các mục
    items.forEach(item => {
      itemMap.set(item.id, {
        ...item,
        children: []
      });
    });

    // Sau đó, tạo cấu trúc cây
    items.forEach(item => {
      if (item.parent) {
        const parentId = typeof item.parent === 'string' ? item.parent : item.parent.id;
        const parent = itemMap.get(parentId);
        if (parent) {
          parent.children.push(itemMap.get(item.id));
        } else {
          rootItems.push(itemMap.get(item.id));
        }
      } else {
        rootItems.push(itemMap.get(item.id));
      }
    });

    return rootItems;
  };

  // Lấy dữ liệu danh mục từ API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/product-categories?limit=100');
        const responseData = await response.json();
        const categoryData = responseData?.data || [];
        const tree = buildCategoryTree(categoryData);
        setCategories(tree);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh mục sản phẩm');
        console.error('Error fetching product categories:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Chuyển đổi trạng thái mở rộng của một danh mục
  const toggleExpand = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  // Render một mục danh mục
  const renderCategoryItem = (category: any, level = 0) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedCategories.has(category.id);

    return (
      <div key={category.id} className="category-item" style={{ paddingLeft: `${level * 20}px` }}>
        <div className="category-item-header">
          {hasChildren ? (
            <button 
              className={`expand-button ${isExpanded ? 'expanded' : ''}`}
              onClick={() => toggleExpand(category.id)}
            >
              {isExpanded ? '▼' : '►'}
            </button>
          ) : (
            <span className="category-item-bullet">•</span>
          )}
          <span className="category-item-title">{category.title}</span>
          {category.showInMenu && (
            <span className="category-tag menu-tag">Menu</span>
          )}
          {category.orderNumber !== undefined && (
            <span className="category-tag order-tag">{category.orderNumber}</span>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="category-children">
            {category.children.map((child: any) => renderCategoryItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="product-category-viewer">
      <h2 className="viewer-title">Cấu Trúc Danh Mục Sản Phẩm</h2>
      
      {loading ? (
        <div className="loading-state">Đang tải danh mục...</div>
      ) : error ? (
        <div className="error-state">{error}</div>
      ) : categories.length === 0 ? (
        <div className="empty-state">Chưa có danh mục sản phẩm nào được tạo</div>
      ) : (
        <div className="categories-tree">
          {categories.map(category => renderCategoryItem(category))}
        </div>
      )}
    </div>
  );
};

export default ProductCategoryViewer;
