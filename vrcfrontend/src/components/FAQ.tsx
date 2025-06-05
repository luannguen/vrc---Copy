/**
 * FAQ Component
 * Displays frequently asked questions with collapsible answers
 */

import React from 'react';
import { HelpCircle, AlertCircle, RefreshCw } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useFAQ } from '../hooks/useFAQ';
import { FAQ as FAQType } from '../types/FAQ';

/**
 * FAQ Component Props
 */
interface FAQProps {
  category?: string;
  title?: string;
  showTitle?: boolean;
  maxItems?: number;
  className?: string;
}

/**
 * FAQ Item Component
 */
const FAQItem: React.FC<{ faq: FAQType; index: number }> = ({ faq, index }) => (
  <AccordionItem value={`faq-${faq.id}`} className="border-b border-gray-200">
    <AccordionTrigger className="text-left hover:no-underline py-4 px-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium flex-shrink-0">
          {index + 1}
        </div>
        <span className="font-medium text-gray-900 text-sm md:text-base">
          {faq.question}
        </span>
      </div>
    </AccordionTrigger>
    <AccordionContent className="px-6 pb-4">
      <div className="pl-9">
        <div 
          className="text-gray-600 prose prose-sm max-w-none"
          dangerouslySetInnerHTML={{ __html: faq.answer }}
        />
      </div>
    </AccordionContent>
  </AccordionItem>
);

/**
 * FAQ Loading Skeleton
 */
const FAQSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[...Array(5)].map((_, index) => (
      <div key={index} className="border border-gray-200 rounded-lg">
        <div className="p-4 flex items-center gap-3">
          <Skeleton className="w-6 h-6 rounded-full" />
          <Skeleton className="h-4 flex-1 max-w-md" />
          <Skeleton className="w-4 h-4" />
        </div>
      </div>
    ))}
  </div>
);

/**
 * Main FAQ Component
 */
export const FAQ: React.FC<FAQProps> = ({
  category,
  title = "Câu hỏi thường gặp",
  showTitle = true,
  maxItems,
  className = "",
}) => {
  const { faqs, loading, error, retry } = useFAQ({
    initialParams: {
      category,
      status: 'published',
      sort: 'order',
      limit: maxItems,
    },
    autoLoad: true,
    retryAttempts: 3,
  });

  // Filter and limit FAQs if needed
  const displayFAQs = maxItems ? faqs.slice(0, maxItems) : faqs;

  // Error state
  if (error && !loading) {
    return (
      <Card className={`w-full ${className}`}>
        {showTitle && (
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="flex items-center justify-between">
              <span>{error.message}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={retry}
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4 mr-1" />
                Thử lại
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  // Loading state
  if (loading) {
    return (
      <Card className={`w-full ${className}`}>
        {showTitle && (
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <FAQSkeleton />
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!displayFAQs.length) {
    return (
      <Card className={`w-full ${className}`}>
        {showTitle && (
          <CardHeader className="text-center pb-4">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
              <HelpCircle className="w-6 h-6 text-blue-600" />
              {title}
            </CardTitle>
          </CardHeader>
        )}
        <CardContent>
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Chưa có câu hỏi thường gặp nào.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Success state
  return (
    <Card className={`w-full ${className}`}>
      {showTitle && (
        <CardHeader className="text-center pb-6">
          <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold text-gray-900">
            <HelpCircle className="w-6 h-6 text-blue-600" />
            {title}
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Tìm câu trả lời cho những thắc mắc phổ biến
          </p>
        </CardHeader>
      )}
      <CardContent className="p-0">
        <Accordion type="single" collapsible className="w-full">
          {displayFAQs.map((faq, index) => (
            <FAQItem
              key={faq.id}
              faq={faq}
              index={index}
            />
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default FAQ;
