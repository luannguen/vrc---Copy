import { useParams, Link, useNavigate } from "react-router-dom";
import { CalendarIcon, Clock, MapPin, User, Users, Tag, ArrowLeft, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useEvent } from "@/hooks/useEvents";
import { EventsUtils } from "@/services/eventsApi";
import { useTranslation } from "react-i18next";

// Fallback data for when API is not available
const fallbackEventData: Record<string, any> = {
  "1": {
    id: "1",
    title: "Triển lãm Quốc tế về Hệ thống Lạnh và Điều hòa Không khí",
    content: `
      <h2>Giới thiệu về sự kiện</h2>
      <p>Triển lãm Quốc tế về Hệ thống Lạnh và Điều hòa Không khí 2025 là sự kiện triển lãm quốc tế lớn nhất trong năm về các giải pháp và sản phẩm mới trong lĩnh vực hệ thống làm lạnh và điều hòa không khí.</p>
      
      <h3>Nội dung chính của sự kiện</h3>
      <ul>
        <li>Triển lãm các sản phẩm công nghệ làm lạnh tiên tiến</li>
        <li>Hội thảo về xu hướng phát triển ngành điều hòa không khí</li>
        <li>Gặp gỡ các nhà cung cấp và đối tác hàng đầu</li>
        <li>Chia sẻ kinh nghiệm từ các chuyên gia trong ngành</li>
        <li>Workshop về bảo trì và vận hành hệ thống hiệu quả</li>
      </ul>
      
      <h3>Đối tượng tham gia</h3>
      <p>Sự kiện dành cho các kỹ sư, nhà thiết kế, nhà thầu, nhà phân phối và tất cả những ai quan tâm đến lĩnh vực hệ thống lạnh và điều hòa không khí.</p>
      
      <h3>Lợi ích khi tham gia</h3>
      <ul>
        <li>Cập nhật công nghệ và xu hướng mới nhất</li>
        <li>Mở rộng mạng lưới đối tác kinh doanh</li>
        <li>Tham gia các buổi đào tạo chuyên sâu</li>
        <li>Nhận chứng chỉ tham dự có giá trị</li>
      </ul>
    `,
    summary: "Sự kiện triển lãm quốc tế lớn nhất trong năm về các giải pháp và sản phẩm mới trong lĩnh vực hệ thống làm lạnh và điều hòa không khí...",
    featuredImage: "/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png",
    startDate: "2025-05-15",
    endDate: "2025-05-18",
    location: "Trung tâm Hội chợ và Triển lãm Sài Gòn (SECC), Quận 7, TP.HCM",
    organizer: "Hiệp hội Điện lạnh Việt Nam",
    participants: 2500,
    categories: [{ id: "1", name: "Triển lãm" }],
    tags: [
      { id: "tag1", title: "Triển lãm", slug: "trien-lam" },
      { id: "tag2", title: "Điều hòa", slug: "dieu-hoa" },
      { id: "tag3", title: "Công nghệ làm lạnh", slug: "cong-nghe-lam-lanh" }
    ],
    status: "upcoming"  },
  "2": {
    id: "2",
    title: "Hội thảo Công nghệ Tiết kiệm Năng lượng trong Hệ thống Lạnh",
    content: `
      <h2>Về hội thảo</h2>
      <p>Hội thảo chuyên sâu về các công nghệ tiết kiệm năng lượng mới nhất áp dụng trong hệ thống lạnh công nghiệp và thương mại.</p>
      
      <h3>Chương trình chi tiết</h3>
      <ul>
        <li>9:00 - 9:30: Đăng ký và coffee break</li>
        <li>9:30 - 10:30: Công nghệ Inverter trong hệ thống lạnh</li>
        <li>10:30 - 11:30: Giải pháp thu hồi nhiệt thải</li>
        <li>11:30 - 12:30: Hệ thống điều khiển thông minh</li>
        <li>13:30 - 14:30: Case study tiết kiệm năng lượng</li>
        <li>14:30 - 15:30: Q&A và thảo luận</li>
      </ul>
      
      <h3>Diễn giả</h3>
      <p>Các chuyên gia hàng đầu trong lĩnh vực công nghệ làm lạnh và tiết kiệm năng lượng từ VRC và các đối tác quốc tế.</p>
    `,
    summary: "Hội thảo chuyên sâu về các công nghệ tiết kiệm năng lượng mới nhất áp dụng trong hệ thống lạnh công nghiệp và thương mại...",
    featuredImage: "/assets/images/projects-overview.jpg",
    startDate: "2025-04-20",
    endDate: "2025-04-20",
    location: "Khách sạn Melia, 44 Lý Thường Kiệt, Hà Nội",
    organizer: "VRC",
    participants: 350,
    categories: [{ id: "2", name: "Hội thảo" }],
    tags: [
      { id: "tag4", title: "Tiết kiệm năng lượng", slug: "tiet-kiem-nang-luong" },
      { id: "tag5", title: "Công nghệ mới", slug: "cong-nghe-moi" },
      { id: "tag6", title: "Hệ thống lạnh", slug: "he-thong-lanh" }
    ],
    status: "upcoming"  },
  "3": {
    id: "3",
    title: "Khóa đào tạo Kỹ thuật viên Bảo trì Hệ thống Lạnh Công nghiệp",
    content: `
      <h2>Thông tin khóa đào tạo</h2>
      <p>Khóa đào tạo chuyên sâu dành cho kỹ thuật viên về quy trình bảo trì, sửa chữa và nâng cấp các hệ thống lạnh công nghiệp quy mô lớn.</p>
      
      <h3>Nội dung đào tạo</h3>
      <ul>
        <li>Nguyên lý hoạt động của hệ thống lạnh công nghiệp</li>
        <li>Quy trình bảo trì định kỳ và dự phòng</li>
        <li>Chẩn đoán và xử lý sự cố thường gặp</li>
        <li>An toàn lao động trong bảo trì hệ thống lạnh</li>
        <li>Thực hành trên thiết bị thực tế</li>
      </ul>
      
      <h3>Đối tượng</h3>
      <p>Kỹ thuật viên có kinh nghiệm từ 1 năm trở lên trong lĩnh vực điện lạnh.</p>
      
      <h3>Chứng chỉ</h3>
      <p>Sau khi hoàn thành khóa học, học viên sẽ được cấp chứng chỉ "Kỹ thuật viên Bảo trì Hệ thống Lạnh Công nghiệp" do VRC Academy cấp.</p>
    `,
    summary: "Khóa đào tạo chuyên sâu dành cho kỹ thuật viên về quy trình bảo trì, sửa chữa và nâng cấp các hệ thống lạnh công nghiệp quy mô lớn...",
    featuredImage: "/assets/images/service-overview.jpg",
    startDate: "2025-04-10",
    endDate: "2025-04-12",
    location: "Trung tâm Đào tạo VRC, Biên Hòa, Đồng Nai",
    organizer: "VRC Academy",
    participants: 180,
    categories: [{ id: "3", name: "Đào tạo" }],
    tags: [
      { id: "tag7", title: "Đào tạo", slug: "dao-tao" },
      { id: "tag8", title: "Bảo trì", slug: "bao-tri" },
      { id: "tag9", title: "Kỹ thuật viên", slug: "ky-thuat-vien" }
    ],    status: "upcoming"
  }
};

const EventDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Use API hook
  const { event: apiEvent, loading, error } = useEvent(id || "");  // Fallback to static data if API fails or for development
  const fallbackEvent = id ? fallbackEventData[id] : null;
  const event = apiEvent || fallbackEvent;

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Get event image URL
  const getEventImage = (event: any) => {
    if (event.featuredImage && typeof event.featuredImage === 'object') {
      return EventsUtils.getImageUrl(event, 'tablet') || event.featuredImage.url;
    }
    return event.featuredImage || event.image || '/assets/images/default-event.jpg';
  };

  // Get event category
  const getEventCategory = (event: any) => {
    if (event.categories && event.categories.length > 0) {
      return event.categories[0].name;
    }
    return event.category || 'Sự kiện';
  };

  // Share functionality
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event?.title,
          text: event?.summary,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could show a toast notification here
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Không tìm thấy sự kiện
              </h1>
              <p className="text-gray-600 mb-6">
                Sự kiện bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
              </p>
              <Button onClick={() => navigate('/events')}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Quay lại danh sách sự kiện
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate('/events')}
              className="text-primary hover:text-primary/80"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Quay lại danh sách sự kiện
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="mr-2 h-4 w-4" />
              Chia sẻ
            </Button>
          </div>
          
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              {getEventCategory(event)}
            </Badge>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {event.title}
            </h1>
            <p className="text-lg text-gray-600 leading-relaxed">
              {event.summary}
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Featured Image */}
            <div className="mb-8">
              <img
                src={getEventImage(event)}
                alt={event.title}
                className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/assets/images/default-event.jpg';
                }}
              />
            </div>

            {/* Event Content */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-4">Chi tiết sự kiện</h2>
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: typeof event.content === 'string' 
                      ? event.content 
                      : event.content?.toString() || event.summary || '' 
                  }}
                />
                  {/* Tags */}
                {event.tags && event.tags.length > 0 && (
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="text-lg font-semibold mb-3">Từ khóa</h3>                    <div className="flex flex-wrap gap-2">
                      {event.tags.map((tag, index) => {
                        // Handle tags from relationship (object) or fallback data (string)
                        const tagText = typeof tag === 'string' ? tag : tag?.title || tag?.name || tag?.tag || String(tag);                        const tagSlug = typeof tag === 'string' ? tag.toLowerCase().replace(/\s+/g, '-') : tag?.slug || tag.toLowerCase().replace(/\s+/g, '-');
                        
                        return (
                          <Link 
                            key={index} 
                            to={`/events?tag=${tagSlug}`}
                            className="inline-flex items-center"
                          >
                            <Badge variant="outline" className="hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                              <Tag className="mr-1 h-3 w-3" />
                              {tagText}
                            </Badge>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Info Card */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Thông tin sự kiện</h3>
                <div className="space-y-4">
                  {/* Date */}
                  <div className="flex items-start space-x-3">
                    <CalendarIcon className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">Thời gian</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate && (
                          <span> - {formatDate(event.endDate)}</span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTime(event.startDate)}
                        {event.endDate && event.endDate !== event.startDate && (
                          <span> - {formatTime(event.endDate)}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Địa điểm</p>
                        <p className="text-sm text-gray-600">{event.location}</p>
                      </div>
                    </div>
                  )}

                  {/* Organizer */}
                  {event.organizer && (
                    <div className="flex items-start space-x-3">
                      <User className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Đơn vị tổ chức</p>
                        <p className="text-sm text-gray-600">{event.organizer}</p>
                      </div>
                    </div>
                  )}

                  {/* Participants */}
                  {event.participants && (
                    <div className="flex items-start space-x-3">
                      <Users className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">Số lượng tham gia</p>
                        <p className="text-sm text-gray-600">
                          {event.participants.toLocaleString()} người
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button className="w-full" size="lg">
                    Đăng ký tham gia
                  </Button>
                  <Button variant="outline" className="w-full">
                    Tải tài liệu
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Related Events */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Sự kiện liên quan</h3>
                <div className="space-y-4">
                  <Link 
                    to="/event-details/2" 
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1">
                      Hội thảo Công nghệ Tiết kiệm Năng lượng
                    </h4>
                    <p className="text-xs text-gray-600 flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      20/04/2025
                    </p>
                  </Link>
                  <Link 
                    to="/event-details/3" 
                    className="block p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <h4 className="font-medium text-sm mb-1">
                      Khóa đào tạo Kỹ thuật viên Bảo trì
                    </h4>
                    <p className="text-xs text-gray-600 flex items-center">
                      <CalendarIcon className="h-3 w-3 mr-1" />
                      10-12/04/2025
                    </p>
                  </Link>
                </div>
                <Button variant="ghost" className="w-full mt-4" asChild>
                  <Link to="/events">Xem tất cả sự kiện</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
