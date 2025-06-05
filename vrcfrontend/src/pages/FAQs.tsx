/**
 * FAQs Page
 * Comprehensive page displaying all frequently asked questions organized by categories
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, HelpCircle, Users, Settings, Wrench, Package, Building, ArrowRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import FAQ from "@/components/FAQ";
import AppLink from "@/components/ui/app-link";
import { ROUTES } from "@/lib/routes";

/**
 * FAQ Category definitions with icons and descriptions
 */
const FAQ_CATEGORIES = [
  {
    key: 'all',
    label: 'Tất cả',
    icon: HelpCircle,
    description: 'Xem tất cả câu hỏi thường gặp',
    color: 'bg-blue-500',
  },
  {
    key: 'products',
    label: 'Sản phẩm',
    icon: Package,
    description: 'Câu hỏi về các sản phẩm điều hòa, thiết bị',
    color: 'bg-green-500',
  },
  {
    key: 'services',
    label: 'Dịch vụ',
    icon: Wrench,
    description: 'Câu hỏi về dịch vụ lắp đặt, bảo trì, sửa chữa',
    color: 'bg-orange-500',
  },
  {
    key: 'general',
    label: 'Chung',
    icon: Users,
    description: 'Câu hỏi về công ty, chính sách, thông tin chung',
    color: 'bg-purple-500',
  },
  {
    key: 'technical',
    label: 'Kỹ thuật',
    icon: Settings,
    description: 'Câu hỏi về thông số kỹ thuật, vận hành',
    color: 'bg-red-500',
  },
  {
    key: 'projects',
    label: 'Dự án',
    icon: Building,
    description: 'Câu hỏi về các dự án, thi công',
    color: 'bg-indigo-500',
  },
] as const;

/**
 * Statistics section component
 */
const FAQStats: React.FC = () => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tổng số FAQ</CardTitle>
        <HelpCircle className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">150+</div>
        <p className="text-xs text-muted-foreground">
          Câu hỏi được cập nhật thường xuyên
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Danh mục</CardTitle>
        <Filter className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">6</div>
        <p className="text-xs text-muted-foreground">
          Phân loại theo chủ đề
        </p>
      </CardContent>
    </Card>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Tỷ lệ hữu ích</CardTitle>
        <Users className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">98%</div>
        <p className="text-xs text-muted-foreground">
          Khách hàng thấy hữu ích
        </p>
      </CardContent>
    </Card>
  </div>
);

/**
 * Category selector component
 */
const CategorySelector: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ selectedCategory, onCategoryChange }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
    {FAQ_CATEGORIES.map((category) => {
      const Icon = category.icon;
      const isSelected = selectedCategory === category.key;
      
      return (
        <Card
          key={category.key}
          className={`cursor-pointer transition-all duration-200 hover:scale-105 ${
            isSelected 
              ? 'ring-2 ring-primary shadow-md' 
              : 'hover:shadow-lg'
          }`}
          onClick={() => onCategoryChange(category.key)}
        >
          <CardHeader className="pb-3">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${category.color} text-white`}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{category.label}</CardTitle>
                <CardDescription className="text-sm">
                  {category.description}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>
      );
    })}
  </div>
);

/**
 * Search and filter section
 */
const SearchFilter: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}> = ({ searchTerm, onSearchChange, sortBy, onSortChange }) => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <Search className="h-5 w-5" />
        Tìm kiếm và lọc
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Nhập từ khóa để tìm kiếm..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full"
          />
        </div>
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Sắp xếp theo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="order">Thứ tự ưu tiên</SelectItem>
            <SelectItem value="-createdAt">Mới nhất</SelectItem>
            <SelectItem value="createdAt">Cũ nhất</SelectItem>
            <SelectItem value="question">A-Z</SelectItem>
            <SelectItem value="-question">Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </CardContent>
  </Card>
);

/**
 * Quick links section
 */
const QuickLinks: React.FC = () => (
  <Card className="mb-8">
    <CardHeader>
      <CardTitle>Liên kết nhanh</CardTitle>
      <CardDescription>
        Các trang có thể hữu ích cho bạn
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">        <AppLink routeKey="PRODUCTS" className="block">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-green-500" />
              <span className="font-medium">Xem sản phẩm</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </AppLink>
        
        <AppLink routeKey="SERVICES" className="block">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Wrench className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Dịch vụ</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </AppLink>
        
        <AppLink routeKey="PROJECTS" className="block">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Building className="h-5 w-5 text-indigo-500" />
              <span className="font-medium">Dự án</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </AppLink>
        
        <AppLink routeKey="CONTACT" className="block">
          <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-purple-500" />
              <span className="font-medium">Liên hệ</span>
            </div>
            <ArrowRight className="h-4 w-4 text-gray-400" />
          </div>
        </AppLink>
      </div>
    </CardContent>
  </Card>
);

/**
 * Main FAQs Page Component
 */
const FAQsPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('order');

  // Get current category info
  const currentCategory = FAQ_CATEGORIES.find(cat => cat.key === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Câu hỏi thường gặp
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              Tìm câu trả lời cho mọi thắc mắc về sản phẩm và dịch vụ của VRC
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <HelpCircle className="h-5 w-5 mr-2" />
              150+ câu hỏi được giải đáp
            </Badge>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Statistics */}
        <FAQStats />

        {/* Search and Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Category Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Filter className="h-5 w-5" />
                    Danh mục
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {FAQ_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const isSelected = selectedCategory === category.key;
                    
                    return (
                      <Button
                        key={category.key}
                        variant={isSelected ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedCategory(category.key)}
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {category.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              {/* Quick Links */}
              <QuickLinks />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Current Category Header */}
            {currentCategory && (
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg ${currentCategory.color} text-white`}>
                    <currentCategory.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedCategory === 'all' 
                        ? 'Tất cả câu hỏi thường gặp' 
                        : `FAQ ${currentCategory.label}`
                      }
                    </h2>
                    <p className="text-gray-600">{currentCategory.description}</p>
                  </div>
                </div>
              </div>
            )}

            {/* FAQ Content */}
            {selectedCategory === 'all' ? (
              <Tabs defaultValue="products" className="w-full">
                <TabsList className="grid w-full grid-cols-3 lg:grid-cols-5">
                  <TabsTrigger value="products">Sản phẩm</TabsTrigger>
                  <TabsTrigger value="services">Dịch vụ</TabsTrigger>
                  <TabsTrigger value="general">Chung</TabsTrigger>
                  <TabsTrigger value="technical" className="hidden lg:inline-flex">Kỹ thuật</TabsTrigger>
                  <TabsTrigger value="projects" className="hidden lg:inline-flex">Dự án</TabsTrigger>
                </TabsList>
                
                {FAQ_CATEGORIES.slice(1).map((category) => (
                  <TabsContent key={category.key} value={category.key} className="mt-6">
                    <FAQ
                      category={category.key}
                      title={`Câu hỏi về ${category.label}`}
                      className="max-w-none"
                    />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <FAQ
                category={selectedCategory}
                title={`Câu hỏi về ${currentCategory?.label}`}
                className="max-w-none"
              />
            )}
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-16 bg-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">Không tìm thấy câu trả lời?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ với đội ngũ chuyên gia của VRC để được tư vấn chi tiết.
          </p>          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AppLink routeKey="CONTACT">
              <Button size="lg" className="px-8">
                <Users className="h-5 w-5 mr-2" />
                Liên hệ ngay
              </Button>
            </AppLink>
            <AppLink routeKey="CONSULTING">
              <Button size="lg" variant="outline" className="px-8">
                <HelpCircle className="h-5 w-5 mr-2" />
                Tư vấn miễn phí
              </Button>
            </AppLink>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FAQsPage;
