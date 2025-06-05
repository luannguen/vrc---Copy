import { useState, useEffect } from 'react';
import { ArrowUpRight, CheckCircle, Cpu, Database, Server, BarChart, Microscope } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getTechnologySectionsByType, extractTextFromLexicalContent } from '@/services/technologySectionsService';
import { getTechnologies, extractTextFromLexicalContent as extractTechText } from '@/services/technologiesService';
import { TechnologySectionsByType } from '@/types/technology-sections';
import { Technology } from '@/services/technologiesService';

// ChipIcon component for lucide-react compatibility
function ChipIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 7h6v10H9z" />
      <path d="M5 3v4" />
      <path d="M9 3v4" />
      <path d="M15 3v4" />
      <path d="M19 3v4" />
      <path d="M5 21v-4" />
      <path d="M9 21v-4" />
      <path d="M15 21v-4" />
      <path d="M19 21v-4" />
      <path d="M3 9h4" />
      <path d="M17 9h4" />
      <path d="M3 15h4" />
      <path d="M17 15h4" />
    </svg>
  );
}

// Icon mapping for technology cards
const getIconForTechnology = (category: string) => {
  const iconMap: Record<string, JSX.Element> = {
    'industrial': <Server className="text-primary" />,
    'commercial': <Cpu className="text-primary" />,
    'food': <ChipIcon className="text-primary" />,
    'energy': <BarChart className="text-primary" />,
    'smart': <Database className="text-primary" />,
    'green': <Microscope className="text-primary" />,
  };
  
  // Default icon if category not found
  return iconMap[category] || <Server className="text-primary" />;
};

const Technologies = () => {  const [sections, setSections] = useState<TechnologySectionsByType>({});
  const [technologies, setTechnologies] = useState<Technology[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch both sections and technologies data
        const [sectionsData, technologiesData] = await Promise.all([
          getTechnologySectionsByType(),
          getTechnologies()
        ]);        setSections(sectionsData);
        setTechnologies(technologiesData.technologies || []);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Không thể tải dữ liệu. Đang hiển thị nội dung mẫu.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fallback data if API fails
  const fallbackTechnologies = [
    {
      id: '1',
      name: "Hệ thống làm lạnh công nghiệp",
      description: "Công nghệ làm lạnh tiên tiến cho nhà máy và cơ sở công nghiệp",
      category: 'industrial',
      features: [
        "Hệ thống làm lạnh công nghiệp quy mô lớn",
        "Điều khiển nhiệt độ chính xác đến 0.1°C",
        "Tiết kiệm năng lượng lên đến 30%",
        "Khả năng giám sát từ xa qua internet"
      ],
      slug: "industrial-cooling",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    // Add more fallback data as needed
  ];

  const fallbackEquipmentCategories = [
    {
      title: "Thiết bị làm lạnh công nghiệp",
      items: ["Hệ thống làm lạnh nước", "Tháp giải nhiệt", "Máy làm lạnh Chiller", "Bộ trao đổi nhiệt"]
    },
    {
      title: "Thiết bị điều hòa không khí",
      items: ["Hệ thống VRF/VRV", "Điều hòa trung tâm", "AHU và FCU", "Điều hòa không khí chính xác"]
    },
    {
      title: "Thiết bị lạnh thương mại",
      items: ["Tủ đông công nghiệp", "Tủ mát siêu thị", "Kho lạnh", "Quầy trưng bày lạnh"]
    },
    {
      title: "Thiết bị phụ trợ",
      items: ["Hệ thống ống đồng", "Van điều khiển", "Cảm biến nhiệt độ", "Thiết bị kiểm soát độ ẩm"]
    }
  ];

  // Get section data with fallbacks
  const heroSection = sections.hero;
  const overviewSection = sections.overview;
  const equipmentSection = sections['equipment-categories'];
  const partnersSection = sections.partners;
  const ctaSection = sections.cta;

  if (loading) {
    return (
      <main className="flex-grow">
        <div className="container-custom py-20 text-center">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-96 mx-auto"></div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow">
      {/* Hero Section */}
      <section className={`py-16 text-white ${heroSection?.backgroundColor === 'primary' ? 'bg-primary/90' : 'bg-primary/90'}`}>
        <div className="container-custom">
          <div className="max-w-3xl">
            <h1 className="text-white mb-6">
              {heroSection?.title || 'Công nghệ & Thiết bị'}
            </h1>
            <p className="text-xl md:text-2xl mb-8">
              {heroSection?.subtitle || 'Ứng dụng công nghệ hiện đại và các thiết bị tiên tiến nhất trong lĩnh vực kỹ thuật lạnh và điều hòa không khí.'}
            </p>
            {heroSection?.content && (
              <p className="text-lg mb-8 opacity-90">
                {extractTextFromLexicalContent(heroSection.content)}
              </p>
            )}
            <div className="flex flex-wrap gap-4">
              {heroSection?.ctaButtons?.map((button) => (
                <Button key={button.id} asChild variant={button.variant === 'outline' ? 'outline' : 'secondary'}>
                  <Link to={button.link}>
                    {button.text}
                  </Link>
                </Button>
              )) || (
                <Button asChild variant="secondary">
                  <Link to="/contact">
                    Tư vấn giải pháp công nghệ
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Technology Overview */}
      <section className={`py-12 ${overviewSection?.backgroundColor === 'white' ? 'bg-white' : 'bg-white'}`}>
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="mb-6">
                {overviewSection?.title || 'Công nghệ tiên tiến'}
              </h2>
              <p className="text-muted-foreground mb-6">
                {overviewSection?.subtitle || 'VRC luôn đi đầu trong việc ứng dụng các công nghệ tiên tiến nhất trong lĩnh vực kỹ thuật lạnh và điều hòa không khí.'}
              </p>
              {overviewSection?.content && (
                <p className="text-muted-foreground mb-6">
                  {extractTextFromLexicalContent(overviewSection.content)}
                </p>
              )}
              <ul className="space-y-3">
                {overviewSection?.features?.map((feature) => (
                  <li key={feature.id} className="flex items-start">
                    <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                    <div>
                      <span className="font-medium">{feature.title}</span>
                      {feature.description && (
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                      )}
                    </div>
                  </li>
                )) || (
                  // Fallback features
                  <>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                      <span>Công nghệ tiết kiệm năng lượng đạt chuẩn quốc tế</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                      <span>Tích hợp IoT và hệ thống quản lý thông minh</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                      <span>Giải pháp thân thiện với môi trường, giảm phát thải carbon</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle size={20} className="text-primary mr-3 mt-1" />
                      <span>Hệ thống giám sát và điều khiển từ xa hiện đại</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
            <div>
              <img 
                src="/lovable-uploads/0bd3c048-8e37-4775-a6bc-0b54ec07edbe.png"
                alt="Công nghệ kỹ thuật lạnh tiên tiến" 
                className="rounded-lg shadow-lg"
                onError={(e) => {
                  e.currentTarget.src = "/placeholder.svg";
                  e.currentTarget.alt = "Placeholder image";
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Technologies Section */}
      <section className="py-12 bg-muted">
        <div className="container-custom">
          <div className="text-center mb-10">
            <h2 className="mb-4">Công nghệ hiện đại</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Khám phá các công nghệ tiên tiến được VRC áp dụng trong các giải pháp kỹ thuật lạnh và điều hòa không khí.
            </p>
          </div>          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(technologies.length > 0 
              ? technologies.filter(tech => tech.type === 'technology') 
              : fallbackTechnologies
            ).map((tech) => (
              <Card key={tech.id} className="transition-all hover:shadow-md">
                <CardHeader>
                  <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                    {getIconForTechnology(tech.category || tech.type || '')}
                  </div>
                  <CardTitle>{tech.name}</CardTitle>
                  <CardDescription>
                    {tech.description && typeof tech.description === 'object' 
                      ? extractTechText(tech.description) 
                      : tech.description || 'Công nghệ tiên tiến'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {tech.logo && (
                    <div className="mb-4">
                      <img 
                        src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${tech.logo.url}`}
                        alt={tech.logo.alt || tech.name}
                        className="h-16 w-auto object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                  {(tech as Technology & { features?: string[] }).features ? (
                    <ul className="space-y-2">
                      {(tech as Technology & { features?: string[] }).features?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <CheckCircle size={16} className="text-primary mr-2 mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      {tech.type === 'partner' && '🤝 Đối tác chiến lược'}
                      {tech.type === 'supplier' && '🏭 Nhà cung cấp uy tín'}
                      {tech.type === 'technology' && '⚡ Công nghệ tiên tiến'}
                      {tech.website && (
                        <div className="mt-2">
                          <a 
                            href={tech.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline"
                          >
                            Tìm hiểu thêm
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
                <CardFooter>
                  <Link 
                    to={`/technologies/${tech.slug || tech.id}`} 
                    className="text-primary hover:text-accent flex items-center"
                  >
                    Chi tiết
                    <ArrowUpRight size={16} className="ml-1" />
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>      {/* Suppliers Section */}
      {technologies.filter(tech => tech.type === 'supplier').length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="mb-4">Đối tác & Nhà cung cấp</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi hợp tác với các nhà cung cấp hàng đầu thế giới để mang đến những giải pháp chất lượng nhất.
              </p>
            </div>            <div className="flex justify-center">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl">
                {technologies
                  .filter(tech => tech.type === 'supplier')
                  .map((tech) => (
                  <Card key={tech.id} className="transition-all hover:shadow-md text-center">
                    <CardHeader>                      {tech.logo && (
                        <div className="mb-4 flex justify-center">
                          <Link to={`/technologies/${tech.slug || tech.id}`}>
                            <img 
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${tech.logo.url}`}
                              alt={tech.logo.alt || tech.name}
                              className="h-24 w-auto object-contain cursor-pointer hover:opacity-80 transition-opacity"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </Link>
                        </div>
                      )}
                      <CardTitle className="text-lg">{tech.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="justify-center">
                      <Link 
                        to={`/technologies/${tech.slug || tech.id}`} 
                        className="text-primary hover:text-accent flex items-center text-sm"
                      >
                        Chi tiết                        <ArrowUpRight size={14} className="ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Equipment Categories */}
      <section className={`py-12 ${equipmentSection?.backgroundColor === 'white' ? 'bg-white' : 'bg-white'}`}>
        <div className="container-custom">
          <h2 className="mb-10 text-center">
            {equipmentSection?.title || 'Danh mục thiết bị'}
          </h2>
          {equipmentSection?.subtitle && (
            <p className="text-center text-muted-foreground mb-10 max-w-2xl mx-auto">
              {equipmentSection.subtitle}
            </p>
          )}
            <div className="grid md:grid-cols-2 gap-8">
            {(equipmentSection?.equipmentItems && equipmentSection.equipmentItems.length > 0 
              ? equipmentSection.equipmentItems 
              : fallbackEquipmentCategories
            ).map((category, index) => (
              <div key={category.id || index} className="rounded-lg border border-muted p-6">
                <h3 className="text-xl font-semibold mb-4 text-primary">
                  {category.category || category.title}
                </h3>
                <ul className="space-y-3">
                  {category.items.map((item, idx) => (
                    <li key={item.id || idx} className="flex items-start">
                      <CheckCircle size={16} className="text-primary mr-3 mt-1" />
                      <span>{item.name || item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>      {/* Technology Partners Section */}
      {technologies.filter(tech => tech.type === 'partner').length > 0 && (
        <section className="py-12 bg-muted/50">
          <div className="container-custom">
            <div className="text-center mb-10">
              <h2 className="mb-4">Đối tác công nghệ</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Chúng tôi hợp tác với các đối tác công nghệ hàng đầu để mang đến giải pháp tối ưu.
              </p>
            </div>            <div className="flex justify-center">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-6xl">
                {technologies
                  .filter(tech => tech.type === 'partner')
                  .map((partner) => (
                  <Card key={partner.id} className="transition-all hover:shadow-md text-center">
                    <CardHeader className="pb-2">                      {partner.logo?.url ? (
                        <Link to={`/technologies/${partner.slug || partner.id}`} className="block">
                          <div className="flex justify-center items-center h-24 mb-3 cursor-pointer hover:opacity-80 transition-opacity">
                            <img 
                              src={`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}${partner.logo.url}`}
                              alt={partner.logo.alt || partner.name}
                              className="max-w-full max-h-full object-contain"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                        </Link>
                      ) : (
                        <div className="flex justify-center items-center h-24 mb-3">
                          <div className="text-center">
                            <div className="font-medium text-sm">{partner.name}</div>
                          </div>
                        </div>
                      )}
                      <CardTitle className="text-sm">{partner.name}</CardTitle>
                    </CardHeader>
                    <CardFooter className="justify-center pt-0">
                      <Link 
                        to={`/technologies/${partner.slug || partner.id}`} 
                        className="text-primary hover:text-accent flex items-center text-xs"
                      >
                        Chi tiết                        <ArrowUpRight size={12} className="ml-1" />
                      </Link>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className={`py-12 ${ctaSection?.backgroundColor === 'accent' ? 'bg-accent/10' : 'bg-accent/10'}`}>
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="mb-6">
              {ctaSection?.title || 'Tìm hiểu giải pháp công nghệ phù hợp'}
            </h2>
            <p className="text-muted-foreground mb-8">
              {ctaSection?.subtitle || 'Hãy liên hệ với chúng tôi ngay hôm nay để được tư vấn về các giải pháp công nghệ và thiết bị phù hợp với nhu cầu của doanh nghiệp bạn.'}
            </p>
            {ctaSection?.content && (
              <p className="text-muted-foreground mb-8">
                {extractTextFromLexicalContent(ctaSection.content)}
              </p>
            )}
            <div className="flex flex-wrap gap-4 justify-center">
              {ctaSection?.ctaButtons?.map((button) => (
                <Button 
                  key={button.id} 
                  asChild 
                  variant={button.variant === 'outline' ? 'outline' : 'default'}
                >
                  <Link to={button.link}>{button.text}</Link>
                </Button>
              )) || (
                // Fallback buttons
                <>
                  <Button asChild>
                    <Link to="/contact">Liên hệ tư vấn</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link to="/projects">Xem dự án thực tế</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
    </main>
  );
};

export default Technologies;
