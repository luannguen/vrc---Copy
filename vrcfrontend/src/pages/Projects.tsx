import { ArrowRight, CheckCircle, ArrowUpRight, Building, Building2, Factory, CheckCircle2, BarChart, Loader2, ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { useProjects, useProjectCategories, useProjectsPageSettings, getImageUrl, getImageAlt } from "@/hooks/useProjects";

const Projects = () => {
  // Fetch data from API
  const { projects: featuredProjects, loading: featuredLoading, error: featuredError } = useProjects({ 
    featured: true, // Only get featured projects
    limit: 10 
  });
  
  const { projects: allProjects, loading: allProjectsLoading, error: allProjectsError } = useProjects({ 
    limit: 50 // Get more projects for "all projects" section
  });
  
  const { categories, loading: categoriesLoading, error: categoriesError } = useProjectCategories();
  const { settings, loading: settingsLoading, error: settingsError } = useProjectsPageSettings();

  // Loading state
  if (featuredLoading || categoriesLoading || settingsLoading || allProjectsLoading) {
    return (
      <main className="flex-grow">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (featuredError || categoriesError || settingsError || allProjectsError) {
    return (
      <main className="flex-grow">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <p className="text-red-600 mb-4">Có lỗi xảy ra khi tải dữ liệu</p>
            <Button onClick={() => window.location.reload()}>Thử lại</Button>
          </div>
        </div>
      </main>
    );
  }
  
  // Get hero background image
  const heroBackground = settings?.heroSection?.backgroundImage ? getImageUrl(settings.heroSection.backgroundImage, 'large') : null;

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section 
        className={`bg-primary/90 py-16 text-white relative ${heroBackground ? 'bg-cover bg-center bg-no-repeat' : ''}`}
        {...(heroBackground && {
          style: {
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroBackground})`,
          }
        })}
      >
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">
              {settings?.heroSection?.title || 'Dự án tiêu biểu'}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {settings?.heroSection?.subtitle || 'Những công trình thực tế đã được VRC thiết kế, cung cấp thiết bị và thi công lắp đặt trên khắp cả nước.'}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-accent">
                Đặt lịch tư vấn
              </Link>
              <Link to="/services" className="btn-white">
                Xem dịch vụ
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
              <h2 className="mb-6">Năng lực và kinh nghiệm</h2>
              <p className="text-muted-foreground mb-6">
                Với hơn 20 năm kinh nghiệm, VRC đã thực hiện hàng trăm dự án lớn nhỏ trong lĩnh vực điện lạnh công nghiệp và dân dụng. Chúng tôi tự hào là đối tác tin cậy của nhiều tập đoàn lớn và các đơn vị hàng đầu trong các ngành công nghiệp.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                  <span>Hơn 500 dự án lớn nhỏ đã hoàn thành</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                  <span>Đối tác của các tập đoàn và doanh nghiệp hàng đầu</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                  <span>Đội ngũ kỹ sư và chuyên viên giàu kinh nghiệm</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                  <span>Cam kết chất lượng và tiến độ thi công</span>
                </li>
              </ul>
            </div>
            <div>
              <img 
                src="/assets/images/projects-overview.jpg" 
                alt="Dự án điện lạnh công nghiệp" 
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

      {/* Project Categories */}
      <section className="py-12 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="mb-4">
              {settings?.categorySection?.title || 'Danh mục dự án'}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              {settings?.categorySection?.description || 'VRC tự hào thực hiện các dự án đa dạng với quy mô khác nhau, từ hệ thống điều hòa không khí trung tâm cho tòa nhà thương mại đến các hệ thống làm lạnh công nghiệp phức tạp.'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              // Get category icon based on slug
              const getCategoryIcon = (slug: string) => {
                switch (slug) {
                  case 'commercial':
                    return <Building className="text-primary" />;
                  case 'industrial':
                    return <Factory className="text-primary" />;
                  case 'specialized':
                    return <Building2 className="text-primary" />;
                  default:
                    return <Building className="text-primary" />;
                }
              };

              return (
                <Card key={category.id} className="transition-all hover:shadow-md">
                  <CardHeader>
                    <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                      {getCategoryIcon(category.slug)}
                    </div>
                    <CardTitle>
                      {category.title}
                    </CardTitle>
                    <CardDescription>
                      {category.description || ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {category.description || 'Mô tả sẽ được cập nhật sớm.'}
                    </p>
                  </CardContent>
                  <CardFooter>
                    {/* Link to category filter page, not project detail */}
                    <Link 
                      to={`/projects/category/${category.slug}`} 
                      className="text-primary hover:text-accent flex items-center"
                    >
                      Xem dự án danh mục này
                      <ExternalLink size={16} className="ml-1" />
                    </Link>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Projects */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="mb-8">
            {settings?.featuredSection?.title || 'Dự án nổi bật'}
          </h2>          <div className="space-y-8">
            {featuredProjects.length > 0 ? (
              featuredProjects.slice(0, 3).map((project) => (
                <div key={project.id} className="border rounded-lg overflow-hidden">
                  <div className="grid md:grid-cols-2">
                    <div className="h-60 md:h-auto bg-muted">
                      <img 
                        src={project.featuredImage ? getImageUrl(project.featuredImage, 'medium') || "/placeholder.svg" : "/placeholder.svg"}
                        alt={project.featuredImage ? getImageAlt(project.featuredImage, project.title) : project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center mb-2">
                        <h3 className="text-xl font-semibold">{project.title}</h3>
                        <span className="ml-3 bg-accent text-white px-2 py-1 rounded-md text-xs font-medium">
                          Nổi bật
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {project.timeframe?.endDate 
                          ? `Hoàn thành: ${new Date(project.timeframe.endDate).toLocaleDateString('vi-VN')}` 
                          : 'Thời gian: N/A'
                        }
                      </p>
                      <p className="mb-4">
                        {project.summary || `Dự án tại ${project.location || 'địa điểm chưa xác định'} cho khách hàng ${project.client || 'chưa xác định'}.`}
                      </p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {project.categories?.map((category) => (
                          <span key={category.id} className="bg-primary/10 px-2 py-1 rounded-md text-primary text-sm">
                            {category.title}
                          </span>
                        ))}
                        {project.services?.map((service, index) => (
                          <span key={index} className="bg-primary/10 px-2 py-1 rounded-md text-primary text-sm">
                            {service.name}
                          </span>
                        ))}
                      </div>
                      {/* Link to project detail */}
                      <Link 
                        to={`/projects/detail/${project.slug}`} 
                        className="text-primary hover:text-accent flex items-center"
                      >
                        Chi tiết dự án
                        <ArrowRight size={16} className="ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Chưa có dự án nổi bật nào được hiển thị.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* All Projects Section */}
      <section className="py-12 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="mb-4">Tất cả dự án</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Danh sách tất cả các dự án mà VRC đã thực hiện, từ các dự án nhỏ đến những công trình lớn, thể hiện năng lực và kinh nghiệm đa dạng của chúng tôi.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allProjects.length > 0 ? (
              allProjects.map((project) => (
                <Card key={project.id} className="transition-all hover:shadow-md">
                  <div className="relative">
                    <div className="h-48 bg-muted rounded-t-lg overflow-hidden">
                      <img 
                        src={project.featuredImage ? getImageUrl(project.featuredImage, 'medium') || "/placeholder.svg" : "/placeholder.svg"}
                        alt={project.featuredImage ? getImageAlt(project.featuredImage, project.title) : project.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.svg";
                        }}
                      />
                    </div>
                    {project.featured && (
                      <div className="absolute top-3 right-3 bg-accent text-white px-2 py-1 rounded-md text-xs font-medium">
                        Nổi bật
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{project.title}</CardTitle>
                    <CardDescription>
                      {project.client && `Khách hàng: ${project.client}`}
                      {project.location && ` • ${project.location}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm line-clamp-3">
                      {project.summary || 'Mô tả dự án sẽ được cập nhật sớm.'}
                    </p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {project.categories?.slice(0, 2).map((category) => (
                        <span key={category.id} className="bg-primary/10 px-2 py-1 rounded-md text-primary text-xs">
                          {category.title}
                        </span>
                      ))}
                      {project.categories && project.categories.length > 2 && (
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-600 text-xs">
                          +{project.categories.length - 2}
                        </span>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Link 
                      to={`/projects/detail/${project.slug}`} 
                      className="text-primary hover:text-accent flex items-center text-sm"
                    >
                      Xem chi tiết
                      <ArrowRight size={14} className="ml-1" />
                    </Link>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-8">
                <p className="text-muted-foreground">Chưa có dự án nào được hiển thị.</p>
              </div>
            )}
          </div>

          {allProjects.length > 0 && (
            <div className="text-center mt-10">
              <Link to="/projects/all" className="btn-outline">
                Xem tất cả dự án
                <ArrowRight size={16} className="ml-2" />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      {settings?.statsSection?.enableStats && (
        <section className="py-12 bg-accent/10">
          <div className="container-custom">
            <h2 className="text-center mb-10">Thành tựu của chúng tôi</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {settings.statsSection.stats.map((stat) => (
                <div key={stat.id} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-6">
              {settings?.ctaSection?.title || 'Bạn có dự án cần tư vấn?'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {settings?.ctaSection?.description || 'Hãy liên hệ với đội ngũ kỹ sư của chúng tôi để được tư vấn giải pháp tối ưu cho dự án của bạn. VRC cam kết mang đến các giải pháp điện lạnh hiện đại, hiệu quả và tiết kiệm chi phí.'}
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to={settings?.ctaSection?.primaryButton?.link || "/contact"} 
                className="btn-primary"
              >
                {settings?.ctaSection?.primaryButton?.text || 'Liên hệ tư vấn'}
              </Link>
              <Link 
                to={settings?.ctaSection?.secondaryButton?.link || "/services"} 
                className="btn-outline"
              >
                {settings?.ctaSection?.secondaryButton?.text || 'Xem dịch vụ'}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Projects;