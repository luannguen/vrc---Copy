import React from "react";
import { CalendarIcon, ChevronRight, Clock, Eye, MapPin, Tag, User, Grid, Calendar as CalendarViewIcon } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { SearchIcon } from "@/components/ui/search-icon";
import { useEvents, useEventsFilters, useEventCategories, useFilteredEvents, useEventCategoryCounts } from "@/hooks/useEvents";
import { EventsUtils } from "@/services/eventsApi";
import { CategoryDisplay } from "@/types/events";
import Calendar from "@/components/Calendar";
import { cn } from "@/lib/utils";

// Dữ liệu mẫu cho sự kiện
const eventItems = [
  {
    id: 1,
    title: "Triển lãm Quốc tế về Hệ thống Lạnh và Điều hòa Không khí",
    summary: "Sự kiện triển lãm quốc tế lớn nhất trong năm về các giải pháp và sản phẩm mới trong lĩnh vực hệ thống làm lạnh và điều hòa không khí...",
    image: "/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png",
    startDate: "2025-05-15",
    endDate: "2025-05-18",
    location: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC), Quận 7, TP.HCM",
    organizer: "Hiệp hội Điện lạnh Việt Nam",
    participants: 2500,
    category: "Triển lãm",
    tags: ["Triển lãm", "Điều hòa", "Công nghệ làm lạnh"],
    status: "upcoming" // upcoming, ongoing, past
  },
  {
    id: 2,
    title: "Hội thảo Công nghệ Tiết kiệm Năng lượng trong Hệ thống Lạnh",
    summary: "Hội thảo chuyên sâu về các công nghệ tiết kiệm năng lượng mới nhất áp dụng trong hệ thống lạnh công nghiệp và thương mại...",
    image: "/assets/images/projects-overview.jpg",
    startDate: "2025-04-20",
    endDate: "2025-04-20",
    location: "Khách sạn Melia, 44 Lý Thường Kiệt, Hà Nội",
    organizer: "VRC",
    participants: 350,
    category: "Hội thảo",
    tags: ["Tiết kiệm năng lượng", "Công nghệ mới", "Hệ thống lạnh"],
    status: "upcoming"
  },
  {
    id: 3,
    title: "Khóa đào tạo Kỹ thuật viên Bảo trì Hệ thống Lạnh Công nghiệp",
    summary: "Khóa đào tạo chuyên sâu dành cho kỹ thuật viên về quy trình bảo trì, sửa chữa và nâng cấp các hệ thống lạnh công nghiệp quy mô lớn...",
    image: "/assets/images/service-overview.jpg",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    location: "Trung tâm Đào tạo VRC, Biên Hòa, Đồng Nai",
    organizer: "VRC Academy",
    participants: 180,
    category: "Đào tạo",
    tags: ["Đào tạo kỹ thuật", "Bảo trì", "Hệ thống lạnh công nghiệp"],
    status: "upcoming"
  },
  {
    id: 4,
    title: "Lễ ra mắt dòng sản phẩm Điều hòa Inverter thế hệ mới",
    summary: "Sự kiện ra mắt dòng sản phẩm điều hòa không khí công nghệ Inverter thế hệ mới với khả năng tiết kiệm năng lượng vượt trội...",
    image: "/assets/images/projects-overview.jpg",
    startDate: "2025-03-25",
    endDate: "2025-03-25",
    location: "Trung tâm Hội nghị Quốc gia, Hà Nội",
    organizer: "VRC",
    participants: 420,
    category: "Ra mắt sản phẩm",
    tags: ["Inverter", "Điều hòa", "Tiết kiệm năng lượng"],
    status: "past"
  },
  {
    id: 5,
    title: "Diễn đàn Doanh nghiệp Điện lạnh Việt - EU",
    summary: "Diễn đàn kết nối doanh nghiệp trong lĩnh vực điện lạnh giữa Việt Nam và các nước Liên minh Châu Âu, tạo cơ hội hợp tác và phát triển thị trường...",
    image: "/assets/images/service-overview.jpg",
    startDate: "2025-04-28",
    endDate: "2025-04-29",
    location: "Pullman Saigon Centre, TP.HCM",
    organizer: "Bộ Công Thương và Phái đoàn EU tại Việt Nam",
    participants: 300,
    category: "Diễn đàn",
    tags: ["Hợp tác quốc tế", "EU", "Thương mại"],
    status: "upcoming"
  },
  {
    id: 6,
    title: "Hội nghị khách hàng VRC 2025",
    summary: "Sự kiện thường niên dành cho khách hàng của VRC, giới thiệu các sản phẩm mới và chiến lược phát triển trong năm tới...",
    image: "/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png",
    startDate: "2025-03-15",
    endDate: "2025-03-15",
    location: "Hotel Nikko, Hà Nội",
    organizer: "VRC",
    participants: 250,
    category: "Hội nghị",
    tags: ["Khách hàng", "Networking", "Hội nghị thường niên"],
    status: "past"
  }
];

// Dữ liệu mẫu cho sự kiện nổi bật
const featuredEvent = eventItems[0];
// Dữ liệu danh mục
const categories = [
  { name: "Triển lãm", count: 8 },
  { name: "Hội thảo", count: 12 },
  { name: "Đào tạo", count: 15 },
  { name: "Ra mắt sản phẩm", count: 6 },
  { name: "Diễn đàn", count: 5 },
  { name: "Hội nghị", count: 10 }
];

const Events = () => {
  // Get tag parameter from URL
  const { tag } = useParams<{ tag: string }>();
  
  // View state - list or calendar
  const [viewMode, setViewMode] = React.useState<'list' | 'calendar'>('list');
  
  // API Integration: Use filtered events with category support
  const { filters, updateFilter, updatePage, resetFilters } = useEventsFilters();
  
  // Debug logging
  console.log('Events filters:', filters);
  
  const { events: apiEvents, loading, error, pagination } = useFilteredEvents(filters);
  const { categories: apiCategories, loading: categoriesLoading, error: categoriesError } = useEventCategories();
  const { categoryCounts, totalEvents, loading: countsLoading } = useEventCategoryCounts();

  // Debug logging for data
  console.log('API Events:', apiEvents);
  console.log('Category Counts:', categoryCounts);
  console.log('Total Events:', totalEvents);

  // Fallback to static data if API fails (for smooth transition)
  const hasApiData = apiEvents.length > 0 && !error;
  const hasApiCategories = apiCategories.length > 0 && !categoriesError;
  const hasCategoryCounts = categoryCounts.length > 0 && !countsLoading;    // Use API data or fallback to static data
  const events = hasApiData ? apiEvents : eventItems;
  const categoriesForDisplay = hasCategoryCounts ? categoryCounts : categories;
  
  // Filter events by tag if tag parameter is present
  const filteredEvents = tag 
    ? events.filter(event => {
        if (hasApiData && event.tags) {
          // Handle API data - tags might be objects or strings
          return event.tags.some((eventTag: any) => {
            const tagText = typeof eventTag === 'string' ? eventTag : eventTag?.title || eventTag?.name || eventTag?.tag;
            const tagSlug = tagText?.toLowerCase().replace(/\s+/g, '-');
            return tagSlug === tag;
          });
        } else if (event.tags) {
          // Handle static data - tags are strings
          return event.tags.some((eventTag: string) => 
            eventTag.toLowerCase().replace(/\s+/g, '-') === tag
          );
        }
        return false;
      })
    : events;
    // Helper functions to safely access category properties
  const getCategoryId = (category: CategoryDisplay): string => {
    return 'id' in category ? category.id : category.name;
  };
  
  const getCategoryDisplayName = (category: CategoryDisplay): string => {
    return category.name;
  };
  
  const isCategorySelected = (category: CategoryDisplay): boolean => {
    const categoryId = getCategoryId(category);
    return filters.category === categoryId;
  };
  
  const getSelectedCategoryName = (): string | undefined => {
    if (!filters.category) return undefined;
    
    const selectedCategory = categoriesForDisplay.find(cat => 
      getCategoryId(cat) === filters.category
    );
    return selectedCategory ? getCategoryDisplayName(selectedCategory) : undefined;
  };
  
    // Get featured event (first event with featured=true or first event)
  const featuredEvent = hasApiData 
    ? apiEvents.find(event => event.featured) || apiEvents[0]
    : eventItems[0];

  // Helper functions to handle both API and static data formats
  const getEventImage = (event: any) => {
    if (hasApiData && event.featuredImage) {
      return EventsUtils.getImageUrl(event, 'card');
    }
    return event.image || '/assets/images/default-event.jpg';
  };

  const getEventCategory = (event: any) => {
    if (hasApiData && event.categories && event.categories.length > 0) {
      return event.categories[0].name;
    }
    return event.category || 'Sự kiện';
  };

  const getEventEndDate = (event: any) => {
    return event.endDate || event.startDate;
  };
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  };

  // Get event status badge
  const getStatusBadge = (status: string) => {
    if (status === "upcoming") {
      return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">Sắp diễn ra</Badge>;
    } else if (status === "ongoing") {
      return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Đang diễn ra</Badge>;
    } else {
      return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">Đã kết thúc</Badge>;
    }
  };

  // Additional helper functions for event data
  const getImageUrl = (event: any) => {
    if (hasApiData && event.featuredImage) {
      return EventsUtils.getImageUrl(event, 'card');
    }
    return event.image || '/assets/images/default-event.jpg';
  };

  const getCategoryName = (event: any) => {
    if (hasApiData && event.categories && event.categories.length > 0) {
      return event.categories[0].name;
    }
    return event.category || 'Sự kiện';
  };

  const getEventStatus = (event: any) => {
    return event.status || 'upcoming';
  };

  return (
    <main className="flex-grow">      {/* Tiêu đề trang */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 md:py-12">
        <div className="container-custom">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">
            {tag ? `Sự kiện: ${tag.replace(/-/g, ' ')}` : 'Sự kiện'}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            {tag 
              ? `Các sự kiện liên quan đến "${tag.replace(/-/g, ' ')}"` 
              : 'Các sự kiện, hội thảo và triển lãm liên quan đến lĩnh vực điện lạnh và điều hòa không khí'
            }
          </p>
          {tag && (
            <div className="mt-4">
              <Link 
                to="/events" 
                className="text-primary hover:text-primary/80 underline font-medium"
              >
                ← Quay lại tất cả sự kiện
              </Link>
            </div>
          )}
        </div>
      </div>      {/* Nội dung chính */}
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* View Toggle */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-primary">
                {viewMode === 'list' ? 'Danh sách sự kiện' : 'Lịch sự kiện'}
              </h2>
              <div className="flex rounded-lg border">
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4 mr-2" />
                  Danh sách
                </Button>
                <Button
                  variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('calendar')}
                  className="rounded-l-none border-l"
                >
                  <CalendarViewIcon className="h-4 w-4 mr-2" />
                  Lịch
                </Button>
              </div>
            </div>

            {viewMode === 'list' ? (
              <>
                {/* Sự kiện nổi bật */}
                <div className="mb-10">
                  <h3 className="text-xl font-bold text-primary mb-4">Sự kiện nổi bật</h3>
              <div className="aspect-video rounded-lg overflow-hidden mb-4">
                <img 
                  src={getEventImage(featuredEvent)} 
                  alt={featuredEvent?.title || 'Event image'}
                  className="w-full h-full object-cover transition-transform hover:scale-105" 
                />
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                <span className="inline-block bg-secondary text-black font-medium px-3 py-1 rounded-md text-sm">
                  {getEventCategory(featuredEvent)}
                </span>
                {getStatusBadge(featuredEvent?.status || 'upcoming')}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-primary mb-3">
                <Link to={`/event-details/${featuredEvent.id}`} className="hover:text-accent">
                  {featuredEvent.title}
                </Link>
              </h2>
              <p className="text-muted-foreground mb-4">{featuredEvent.summary}</p>
              
              <div className="flex flex-wrap items-center text-sm text-muted-foreground gap-4 mb-4">                <div className="flex items-center">
                  <CalendarIcon size={16} className="mr-1" />
                  <span>{formatDate(featuredEvent?.startDate || '')}{getEventEndDate(featuredEvent) !== featuredEvent?.startDate ? ` - ${formatDate(getEventEndDate(featuredEvent) || '')}` : ''}</span>
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  <span>{featuredEvent?.location || 'Chưa xác định'}</span>
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  <span>Tổ chức bởi: {featuredEvent?.organizer || 'VRC'}</span>
                </div>
              </div>
              
              <Button asChild>
                <Link to={`/event-details/${featuredEvent.id}`}>
                  Xem chi tiết
                  <ChevronRight size={16} className="ml-1" />
                </Link>
              </Button>
            </div>            {/* Bộ lọc sự kiện */}
            <div className="mb-8 bg-white p-4 rounded-lg shadow-sm">
              <h3 className="text-lg font-medium mb-4">Lọc sự kiện</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm mb-1">Danh mục</label>
                  <select 
                    className="w-full rounded border border-gray-300 p-2" 
                    aria-label="Chọn danh mục"
                    value={filters.category || ''}
                    onChange={(e) => updateFilter('category', e.target.value || undefined)}
                  >                    <option value="">Tất cả danh mục</option>                    {categoriesForDisplay.map((cat) => {
                      const categoryId = getCategoryId(cat);
                      return (
                        <option key={categoryId} value={categoryId}>
                          {cat.name} ({cat.count})
                        </option>
                      );
                    })}
                  </select>
                </div>
                <div>
                  <label className="block text-sm mb-1">Trạng thái</label>
                  <select 
                    className="w-full rounded border border-gray-300 p-2"
                    aria-label="Chọn trạng thái"
                    value={filters.status || ''}
                    onChange={(e) => updateFilter('status', e.target.value || undefined)}
                  >
                    <option value="">Tất cả trạng thái</option>
                    <option value="upcoming">Sắp diễn ra</option>
                    <option value="ongoing">Đang diễn ra</option>
                    <option value="past">Đã kết thúc</option>
                  </select>
                </div>
                <div className="self-end">
                  <Button 
                    className="w-full mr-2"
                    onClick={resetFilters}
                    variant="outline"
                  >
                    Đặt lại
                  </Button>
                </div>
              </div>
            </div>            {/* Danh sách sự kiện */}
            <div className="space-y-8">              <h2 className="text-2xl font-bold text-primary border-b border-gray-200 pb-2">
                Sự kiện 
                {filters.category && (
                  <span className="text-base font-normal text-gray-600">
                    - {getSelectedCategoryName()}
                  </span>
                )}
                {filters.status && (
                  <span className="text-base font-normal text-gray-600">
                    - {filters.status === 'upcoming' ? 'Sắp tới' : filters.status === 'ongoing' ? 'Đang diễn ra' : 'Đã kết thúc'}
                  </span>
                )}
              </h2>
              
              {/* Loading state */}
              {loading && (
                <div className="flex justify-center items-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  <span className="ml-2 text-gray-600">Đang tải sự kiện...</span>
                </div>
              )}

              {/* Error state */}
              {error && !loading && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
                  <p>Có lỗi xảy ra khi tải sự kiện: {error}</p>
                  <Button onClick={() => window.location.reload()} className="mt-2" variant="outline">
                    Thử lại
                  </Button>
                </div>
              )}

              {/* Events list */}
              {!loading && !error && events.length > 0 && (
                <div className="space-y-6">
                  {filteredEvents.map(event => (
                    <div key={event.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow flex flex-col md:flex-row">
                      <div className="md:w-1/3">
                        <img 
                          src={getImageUrl(event)} 
                          alt={event.title}
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      
                      <div className="p-4 md:w-2/3 flex flex-col">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                            {getCategoryName(event)}
                          </span>
                          {getStatusBadge(getEventStatus(event))}
                        </div>
                        
                        <h3 className="text-lg font-bold text-primary mb-2 hover:text-accent">
                          <Link to={`/event-details/${event.id}`}>
                            {event.title}
                          </Link>
                        </h3>
                      
                      <p className="text-muted-foreground text-sm mb-3 flex-grow">
                        {event.summary}
                      </p>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-muted-foreground mt-auto">                        <div className="flex items-center">
                          <CalendarIcon size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{formatDate(event.startDate)}{getEventEndDate(event) !== event.startDate ? ` - ${formatDate(getEventEndDate(event))}` : ''}</span>
                        </div><div className="flex items-center">
                          <MapPin size={14} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  ))}
                </div>
              )}

              {/* Empty state */}
              {!loading && !error && events.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-600">Không tìm thấy sự kiện nào phù hợp với bộ lọc hiện tại.</p>
                  <Button onClick={resetFilters} className="mt-4" variant="outline">
                    Xóa bộ lọc
                  </Button>
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && events.length > 0 && pagination.pages > 1 && (
                <div className="flex justify-center items-center space-x-2 mt-8">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePage(pagination.page - 1)}
                    disabled={!pagination.hasPrevPage}
                  >
                    Trước
                  </Button>
                  
                  <span className="text-sm text-gray-600">
                    Trang {pagination.page} / {pagination.pages} 
                    ({pagination.total} sự kiện)
                  </span>
                    <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updatePage(pagination.page + 1)}
                    disabled={!pagination.hasNextPage}
                  >
                    Sau
                  </Button>
                </div>
              )}
            </div>
              </>
            ) : (
              /* Calendar View */
              <Calendar
                events={filteredEvents}
                onEventClick={(event) => {
                  // Navigate to event detail
                  window.location.href = `/event-details/${event.id}`;
                }}
                onDateClick={(date) => {
                  console.log('Date clicked:', date);
                  // Could show events for that date in a modal or filter
                }}
              />
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Tìm kiếm */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h3 className="font-semibold text-lg mb-3">Tìm kiếm</h3>
              <div className="flex">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm sự kiện..." 
                  className="flex-grow border rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
                />                <button className="bg-primary text-white px-4 py-2 rounded-r-md" aria-label="Tìm kiếm">
                  <SearchIcon className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
              {/* Danh mục */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h3 className="font-semibold text-lg mb-3">Danh mục sự kiện</h3>
              {countsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : (
                <ul className="space-y-2">
                  {/* Show all events option */}
                  <li>
                    <button 
                      onClick={() => updateFilter('category', '')}
                      className={`w-full flex justify-between items-center py-2 hover:text-primary text-left ${!filters.category ? 'text-primary font-medium' : ''}`}
                    >
                      <span>Tất cả sự kiện</span>
                      <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                        {totalEvents}
                      </span>
                    </button>
                  </li>                  {/* Category filters */}
                  {categoriesForDisplay.map((category, index) => (
                    <li key={index}>
                      <button 
                        onClick={() => updateFilter('category', getCategoryId(category))}
                        className={`w-full flex justify-between items-center py-2 hover:text-primary text-left ${isCategorySelected(category) ? 'text-primary font-medium' : ''}`}
                      >
                        <span>{category.name}</span>
                        <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full text-xs">
                          {category.count}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
              {/* Sự kiện sắp tới */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
              <h3 className="font-semibold text-lg mb-3">Sự kiện sắp tới</h3>
              <div className="space-y-3">
                {filteredEvents
                  .filter(event => {
                    const eventDate = new Date(event.startDate);
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    return eventDate >= today;
                  })
                  .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
                  .slice(0, 5) // Hiển thị 5 sự kiện sắp tới
                  .map((event, idx) => {
                    const eventDate = new Date(event.startDate);
                    const isToday = eventDate.toDateString() === new Date().toDateString();
                    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
                    
                    return (
                      <div key={idx} className="flex gap-3 items-start p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={cn(
                          "p-2 rounded text-center min-w-[45px]",
                          isToday ? "bg-primary text-white" : "bg-primary/10"
                        )}>
                          <span className="block text-sm font-bold">
                            {eventDate.getDate()}
                          </span>
                          <span className={cn(
                            "text-xs",
                            isToday ? "text-white/80" : "text-muted-foreground"
                          )}>
                            {dayNames[eventDate.getDay()]}
                          </span>
                        </div>
                        <div className="flex-grow min-w-0">
                          <h5 className="font-medium text-sm mb-1 hover:text-primary line-clamp-2">
                            <Link to={`/event-details/${event.id}`} className="hover:underline">
                              {event.title}
                            </Link>
                          </h5>
                          <div className="flex items-center text-xs text-muted-foreground mb-1">
                            <CalendarIcon size={12} className="mr-1 flex-shrink-0" />
                            <span>{formatDate(event.startDate)}</span>
                            {getEventEndDate(event) !== event.startDate && (
                              <span> - {formatDate(getEventEndDate(event))}</span>
                            )}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <MapPin size={12} className="mr-1 flex-shrink-0" />
                            <span className="truncate">
                              {typeof event.location === 'string' 
                                ? event.location.split(',')[0] 
                                : 'TBA'
                              }
                            </span>
                          </div>
                          {/* Category badge */}
                          <div className="mt-2">
                            <span className="inline-block bg-primary/10 text-primary px-2 py-0.5 rounded text-xs">
                              {getCategoryName(event)}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                
                {filteredEvents.filter(event => new Date(event.startDate) >= new Date()).length === 0 && (
                  <div className="text-center py-4 text-muted-foreground">
                    <CalendarIcon className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    <p className="text-sm">Không có sự kiện sắp tới</p>
                  </div>
                )}
                
                {filteredEvents.filter(event => new Date(event.startDate) >= new Date()).length > 5 && (
                  <div className="pt-3 border-t">
                    <Link 
                      to="/events" 
                      className="text-sm text-primary hover:text-primary/80 font-medium flex items-center justify-center"
                    >
                      Xem tất cả sự kiện
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </div>
                )}              </div>
            </div>
            
            {/* Tags */}
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h3 className="font-semibold text-lg mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(eventItems.flatMap(event => event.tags))).map((tag, index) => (
                  <Link 
                    key={index}
                    to={`/events/tag/${tag.toLowerCase().replace(/\s+/g, '-')}`}
                    className="bg-gray-100 hover:bg-primary hover:text-white px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {tag}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Events;