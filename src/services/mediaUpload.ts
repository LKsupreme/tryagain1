import { StorageService } from './storage';
import { MediaLibraryItem } from '../types';

const DB_NAME = 'elle_kay_media_db_v1';
const STORE_NAME = 'media_blobs';

// Initialize IndexedDB for large media files (up to hundreds of MBs)
function getDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const request = window.indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Generate an automatic poster thumbnail from a video file
export async function generateVideoThumbnail(videoFile: File | Blob): Promise<string> {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(videoFile);
      video.src = url;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, (video.duration || 2) / 2 || 0.5);
      };

      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 1280;
        canvas.height = video.videoHeight || 720;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const thumbUrl = canvas.toDataURL('image/jpeg', 0.85);
          URL.revokeObjectURL(url);
          resolve(thumbUrl);
          return;
        }
        URL.revokeObjectURL(url);
        resolve('');
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('');
      };
    } catch {
      resolve('');
    }
  });
}

export const MediaUploadService = {
  // Save a raw Blob/File to IndexedDB and retrieve a persistent Object URL
  async saveBlobToDB(id: string, file: Blob, mimeType: string): Promise<string> {
    try {
      const db = await getDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        const store = tx.objectStore(STORE_NAME);
        store.put({ id, data: file, type: mimeType, timestamp: Date.now() });
        tx.oncomplete = () => {
          // If file is under 20MB, DataURL guarantees cross-tab, cross-reload persistence
          if (file.size < 20 * 1024 * 1024) {
            MediaUploadService.fileToDataUrl(file).then(resolve).catch(() => {
              const url = URL.createObjectURL(file);
              resolve(url);
            });
          } else {
            const url = URL.createObjectURL(file);
            resolve(url);
          }
        };
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      console.warn('IndexedDB fallback to DataURL:', e);
      return MediaUploadService.fileToDataUrl(file);
    }
  },

  // Convert file to Data URL
  fileToDataUrl(file: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  },

  // Primary upload handler for either an Image or a Video
  async processUpload(
    file: File,
    customTitle?: string,
    category: string = 'Uploads',
    projectName?: string
  ): Promise<MediaLibraryItem> {
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name);
    const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';
    const id = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    let mediaUrl: string;
    let posterUrl: string | undefined;

    if (isVideo) {
      // Automatically generate video poster thumbnail from frame
      posterUrl = await generateVideoThumbnail(file);
      // For videos up to 25MB, save with IndexedDB + DataURL
      mediaUrl = await MediaUploadService.saveBlobToDB(id, file, file.type || 'video/mp4');
    } else {
      // For images, DataURL guarantees instant rendering everywhere
      mediaUrl = await MediaUploadService.fileToDataUrl(file);
    }

    const title = customTitle?.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    const newItem = StorageService.addMediaItem({
      title,
      type: mediaType,
      url: mediaUrl,
      posterUrl,
      category,
      projectName,
      fileSize: MediaUploadService.formatBytes(file.size),
    });

    return newItem;
  },

  formatBytes(bytes: number, decimals = 1): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  },
};
