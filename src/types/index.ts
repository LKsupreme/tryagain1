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
