
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLatestPublicationsSection } from '@/hooks/useHomepageSettings';
import type { PostData } from '@/services/homepageSettingsService';

// Helper function to format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const LatestPublications = () => {
  const { t } = useTranslation();

  // Hook automatically uses current locale for localized section content and posts
  const { settings, posts, isLoading, error, isEnabled } = useLatestPublicationsSection();

  // Create localized fallback publications
  const fallbackPublications: PostData[] = [
    {
      id: '1',
      title: t('latestPublications.fallbackPublications.publication1.title'),
      excerpt: t('latestPublications.fallbackPublications.publication1.excerpt'),
      publishedAt: "2025-03-15T00:00:00Z",
      slug: "cong-nghe-inverter-tien-tien",
      featuredImage: {
        url: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=1170&h=750&dpr=1",
        alt: t('latestPublications.fallbackPublications.publication1.alt')
      },
      author: {
        name: "VRC Research Team"
      }
    },
    {
      id: '2',
      title: t('latestPublications.fallbackPublications.publication2.title'),
      excerpt: t('latestPublications.fallbackPublications.publication2.excerpt'),
      publishedAt: "2025-02-27T00:00:00Z",
      slug: "giai-phap-heat-recovery",
      featuredImage: {
        url: "https://images.pexels.com/photos/175413/pexels-photo-175413.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
        alt: t('latestPublications.fallbackPublications.publication2.alt')
      },
      author: {
        name: "VRC Research Team"
      }
    },
    {
      id: '3',
      title: t('latestPublications.fallbackPublications.publication3.title'),
      excerpt: t('latestPublications.fallbackPublications.publication3.excerpt'),
      publishedAt: "2025-01-10T00:00:00Z",
      slug: "tieu-chuan-cong-trinh-xanh",
      featuredImage: {
        url: "https://images.pexels.com/photos/323780/pexels-photo-323780.jpeg?auto=compress&cs=tinysrgb&w=1170&h=750&dpr=1",
        alt: t('latestPublications.fallbackPublications.publication3.alt')
      },
      author: {
        name: "VRC Research Team"
      }
    },
    {
      id: '4',
      title: t('latestPublications.fallbackPublications.publication4.title'),
      excerpt: t('latestPublications.fallbackPublications.publication4.excerpt'),
      publishedAt: "2024-12-05T00:00:00Z",
      slug: "bao-cao-tiet-kiem-nang-luong",
      featuredImage: {
        url: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=1170&q=80",
        alt: t('latestPublications.fallbackPublications.publication4.alt')
      },
      author: {
        name: "VRC Research Team"
      }
    }
  ];

  // Use API posts (localized) or fallback
  const displayPosts = posts.length > 0 ? posts : fallbackPublications;
  const sectionTitle = settings?.sectionTitle || t('latestPublications.defaultSectionTitle');
  const showDate = settings?.showDate ?? true;
  const showExcerpt = settings?.showExcerpt ?? true;

  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }
  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-muted">
        <div className="container-custom">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>{t('latestPublications.loading')}</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state with fallback
  if (error) {
    console.warn('Latest publications API error, using fallback data:', error);
  }

  return (
    <section className="py-16 bg-muted">
      <div className="container-custom">        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="mb-4">{sectionTitle}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {t('latestPublications.defaultSectionSubtitle')}
            </p>
          </div>
          <Link to="/publications" className="mt-4 md:mt-0 inline-flex items-center text-accent hover:text-primary transition-colors font-medium">
            {t('latestPublications.viewAllPublications')}
            <ArrowRight size={18} className="ml-2" />
          </Link>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayPosts.map((post) => (
            <div key={post.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img 
                  src={post.featuredImage?.url || "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg?auto=compress&cs=tinysrgb&w=400&h=250&dpr=1"} 
                  alt={post.featuredImage?.alt || post.title} 
                  className="w-full h-40 object-cover"
                />
                {post.author && (
                  <span className="absolute top-2 right-2 bg-secondary text-secondary-foreground text-xs px-2 py-1 rounded">
                    {post.author.name}
                  </span>
                )}
              </div>
              <div className="p-4">
                {showDate && (
                  <p className="text-sm text-muted-foreground mb-2">
                    {formatDate(post.publishedAt)}
                  </p>
                )}
                <h3 className="text-base font-medium line-clamp-2 mb-3">{post.title}</h3>
                {showExcerpt && post.excerpt && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{post.excerpt}</p>
                )}                <Link 
                  to={`/publications/${post.slug}`} 
                  className="inline-flex items-center text-accent hover:text-primary transition-colors text-sm font-medium"
                >
                  {t('latestPublications.readMore')}
                  <ArrowRight size={16} className="ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestPublications;
