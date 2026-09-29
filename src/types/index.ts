export type ProjectCategory = 
  | 'Architectural Visualization'
  | 'Interior Visualization'
  | 'Residential Architecture'
  | 'Hospitality & Pavilions'
  | '3D & CGI'
  | 'AI Creative'
  | 'Animation & Film';

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  posterUrl?: string;
  caption?: string;
  aspect?: '16:9' | '4:3' | '3:4' | '21:9' | 'full';
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
  description?: string; // Short 1-2 sentence note maximum
  architecturalNarrative?: string;
  
  // Media-First Architecture
  coverType: 'image' | 'video';
  coverUrl: string;
  coverPosterUrl?: string;
  // Mixed sequential media stream: images and videos in exact user-specified storytelling sequence
  media: MediaItem[];

  // Compatibility fields
  coverImage?: string;
  gallery?: MediaItem[];
  videoUrl?: string;

  isPublished: boolean;
  isFeatured: boolean;
  orderIndex: number;
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
  addedAt: string;
}

// Site-Wide Content Interfaces for Universal In-Place & CMS Text/Media Editing
export interface HeroContent {
  tagline: string;
  heading: string;
  badge: string;
  viewWorkText: string;
  videoUrl: string;
  posterUrl: string;
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
}

export interface ServicesContent {
  heading: string;
  badge: string;
  items: ServiceItemContent[];
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
}

export interface AICreativeContent {
  heading: string;
  badge: string;
  studies: AICreativeStudy[];
}

export interface ClientRegionItem {
  id: string;
  region: string;
  desc: string;
  img: string;
}

export interface ClientsContent {
  heading: string;
  badge: string;
  regions: ClientRegionItem[];
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
}

export interface SiteContent {
  hero: HeroContent;
  about: AboutContent;
  services: ServicesContent;
  aiCreative: AICreativeContent;
  clients: ClientsContent;
  contact: ContactContent;
  header: HeaderContent;
  footer: FooterContent;
}
