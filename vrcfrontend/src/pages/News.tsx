import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CalendarIcon, ChevronRight, User, Search, Eye, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNewsCategories } from '@/hooks/useNewsCategories';
import { useNewsPosts, PostData } from '@/hooks/useNewsPosts';
import { TagsList } from '@/components/TagsList';

const News: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Use custom hooks
  const { categories, totalAllPosts, loading: categoriesLoading } = useNewsCategories();
  const { posts, loading: postsLoading, pagination, filterByCategory, goToPage, currentPage } = useNewsPosts({
    selectedCategory
  });
  // Sample tags for display
  // const sampleTags = [
  //   "Điện lạnh", "Triển lãm", "Hội thảo", "Công nghệ", "Tiết kiệm năng lượng",
  //   "Bảo trì", "Inverter", "Hợp tác quốc tế", "Nghiên cứu", "Phát triển bền vững"
  // ];

  // Handle category selection
  const handleCategorySelect = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    filterByCategory(categoryId);
  };

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  // Get excerpt from Lexical content or meta description
  const getExcerpt = (post: PostData, maxLength: number = 150): string => {
    // Try meta description first
    if (post.meta?.description) {
      return post.meta.description.length > maxLength 
        ? post.meta.description.substring(0, maxLength) + '...' 
        : post.meta.description;
    }

    // Extract from Lexical content
    if (!post.content?.root?.children) return '';
    
    try {
      const extractText = (node: unknown): string => {
        const typedNode = node as Record<string, unknown>;
        if (typedNode.type === 'text') {
          return (typedNode.text as string) || '';
        }
        if (typedNode.children && Array.isArray(typedNode.children)) {
          return typedNode.children.map(extractText).join('');
        }
        return '';
      };
      
      if (!post.content?.root?.children || !Array.isArray(post.content.root.children)) {
        return '';
      }
      
      const fullText = post.content.root.children.map(extractText).join(' ');
      return fullText.length > maxLength 
        ? fullText.substring(0, maxLength) + '...' 
        : fullText;
    } catch (error) {
      console.error('Error extracting text:', error);
      return '';
    }
  };

  // Simplified image URL function
  const getImageUrl = (heroImage: PostData['heroImage'], preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' | 'og' = 'medium'): string => {
    const fallbackUrl = 'http://localhost:3000/api/media/file/banner-1748513055712.jpg';
    
    if (!heroImage) {
      return fallbackUrl;
    }

    // Try preferred size first
    if (heroImage.sizes?.[preferredSize]?.url) {
      const sizedUrl = heroImage.sizes[preferredSize].url;
      return sizedUrl.startsWith('http') ? sizedUrl : `http://localhost:3000${sizedUrl}`;
    }

    // Try main URL
    if (heroImage.url) {
      const mainUrl = heroImage.url;
      return mainUrl.startsWith('http') ? mainUrl : `http://localhost:3000${mainUrl}`;
    }

    // Try thumbnail URL
    if (heroImage.thumbnailURL) {
      const thumbUrl = heroImage.thumbnailURL;
      return thumbUrl.startsWith('http') ? thumbUrl : `http://localhost:3000${thumbUrl}`;
    }

    return fallbackUrl;
  };

  // Get featured post (first post) and regular posts
  const featuredPost = posts[0];
  const regularPosts = posts.slice(1);

  // Handle search form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Search term:', searchTerm);
  };

  if (categoriesLoading || postsLoading) {
    return (
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="animate-pulse space-y-6">
                <div className="h-64 bg-gray-300 rounded-lg"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="h-48 bg-gray-300 rounded-lg"></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="animate-pulse space-y-6">
                <div className="h-32 bg-gray-300 rounded-lg"></div>
                <div className="h-32 bg-gray-300 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      {/* Page Header */}
      <div className="bg-gradient-to-b from-blue-50 to-transparent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-900">
            {selectedCategory ? 
              categories.find(cat => cat.id === selectedCategory)?.title || 'Tin tức & Sự kiện' 
              : 'Tin tức & Sự kiện'
            }
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl">
            {selectedCategory ? 
              `Các bài viết thuộc danh mục: ${categories.find(cat => cat.id === selectedCategory)?.title}`
              : 'Cập nhật những thông tin mới nhất về ngành điện lạnh, công nghệ mới và các hoạt động của chúng tôi'
            }
          </p>
          {selectedCategory && (
            <button 
              onClick={() => handleCategorySelect(null)}
              className="mt-3 text-blue-600 hover:text-blue-800 underline flex items-center gap-1"
            >
              ← Quay lại tất cả tin tức
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            {/* Featured News */}
            {featuredPost && (
              <div className="mb-10">
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img 
                    src={getImageUrl(featuredPost.heroImage, 'large')} 
                    alt={featuredPost.heroImage?.alt || featuredPost.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'http://localhost:3000/api/media/file/banner-1748513055712.jpg';
                      console.log('🖼️ Image load error for featured post:', featuredPost.title);
                    }}
                  />
                </div>
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                    Tin nổi bật
                  </Badge>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                  <Link 
                    to={`/news/${featuredPost.slug}`} 
                    className="hover:text-blue-600 transition-colors"
                  >
                    {featuredPost.title}
                  </Link>
                </h2>
                <p className="text-gray-600 mb-4">
                  {getExcerpt(featuredPost)}
                </p>
                
                <div className="flex flex-wrap items-center text-sm text-gray-500 gap-4 mb-4">
                  <div className="flex items-center">
                    <CalendarIcon size={16} className="mr-1" />
                    <span>{formatDate(featuredPost.publishedAt)}</span>
                  </div>
                  {featuredPost.populatedAuthors && featuredPost.populatedAuthors.length > 0 && (
                    <div className="flex items-center">
                      <User size={16} className="mr-1" />
                      <span>
                        Tác giả: {featuredPost.populatedAuthors.map((author: { name: string }) => author.name).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to={`/news/${featuredPost.slug}`}>
                    Xem chi tiết
                    <ChevronRight size={16} className="ml-1" />
                  </Link>
                </Button>
              </div>
            )}

            {/* Tab Filters */}
            <Tabs defaultValue="all" className="mb-8" value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3 w-full max-w-[400px]">
                <TabsTrigger value="all">Tất cả</TabsTrigger>
                <TabsTrigger value="news">Tin tức</TabsTrigger>
                <TabsTrigger value="events">Sự kiện</TabsTrigger>
              </TabsList>
            </Tabs>

            {/* News Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {regularPosts.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow border">
                  <Link to={`/news/${post.slug}`} className="block aspect-[4/3] overflow-hidden">
                    <img 
                      src={getImageUrl(post.heroImage, 'medium')} 
                      alt={post.heroImage?.alt || post.title}
                      className="w-full h-full object-cover transition-transform hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'http://localhost:3000/api/media/file/banner-1748513055712.jpg';
                        console.log('🖼️ Image load error for post:', post.title);
                      }}
                    />
                  </Link>
                  
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                        Tin tức
                      </Badge>
                      <span className="text-xs text-gray-500 flex items-center">
                        <CalendarIcon size={12} className="mr-1" />
                        {formatDate(post.publishedAt)}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 hover:text-blue-600 transition-colors">
                      <Link to={`/news/${post.slug}`}>
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {getExcerpt(post)}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <div className="text-xs text-gray-500">
                        {post.populatedAuthors && post.populatedAuthors.length > 0 ? 
                          `Tác giả: ${post.populatedAuthors.map((author: { name: string }) => author.name).join(', ')}` :
                          'VRC'
                        }
                      </div>
                      <div className="flex items-center gap-3 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Eye size={12} className="mr-1" />
                          {Math.floor(Math.random() * 1000) + 100}
                        </span>
                        <span className="flex items-center">
                          <MessageCircle size={12} className="mr-1" />
                          {Math.floor(Math.random() * 20)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex gap-1">
                  <Button
                    variant="outline"
                    onClick={() => goToPage(Math.max(currentPage - 1, 1))}
                    disabled={!pagination.hasPrevPage}
                    className="px-3 py-1"
                  >
                    «
                  </Button>
                  {[...Array(pagination.totalPages)].map((_, i) => (
                    <Button
                      key={i + 1}
                      variant={currentPage === i + 1 ? "default" : "outline"}
                      onClick={() => goToPage(i + 1)}
                      className="px-3 py-1"
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => goToPage(Math.min(currentPage + 1, pagination.totalPages))}
                    disabled={!pagination.hasNextPage}
                    className="px-3 py-1"
                  >
                    »
                  </Button>
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
              <h3 className="font-semibold text-lg mb-3">Tìm kiếm</h3>
              <form onSubmit={handleSearch} className="flex">
                <input 
                  type="text" 
                  placeholder="Tìm kiếm tin tức..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-grow border rounded-l-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <Button type="submit" className="px-4 py-2 rounded-r-md rounded-l-none bg-blue-600 hover:bg-blue-700">
                  <Search size={18} />
                </Button>
              </form>
            </div>

            {/* Categories */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
              <h3 className="font-semibold text-lg mb-3">Danh mục</h3>
              {categoriesLoading ? (
                <div className="space-y-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse flex justify-between items-center py-2">
                      <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-300 rounded w-8"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <ul className="space-y-2">
                  {/* All categories option */}
                  <li>
                    <button 
                      onClick={() => handleCategorySelect(null)}
                      className={`w-full flex justify-between items-center py-2 hover:text-blue-600 transition-colors text-left ${
                        selectedCategory === null ? 'text-blue-600 font-medium' : ''
                      }`}
                    >
                      <span>Tất cả</span>
                      <Badge variant="secondary" className="text-xs">
                        {totalAllPosts || 0}
                      </Badge>
                    </button>
                  </li>
                  {categories.map((category) => (
                    <li key={category.id}>
                      <button 
                        onClick={() => handleCategorySelect(category.id)}
                        className={`w-full flex justify-between items-center py-2 hover:text-blue-600 transition-colors text-left ${
                          selectedCategory === category.id ? 'text-blue-600 font-medium' : ''
                        }`}
                      >
                        <span>{category.title}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            {/* Recent Posts */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border">
              <h3 className="font-semibold text-lg mb-3">Bài viết gần đây</h3>
              <div className="space-y-4">
                {posts.slice(0, 5).map(post => (
                  <div key={post.id} className="flex gap-3">
                    <Link to={`/news/${post.slug}`} className="block w-20 h-20 flex-shrink-0">
                      <img 
                        src={getImageUrl(post.heroImage, 'thumbnail')} 
                        alt={post.heroImage?.alt || post.title}
                        className="w-full h-full object-cover rounded"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'http://localhost:3000/api/media/file/banner-1748513055712-300x450.jpg';
                        }}
                      />
                    </Link>
                    <div>
                      <Link 
                        to={`/news/${post.slug}`} 
                        className="font-medium text-sm hover:text-blue-600 transition-colors line-clamp-2"
                      >
                        {post.title}
                      </Link>
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <CalendarIcon size={12} className="mr-1" />
                        {formatDate(post.publishedAt)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
              {/* Tags */}
            <TagsList />
          </div>
        </div>
      </div>
    </main>
  );
};

export default News;
