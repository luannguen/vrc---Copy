import { useState } from "react";
import { useTranslation } from 'react-i18next';
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Loader2 } from "lucide-react";
import { useContactFormSection } from "../hooks/useHomepageSettings";
import { apiService } from "../lib/api";

const ContactForm = () => {
  const { t } = useTranslation();
  
  // Hook automatically uses current locale for localized form labels, messages, and settings
  const { settings: contactFormData, isLoading, error, isEnabled } = useContactFormSection();
  
  // Initialize state first (hooks must be called in the same order)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "general",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");
  
  // Fallback data if API fails - use translation keys
  const fallbackData = {
    enabled: true,
    sectionTitle: t('contactForm.sectionTitle'),
    sectionSubtitle: t('contactForm.sectionSubtitle'),
    successMessage: t('contactForm.successMessage'),
    enableNotifications: true
  };

  // Use API data (localized) or fallback
  const sectionData = contactFormData || fallbackData;

  if (error) {
    console.warn('ContactForm API error, using fallback data:', error);
  }

  // Don't render if disabled
  if (!isEnabled) {
    return null;
  }
  if (isLoading) {
    return (
      <section className="bg-gray-100 py-16">
        <div className="container-custom">
          <div className="flex justify-center items-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t('contactForm.loading')}</span>
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
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await apiService.post('/contact-form', formData) as { success: boolean; message?: string };

      if (result.success) {
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
          <h2 className="text-3xl font-bold text-primary mb-2">{sectionData?.sectionTitle || t('contactForm.sectionTitle')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {sectionData?.sectionSubtitle || t('contactForm.sectionSubtitle')}
          </p>
        </div>

        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">          {submitStatus === "success" && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-md p-4 mb-6">
              {sectionData?.successMessage || t('contactForm.successMessage')}
            </div>
          )}

          {submitStatus === "error" && (
            <div className="bg-red-50 border border-red-200 text-red-800 rounded-md p-4 mb-6">
              {t('contactForm.errorMessage')}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contactForm.form.name.label')}
                </label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder={t('contactForm.form.name.placeholder')}
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contactForm.form.email.label')}
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder={t('contactForm.form.email.placeholder')}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contactForm.form.phone.label')}
                </label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder={t('contactForm.form.phone.placeholder')}
                />
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('contactForm.form.subject.label')}
                </label>
                <Select value={formData.subject} onValueChange={handleSelectChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('contactForm.form.subject.placeholder')} />
                  </SelectTrigger>                  <SelectContent>
                    <SelectItem value="general">{t('contactForm.form.subject.options.general')}</SelectItem>
                    <SelectItem value="repair">{t('contactForm.form.subject.options.repair')}</SelectItem>
                    <SelectItem value="maintenance">{t('contactForm.form.subject.options.maintenance')}</SelectItem>
                    <SelectItem value="installation">{t('contactForm.form.subject.options.installation')}</SelectItem>
                    <SelectItem value="consulting">{t('contactForm.form.subject.options.consulting')}</SelectItem>
                    <SelectItem value="inverter-technology">{t('contactForm.form.subject.options.inverterTechnology')}</SelectItem>
                    <SelectItem value="heat-recovery">{t('contactForm.form.subject.options.heatRecovery')}</SelectItem>
                    <SelectItem value="energy-efficiency">{t('contactForm.form.subject.options.energyEfficiency')}</SelectItem>
                    <SelectItem value="other">{t('contactForm.form.subject.options.other')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                {t('contactForm.form.message.label')}
              </label>
              <Textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
                placeholder={t('contactForm.form.message.placeholder')}
                className="resize-none"
              />
            </div>

            <div className="text-center">              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="px-8 py-2"
              >
                {isSubmitting ? t('contactForm.submitting') : t('contactForm.submitButton')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;