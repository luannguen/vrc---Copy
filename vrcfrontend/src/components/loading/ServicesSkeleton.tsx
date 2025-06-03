// Loading components for Services
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";

// Loading skeleton cho service card
export const ServiceCardSkeleton = () => {
  return (
    <Card className="transition-all hover:shadow-md">
      <CardHeader>
        <div className="bg-muted w-12 h-12 rounded-lg mb-4">
          <Skeleton className="w-full h-full" />
        </div>
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </CardContent>
      <CardFooter>
        <Skeleton className="h-4 w-20" />
      </CardFooter>
    </Card>
  );
};

// Loading skeleton cho grid services
export const ServicesGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ServiceCardSkeleton key={index} />
      ))}
    </div>
  );
};

// Loading skeleton cho service detail
export const ServiceDetailSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="bg-muted/50 py-16">
        <div className="container-custom">
          <Skeleton className="h-12 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-2/3 mb-8" />
          <div className="flex gap-4">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="container-custom">
        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-4">
            <Skeleton className="h-8 w-1/2" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div>
            <Skeleton className="w-full h-64 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
};

// Loading spinner simple
export const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
};
