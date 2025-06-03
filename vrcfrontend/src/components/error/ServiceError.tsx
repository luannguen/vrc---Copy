// Error handling components for Services
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface ServiceErrorProps {
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

// Error component cho services
export const ServiceError = ({ 
  error, 
  onRetry, 
  showRetry = true 
}: ServiceErrorProps) => {
  return (
    <div className="py-8">
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Không thể tải dịch vụ</AlertTitle>
        <AlertDescription className="mt-2">
          {error}
        </AlertDescription>
        {showRetry && onRetry && (
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRetry}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Thử lại
            </Button>
          </div>
        )}
      </Alert>
    </div>
  );
};

// Error state cho khi không có dữ liệu
export const NoServicesFound = ({ 
  message = "Không tìm thấy dịch vụ nào",
  showBackButton = false 
}: { 
  message?: string;
  showBackButton?: boolean;
}) => {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
        <AlertCircle className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Không có dịch vụ</h3>
      <p className="text-muted-foreground mb-6">{message}</p>
      {showBackButton && (
        <Button variant="outline" onClick={() => window.history.back()}>
          Quay lại
        </Button>
      )}
    </div>
  );
};
