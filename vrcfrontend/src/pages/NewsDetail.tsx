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
  tag?: number;
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
        let response = await fetch(`http://localhost:3000/api/posts?where[slug][equals]=${slug}&limit=1`);
        
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

  // Render Lexical content
  const renderLexicalContent = (content: PostDetailData['content']): JSX.Element[] => {
    if (!content?.root?.children) return [];
    
    const renderNode = (node: LexicalNode, index: number): JSX.Element => {
      switch (node.type) {
        case 'paragraph':
          return (
            <p key={index} className="mb-4 leading-relaxed text-gray-700">
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </p>
          );
          case 'heading': {
          const HeadingTag = `h${Math.min(node.tag || 2, 6)}` as keyof JSX.IntrinsicElements;
          const headingClasses = {
            h1: 'text-3xl font-bold mb-6 text-gray-900',
            h2: 'text-2xl font-bold mb-4 text-gray-900',
            h3: 'text-xl font-semibold mb-3 text-gray-900',
            h4: 'text-lg font-semibold mb-2 text-gray-900',
            h5: 'text-base font-semibold mb-2 text-gray-900',
            h6: 'text-sm font-semibold mb-2 text-gray-900'
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
            ? 'list-decimal list-inside mb-4 space-y-2' 
            : 'list-disc list-inside mb-4 space-y-2';
          
          return (
            <ListTag key={index} className={listClass}>
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </ListTag>
          );
        }
        
        case 'listitem':
          return (
            <li key={index} className="text-gray-700">
              {node.children?.map((child, childIndex) => renderNode(child, childIndex))}
            </li>
          );
          case 'text': {
          let textElement: React.ReactNode = node.text || '';
          
          if (node.format) {
            if (node.format & 1) textElement = <strong key={index}>{textElement}</strong>; // Bold
            if (node.format & 2) textElement = <em key={index}>{textElement}</em>; // Italic
            if (node.format & 8) textElement = <u key={index}>{textElement}</u>; // Underline
          }
          
          return <span key={index}>{textElement}</span>;
        }
        
        case 'link':
          return (
            <a 
              key={index} 
              href={node.url} 
              className="text-blue-600 hover:text-blue-800 underline"
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
              <div key={index} className="mb-2">
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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Đang tải bài viết...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              <h3 className="font-bold">Lỗi tải bài viết</h3>
              <p>{error || 'Bài viết không tồn tại'}</p>
            </div>
            <div className="space-x-4">
              <button
                onClick={() => navigate('/news')}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                ← Quay lại danh sách tin tức
              </button>
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                Thử lại
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const authors = post.populatedAuthors || post.authors || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm">
            <a href="/news" className="text-blue-600 hover:text-blue-800">Tin tức</a>
            <span className="mx-2 text-gray-500">›</span>
            <span className="text-gray-700">{post.title}</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Article Header */}
          <header className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
              {post.title}
            </h1>
            
            {/* Meta Information */}
            <div className="flex flex-wrap items-center text-gray-600 mb-6 space-x-6">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(post.publishedAt)}</span>
              </div>
              
              {authors.length > 0 && (
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Bởi {authors.map(author => author.name).join(', ')}</span>
                </div>
              )}
            </div>

            {/* Meta Description */}
            {post.meta?.description && (
              <div className="text-xl text-gray-600 leading-relaxed mb-6 font-light">
                {post.meta.description}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {post.heroImage && (
            <div className="mb-8">
              <img
                src={getOptimizedImageUrl(post.heroImage, 'large')}
                alt={post.heroImage?.alt || post.title}
                className="w-full h-auto rounded-lg shadow-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  console.log('🖼️ Image failed to load, using placeholder');
                  target.src = '/api/placeholder/800/450';
                }}
              />
            </div>
          )}

          {/* Article Content */}
          <article className="prose prose-lg max-w-none">
            <div className="text-gray-800 leading-relaxed">
              {renderLexicalContent(post.content)}
            </div>
          </article>

          {/* Footer Actions */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
              <button
                onClick={() => navigate('/news')}
                className="inline-flex items-center px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Quay lại danh sách tin tức
              </button>

              {/* Share Buttons */}
              <div className="flex items-center space-x-4">
                <span className="text-gray-600 text-sm">Chia sẻ:</span>
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
                  className="text-gray-600 hover:text-blue-600"
                  title="Chia sẻ"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                  </svg>
                </button>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default NewsDetail;