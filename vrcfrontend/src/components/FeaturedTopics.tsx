import { ArrowRight, Loader2 } from 'lucide-react';
import { useFeaturedTopicsSection } from '@/hooks/useHomepageSettings';
import type { ProductData } from '@/services/homepageSettingsService';

// Fallback topics in case the API call fails
const fallbackTopics: ProductData[] = [
  {
    id: '1',
    title: "Hệ thống điều hòa công nghiệp",
    description: "Giải pháp làm mát cho nhà máy, kho bãi và không gian rộng lớn",
    image: {
      url: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Hệ thống điều hòa công nghiệp"
    },
    slug: "he-thong-dieu-hoa-cong-nghiep",
    featured: true
  },
  {
    id: '2',
    title: "Hệ thống lạnh thương mại",
    description: "Thiết bị làm lạnh cho siêu thị, nhà hàng và cửa hàng bán lẻ",
    image: {
      url: "https://images.unsplash.com/photo-1518005020951-eccb494ad742?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Hệ thống lạnh thương mại"
    },
    slug: "he-thong-lanh-thuong-mai",
    featured: true
  },
  {
    id: '3',
    title: "Giải pháp tiết kiệm năng lượng",
    description: "Công nghệ hiện đại giúp tiết kiệm chi phí và bảo vệ môi trường",
    image: {
      url: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
      alt: "Giải pháp tiết kiệm năng lượng"
    },
    slug: "giai-phap-tiet-kiem-nang-luong",
    featured: true
  }
];

const FeaturedTopics = () => {
  const { settings, products, isLoading, error, isEnabled } = useFeaturedTopicsSection();

  // Use API products or fallback
  const displayProducts = products.length > 0 ? products : fallbackTopics;
  const sectionTitle = settings?.sectionTitle || "Sản phẩm nổi bật";
  const sectionSubtitle = settings?.sectionSubtitle || "Khám phá các giải pháp điện lạnh hàng đầu của chúng tôi, phù hợp với mọi nhu cầu công nghiệp và thương mại.";

  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }

  // Loading state
  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-2 text-gray-600">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Đang tải sản phẩm nổi bật...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state with fallback
  if (error) {
    console.warn('Featured topics API error, using fallback data:', error);
  }

  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between">
          <div>
            <h2 className="mb-4">{sectionTitle}</h2>
            <p className="text-muted-foreground max-w-2xl">
              {sectionSubtitle}
            </p>
          </div>
          <a href="/products" className="mt-4 md:mt-0 inline-flex items-center text-accent hover:text-primary transition-colors font-medium">
            Xem tất cả sản phẩm
            <ArrowRight size={18} className="ml-2" />
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProducts.map((product) => (
            <div key={product.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <img 
                src={product.image?.url || "https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=400&q=80"} 
                alt={product.image?.alt || product.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2">{product.title}</h3>
                <p className="text-muted-foreground mb-4">{product.description}</p>
                <a 
                  href={`/products/${product.slug}`} 
                  className="inline-flex items-center text-accent hover:text-primary transition-colors font-medium"
                >
                  Tìm hiểu thêm
                  <ArrowRight size={18} className="ml-2" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedTopics;
