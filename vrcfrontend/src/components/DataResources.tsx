
import { LineChart, BarChart3, Gauge, ArrowRight, Loader2 } from 'lucide-react';
import { useDataResourcesSection } from '../hooks/useHomepageSettings';

const DataResources = () => {
  const { settings: dataResourcesData, isLoading, error, isEnabled } = useDataResourcesSection();
  // Fallback data if API fails
  const fallbackData = {
    enabled: true,
    leftPanel: {
      title: "Dữ liệu & Thống kê năng lượng",
      linkUrl: "/data/statistics"
    },
    rightPanel: {
      title: "Công cụ tính toán & Thiết kế", 
      linkUrl: "/data/tools"
    }
  };

  // Use API data or fallback
  const sectionData = dataResourcesData || fallbackData;

  if (error) {
    console.warn('DataResources API error, using fallback data:', error);
  }
  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }

  if (isLoading) {
    return (
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }  return (
    <section className="py-16 bg-white">
      <div className="container-custom">
        <div className="mb-12">
          <h2 className="mb-4">Công cụ & Tài nguyên</h2>
          <p className="text-muted-foreground max-w-2xl">
            Truy cập các công cụ tính toán, dữ liệu phân tích và tài nguyên hỗ trợ cho việc lựa chọn và vận hành hệ thống điều hòa không khí hiệu quả.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Panel - Data & Statistics */}
          <div className="bg-muted p-8 rounded-lg">
            <div className="flex items-start mb-6">
              <div className="bg-primary rounded-full p-3 mr-4">
                <LineChart className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{sectionData?.leftPanel?.title || "Dữ liệu & Thống kê năng lượng"}</h3>
                <p className="text-muted-foreground">
                  Truy cập dữ liệu phân tích và thống kê về hiệu suất năng lượng của các hệ thống điều hòa không khí, 
                  chi phí vận hành và tác động môi trường của các công nghệ khác nhau.
                </p>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>Chỉ số hiệu suất năng lượng (EER/COP)</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>Chi phí vận hành và bảo trì</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>Phân tích ROI và thời gian hoàn vốn</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>Dữ liệu phát thải carbon và tác động môi trường</span>
              </li>
            </ul>
            <a 
              href={sectionData?.leftPanel?.linkUrl || "/data/statistics"}
              className="inline-flex items-center text-accent hover:text-primary transition-colors font-medium"
            >
              Xem thống kê
              <ArrowRight size={18} className="ml-2" />
            </a>
          </div>
          
          {/* Right Panel - Tools & Design */}
          <div className="bg-muted p-8 rounded-lg">
            <div className="flex items-start mb-6">
              <div className="bg-primary rounded-full p-3 mr-4">
                <Gauge className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">{sectionData?.rightPanel?.title || "Công cụ tính toán & Thiết kế"}</h3>
                <p className="text-muted-foreground">
                  Sử dụng các công cụ tính toán và thiết kế để lựa chọn hệ thống điều hòa không khí phù hợp, 
                  tối ưu hóa hiệu suất và ước tính chi phí vận hành dài hạn.
                </p>
              </div>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>Tính toán tải lạnh cho không gian</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>So sánh hiệu suất và chi phí giữa các hệ thống</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>Phân tích tiết kiệm năng lượng và giảm chi phí</span>
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-primary rounded-full mr-3"></span>
                <span>Tư vấn lựa chọn giải pháp phù hợp</span>
              </li>
            </ul>
            <a 
              href={sectionData?.rightPanel?.linkUrl || "/data/tools"}
              className="inline-flex items-center text-accent hover:text-primary transition-colors font-medium"
            >
              Khám phá công cụ
              <ArrowRight size={18} className="ml-2" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DataResources;
