export type ProjectCategory = 
  | 'Architectural Visualization'
  | 'Interior Visualization'
  | 'Residential Architecture'
  | 'Hospitality & Pavilions'
  | '3D & CGI'
  | 'AI Creative'
  | 'Animation & Film'
  | 'Technical Visualization';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  posterUrl?: string;
  caption?: string;
  altText?: string;
  aspect?: '16:9' | '4:3' | '3:4' | '21:9' | 'full';
  isPlaceholder?: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  showOnHomepage?: boolean;
  showInGallery?: boolean;
}

// Backward compatibility alias
export type GalleryItem = MediaItem;

export interface Project {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  category: string;
  year: string;
  location: string;
  client?: string;
  role?: string;
  description?: string; // Short summary
  fullDescription?: string; // Detailed architectural and 3D narrative
  architecturalNarrative?: string;
  
  // Media-First Architecture
  coverType: 'image' | 'video';
  coverUrl: string;
  coverPosterUrl?: string;
  coverIsPlaceholder?: boolean;
  coverAltText?: string;

  // Mixed sequential media stream: images and videos in exact user-specified sequence
  media: MediaItem[];

  // Compatibility fields
  coverImage?: string;
  gallery?: MediaItem[];
  videoUrl?: string;

  isPublished: boolean;
  isFeatured: boolean;
  homepageVisibility?: boolean;
  orderIndex: number;
  seoTitle?: string;
  seoDescription?: string;
  softwareStack?: string[];
  awardsRecognition?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CloudflareConfig {
  accountId: string;
  bucketName: string;
  publicCdnUrl: string;
  streamUrl?: string;
  enabled: boolean;
}

export interface MediaLibraryItem {
  id: string;
  title: string;
  type: 'image' | 'video';
  url: string;
  posterUrl?: string;
  category?: string;
  projectName?: string;
  addedAt: string;
  isPlaceholder?: boolean;
  fileSize?: string;
}

// Site-Wide Content Interfaces for Universal In-Place & CMS Text/Media Editing
export interface HeroContent {
  tagline: string;
  heading: string;
  badge: string;
  viewWorkText: string;
  videoUrl: string;
  posterUrl: string;
  visibility?: boolean;
  ctaLink?: string;
  soundEnabled?: boolean;
  autoplay?: boolean;
  isPlaceholder?: boolean;
}

export interface ShowreelContent {
  heading: string;
  badge: string;
  description: string;
  videoUrl: string;
  posterUrl: string;
  isPlaceholder?: boolean;
  visibility: boolean;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
}

export interface AboutExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
}

export interface AboutContent {
  portraitUrl: string;
  portraitCaption: string;
  sectionBadge: string;
  name: string;
  role: string;
  quote: string;
  bio: string;
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  experiences: AboutExperienceItem[];
  software: string[];
  visibility?: boolean;
}

export interface ServiceItemContent {
  id: string;
  number: string;
  title: string;
  scope: string;
  description: string;
  mediaUrl: string;
  posterUrl?: string;
  type: 'image' | 'video';
  isPlaceholder?: boolean;
}

export interface ServicesContent {
  heading: string;
  badge: string;
  items: ServiceItemContent[];
  visibility?: boolean;
}

export interface AICreativeStudy {
  id: string;
  title: string;
  category: string;
  prompt: string;
  mediaUrl: string;
  posterUrl?: string;
  type: 'image' | 'video';
  aspect?: string;
  isPlaceholder?: boolean;
}

export interface AICreativeContent {
  heading: string;
  badge: string;
  studies: AICreativeStudy[];
  visibility?: boolean;
}

export interface ClientRegionItem {
  id: string;
  region: string;
  desc: string;
  img: string;
  isPlaceholder?: boolean;
}

export interface ClientsContent {
  heading: string;
  badge: string;
  regions: ClientRegionItem[];
  visibility?: boolean;
}

export interface ContactContent {
  badge: string;
  heading: string;
  subheadingTags: string[];
  email: string;
  emailLabel: string;
  whatsappNumber: string;
  whatsappLabel: string;
  whatsappMessage: string;
  instagram: string;
  instagramUrl: string;
  instagramLabel: string;
  visibility?: boolean;
}

export interface HeaderContent {
  brandName: string;
  brandTitle: string;
  inquireButtonText: string;
}

export interface FooterContent {
  brandTitle: string;
  tagline: string;
  copyright: string;
  socialInstagramUrl?: string;
  socialLinkedInUrl?: string;
  socialBehanceUrl?: string;
}

export interface SiteContent {
  hero: HeroContent;
  showreel?: ShowreelContent;
  about: AboutContent;
  services: ServicesContent;
  aiCreative: AICreativeContent;
  clients: ClientsContent;
  contact: ContactContent;
  header: HeaderContent;
  footer: FooterContent;
}
