import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface Event {
  id: string | number;
  title: string;
  startDate: string;
  endDate?: string;
  category?: string;
  status?: string;
}

interface CalendarProps {
  events: Event[];
  onEventClick?: (event: Event) => void;
  onDateClick?: (date: Date) => void;
}

// Màu sắc cho từng category
const categoryColors: Record<string, string> = {
  'Triển lãm': 'bg-blue-100 text-blue-800 border-blue-200',
  'Hội thảo': 'bg-green-100 text-green-800 border-green-200',
  'Đào tạo': 'bg-purple-100 text-purple-800 border-purple-200',
  'Ra mắt sản phẩm': 'bg-orange-100 text-orange-800 border-orange-200',
  'Diễn đàn': 'bg-pink-100 text-pink-800 border-pink-200',
  'Hội nghị': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'default': 'bg-gray-100 text-gray-800 border-gray-200'
};

const Calendar: React.FC<CalendarProps> = ({ events, onEventClick, onDateClick }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Lấy năm và tháng hiện tại
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Tên tháng tiếng Việt
  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ];

  // Tên ngày trong tuần tiếng Việt
  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
  // Tính toán các ngày trong tháng
  const daysInMonth = useMemo(() => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    
    // Điều chỉnh để bắt đầu từ Chủ nhật
    startDate.setDate(firstDay.getDate() - firstDay.getDay());
    
    const days: Date[] = [];
    const endDate = new Date(lastDay);
    endDate.setDate(lastDay.getDate() + (6 - lastDay.getDay()));
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    
    return days;
  }, [year, month]);

  // Lấy events cho một ngày cụ thể
  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.filter(event => {
      const eventStart = new Date(event.startDate).toISOString().split('T')[0];
      const eventEnd = event.endDate ? new Date(event.endDate).toISOString().split('T')[0] : eventStart;
      return dateStr >= eventStart && dateStr <= eventEnd;
    });
  };

  // Navigation
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  // Check if date is in current month
  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h2 className="text-xl font-semibold flex items-center">
          <CalendarIcon className="mr-2 h-5 w-5" />
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm" onClick={goToToday}>
            Hôm nay
          </Button>
          <Button variant="outline" size="sm" onClick={goToPreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="sm" onClick={goToNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {daysInMonth.map((date, index) => {
            const dayEvents = getEventsForDate(date);
            const isCurrentMonthDate = isCurrentMonth(date);
            const isTodayDate = isToday(date);
            
            return (
              <div
                key={index}
                className={cn(
                  "min-h-[100px] p-1 border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors",
                  !isCurrentMonthDate && "text-gray-300 bg-gray-50/50",
                  isTodayDate && "bg-blue-50 border-blue-200"
                )}
                onClick={() => onDateClick?.(date)}
              >
                {/* Date number */}
                <div className={cn(
                  "text-sm font-medium mb-1",
                  isTodayDate && "text-blue-600 font-bold"
                )}>
                  {date.getDate()}
                </div>

                {/* Events */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => {
                    const category = typeof event.category === 'string' ? event.category : 'default';
                    const colorClass = categoryColors[category] || categoryColors.default;
                    
                    return (
                      <div
                        key={eventIndex}
                        className={cn(
                          "text-xs p-1 rounded cursor-pointer truncate",
                          colorClass
                        )}
                        onClick={(e) => {
                          e.stopPropagation();
                          onEventClick?.(event);
                        }}
                        title={event.title}
                      >
                        {event.title}
                      </div>
                    );
                  })}
                  
                  {/* Show more indicator */}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 font-medium">
                      +{dayEvents.length - 2} thêm
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="px-4 pb-4">
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 mr-2">Danh mục:</span>
          {Object.entries(categoryColors).filter(([key]) => key !== 'default').map(([category, colorClass]) => (
            <Badge key={category} variant="outline" className={cn("text-xs", colorClass)}>
              {category}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
