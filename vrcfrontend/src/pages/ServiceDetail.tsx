// Service Detail Page - Dynamic content từ API
import { useParams, Link, Navigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Phone, Mail, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useService } from "@/hooks/useServices";
import { servicesApi } from "@/api/services";
import { ServiceDetailSkeleton } from "@/components/loading/ServicesSkeleton";
import { ServiceError, NoServicesFound } from "@/components/error/ServiceError";

const ServiceDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { data: service, loading, error } = useService(slug || '');

  // Loading state
  if (loading) {
    return <ServiceDetailSkeleton />;
  }

  // Error state
  if (error) {
    return (
      <main className="flex-grow">
        <div className="container-custom py-8">
          <ServiceError 
            error={error} 
            onRetry={() => window.location.reload()}
          />
        </div>
      </main>
    );
  }

  // Not found state
  if (!service) {
    return (
      <main className="flex-grow">
        <div className="container-custom py-8">
          <NoServicesFound 
            message="Không tìm thấy dịch vụ này"
            showBackButton={true}
          />
        </div>
      </main>
    );
  }
  // Format price display
  const formatPrice = (pricing: {
    showPricing: boolean;
    priceType: string;
    customPrice?: string;
    currency?: string;
  }) => {
    if (!pricing.showPricing) return "Liên hệ báo giá";
    
    switch (pricing.priceType) {
      case 'fixed':
        return `${parseInt(pricing.customPrice || '0').toLocaleString('vi-VN')} ${pricing.currency || 'VND'}`;
      case 'custom':
        return `${parseInt(pricing.customPrice || '0').toLocaleString('vi-VN')} ${pricing.currency || 'VND'}`;
      case 'contact':
        return "Liên hệ báo giá";
      default:
        return "Liên hệ báo giá";
    }
  };

  // Convert service type to Vietnamese
  const getServiceTypeLabel = (type: string) => {
    const typeMap: Record<string, string> = {
      'consulting': 'Tư vấn thiết kế',
      'installation': 'Lắp đặt',
      'maintenance': 'Bảo trì',
      'repair': 'Sửa chữa',
      'upgrade': 'Nâng cấp',
      'support': 'Hỗ trợ kỹ thuật'
    };
    return typeMap[type] || type;
  };  // Render content from Lexical format
  const renderContent = (content: {
    root: {
      children: Array<{
        type: string;
        children?: Array<{
          type: string;
          text?: string;
          format?: number | string;
        }>;
        text?: string;
        format?: number | string;
        direction?: string;
        indent?: number;
      }>;
    };
  }) => {
    if (!content?.root?.children) return null;

    const renderNode = (node: {
      type: string;
      children?: Array<{
        type: string;
        text?: string;
        format?: number | string;
      }>;
      text?: string;
      format?: number | string;
      direction?: string;
      indent?: number;
    }, index: number): JSX.Element | null => {
      switch (node.type) {
        case 'paragraph':
          return (
            <p key={index} className="mb-4 leading-relaxed">
              {node.children?.map((child, childIndex) => 
                renderNode(child, childIndex)
              )}
            </p>
          );
        case 'text': {
          const className: string[] = [];
          // Xử lý format có thể là number hoặc string
          const formatValue = typeof node.format === 'number' ? node.format : parseInt(node.format || '0');
          if (formatValue & 1) className.push('font-bold');
          if (formatValue & 2) className.push('italic');
          return (
            <span key={index} className={className.join(' ')}>
              {node.text}
            </span>
          );
        }
        case 'linebreak':
          return <br key={index} />;
        default:
          return null;
      }
    };

    return (
      <div className="prose prose-gray max-w-none">
        {content.root.children.map((node, index) => 
          renderNode(node, index)
        )}
      </div>
    );
  };

  return (
    <main className="flex-grow">
      {/* Breadcrumb */}
      <div className="container-custom py-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-primary">Dịch vụ</Link>
          <span>/</span>
          <span className="text-foreground">{service.title}</span>
        </div>
      </div>

      {/* Hero Section */}
      <section className="bg-primary/90 py-16 text-white">
        <div className="container-custom">
          <div className="max-w-4xl">
            <div className="flex items-center gap-2 mb-4">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {getServiceTypeLabel(service.type)}
              </Badge>
              {service.featured && (
                <Badge variant="secondary" className="bg-accent text-white">
                  Nổi bật
                </Badge>
              )}
            </div>
            <h1 className="text-white mb-6">{service.title}</h1>
            <p className="text-xl md:text-2xl mb-8 leading-relaxed">
              {service.summary}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-accent">
                <Phone size={16} className="mr-2" />
                Liên hệ tư vấn
              </Link>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30">
                <DollarSign size={16} className="mr-2" />
                {formatPrice(service.pricing)}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {/* Service Description */}
                <div>
                  <h2 className="text-2xl font-bold mb-6">Thông tin chi tiết</h2>
                  {renderContent(service.content)}
                </div>                {/* Features */}
                {service.features && service.features.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Tính năng chính</h3>
                    <ul className="space-y-3">
                      {service.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={20} className="text-primary mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{feature.title}</span>
                            {feature.description && (
                              <p className="text-muted-foreground text-sm mt-1">{feature.description}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}                {/* Benefits */}
                {service.benefits && service.benefits.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-4">Lợi ích</h3>
                    <ul className="space-y-3">
                      {service.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start">
                          <CheckCircle size={20} className="text-accent mr-3 mt-1 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{benefit.title}</span>
                            {benefit.description && (
                              <p className="text-muted-foreground text-sm mt-1">{benefit.description}</p>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* FAQ */}
                {service.faq && service.faq.length > 0 && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Câu hỏi thường gặp</h3>
                    <div className="space-y-4">
                      {service.faq.map((item, index) => (
                        <Card key={index}>
                          <CardHeader>
                            <CardTitle className="text-lg">{item.question}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground">{item.answer}</p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Image */}
              {service.featuredImage && (
                <div>
                  <img 
                    src={servicesApi.getImageUrl(service)} 
                    alt={service.title}
                    className="w-full rounded-lg shadow-md"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                      e.currentTarget.alt = "Placeholder image";
                    }}
                  />
                </div>
              )}

              {/* Pricing Card */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign size={20} />
                    Thông tin giá
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-primary mb-4">
                    {formatPrice(service.pricing)}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    Giá có thể thay đổi tùy theo quy mô và yêu cầu cụ thể của dự án.
                  </p>
                  <Link to="/contact" className="w-full btn-primary block text-center">
                    Yêu cầu báo giá
                  </Link>
                </CardContent>
              </Card>

              {/* Contact Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Liên hệ tư vấn</CardTitle>
                  <CardDescription>
                    Chúng tôi sẵn sàng hỗ trợ và tư vấn cho bạn
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link to="/contact" className="w-full btn-primary block text-center">
                    <Phone size={16} className="mr-2" />
                    Gọi ngay
                  </Link>
                  <Link to="/contact" className="w-full btn-outline block text-center">
                    <Mail size={16} className="mr-2" />
                    Gửi email
                  </Link>
                  <Link to="/service-support" className="w-full btn-outline block text-center">
                    <Calendar size={16} className="mr-2" />
                    Đặt lịch hẹn
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Back Button */}
      <section className="py-8 bg-muted/50">
        <div className="container-custom">
          <Link 
            to="/services" 
            className="inline-flex items-center text-primary hover:text-accent"
          >
            <ArrowLeft size={16} className="mr-2" />
            Quay lại danh sách dịch vụ
          </Link>
        </div>
      </section>
    </main>
  );
};

export default ServiceDetail;
