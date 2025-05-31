import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";
import { useContactFormSection } from "../hooks/useHomepageSettings";

const ContactForm = () => {
  const { settings: contactFormData, isLoading, error, isEnabled } = useContactFormSection();
  
  // Fallback data if API fails
  const fallbackData = {
    enabled: true,
    sectionTitle: "Liên hệ với chúng tôi",
    sectionSubtitle: "Hãy để lại thông tin liên hệ, chúng tôi sẽ sớm phản hồi tới quý khách hàng.",
    successMessage: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!",
    enableNotifications: true
  };

  // Use API data or fallback
  const sectionData = contactFormData || fallbackData;

  if (error) {
    console.warn('ContactForm API error, using fallback data:', error);
  }

  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  if (isLoading) {
    return (
      <section className="bg-gray-100 py-16">
        <div className="container-custom">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        </div>
      </section>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, subject: value }));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "general",
          message: "",
        });
      } else {
        setSubmitStatus("error");
        console.error("Error submitting form:", result.message);
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="bg-gray-100 py-16">
      <div className="container-custom">        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-primary mb-2">{sectionData?.sectionTitle || "Liên hệ với chúng tôi"}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {sectionData?.sectionSubtitle || "Hãy để lại thông tin liên hệ, chúng tôi sẽ sớm phản hồi tới quý khách hàng."}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">          {submitStatus === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
              {sectionData?.successMessage || "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi trong thời gian sớm nhất!"}
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              Đã có lỗi xảy ra. Vui lòng thử lại sau!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên *
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên của bạn"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@domain.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Số điện thoại
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  Chủ đề
                </label>
                <Select value={formData.subject} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn chủ đề" />
                  </SelectTrigger>                  <SelectContent>
                    <SelectItem value="general">Tư vấn chung</SelectItem>
                    <SelectItem value="repair">Dịch vụ sửa chữa</SelectItem>
                    <SelectItem value="maintenance">Bảo trì thiết bị</SelectItem>
                    <SelectItem value="installation">Lắp đặt</SelectItem>
                    <SelectItem value="consulting">Tư vấn kỹ thuật</SelectItem>
                    <SelectItem value="inverter-technology">Công nghệ Inverter</SelectItem>
                    <SelectItem value="heat-recovery">Giải pháp thu hồi nhiệt</SelectItem>
                    <SelectItem value="energy-efficiency">Hiệu quả năng lượng</SelectItem>
                    <SelectItem value="other">Khác</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung *
              </label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="Nhập nội dung liên hệ"
                className="resize-none"
              />
            </div>

            <div className="text-center">
              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-2"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi liên hệ"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;