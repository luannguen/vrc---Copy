import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { EventRegistrationService, type EventRegistrationData } from "@/services/eventRegistrationApi";

interface EventRegistrationFormProps {
  eventId: string;
  eventTitle: string;
  onSuccess?: () => void;
}

interface RegistrationFormData {
  fullName: string;
  email: string;
  phone: string;
  organization: string;
  jobTitle: string;
  participationType: string;
  dietaryRequirements: string;
  dietaryNote: string;
  accessibilityNeeds: string;
  marketingConsent: boolean;
  privacyConsent: boolean;
}

const EventRegistrationForm: React.FC<EventRegistrationFormProps> = ({
  eventId,
  eventTitle,
  onSuccess
}) => {  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDuplicateRegistration, setIsDuplicateRegistration] = useState(false);
  
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: '',
    email: '',
    phone: '',
    organization: '',
    jobTitle: '',
    participationType: 'in-person',
    dietaryRequirements: 'none',
    dietaryNote: '',
    accessibilityNeeds: '',
    marketingConsent: false,
    privacyConsent: false,
  });

  const handleInputChange = (field: keyof RegistrationFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    const requiredFields = ['fullName', 'email', 'phone'];
    for (const field of requiredFields) {
      if (!formData[field as keyof RegistrationFormData]) {
        toast({
          title: "Lỗi",
          description: "Vui lòng điền đầy đủ thông tin bắt buộc",
          variant: "destructive",
        });
        return false;
      }
    }

    if (!formData.privacyConsent) {
      toast({
        title: "Lỗi",
        description: "Vui lòng đồng ý với chính sách bảo mật",
        variant: "destructive",
      });
      return false;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Lỗi",
        description: "Email không hợp lệ",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const registrationData: EventRegistrationData = {
        ...formData,
        eventId,
        eventTitle,
      };

      const result = await EventRegistrationService.createRegistration(registrationData);

      setIsSubmitted(true);
      toast({
        title: "Đăng ký thành công!",
        description: result.message || "Chúng tôi đã gửi email xác nhận đến địa chỉ của bạn.",
      });
      onSuccess?.();    } catch (error: any) {
      console.error('Registration error:', error);
      console.log('Error message:', error.message);
      console.log('Checking if message includes "đã đăng ký":', error.message && error.message.includes('đã đăng ký'));
      
      // Handle duplicate registration specifically
      if (error.message && error.message.includes('đã đăng ký')) {
        console.log('Setting isDuplicateRegistration to true');
        setIsDuplicateRegistration(true);
        toast({
          title: "Bạn đã đăng ký sự kiện này",
          description: error.message || "Bạn đã đăng ký tham gia sự kiện này trước đó. Vui lòng kiểm tra email để xem thông tin xác nhận.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Lỗi đăng ký",
          description: error.message || "Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  if (isDuplicateRegistration) {
    console.log('Rendering duplicate registration UI');
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-orange-700 mb-2">
            Bạn đã đăng ký sự kiện này
          </h3>
          <p className="text-gray-600 mb-4">
            Bạn đã đăng ký tham gia sự kiện <strong>{eventTitle}</strong> trước đó.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Vui lòng kiểm tra hộp thư email để xem thông tin xác nhận đăng ký. 
            Nếu bạn không tìm thấy email, hãy kiểm tra thư mục spam hoặc liên hệ với chúng tôi.
          </p>
          <div className="space-y-3">
            <Button            
              onClick={() => {
                setIsDuplicateRegistration(false);
                setFormData({
                  fullName: '',
                  email: '',
                  phone: '',
                  organization: '',
                  jobTitle: '',
                  participationType: 'in-person',
                  dietaryRequirements: 'none',
                  dietaryNote: '',
                  accessibilityNeeds: '',
                  marketingConsent: false,
                  privacyConsent: false,
                });
              }}
              variant="outline"
              className="w-full"
            >
              Đăng ký cho người khác
            </Button>
            <p className="text-xs text-gray-400">
              Hoặc liên hệ với chúng tôi nếu cần hỗ trợ: support@vrc.com
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isSubmitted) {
    return (
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-green-700 mb-2">
            Đăng ký thành công!
          </h3>
          <p className="text-gray-600 mb-4">
            Cảm ơn bạn đã đăng ký tham gia sự kiện <strong>{eventTitle}</strong>.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Chúng tôi đã gửi email xác nhận đến địa chỉ <strong>{formData.email}</strong>. 
            Vui lòng kiểm tra hộp thư và làm theo hướng dẫn để hoàn tất quá trình đăng ký.
          </p>
          <Button            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                fullName: '',
                email: '',
                phone: '',
                organization: '',
                jobTitle: '',
                participationType: 'in-person',
                dietaryRequirements: 'none',
                dietaryNote: '',
                accessibilityNeeds: '',
                marketingConsent: false,
                privacyConsent: false,
              });
            }}
            variant="outline"
          >
            Đăng ký cho người khác
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserPlus className="w-5 h-5" />
          Đăng ký tham gia sự kiện
        </CardTitle>
        <p className="text-sm text-gray-600">
          Điền thông tin của bạn để đăng ký tham gia: <strong>{eventTitle}</strong>
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Thông tin cá nhân</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Họ và tên *</Label>
                <Input
                  id="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  placeholder="Nhập họ và tên đầy đủ"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="example@email.com"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">Số điện thoại *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="0901234567"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Chức vụ</Label>
                <Input
                  id="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                  placeholder="Kỹ sư, Quản lý, ..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="organization">Tổ chức/Công ty</Label>
              <Input
                id="organization"
                type="text"
                value={formData.organization}
                onChange={(e) => handleInputChange('organization', e.target.value)}
                placeholder="Tên công ty hoặc tổ chức"
              />
            </div>
          </div>

          {/* Participation Type */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Hình thức tham gia</h4>
            <RadioGroup
              value={formData.participationType}
              onValueChange={(value) => handleInputChange('participationType', value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="in-person" id="in-person" />
                <Label htmlFor="in-person">Tham gia trực tiếp</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="online" id="online" />
                <Label htmlFor="online">Tham gia trực tuyến</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hybrid" id="hybrid" />
                <Label htmlFor="hybrid">Theo dõi online và tham gia một số phần trực tiếp</Label>
              </div>
            </RadioGroup>
          </div>          {/* Special Requirements */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Yêu cầu đặc biệt (nếu có)</h4>
            
            <div className="space-y-2">
              <Label htmlFor="dietaryRequirements">Yêu cầu về ăn uống</Label>
              <Select
                value={formData.dietaryRequirements}
                onValueChange={(value) => handleInputChange('dietaryRequirements', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn yêu cầu ăn uống" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không có yêu cầu đặc biệt</SelectItem>
                  <SelectItem value="vegetarian">Chay</SelectItem>
                  <SelectItem value="vegan">Thuần chay (Vegan)</SelectItem>
                  <SelectItem value="gluten-free">Không gluten</SelectItem>
                  <SelectItem value="other">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.dietaryRequirements === 'other' && (
              <div className="space-y-2">
                <Label htmlFor="dietaryNote">Ghi chú về ăn uống</Label>
                <Textarea
                  id="dietaryNote"
                  value={formData.dietaryNote}
                  onChange={(e) => handleInputChange('dietaryNote', e.target.value)}
                  placeholder="Mô tả yêu cầu ăn uống cụ thể..."
                  rows={2}
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="accessibilityNeeds">Hỗ trợ tiếp cận</Label>
              <Textarea
                id="accessibilityNeeds"
                value={formData.accessibilityNeeds}
                onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
                placeholder="Xe lăn, phiên dịch ngôn ngữ ký hiệu, ..."
                rows={2}
              />
            </div>
          </div>

          {/* Consent */}
          <div className="space-y-4">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="marketingConsent"
                checked={formData.marketingConsent}
                onCheckedChange={(checked) => handleInputChange('marketingConsent', !!checked)}
              />
              <Label htmlFor="marketingConsent" className="text-sm leading-relaxed">
                Tôi đồng ý nhận thông tin về các sự kiện và hoạt động khác từ VRC
              </Label>
            </div>

            <div className="flex items-start space-x-2">
              <Checkbox
                id="privacyConsent"
                checked={formData.privacyConsent}
                onCheckedChange={(checked) => handleInputChange('privacyConsent', !!checked)}
                required
              />
              <Label htmlFor="privacyConsent" className="text-sm leading-relaxed">
                Tôi đồng ý với <a href="/privacy-policy" target="_blank" className="text-primary underline">
                chính sách bảo mật</a> và việc xử lý dữ liệu cá nhân của mình *
              </Label>
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Đang đăng ký...
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4 mr-2" />
                Đăng ký tham gia
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default EventRegistrationForm;
