import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Phone, Mail, DollarSign, Star, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Product } from '@/types/Product';
import { productsService } from '@/services';

const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;

      try {
        setLoading(true);
        setError(null);
          // Get all products and find by slug
        const products = await productsService.getProducts();
        const foundProduct = products.find(p => p.slug === slug);        
        if (foundProduct) {
          // Found product is already transformed, use it directly
          setProduct(foundProduct);
        } else {
          setError('Không tìm thấy sản phẩm');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Có lỗi xảy ra khi tải sản phẩm');
        toast.error('Không thể tải thông tin sản phẩm');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Đang tải thông tin sản phẩm...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Lỗi</h1>
          <p className="text-muted-foreground mb-6">{error || 'Không tìm thấy sản phẩm'}</p>
          <Link to="/products">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Quay lại danh sách sản phẩm
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="flex-grow">
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="container-custom">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary">Trang chủ</Link>
            <span>/</span>
            <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
            <span>/</span>
            <Link to={`/products/${product.category}`} className="hover:text-primary">{product.categoryTitle}</Link>
            <span>/</span>
            <span className="text-foreground">{product.name}</span>
          </div>
        </div>
      </div>

      {/* Back Button */}
      <div className="container-custom py-4">
        <Link 
          to="/products" 
          className="inline-flex items-center text-primary hover:text-primary/80 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách sản phẩm
        </Link>
      </div>

      {/* Product Detail */}
      <section className="py-8">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
              </div>
              
              {/* Thumbnail grid - if we had multiple images */}
              <div className="grid grid-cols-4 gap-2">
                {[product.imageUrl, product.imageUrl, product.imageUrl, product.imageUrl].map((img, index) => (
                  <div 
                    key={index}
                    className={`aspect-square bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 transition-colors ${
                      selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.categoryTitle}</Badge>
                  {product.isBestseller && (
                    <Badge className="bg-amber-600">Bán chạy</Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-green-600">Mới</Badge>
                  )}
                </div>
                
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.name}</h1>
                
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">(4.8/5 - 124 đánh giá)</span>
                </div>

                <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                  {product.description}
                </p>

                <div className="text-3xl font-bold text-primary mb-6">
                  {product.price}
                </div>
              </div>

              {/* Features */}
              {product.features.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold mb-4">Tính năng nổi bật</h3>
                  <ul className="space-y-2">
                    {product.features.slice(0, 5).map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="space-y-4">
                <Button size="lg" className="w-full" asChild>
                  <Link to={`/contact?product=${product.slug}`}>
                    <Phone className="w-5 h-5 mr-2" />
                    Yêu cầu báo giá
                  </Link>
                </Button>
                
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline" size="lg" asChild>
                    <Link to="tel:+84987654321">
                      <Phone className="w-4 h-4 mr-2" />
                      Gọi ngay
                    </Link>
                  </Button>
                  <Button variant="outline" size="lg" asChild>
                    <Link to="/contact">
                      <Mail className="w-4 h-4 mr-2" />
                      Email
                    </Link>
                  </Button>
                </div>
              </div>

              {/* Quick Info */}
              <Card>
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Danh mục:</span>
                      <p className="text-muted-foreground">{product.categoryTitle}</p>
                    </div>
                    <div>
                      <span className="font-medium">Mã sản phẩm:</span>
                      <p className="text-muted-foreground">{product.id}</p>
                    </div>
                    <div>
                      <span className="font-medium">Bảo hành:</span>
                      <p className="text-muted-foreground">24 tháng</p>
                    </div>
                    <div>
                      <span className="font-medium">Xuất xứ:</span>
                      <p className="text-muted-foreground">Việt Nam</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Product Details Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <Tabs defaultValue="specifications" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="specifications">Thông số kỹ thuật</TabsTrigger>
              <TabsTrigger value="features">Tính năng</TabsTrigger>
              <TabsTrigger value="installation">Lắp đặt</TabsTrigger>
              <TabsTrigger value="warranty">Bảo hành</TabsTrigger>
            </TabsList>
            
            <TabsContent value="specifications" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Thông số kỹ thuật chi tiết</CardTitle>
                  <CardDescription>
                    Các thông số kỹ thuật chính của {product.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {Object.keys(product.specifications || {}).length > 0 ? (
                    <div className="overflow-hidden rounded border border-gray-200">
                      <table className="min-w-full divide-y divide-gray-200">
                        <tbody className="divide-y divide-gray-200">
                          {Object.entries(product.specifications || {}).map(([key, value], index) => (
                            <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                              <td className="px-6 py-3 text-sm font-medium text-gray-900 w-1/3">{key}</td>
                              <td className="px-6 py-3 text-sm text-gray-600">{value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Thông tin thông số kỹ thuật sẽ được cập nhật sớm.</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Tính năng đầy đủ</CardTitle>
                  <CardDescription>
                    Danh sách đầy đủ các tính năng của {product.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {product.features.map((feature, index) => (
                      <div key={index} className="flex items-start">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="installation" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Hướng dẫn lắp đặt</CardTitle>
                  <CardDescription>
                    Thông tin về việc lắp đặt {product.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Yêu cầu lắp đặt:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Đội ngũ kỹ thuật viên có chứng chỉ</li>
                        <li>Kiểm tra điều kiện môi trường lắp đặt</li>
                        <li>Chuẩn bị các thiết bị hỗ trợ cần thiết</li>
                        <li>Thời gian lắp đặt: 1-2 ngày làm việc</li>
                      </ul>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="font-medium mb-2">Dịch vụ hỗ trợ:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Tư vấn miễn phí trước khi lắp đặt</li>
                        <li>Lắp đặt và vận hành thử nghiệm</li>
                        <li>Hướng dẫn sử dụng chi tiết</li>
                        <li>Bảo hành tại chỗ 24 tháng</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="warranty" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Chính sách bảo hành</CardTitle>
                  <CardDescription>
                    Thông tin bảo hành cho {product.name}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Thời gian bảo hành: 24 tháng</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Bảo hành toàn bộ máy và linh kiện trong vòng 24 tháng kể từ ngày lắp đặt hoàn thành.
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Điều kiện bảo hành:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Sử dụng đúng hướng dẫn của nhà sản xuất</li>
                        <li>Bảo trì định kỳ theo lịch</li>
                        <li>Không tự ý sửa chữa hoặc thay đổi</li>
                        <li>Còn phiếu bảo hành hợp lệ</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Dịch vụ bảo hành:</h4>
                      <ul className="list-disc pl-5 space-y-1 text-sm text-muted-foreground">
                        <li>Sửa chữa miễn phí tại nhà</li>
                        <li>Thay thế linh kiện chính hãng</li>
                        <li>Hỗ trợ 24/7 qua hotline</li>
                        <li>Bảo trì định kỳ miễn phí</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-12 bg-primary/5">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Cần tư vấn thêm?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Liên hệ với chúng tôi để được tư vấn chi tiết về {product.name}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to={`/contact?product=${product.slug}`}>
                  <Phone className="w-5 h-5 mr-2" />
                  Liên hệ ngay
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/products">
                  Xem sản phẩm khác
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetail;
