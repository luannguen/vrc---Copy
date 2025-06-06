/**
 * FAQs Page
 * Comprehensive page displaying all frequently asked questions organized by categories
 */

import React, { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, HelpCircle, Users, Settings, Wrench, Package, Building, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
const getFAQCategories = (t: (key: string) => string) => [
  {
    key: 'all',
    label: t('faq.categories.all.label'),
    icon: HelpCircle,
    description: t('faq.categories.all.description'),
    color: 'bg-blue-500',
  },
  {
    key: 'products',
    label: t('faq.categories.products.label'),
    icon: Package,
    description: t('faq.categories.products.description'),
    color: 'bg-green-500',
  },
  {
    key: 'services',
    label: t('faq.categories.services.label'),
    icon: Wrench,
    description: t('faq.categories.services.description'),
    color: 'bg-orange-500',
  },
  {
    key: 'general',
    label: t('faq.categories.general.label'),
    icon: Users,
    description: t('faq.categories.general.description'),
    color: 'bg-purple-500',
  },
  {
    key: 'technical',
    label: t('faq.categories.technical.label'),
    icon: Settings,
    description: t('faq.categories.technical.description'),
    color: 'bg-red-500',
  },
  {
    key: 'projects',
    label: t('faq.categories.projects.label'),
    icon: Building,
    description: t('faq.categories.projects.description'),
    color: 'bg-indigo-500',
  },
] as const;

/**
 * Statistics section component
 */
const FAQStats: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('faq.stats.totalTitle')}</CardTitle>
          <HelpCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">150+</div>
          <p className="text-xs text-muted-foreground">
            {t('faq.stats.totalDescription')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('faq.stats.categoriesTitle')}</CardTitle>
          <Filter className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">6</div>
          <p className="text-xs text-muted-foreground">
            {t('faq.stats.categoriesDescription')}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{t('faq.stats.helpfulTitle')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">98%</div>
          <p className="text-xs text-muted-foreground">
            {t('faq.stats.helpfulDescription')}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Category selector component
 */
const CategorySelector: React.FC<{
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}> = ({ selectedCategory, onCategoryChange }) => {
  const { t } = useTranslation();
  const FAQ_CATEGORIES = getFAQCategories(t);
  
  return (
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
};

/**
 * Search and filter section
 */
const SearchFilter: React.FC<{
  searchTerm: string;
  onSearchChange: (term: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}> = ({ searchTerm, onSearchChange, sortBy, onSortChange }) => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5" />
          {t('faq.search.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <Input
              placeholder={t('faq.search.placeholder')}
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full"
            />
          </div>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder={t('faq.search.sortBy')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="order">{t('faq.search.sortOptions.priority')}</SelectItem>
              <SelectItem value="-createdAt">{t('faq.search.sortOptions.newest')}</SelectItem>
              <SelectItem value="createdAt">{t('faq.search.sortOptions.oldest')}</SelectItem>
              <SelectItem value="question">{t('faq.search.sortOptions.aToZ')}</SelectItem>
              <SelectItem value="-question">{t('faq.search.sortOptions.zToA')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Quick links section
 */
const QuickLinks: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>{t('faq.quickLinks.title')}</CardTitle>
        <CardDescription>
          {t('faq.quickLinks.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">        
          <AppLink routeKey="PRODUCTS" className="block">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Package className="h-5 w-5 text-green-500" />
                <span className="font-medium">{t('faq.quickLinks.products')}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </AppLink>
          
          <AppLink routeKey="SERVICES" className="block">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-orange-500" />
                <span className="font-medium">{t('faq.quickLinks.services')}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </AppLink>
          
          <AppLink routeKey="PROJECTS" className="block">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Building className="h-5 w-5 text-indigo-500" />
                <span className="font-medium">{t('faq.quickLinks.projects')}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </AppLink>
          
          <AppLink routeKey="CONTACT" className="block">
            <div className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-500" />
                <span className="font-medium">{t('faq.quickLinks.contact')}</span>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400" />
            </div>
          </AppLink>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Main FAQs Page Component
 */
const FAQsPage: React.FC = () => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('order');

  // Get FAQ categories with translations
  const FAQ_CATEGORIES = getFAQCategories(t);
  
  // Get current category info
  const currentCategory = FAQ_CATEGORIES.find(cat => cat.key === selectedCategory);

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              {t('faq.hero.title')}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8">
              {t('faq.hero.subtitle')}
            </p>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <HelpCircle className="h-5 w-5 mr-2" />
              {t('faq.hero.badge')}
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
                    {t('faq.sidebar.categoriesTitle')}
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
                        ? t('faq.content.allTitle') 
                        : t('faq.content.categoryTitle', { category: currentCategory.label })
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
                  <TabsTrigger value="products">{t('faq.categories.products.label')}</TabsTrigger>
                  <TabsTrigger value="services">{t('faq.categories.services.label')}</TabsTrigger>
                  <TabsTrigger value="general">{t('faq.categories.general.label')}</TabsTrigger>
                  <TabsTrigger value="technical" className="hidden lg:inline-flex">{t('faq.categories.technical.label')}</TabsTrigger>
                  <TabsTrigger value="projects" className="hidden lg:inline-flex">{t('faq.categories.projects.label')}</TabsTrigger>
                </TabsList>
                
                {FAQ_CATEGORIES.slice(1).map((category) => (
                  <TabsContent key={category.key} value={category.key} className="mt-6">
                    <FAQ
                      category={category.key}
                      title={t('faq.content.questionsAbout', { category: category.label })}
                      className="max-w-none"
                    />
                  </TabsContent>
                ))}
              </Tabs>
            ) : (
              <FAQ
                category={selectedCategory}
                title={t('faq.content.questionsAbout', { category: currentCategory?.label })}
                className="max-w-none"
              />
            )}
          </div>
        </div>

        {/* CTA Section */}
        <section className="mt-16 bg-white rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold mb-4">{t('faq.cta.title')}</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            {t('faq.cta.description')}
          </p>          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AppLink routeKey="CONTACT">
              <Button size="lg" className="px-8">
                <Users className="h-5 w-5 mr-2" />
                {t('faq.cta.contactButton')}
              </Button>
            </AppLink>
            <AppLink routeKey="CONSULTING">
              <Button size="lg" variant="outline" className="px-8">
                <HelpCircle className="h-5 w-5 mr-2" />
                {t('faq.cta.consultingButton')}
              </Button>
            </AppLink>
          </div>
        </section>
      </div>
    </main>
  );
};

export default FAQsPage;
