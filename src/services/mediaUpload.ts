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
          const url = URL.createObjectURL(file);
          resolve(url);
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
    category: string = 'Uploads'
  ): Promise<MediaLibraryItem> {
    const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|mov|ogg)$/i.test(file.name);
    const mediaType: 'image' | 'video' = isVideo ? 'video' : 'image';
    const id = `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

    let mediaUrl: string;

    // For images < 1.5MB, DataURL is great for zero-latency cross-session persistence
    if (!isVideo && file.size < 1.5 * 1024 * 1024) {
      mediaUrl = await MediaUploadService.fileToDataUrl(file);
    } else {
      // For videos or large images, use IndexedDB + ObjectURL / DataURL fallback
      mediaUrl = await MediaUploadService.saveBlobToDB(id, file, file.type);
    }

    const title = customTitle?.trim() || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');

    const newItem = StorageService.addMediaItem({
      title,
      type: mediaType,
      url: mediaUrl,
      category,
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
