import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Search, Filter, Loader2, Building, Factory, Building2 } from 'lucide-react';
import { useProjects, useProjectCategories, getImageUrl, getImageAlt } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AllProjects: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { projects, loading, error, totalPages } = useProjects({ 
    category: selectedCategory === 'all' ? undefined : selectedCategory,
    limit: itemsPerPage,
    page: currentPage 
  });
  
  const { categories, loading: categoriesLoading } = useProjectCategories();

  // Filter projects by search term
  const filteredProjects = React.useMemo(() => {
    if (!searchTerm.trim()) return projects;
    
    return projects.filter(project => 
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.client?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [projects, searchTerm]);

  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'commercial':
        return <Building className="text-primary" size={20} />;
      case 'industrial':
        return <Factory className="text-primary" size={20} />;
      case 'specialized':
        return <Building2 className="text-primary" size={20} />;
      default:
        return <Building className="text-primary" size={20} />;
    }
  };

  if (loading || categoriesLoading) {
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

  if (error) {
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

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className="bg-primary/90 py-16 text-white">
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">Tất cả dự án</h1>
            <p className="text-xl md:text-2xl mb-8">
              Danh sách đầy đủ các dự án mà VRC đã thực hiện, thể hiện năng lực và kinh nghiệm đa dạng của chúng tôi trong lĩnh vực điện lạnh.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-accent">
                Đặt lịch tư vấn
              </Link>
              <Link to="/projects" className="btn-white">
                Quay lại trang dự án
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={20} />
                <Input
                  placeholder="Tìm kiếm dự án..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-muted-foreground" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả danh mục</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.slug}>
                        {category.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-sm text-muted-foreground">
                {filteredProjects.length} dự án
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-12 bg-muted">
        <div className="container-custom">
          {filteredProjects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProjects.map((project) => (
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
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg line-clamp-2">{project.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {project.client && `Khách hàng: ${project.client}`}
                      {project.location && ` • ${project.location}`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
                      {project.summary || 'Mô tả dự án sẽ được cập nhật sớm.'}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.categories?.slice(0, 2).map((category) => (
                        <div key={category.id} className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-md text-primary text-xs">
                          {getCategoryIcon(category.slug)}
                          <span>{category.title}</span>
                        </div>
                      ))}
                      {project.categories && project.categories.length > 2 && (
                        <span className="bg-gray-100 px-2 py-1 rounded-md text-gray-600 text-xs">
                          +{project.categories.length - 2}
                        </span>
                      )}
                    </div>
                    {project.timeframe?.endDate && (
                      <p className="text-xs text-muted-foreground mt-2">
                        Hoàn thành: {new Date(project.timeframe.endDate).toLocaleDateString('vi-VN')}
                      </p>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Link 
                      to={`/projects/detail/${project.slug}`} 
                      className="text-primary hover:text-accent flex items-center text-sm w-full justify-between"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight size={14} />
                    </Link>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg mb-4">
                {searchTerm ? 'Không tìm thấy dự án nào phù hợp với từ khóa tìm kiếm.' : 'Chưa có dự án nào trong danh mục này.'}
              </p>
              {searchTerm && (
                <Button onClick={() => setSearchTerm('')} variant="outline">
                  Xóa bộ lọc
                </Button>
              )}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Trang trước
              </Button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNumber = currentPage <= 3 ? i + 1 : currentPage - 2 + i;
                  if (pageNumber > totalPages) return null;
                  
                  return (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNumber)}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Trang sau
              </Button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default AllProjects;
