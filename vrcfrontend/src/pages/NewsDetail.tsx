import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Interface phù hợp với API response structure thực tế
interface PostDetailData {
  id: string;
  title: string;
  slug: string;
  content: {
    root: {
      type: string;
      children: LexicalNode[];
      direction?: string;
      format?: string;
      indent?: number;
      version?: number;
    };
  };
  heroImage?: {
    url?: string;
    thumbnailURL?: string;
    alt?: string;
    width?: number;
    height?: number;
    sizes?: {
      thumbnail?: { url?: string; width?: number; height?: number };
      small?: { url?: string; width?: number; height?: number };
      medium?: { url?: string; width?: number; height?: number };
      large?: { url?: string; width?: number; height?: number };
      xlarge?: { url?: string; width?: number; height?: number };
      og?: { url?: string; width?: number; height?: number };
    };
  };
  authors?: Array<{
    id: string;
    name: string;
  }>;
  populatedAuthors?: Array<{
    id: string;
    name: string;
  }>;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  _status: string;
  meta?: {
    title?: string;
    description?: string;
    image?: {
      url: string;
      alt?: string;
    };
  };
}

interface LexicalNode {
  type: string;
  children?: LexicalNode[];
  text?: string;
  format?: number;
  url?: string;
  tag?: number | string; // Allow both number and string for heading tags
  listType?: string;
  direction?: string;
  indent?: number;
  version?: number;
}

interface ApiResponse {
  success: boolean;
  data: PostDetailData | PostDetailData[];
}

const NewsDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<PostDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError('Không tìm thấy bài viết');
      setLoading(false);
      return;
    }

    const fetchPost = async () => {
      try {
        setLoading(true);
        setError(null);
          // Try to fetch by slug first
        let response = await fetch(`http://localhost:3000/api/posts?slug=${slug}&limit=1`);
        
        if (!response.ok) {
          // If slug doesn't work, try ID
          response = await fetch(`http://localhost:3000/api/posts/${slug}`);
        }
        
        if (!response.ok) {
          throw new Error('Bài viết không tồn tại');
        }
        
        const data: ApiResponse = await response.json();
        
        if (data.success) {
          // Handle both single post and array response
          const postData = Array.isArray(data.data) ? data.data[0] : data.data;
          if (postData) {
            setPost(postData);
          } else {
            throw new Error('Không tìm thấy bài viết');
          }
        } else {
          throw new Error('Lỗi tải dữ liệu');
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch post');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [slug]);
  // Format date helper
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to construct proper image URLs
  const getImageUrl = (imageUrl?: string) => {
    if (!imageUrl) {
      console.log('🖼️ No imageUrl provided');
      return '/api/placeholder/800/450';
    }
    
    // If already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      console.log('🖼️ Using full URL:', imageUrl);
      return imageUrl;
    }
    
    // Construct full URL with backend base URL
    const baseUrl = 'http://localhost:3000';
    const fullUrl = `${baseUrl}${imageUrl}`;
    console.log('🖼️ Constructed URL:', fullUrl);
    return fullUrl;
  };

  // Helper function to get optimized image URL with size preference  
  const getOptimizedImageUrl = (heroImage: PostDetailData['heroImage'], preferredSize: 'thumbnail' | 'small' | 'medium' | 'large' = 'large'): string => {
    if (!heroImage) {
      console.log('🖼️ No heroImage provided, using placeholder');
      return '/api/placeholder/800/450';
    }

    console.log('🖼️ Processing heroImage for NewsDetail:', heroImage);

    // Try to get the preferred size first
    if (heroImage.sizes && heroImage.sizes[preferredSize]?.url) {
      const sizedUrl = getImageUrl(heroImage.sizes[preferredSize].url);
      console.log(`🖼️ Using ${preferredSize} size:`, sizedUrl);
      return sizedUrl;
    }

    // Fallback to other available sizes
    if (heroImage.sizes) {
      const availableSizes = ['xlarge', 'large', 'medium', 'small', 'thumbnail'];
      for (const size of availableSizes) {
        if (heroImage.sizes[size]?.url) {
          const fallbackUrl = getImageUrl(heroImage.sizes[size].url);
          console.log(`🖼️ Using fallback ${size} size:`, fallbackUrl);
          return fallbackUrl;
        }
      }
    }

    // Fallback to main URL or thumbnail
    const fallbackUrl = heroImage.url || heroImage.thumbnailURL;
    const finalUrl = getImageUrl(fallbackUrl);
    console.log('🖼️ Using main URL fallback:', finalUrl);
    return finalUrl;
  };
  // Render Lexical content with enhanced styling
  const renderLexicalContent = (content: PostDetailData['content']): JSX.Element[] => {
    if (!content?.root?.children) return [];
    
    const renderNode = (node: LexicalNode, index: number): JSX.Element => {
      switch (node.type) {
        case 'paragraph':
          return (
            <p key={index} className="mb-6 leading-[1.8] text-gray-800 text-lg tracking-wide">
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </p>
          );        case 'heading': {
          // Extract heading level - handle both string tags like "h3" and numeric levels
          let headingLevel = 2; // default to h2
          
          if (typeof node.tag === 'string' && node.tag.startsWith('h')) {
            // Extract number from "h3" -> 3
            const levelMatch = node.tag.match(/h(\d+)/);
            if (levelMatch) {
              headingLevel = parseInt(levelMatch[1], 10);
            }
          } else if (typeof node.tag === 'number' && !isNaN(node.tag)) {
            headingLevel = node.tag;
          }
          
          // Ensure level is between 1-6
          headingLevel = Math.max(1, Math.min(headingLevel, 6));
          
          const HeadingTag = `h${headingLevel}` as keyof JSX.IntrinsicElements;
          const headingClasses = {
            h1: 'text-4xl font-bold mb-8 text-gray-900 leading-tight border-b-2 border-blue-100 pb-4',
            h2: 'text-3xl font-bold mb-6 text-gray-900 leading-tight mt-12 first:mt-0',
            h3: 'text-2xl font-semibold mb-5 text-gray-900 leading-tight mt-10 first:mt-0',
            h4: 'text-xl font-semibold mb-4 text-gray-900 leading-tight mt-8 first:mt-0',
            h5: 'text-lg font-semibold mb-3 text-gray-900 leading-tight mt-6 first:mt-0',
            h6: 'text-base font-semibold mb-3 text-gray-900 leading-tight mt-4 first:mt-0'
          };
          
          return (
            <HeadingTag key={index} className={headingClasses[HeadingTag] || headingClasses.h2}>
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </HeadingTag>
          );
        }
          case 'list': {
          const ListTag = node.listType === 'number' ? 'ol' : 'ul';
          const listClass = node.listType === 'number' 
            ? 'list-decimal list-outside ml-6 mb-6 space-y-3 text-lg' 
            : 'list-disc list-outside ml-6 mb-6 space-y-3 text-lg';
          
          return (
            <ListTag key={index} className={listClass}>
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </ListTag>
          );
        }
        
        case 'listitem':
          return (
            <li key={index} className="text-gray-800 leading-relaxed pl-2">
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </li>
          );
          case 'text': {
          let textElement: React.ReactNode = node.text || '';
          
          if (node.format) {
            if (node.format & 1) textElement = <strong key={index} className="font-semibold text-gray-900">{textElement}</strong>; // Bold
            if (node.format & 2) textElement = <em key={index} className="italic text-gray-700">{textElement}</em>; // Italic
            if (node.format & 8) textElement = <u key={index} className="underline decoration-blue-400 decoration-2">{textElement}</u>; // Underline
          }
          
          return <span key={index}>{textElement}</span>;
        }
        
        case 'link':
          return (
            <a 
              key={index} 
              href={node.url} 
              className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors duration-200 font-medium"
              target={node.url?.startsWith('http') ? '_blank' : '_self'}
              rel={node.url?.startsWith('http') ? 'noopener noreferrer' : undefined}
            >
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </a>
          );
        
        case 'linebreak':
          return <br key={index} />;
        
        default:
          // Fallback for unknown node types
          if (node.children) {
            return (
              <div key={index} className="mb-4">
                {node.children.map((child, childIndex) => renderNode(child, childIndex))}
              </div>
            );
          }
          return <span key={index}>{node.text || ''}</span>;
      }
    };

    return content.root.children.map((child, index) => renderNode(child, index));
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
              <div className="absolute inset-0 rounded-full h-16 w-16 border-4 border-blue-100 animate-pulse mx-auto"></div>
            </div>
            <p className="text-gray-700 text-lg font-medium">Đang tải bài viết...</p>
            <p className="text-gray-500 text-sm mt-2">Vui lòng chờ trong giây lát</p>
          </div>
        </div>
      </div>
    );
  }
  if (error || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Không thể tải bài viết</h3>
              <p className="text-gray-600 mb-6">{error || 'Bài viết không tồn tại hoặc đã bị xóa'}</p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={() => navigate('/news')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Quay lại tin tức
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium flex items-center justify-center"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Thử lại
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const authors = post.populatedAuthors || post.authors || [];
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center text-sm font-medium">
            <a 
              href="/news" 
              className="text-blue-600 hover:text-blue-800 transition-colors duration-200 flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Tin tức
            </a>
            <svg className="w-4 h-4 mx-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-700 truncate">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight tracking-tight">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center text-gray-600 mb-8 space-x-8">
              <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                <svg className="w-5 h-5 mr-3 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="font-medium">{formatDate(post.publishedAt)}</span>
              </div>
              
              {authors.length > 0 && (
                <div className="flex items-center bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50">
                  <svg className="w-5 h-5 mr-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span className="font-medium">Bởi {authors.map(author => author.name).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Meta Description */}
            {post.meta?.description && (
              <div className="text-2xl text-gray-600 leading-relaxed mb-8 font-light italic bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                "{post.meta.description}"
              </div>
            )}
          </header>          {/* Featured Image */}
          {post.heroImage && (
            <div className="mb-12 relative overflow-hidden rounded-2xl shadow-2xl group">
              <img
                src={getOptimizedImageUrl(post.heroImage, 'large')}
                alt={post.heroImage?.alt || post.title}
                className="w-full max-h-[600px] object-cover transition-all duration-500 group-hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('🖼️ Image failed to load, using placeholder');
                  target.src = '/api/placeholder/800/450';
                }}
              />
              {/* Enhanced gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-purple-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Image caption if alt text exists */}
              {post.heroImage?.alt && (
                <div className="absolute bottom-4 left-4 right-4 bg-black/70 backdrop-blur-sm text-white p-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-sm font-medium">{post.heroImage.alt}</p>
                </div>
              )}
            </div>
          )}

          {/* Article Content */}
          <article className="relative">
            {/* Content Background */}
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200/50">
              <div className="prose prose-xl max-w-none prose-gray prose-headings:text-gray-900 prose-a:text-blue-600 prose-strong:text-gray-900">
                {renderLexicalContent(post.content)}
              </div>
            </div>
            
            {/* Decorative elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-gradient-to-br from-blue-200 to-purple-200 rounded-full opacity-20 -z-10"></div>
            <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-gradient-to-br from-purple-200 to-pink-200 rounded-full opacity-20 -z-10"></div>
          </article>

          {/* Footer Actions */}
          <footer className="mt-16 pt-8">
            <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200/50">
              <div className="flex flex-col lg:flex-row justify-between items-center space-y-6 lg:space-y-0">
                <button
                  onClick={() => navigate('/news')}
                  className="group inline-flex items-center px-6 py-3 text-blue-600 hover:text-white font-semibold rounded-xl border-2 border-blue-600 hover:bg-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                >
                  <svg className="w-5 h-5 mr-3 transition-transform duration-300 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Quay lại danh sách tin tức
                </button>

                {/* Enhanced Share Buttons */}
                <div className="flex items-center space-x-6">
                  <span className="text-gray-600 text-sm font-medium">Chia sẻ bài viết:</span>
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => {
                        if (navigator.share) {
                          navigator.share({
                            title: post.title,
                            text: post.meta?.description || '',
                            url: window.location.href
                          });
                        } else {
                          navigator.clipboard.writeText(window.location.href);
                          alert('Đã sao chép link bài viết!');
                        }
                      }}
                      className="group p-3 bg-gray-100 hover:bg-blue-500 text-gray-600 hover:text-white rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      title="Chia sẻ"
                    >
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </button>
                    
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        alert('Đã sao chép link bài viết!');
                      }}
                      className="group p-3 bg-gray-100 hover:bg-green-500 text-gray-600 hover:text-white rounded-full transition-all duration-300 transform hover:scale-110 hover:shadow-lg"
                      title="Sao chép liên kết"
                    >
                      <svg className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;