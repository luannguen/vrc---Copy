// Technology Sections Types for Frontend
export interface TechnologySectionFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface TechnologySectionEquipmentItem {
  id: string;
  name: string;
}

export interface TechnologySectionEquipmentCategory {
  id: string;
  category: string;
  items: TechnologySectionEquipmentItem[];
}

export interface TechnologySectionPartnerLogo {
  id: string;
  partnerName: string;
  logo?: {
    url: string;
    alt?: string;
    thumbnailURL?: string;
  };
  website?: string;
}

export interface TechnologySectionCTAButton {
  id: string;
  text: string;
  link: string;
  variant: 'default' | 'outline' | 'secondary';
}

export interface LexicalContent {
  root: {
    type: 'root';
    children: Array<{
      type: 'paragraph';
      version: number;
      children: Array<{
        type: 'text';
        text: string;
      }>;
    }>;
    direction: 'ltr' | 'rtl';
    format: string;
    indent: number;
    version: number;
  };
}

export interface TechnologySection {
  id: string;
  title: string;
  section: 'hero' | 'overview' | 'equipment-categories' | 'partners' | 'cta';
  subtitle?: string;
  content?: LexicalContent;
  features: TechnologySectionFeature[];
  equipmentItems: TechnologySectionEquipmentCategory[];
  partnerLogos: TechnologySectionPartnerLogo[];
  ctaButtons: TechnologySectionCTAButton[];
  backgroundColor?: 'primary' | 'secondary' | 'accent' | 'muted' | 'white';
  order: number;
  _status: 'draft' | 'published';
  createdAt: string;
  updatedAt: string;
}

export interface TechnologySectionsResponse {
  docs: TechnologySection[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
}

// Helper type for section-specific data
export type TechnologySectionsByType = {
  hero?: TechnologySection;
  overview?: TechnologySection;
  'equipment-categories'?: TechnologySection;
  partners?: TechnologySection;
  cta?: TechnologySection;
};
