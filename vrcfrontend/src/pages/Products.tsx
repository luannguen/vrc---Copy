import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import AppLink from "@/components/ui/app-link";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import FAQ from "@/components/FAQ";

// Import our types and services
import { Product, ProductCategory, ApiError } from "@/types/Product";
import { productsService, productCategoriesService } from "@/services";

const Products = () => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Load products and categories from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Load products and categories in parallel
        const [productsResult, categoriesResult] = await Promise.allSettled([
          productsService.getProducts(),
          productCategoriesService.getCategories()
        ]);

        // Handle products result
        if (productsResult.status === 'fulfilled') {
          setProducts(productsResult.value);
        } else {
          console.error('Error loading products:', productsResult.reason);
          throw new Error('Không thể tải danh sách sản phẩm');
        }

        // Handle categories result (optional, won't break if fails)
        if (categoriesResult.status === 'fulfilled') {
          setCategories(categoriesResult.value);
        } else {
          console.warn('Warning loading categories:', categoriesResult.reason);
          // Set default categories if API fails
          setCategories([
            { id: 'industrial', title: 'Công nghiệp', description: '', slug: 'industrial', showInMenu: true, orderNumber: 1 },
            { id: 'commercial', title: 'Thương mại', description: '', slug: 'commercial', showInMenu: true, orderNumber: 2 },
            { id: 'residential', title: 'Dân dụng', description: '', slug: 'residential', showInMenu: true, orderNumber: 3 },
            { id: 'cold-storage', title: 'Kho lạnh', description: '', slug: 'cold-storage', showInMenu: true, orderNumber: 4 },
            { id: 'auxiliary', title: 'Phụ trợ', description: '', slug: 'auxiliary', showInMenu: true, orderNumber: 5 },
          ]);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filter products by category
  const filteredProducts = activeCategory === "all" 
    ? products 
    : products.filter(product => product.category === activeCategory);
  // Retry loading data
  const retryLoadData = async () => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        toast.info("Đang tải lại dữ liệu...");
        
        // Load products and categories in parallel
        const [productsResult, categoriesResult] = await Promise.allSettled([
          productsService.getProducts(),
          productCategoriesService.getCategories()
        ]);

        // Handle products result
        if (productsResult.status === 'fulfilled') {
          setProducts(productsResult.value);
          toast.success("Đã tải lại sản phẩm thành công!");
        } else {
          console.error('Error loading products:', productsResult.reason);
          throw new Error('Không thể tải danh sách sản phẩm');
        }

        // Handle categories result (optional, won't break if fails)
        if (categoriesResult.status === 'fulfilled') {
          setCategories(categoriesResult.value);
        } else {
          console.warn('Warning loading categories:', categoriesResult.reason);
        }
      } catch (err) {
        console.error('Error loading data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Không thể tải dữ liệu';
        setError(errorMessage);
        toast.error(`Lỗi: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    await loadData();
  };
  return (
    <main className="flex-grow">
      {/* Banner */}
      <div className="bg-gradient-to-b from-primary/10 to-transparent py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary">Sản Phẩm</h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl">
            VRC cung cấp các giải pháp và thiết bị kỹ thuật lạnh đa dạng, từ hệ thống điều hòa không khí, kho lạnh đến các giải pháp làm lạnh công nghiệp tiên tiến
          </p>
        </div>
      </div>

      {/* Nội dung chính */}
      <div className="container mx-auto py-12 px-4">
        {/* Error State */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {error}
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-4"
                onClick={retryLoadData}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Thử lại
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-lg text-muted-foreground">Đang tải sản phẩm...</span>
          </div>
        )}        {/* Products Content */}
        {!loading && (
          <Tabs defaultValue="all" className="mb-10">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 mb-8">
              <TabsTrigger value="all" onClick={() => setActiveCategory("all")}>Tất cả</TabsTrigger>
              {categories.map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.slug} 
                  onClick={() => setActiveCategory(category.slug)}
                >
                  {category.title}
                </TabsTrigger>
              ))}
            </TabsList>            
            <TabsContent value="all" className="mt-6">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-lg text-muted-foreground">
                    {products.length === 0 ? 'Chưa có sản phẩm nào.' : 'Không có sản phẩm nào trong danh mục này.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProducts.map((product) => (
                    <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
                      <div className="h-60 w-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                        <img 
                          src={product.imageUrl} 
                          alt={product.name} 
                          className="w-full h-full object-cover transition-transform hover:scale-105"
                          onError={(e) => {
                            // Fallback image if API image fails to load
                            (e.target as HTMLImageElement).src = "/assets/images/projects-overview.jpg";
                          }}
                        />
                        {product.isNew && (
                          <Badge className="absolute top-3 right-3 bg-green-600">Mới</Badge>
                        )}
                        {product.isBestseller && (
                          <Badge className="absolute top-3 left-3 bg-amber-600">Bán chạy</Badge>
                        )}
                      </div>
                      <CardHeader>
                        <div className="flex justify-between items-start">
                          <CardTitle className="text-xl">{product.name}</CardTitle>
                          {product.price && (
                            <div className="text-primary font-semibold">{product.price}</div>
                          )}
                        </div>
                        <CardDescription>{product.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-medium mb-2">Tính năng nổi bật:</h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                          {product.features.map((feature, index) => (
                            <li key={index}>{feature}</li>
                          ))}
                        </ul>
                      </CardContent>
                      <CardFooter className="flex justify-between">
                        <Button variant="outline" onClick={() => setSelectedProduct(product)}>
                          Thông số kỹ thuật
                        </Button>
                        <Button>
                          <AppLink routeKey="CONTACT" query={{ product: product.id.toString() }}>
                            Yêu cầu báo giá
                          </AppLink>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
            
            {/* Tab content for each category */}
            {categories.map((category) => (
              <TabsContent key={category.id} value={category.slug} className="mt-6">
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-lg text-muted-foreground">
                      Không có sản phẩm nào trong danh mục này.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProducts.map((product) => (
                      <Card key={product.id} className="overflow-hidden transition-all hover:shadow-lg">
                        <div className="h-60 w-full bg-gray-100 flex items-center justify-center relative overflow-hidden">
                          <img 
                            src={product.imageUrl} 
                            alt={product.name} 
                            className="w-full h-full object-cover transition-transform hover:scale-105"
                            onError={(e) => {
                              // Fallback image if API image fails to load
                              (e.target as HTMLImageElement).src = "/assets/images/projects-overview.jpg";
                            }}
                          />
                          {product.isNew && (
                            <Badge className="absolute top-3 right-3 bg-green-600">Mới</Badge>
                          )}
                          {product.isBestseller && (
                            <Badge className="absolute top-3 left-3 bg-amber-600">Bán chạy</Badge>
                          )}
                        </div>
                        <CardHeader>
                          <div className="flex justify-between items-start">
                            <CardTitle className="text-xl">{product.name}</CardTitle>
                            {product.price && (
                              <div className="text-primary font-semibold">{product.price}</div>
                            )}
                          </div>
                          <CardDescription>{product.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <h4 className="font-medium mb-2">Tính năng nổi bật:</h4>
                          <ul className="list-disc pl-5 space-y-1 text-sm">
                            {product.features.map((feature, index) => (
                              <li key={index}>{feature}</li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                          <Button variant="outline" onClick={() => setSelectedProduct(product)}>
                            Thông số kỹ thuật
                          </Button>
                          <Button>
                            <AppLink routeKey="CONTACT" query={{ product: product.id.toString() }}>
                              Yêu cầu báo giá
                            </AppLink>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Thông số kỹ thuật */}
        {selectedProduct && selectedProduct.specifications && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[80vh] overflow-auto">
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-primary">{selectedProduct.name}</h3>
                  <Button variant="ghost" size="sm" onClick={() => setSelectedProduct(null)}>
                    Đóng
                  </Button>
                </div>
                <h4 className="font-medium mb-4 text-lg">Thông số kỹ thuật</h4>
                <div className="overflow-hidden rounded border border-gray-200">
                  <table className="min-w-full divide-y divide-gray-200">
                    <tbody className="divide-y divide-gray-200">
                      {Object.entries(selectedProduct.specifications).map(([key, value], index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                          <td className="px-6 py-3 text-sm font-medium">{key}</td>
                          <td className="px-6 py-3 text-sm">{String(value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex justify-end mt-6">
                  <Button onClick={() => setSelectedProduct(null)}>
                    Đóng
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Đăng ký tư vấn */}
        <section className="mt-16 bg-gradient-to-r from-primary/10 to-transparent p-8 rounded-lg">
          <h2 className="text-3xl font-bold mb-6 text-primary">Yêu cầu tư vấn sản phẩm</h2>
          <p className="mb-6 text-muted-foreground">
            Bạn cần tư vấn về giải pháp kỹ thuật lạnh phù hợp cho công trình hay doanh nghiệp của mình? 
            Đội ngũ kỹ sư và chuyên gia của VRC sẵn sàng hỗ trợ bạn lựa chọn giải pháp tối ưu.
          </p>          <Button size="lg" variant="default">
            <AppLink routeKey="CONTACT">
              Liên hệ tư vấn
            </AppLink>
          </Button>
        </section>        {/* Câu hỏi thường gặp */}
        <section className="mt-16">
          <FAQ 
            category="products"
            title="Câu hỏi thường gặp về sản phẩm"
            maxItems={6}
            className="max-w-4xl mx-auto"
          />
        </section>
      </div>
    </main>
  );
};

export default Products;