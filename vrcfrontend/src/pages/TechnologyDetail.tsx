import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/loading/ServicesSkeleton';
import { Technology, getTechnologies } from '@/services/technologiesService';

const TechnologyDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [technology, setTechnology] = useState<Technology | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTechnology = async () => {
      if (!slug) return;

      try {        setLoading(true);
        setError(null);
        
        // First try to find by slug
        const response = await getTechnologies();
        const technologies = response?.technologies || [];
        const foundTechnology = technologies.find(tech => tech.slug === slug);
        
        if (foundTechnology) {
          setTechnology(foundTechnology);
        } else {
          setError('Không tìm thấy công nghệ này.');
        }
      } catch (err) {
        console.error('Error fetching technology:', err);
        setError('Có lỗi xảy ra khi tải thông tin công nghệ.');
      } finally {
        setLoading(false);
      }
    };

    fetchTechnology();
  }, [slug]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !technology) {
    return (
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {error || 'Không tìm thấy công nghệ'}
            </h1>
            <p className="text-gray-600 mb-8">
              Công nghệ bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <Link to="/technologies">
              <Button>
                Quay lại danh sách công nghệ
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <nav className="flex mb-6" aria-label="Breadcrumb">
              <ol className="inline-flex items-center space-x-1 md:space-x-3">
                <li className="inline-flex items-center">
                  <Link to="/" className="text-blue-200 hover:text-white">
                    Trang chủ
                  </Link>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <Link to="/technologies" className="ml-1 text-blue-200 hover:text-white md:ml-2">
                      Công nghệ
                    </Link>
                  </div>
                </li>
                <li>
                  <div className="flex items-center">
                    <svg className="w-6 h-6 text-blue-200" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="ml-1 text-white md:ml-2">{technology.name}</span>
                  </div>
                </li>
              </ol>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {technology.name}
            </h1>
            
            {technology.description?.root?.children?.[0]?.children?.[0]?.text && (
              <p className="text-xl text-blue-100 leading-relaxed">
                {technology.description.root.children[0].children[0].text}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Thông tin chi tiết
              </h2>
              
              {technology.description?.root?.children && (
                <div className="prose prose-lg max-w-none text-gray-700">
                  {technology.description.root.children.map((child: { type: string; children?: Array<{ text: string }> }, index: number) => {
                    if (child.type === 'paragraph' && child.children) {
                      return (
                        <p key={index} className="mb-4">
                          {child.children.map((textNode: { text: string }, textIndex: number) => (
                            <span key={textIndex}>{textNode.text}</span>
                          ))}
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              )}

              {/* Features Section */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  Tính năng nổi bật
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Công nghệ tiên tiến</h4>
                      <p className="text-gray-600 text-sm">Sử dụng công nghệ mới nhất trong ngành</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Tiết kiệm năng lượng</h4>
                      <p className="text-gray-600 text-sm">Giảm chi phí vận hành đáng kể</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Thông tin liên hệ
              </h3>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Tư vấn miễn phí</h4>
                  <p className="text-gray-600 text-sm mb-3">
                    Liên hệ với chúng tôi để được tư vấn chi tiết về công nghệ này
                  </p>
                  <Link to="/contact">
                    <Button className="w-full">
                      Liên hệ ngay
                    </Button>
                  </Link>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Hotline</h4>
                  <p className="text-blue-600 font-semibold">1900 1234</p>
                </div>
                
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Email</h4>
                  <p className="text-blue-600">info@vrc.com.vn</p>
                </div>
              </div>
            </div>

            {/* Related Technologies */}
            <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Công nghệ liên quan
              </h3>
              <div className="space-y-3">
                <Link to="/technologies" className="block p-3 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                  <h4 className="font-medium text-gray-900 text-sm">Xem tất cả công nghệ</h4>
                  <p className="text-gray-600 text-xs">Khám phá các giải pháp khác</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnologyDetail;
