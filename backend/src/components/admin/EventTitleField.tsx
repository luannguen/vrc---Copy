'use client'

import React from 'react';
import './EventTitleField.module.scss';

interface EventTitleFieldProps {
  rowData: {
    eventTitle?: string;
    eventId?: string;
    id: string;
  }
}

const EventTitleField: React.FC<EventTitleFieldProps> = ({ rowData }) => {
  console.log('EventTitleField loaded with rowData:', rowData);

  const eventTitle = rowData?.eventTitle;
  const eventId = rowData?.eventId;  const handleEventClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!eventId) return;

    try {
      // Open admin event management page in a popup
      const eventAdminUrl = `/admin/collections/events/${eventId}`;

      // Create a larger popup window for the admin interface
      const popup = window.open(
        eventAdminUrl,
        'eventManagementPopup',
        'width=1400,height=900,scrollbars=yes,resizable=yes,location=no,menubar=no,toolbar=no,status=no,left=200,top=100'
      );

      if (popup) {
        // Focus the popup window
        popup.focus();

        // Create a loading overlay while popup loads
        const loadingHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <title>Đang tải quản lý sự kiện...</title>
            <style>
              body {
                margin: 0;
                padding: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                color: white;
              }
              .loading-container {
                text-align: center;
                background: rgba(255,255,255,0.1);
                backdrop-filter: blur(10px);
                border-radius: 16px;
                padding: 40px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
              }
              .spinner {
                width: 40px;
                height: 40px;
                border: 4px solid rgba(255,255,255,0.3);
                border-top: 4px solid white;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin: 0 auto 20px;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
              h2 {
                margin: 0 0 10px;
                font-weight: 600;
              }
              p {
                margin: 0;
                opacity: 0.9;
              }
              .close-btn {
                position: absolute;
                top: 15px;
                right: 15px;
                background: rgba(239, 68, 68, 0.9);
                color: white;
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                font-size: 16px;
                cursor: pointer;
                transition: all 0.2s ease;
              }
              .close-btn:hover {
                background: #dc2626;
                transform: scale(1.1);
              }
            </style>
          </head>
          <body>
            <button class="close-btn" onclick="window.close()">×</button>
            <div class="loading-container">
              <div class="spinner"></div>
              <h2>Đang tải trang quản lý sự kiện</h2>
              <p>Vui lòng chờ trong giây lát...</p>
            </div>
            <script>
              // Redirect to actual admin page after 1 second
              setTimeout(() => {
                window.location.href = '${eventAdminUrl}';
              }, 1000);
            </script>
          </body>
          </html>
        `;

        // Write loading HTML to popup
        popup.document.write(loadingHTML);
        popup.document.close();

        // Monitor popup for when it loads the actual admin page
        const checkLoaded = setInterval(() => {
          try {
            if (popup.closed) {
              clearInterval(checkLoaded);
              return;
            }

            // Check if the admin page has loaded
            if (popup.location.pathname.includes('/admin/collections/events/')) {
              clearInterval(checkLoaded);

              // Try to inject custom styles after admin page loads
              setTimeout(() => {
                try {
                  const style = popup.document.createElement('style');
                  style.textContent = `
                    /* Enhanced admin popup styles */
                    body {
                      background: #f8fafc !important;
                      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                    }

                    /* Header enhancements */
                    .payload-admin-bar,
                    .nav-wrapper {
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                      box-shadow: 0 4px 20px rgba(0,0,0,0.1) !important;
                    }

                    /* Content area */
                    .template-default {
                      background: #f8fafc !important;
                      min-height: 100vh !important;
                      padding-top: 80px !important;
                    }

                    /* Form container */
                    .render-fields {
                      background: white !important;
                      border-radius: 12px !important;
                      padding: 32px !important;
                      margin: 24px !important;
                      box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
                      border: 1px solid #e2e8f0 !important;
                    }

                    /* Field styling - more compact spacing */
                    .field-type {
                      margin-bottom: 12px !important;
                    }

                    .field-type label {
                      font-weight: 600 !important;
                      color: #374151 !important;
                      margin-bottom: 4px !important;
                      font-size: 12px !important;
                      display: block !important;
                    }

                    /* Checkbox and radio styling */
                    input[type="checkbox"],
                    input[type="radio"] {
                      width: 16px !important;
                      height: 16px !important;
                      margin-right: 8px !important;
                    }

                    /* Field descriptions */
                    .field-description {
                      font-size: 11px !important;
                      color: #6b7280 !important;
                      margin-top: 4px !important;
                    }

                    /* Compact field groups */
                    .field-type--group,
                    .field-type--array {
                      padding: 12px !important;
                      border-radius: 6px !important;
                      background: #f8fafc !important;
                      border: 1px solid #e2e8f0 !important;
                    }

                    /* Input enhancements - more compact */
                    input[type="text"],
                    input[type="email"],
                    input[type="tel"],
                    input[type="date"],
                    textarea,
                    select {
                      border: 2px solid #e2e8f0 !important;
                      border-radius: 5px !important;
                      padding: 6px 10px !important;
                      font-size: 12px !important;
                      transition: all 0.2s ease !important;
                      width: 100% !important;
                      box-sizing: border-box !important;
                      background: white !important;
                      height: auto !important;
                      min-height: 32px !important;
                    }

                    /* Make dropdowns smaller and more compact */
                    select {
                      padding: 4px 8px !important;
                      font-size: 11px !important;
                      min-height: 28px !important;
                      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e") !important;
                      background-position: right 6px center !important;
                      background-repeat: no-repeat !important;
                      background-size: 14px !important;
                      padding-right: 26px !important;
                    }

                    /* Input focus states */
                    input:focus,
                    textarea:focus,
                    select:focus {
                      border-color: #667eea !important;
                      box-shadow: 0 0 0 2px rgba(102, 126, 234, 0.1) !important;
                      outline: none !important;
                    }

                    /* Button styling - more compact */
                    .form-submit .btn,
                    .btn--style-primary,
                    .doc-tab__link--active,
                    .doc-tab__link {
                      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
                      border: none !important;
                      border-radius: 5px !important;
                      padding: 6px 12px !important;
                      font-weight: 600 !important;
                      font-size: 11px !important;
                      color: white !important;
                      cursor: pointer !important;
                      transition: all 0.2s ease !important;
                      box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3) !important;
                      text-decoration: none !important;
                      min-height: 28px !important;
                      height: auto !important;
                      line-height: 1.3 !important;
                    }

                    /* Publish changes button specifically - extra compact */
                    .form-submit .btn,
                    .btn--style-primary {
                      padding: 4px 10px !important;
                      font-size: 10px !important;
                      min-height: 26px !important;
                      border-radius: 4px !important;
                      font-weight: 700 !important;
                      letter-spacing: 0.02em !important;
                    }

                    .btn:hover,
                    .btn--style-primary:hover {
                      transform: translateY(-1px) !important;
                      box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4) !important;
                    }

                    /* Page title */
                    .doc-header h1 {
                      color: #1a202c !important;
                      font-size: 28px !important;
                      font-weight: 700 !important;
                      margin-bottom: 8px !important;
                    }

                    /* Breadcrumb */
                    .step-nav {
                      background: rgba(255,255,255,0.95) !important;
                      backdrop-filter: blur(10px) !important;
                      border-radius: 8px !important;
                      padding: 12px 16px !important;
                      margin: 16px 24px !important;
                      border: 1px solid #e2e8f0 !important;
                      box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
                    }

                    /* Sidebar */
                    .doc-fields__sidebar {
                      background: white !important;
                      border-radius: 12px !important;
                      padding: 24px !important;
                      margin: 24px 12px !important;
                      box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important;
                      border: 1px solid #e2e8f0 !important;
                    }

                    /* Popup close button - more compact and elegant */
                    .popup-close-btn {
                      position: fixed !important;
                      top: 12px !important;
                      right: 12px !important;
                      z-index: 10000 !important;
                      background: #ef4444 !important;
                      color: white !important;
                      border: none !important;
                      border-radius: 50% !important;
                      width: 32px !important;
                      height: 32px !important;
                      font-size: 16px !important;
                      font-weight: bold !important;
                      cursor: pointer !important;
                      box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4) !important;
                      transition: all 0.2s ease !important;
                    }

                    .popup-close-btn:hover {
                      background: #dc2626 !important;
                      transform: scale(1.05) !important;
                      box-shadow: 0 4px 15px rgba(239, 68, 68, 0.5) !important;
                    }

                    /* Secondary buttons - extra compact */
                    .btn--style-secondary,
                    .btn--size-small,
                    .array-field__add-button {
                      padding: 3px 8px !important;
                      font-size: 10px !important;
                      min-height: 24px !important;
                      border-radius: 3px !important;
                      background: #f3f4f6 !important;
                      color: #374151 !important;
                      border: 1px solid #d1d5db !important;
                      font-weight: 500 !important;
                    }

                    .btn--style-secondary:hover {
                      background: #e5e7eb !important;
                      transform: none !important;
                      box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
                    }

                    /* Rich text editor */
                    .lexical-editor {
                      border: 2px solid #e2e8f0 !important;
                      border-radius: 8px !important;
                      min-height: 200px !important;
                    }

                    /* Toast notifications */
                    .toast-container .toast--success {
                      background: #10b981 !important;
                      border-radius: 8px !important;
                      box-shadow: 0 4px 25px rgba(16, 185, 129, 0.3) !important;
                    }

                    .toast-container .toast--error {
                      background: #ef4444 !important;
                      border-radius: 8px !important;
                      box-shadow: 0 4px 25px rgba(239, 68, 68, 0.3) !important;
                    }
                  `;

                  popup.document.head.appendChild(style);

                  // Add enhanced close button
                  const closeBtn = popup.document.createElement('button');
                  closeBtn.innerHTML = '×';
                  closeBtn.className = 'popup-close-btn';
                  closeBtn.title = 'Đóng cửa sổ';
                  closeBtn.onclick = () => popup.close();
                  popup.document.body.appendChild(closeBtn);

                } catch (error) {
                  console.log('Could not enhance popup styling:', error);
                }
              }, 500);
            }
          } catch (_error) {
            // Cross-origin error is expected, ignore
          }
        }, 100);

        // Clear interval after 10 seconds to prevent memory leaks
        setTimeout(() => {
          clearInterval(checkLoaded);
        }, 10000);

      } else {
        // Fallback if popup is blocked
        alert('Popup bị chặn! Sẽ mở trong tab mới.');
        window.open(eventAdminUrl, '_blank');
      }
    } catch (error) {
      console.error('Error opening event management popup:', error);
      // Fallback: open in new tab
      window.open(`/admin/collections/events/${eventId}`, '_blank');
    }
  };

  if (!eventTitle) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <div className="event-title-field">
      <div className="event-title-main">
        <strong className="event-title">{eventTitle}</strong>
      </div>
      {eventId && (
        <div className="event-meta">
          <small className="text-gray-500">
            ID: {eventId}
            <span className="separator"> | </span>
            <a
              href="#"
              onClick={handleEventClick}
              className="event-link"
              title="Mở trang quản lý sự kiện trong popup"
            >
              ⚙️ Quản lý sự kiện
            </a>
          </small>
        </div>
      )}
    </div>
  );
};

export default EventTitleField;
