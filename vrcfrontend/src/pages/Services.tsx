import { ArrowRight, CheckCircle, ArrowUpRight, FileCheck, Wrench, Cog, Shield, Clock } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useServices } from "@/hooks/useServices";
import { servicesApi } from "@/api/services";
import { ServicesGridSkeleton } from "@/components/loading/ServicesSkeleton";
import { ServiceError, NoServicesFound } from "@/components/error/ServiceError";

const Services = () => {
  // Fetch services data from API
  const { data, loading, error } = useServices();

  // Icon mapping cho các loại dịch vụ
  const getServiceIcon = (type: string) => {
    switch (type) {
      case 'consulting': return FileCheck;
      case 'installation': return Wrench;
      case 'maintenance': return Cog;
      case 'repair': return Shield;
      case 'upgrade': return Clock;
      case 'support': return FileCheck;
      default: return FileCheck;
    }
  };

  // Service type to route mapping
  const getServiceRoute = (type: string, slug: string) => {
    return `/services/${slug}`;
  };

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-primary/90 py-16 text-white">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">Dịch vụ chuyên nghiệp</h1>
            <p className="text-xl md:text-2xl mb-8">
              Cung cấp đầy đủ các giải pháp dịch vụ kỹ thuật điện lạnh chất lượng cao từ tư vấn, lắp đặt đến bảo trì và sửa chữa.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-accent">
                Liên hệ tư vấn
              </Link>
              <Link to="/service-support" className="btn-white">
                Hỗ trợ kỹ thuật
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="mb-6">Dịch vụ toàn diện</h2>
              <p className="text-muted-foreground mb-6">
                Với hơn 20 năm kinh nghiệm trong lĩnh vực điện lạnh công nghiệp và dân dụng, VRC đã trở thành đối tác tin cậy của hàng nghìn khách hàng trên cả nước. Chúng tôi tự hào cung cấp các dịch vụ kỹ thuật chất lượng cao với đội ngũ chuyên viên được đào tạo bài bản.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                  <span>Đội ngũ kỹ sư giàu kinh nghiệm, được chứng nhận chuyên môn</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                  <span>Phục vụ 24/7 với thời gian phản hồi nhanh chóng</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                  <span>Trang thiết bị hiện đại, công nghệ tiên tiến</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                  <span>Cam kết chất lượng và bảo hành dài hạn</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="/assets/images/service-overview.jpg" 
                alt="Dịch vụ điện lạnh chuyên nghiệp" 
                className="rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.alt = "Placeholder image";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Services Section */}
      <section className="py-12 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="mb-4">Danh mục dịch vụ</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Chúng tôi cung cấp đầy đủ các dịch vụ điện lạnh công nghiệp và dân dụng, từ tư vấn thiết kế đến lắp đặt, bảo trì và sửa chữa.
            </p>
          </div>          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Loading State */}
            {loading && <ServicesGridSkeleton count={6} />}
            
            {/* Error State */}
            {error && !loading && (
              <div className="col-span-full">
                <ServiceError 
                  error={error} 
                  onRetry={() => window.location.reload()}
                />
              </div>
            )}
            
            {/* No Services State */}
            {!loading && !error && (!data?.data.services || data.data.services.length === 0) && (
              <div className="col-span-full">
                <NoServicesFound message="Hiện tại chưa có dịch vụ nào được công bố" />
              </div>
            )}
            
            {/* Services Grid */}
            {!loading && !error && data?.data.services && data.data.services.map((service) => {
              const IconComponent = getServiceIcon(service.type);
              return (
                <Card key={service.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      <IconComponent className="text-primary" />
                    </div>
                    <CardTitle>{service.title}</CardTitle>
                    <CardDescription>
                      {service.summary.length > 60 
                        ? `${service.summary.substring(0, 60)}...` 
                        : service.summary}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {servicesApi.extractTextFromContent(service.content).length > 120
                        ? `${servicesApi.extractTextFromContent(service.content).substring(0, 120)}...`
                        : servicesApi.extractTextFromContent(service.content)}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Link 
                      to={getServiceRoute(service.type, service.slug)} 
                      className="text-primary hover:text-accent flex items-center"
                    >
                      Chi tiết
                      <ArrowUpRight size={16} className="ml-1" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Client Types Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="mb-8">Đối tượng phục vụ</h2>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="rounded-lg border border-muted p-6">
              <h3 className="text-xl font-semibold mb-4">Khách hàng công nghiệp</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                  <span>Nhà máy sản xuất và xưởng công nghiệp</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                  <span>Kho lạnh và hệ thống bảo quản</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                  <span>Nhà máy chế biến thực phẩm</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                  <span>Hệ thống điều hòa trung tâm công suất lớn</span>
                </li>
              </ul>
            </div>

            <div className="rounded-lg border border-muted p-6">
              <h3 className="text-xl font-semibold mb-4">Khách hàng thương mại</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                  <span>Cao ốc văn phòng và trung tâm thương mại</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                  <span>Khách sạn, nhà hàng và khu nghỉ dưỡng</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                  <span>Bệnh viện và các cơ sở y tế</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                  <span>Siêu thị và cửa hàng bán lẻ</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 bg-accent/10">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-6">Bắt đầu với dịch vụ của chúng tôi</h2>
            <p className="text-muted-foreground mb-8">
              Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn và báo giá các dịch vụ điện lạnh phù hợp với nhu cầu của bạn. Đội ngũ kỹ thuật của VRC luôn sẵn sàng hỗ trợ.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/contact" className="btn-primary">
                Liên hệ ngay
              </Link>
              <Link to="/service-support" className="btn-outline">
                Tìm hiểu thêm
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Services;