import { ArrowLeft, ArrowRight, Calendar, Clock, MapPin, CheckCircle, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import BackToTop from "@/components/BackToTop";
import { useProjects, useProjectsPageSettings, getImageUrl, getImageAlt } from "@/hooks/useProjects";

const IndustrialProjects = () => {
  // Fetch industrial projects and settings
  const { projects, loading, error } = useProjects({ category: 'industrial' });
  const { settings: pageSettings, loading: settingsLoading } = useProjectsPageSettings();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang tải dự án công nghiệp...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">Có lỗi xảy ra: {error}</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Banner */}
        <div className="bg-primary text-white py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="flex items-center text-sm mb-4">
              <Link to="/" className="hover:underline text-white/80">Trang chủ</Link>
              <ArrowRight size={14} className="mx-2 text-white/60" />
              <Link to="/projects" className="hover:underline text-white/80">Dự án</Link>
              <ArrowRight size={14} className="mx-2 text-white/60" />
              <span>Dự án công nghiệp</span>
            </div>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold">Dự Án Hệ Thống Làm Lạnh Công Nghiệp</h1>
            <p className="mt-4 text-lg max-w-3xl">
              Các dự án tiêu biểu về hệ thống làm lạnh công nghiệp mà VRC đã triển khai thành công cho nhà máy sản xuất và chế biến
            </p>
          </div>
        </div>        {/* Nội dung chính */}
        <div className="container mx-auto py-12 px-4">          {/* Dự án tiêu biểu */}
          <section className="mb-16">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-8">Dự án công nghiệp tiêu biểu</h2>
            
            {projects.length > 0 ? (
              <div className="space-y-16">
                {projects.map((project) => (
                  <div key={project.id} className="mb-16">
                    <div className="rounded-lg overflow-hidden mb-8">
                      <img 
                        src={project.featuredImage ? getImageUrl(project.featuredImage, 'large') || "/placeholder.svg" : "/placeholder.svg"}
                        alt={project.featuredImage ? getImageAlt(project.featuredImage, project.title) : project.title}
                        className="w-full h-[400px] md:h-[500px] object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    
                    <div className="grid md:grid-cols-3 gap-8">
                      <div className="md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">{project.title}</h3>
                        
                        <div className="flex flex-wrap gap-4 mb-6">
                          <div className="flex items-center">
                            <MapPin size={18} className="text-primary mr-2" />
                            <span>{project.location || 'Chưa xác định'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={18} className="text-primary mr-2" />
                            <span>
                              Hoàn thành: {project.timeframe?.endDate 
                                ? new Date(project.timeframe.endDate).toLocaleDateString('vi-VN') 
                                : 'Chưa xác định'
                              }
                            </span>
                          </div>
                          {project.timeframe?.startDate && project.timeframe?.endDate && (
                            <div className="flex items-center">
                              <Clock size={18} className="text-primary mr-2" />
                              <span>
                                Thời gian thực hiện: {
                                  Math.ceil(
                                    (new Date(project.timeframe.endDate).getTime() - 
                                     new Date(project.timeframe.startDate).getTime()) / 
                                    (1000 * 60 * 60 * 24 * 30)
                                  )
                                } tháng
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="space-y-4">
                          {project.description && (
                            <div dangerouslySetInnerHTML={{ __html: project.description }} />
                          )}
                          
                          {project.services && project.services.length > 0 && (
                            <>
                              <h4 className="text-xl font-semibold mt-8">Dịch vụ cung cấp</h4>
                              <ul className="grid gap-3 mt-4">
                                {project.services.map((service, index) => (
                                  <li key={index} className="flex items-start">
                                    <CheckCircle size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                    <span>{service.name}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}

                          {project.achievements && project.achievements.length > 0 && (
                            <>
                              <h4 className="text-xl font-semibold mt-8">Kết quả đạt được</h4>
                              <ul className="grid gap-3 mt-4">
                                {project.achievements.map((achievement, index) => (
                                  <li key={index} className="flex items-start">
                                    <CheckCircle size={18} className="text-primary mr-3 mt-1 flex-shrink-0" />
                                    <span>{achievement.description}</span>
                                  </li>
                                ))}
                              </ul>
                            </>
                          )}
                        </div>
                      </div>
                      
                      <div className="space-y-6">
                        <Card>
                          <CardContent className="p-6">
                            <h4 className="font-semibold mb-4">Thông tin dự án</h4>
                            <div className="space-y-3">
                              <div>
                                <span className="text-sm text-gray-600">Khách hàng:</span>
                                <p className="font-medium">{project.client || 'Chưa xác định'}</p>
                              </div>
                              <Separator />
                              <div>
                                <span className="text-sm text-gray-600">Địa điểm:</span>
                                <p className="font-medium">{project.location || 'Chưa xác định'}</p>
                              </div>
                              <Separator />
                              {project.area && (
                                <>
                                  <div>
                                    <span className="text-sm text-gray-600">Diện tích:</span>
                                    <p className="font-medium">{project.area}</p>
                                  </div>
                                  <Separator />
                                </>
                              )}
                              {project.capacity && (
                                <>
                                  <div>
                                    <span className="text-sm text-gray-600">Công suất:</span>
                                    <p className="font-medium">{project.capacity}</p>
                                  </div>
                                  <Separator />
                                </>
                              )}
                              <div>
                                <span className="text-sm text-gray-600">Trạng thái:</span>
                                <p className="font-medium">
                                  {project.timeframe?.isOngoing ? 'Đang thực hiện' : 'Đã hoàn thành'}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                        
                        <Link 
                          to={`/projects/detail/${project.slug}`}
                          className="block w-full"
                        >
                          <Button className="w-full">
                            Xem chi tiết dự án
                            <ArrowRight size={16} className="ml-2" />
                          </Button>
                        </Link>
                      </div>
                    </div>

                    {/* Project Gallery */}
                    {project.gallery && project.gallery.length > 0 && (
                      <div className="mt-10">
                        <h4 className="text-xl font-semibold mb-4">Hình ảnh dự án</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {project.gallery.slice(0, 4).map((image, index) => (
                            <img 
                              key={index}
                              src={getImageUrl(image, 'medium') || "/placeholder.svg"}
                              alt={getImageAlt(image, `${project.title} - Hình ${index + 1}`)}
                              className="w-full h-40 object-cover rounded-lg"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg";
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600">Hiện tại chưa có dự án công nghiệp nào.</p>
              </div>
            )}
          </section>            {/* CTA Section */}
          <div className="bg-primary/10 rounded-lg p-8 md:p-12">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                {pageSettings?.ctaSection?.title || "Bạn cần tư vấn về dự án công nghiệp?"}
              </h2>
              <p className="text-muted-foreground mb-6">
                {pageSettings?.ctaSection?.description || 
                 "Đội ngũ kỹ sư giàu kinh nghiệm của VRC sẵn sàng hỗ trợ bạn thiết kế, lắp đặt và bảo trì hệ thống làm lạnh công nghiệp phù hợp với nhu cầu cụ thể của doanh nghiệp."}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link to={pageSettings?.ctaSection?.primaryButton?.link || "/contact"}>
                    {pageSettings?.ctaSection?.primaryButton?.text || "Liên hệ tư vấn"}
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to={pageSettings?.ctaSection?.secondaryButton?.link || "/products/industrial"}>
                    {pageSettings?.ctaSection?.secondaryButton?.text || "Xem sản phẩm công nghiệp"}
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <BackToTop />
    </div>
  );
};

export default IndustrialProjects;