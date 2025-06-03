'use client'

import React from 'react';

interface EventTitleWithPopupProps {
  rowData: {
    eventTitle?: string;
    eventId?: string;
    id: string;
  }
}

const EventTitleWithPopup: React.FC<EventTitleWithPopupProps> = ({ rowData }) => {
  console.log('EventTitleWithPopup rowData:', rowData);

  const eventTitle = rowData?.eventTitle;
  const eventId = rowData?.eventId;

  const handleEventClick = async (e: React.MouseEvent) => {
    e.preventDefault();

    if (!eventId) return;

    try {
      // Try to fetch event details from API
      const response = await fetch(`/api/events/${eventId}`);

      if (response.ok) {
        const eventData = await response.json();

        // Create popup window with event details
        const popup = window.open('', 'eventPopup', 'width=600,height=400,scrollbars=yes,resizable=yes');
        if (popup) {
          popup.document.write(`
            <html>
              <head>
                <title>Chi tiết sự kiện</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.5; }
                  h1 { color: #333; border-bottom: 2px solid #ddd; padding-bottom: 10px; }
                  .field { margin-bottom: 15px; }
                  .label { font-weight: bold; color: #555; }
                  .value { margin-left: 10px; }
                </style>
              </head>
              <body>
                <h1>${eventData.title || 'Chi tiết sự kiện'}</h1>
                <div class="field">
                  <span class="label">ID:</span>
                  <span class="value">${eventData.id}</span>
                </div>
                <div class="field">
                  <span class="label">Tiêu đề:</span>
                  <span class="value">${eventData.title}</span>
                </div>
                <div class="field">
                  <span class="label">Mô tả:</span>
                  <span class="value">${eventData.description || 'Không có mô tả'}</span>
                </div>
                <div class="field">
                  <span class="label">Trạng thái:</span>
                  <span class="value">${eventData.status || 'Không xác định'}</span>
                </div>
                <button onclick="window.close()" style="margin-top: 20px; padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Đóng</button>
              </body>
            </html>
          `);
        }
      } else {
        // If API call fails, show simpler popup with available info
        const popup = window.open('', 'eventPopup', 'width=400,height=300,scrollbars=yes,resizable=yes');
        if (popup) {
          popup.document.write(`
            <html>
              <head>
                <title>Chi tiết sự kiện</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; text-align: center; }
                  h1 { color: #333; }
                </style>
              </head>
              <body>
                <h1>${eventTitle}</h1>
                <p>ID sự kiện: ${eventId}</p>
                <p>Không thể tải thêm thông tin chi tiết.</p>
                <button onclick="window.close()" style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">Đóng</button>
              </body>
            </html>
          `);
        }
      }
    } catch (error) {
      console.error('Error fetching event details:', error);
      alert('Không thể tải thông tin sự kiện');
    }
  };

  if (!eventTitle) {
    return <span className="text-gray-400">No event title</span>;
  }

  return (
    <div>
      <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{eventTitle}</div>
      {eventId && (
        <small style={{ color: '#666', fontSize: '12px' }}>
          ID: {eventId} |
          <a
            href="#"
            onClick={handleEventClick}
            style={{ color: '#0066cc', marginLeft: '4px', textDecoration: 'none', cursor: 'pointer' }}
          >
            🔍 Xem chi tiết
          </a>
        </small>
      )}
    </div>
  );
};

export default EventTitleWithPopup;
