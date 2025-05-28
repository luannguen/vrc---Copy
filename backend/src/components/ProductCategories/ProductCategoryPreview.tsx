'use client';

import React from 'react';
import { useField } from '@payloadcms/ui';
import './styles.css';

/**
 * Component để hiển thị xem trước của danh mục sản phẩm trong giao diện admin
 */
const ProductCategoryPreview: React.FC<{
  path: string;
}> = (props) => {
  const { path } = props;

  // Sử dụng hook useField để lấy dữ liệu từ form
  const { value: title } = useField<string>({ path: `${path}.title` });
  const { value: description } = useField<string>({ path: `${path}.description` });
  const { value: featuredImage } = useField<{ url?: string }>({ path: `${path}.featuredImage` });
  const { value: showInMenu } = useField<boolean>({ path: `${path}.showInMenu` });
  const { value: orderNumber } = useField<number>({ path: `${path}.orderNumber` });
  const { value: parent } = useField<any>({ path: `${path}.parent` });

  // Nếu không có title, không hiển thị xem trước
  if (!title) {
    return null;
  }

  return (
    <div className="product-category-preview">
      <h3 className="preview-heading">Xem trước danh mục</h3>
      
      <div className="preview-card">
        {featuredImage?.url && (
          <div className="preview-image">
            <img 
              src={featuredImage.url}
              alt={title}
            />
          </div>
        )}
        
        <div className="preview-content">
          <h4 className="preview-title">{title}</h4>
          
          {description && (
            <p className="preview-description">{description}</p>
          )}
          
          <div className="preview-meta">
            {parent && (
              <div className="preview-parent">
                <span className="meta-label">Danh mục cha:</span>
                <span className="meta-value">{parent.label || 'Loading...'}</span>
              </div>
            )}
            
            <div className="preview-flags">
              {showInMenu && (
                <span className="preview-flag menu-flag">Hiển thị trong menu</span>
              )}
              {orderNumber !== undefined && (
                <span className="preview-flag order-flag">Thứ tự: {orderNumber}</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryPreview;
