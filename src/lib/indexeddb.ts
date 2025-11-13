"use client";

import type { FileCategory } from "./types";

interface MediaRecord {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  category: FileCategory;
  lastModified: number;
}

class MediaDB {
  private dbName = "NFTMetadataBuilder";
  private version = 2;
  private db: IDBDatabase | null = null;

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        if (!db.objectStoreNames.contains("media")) {
          const mediaStore = db.createObjectStore("media", { keyPath: "id" });
          mediaStore.createIndex("name", "name", { unique: false });
          mediaStore.createIndex("type", "type", { unique: false });
          mediaStore.createIndex("category", "category", { unique: false });
        }

        if (
          db.objectStoreNames.contains("images") &&
          !db.objectStoreNames.contains("media")
        ) {
          const transaction = (event.target as IDBOpenDBRequest).transaction!;
          const imageStore = transaction.objectStore("images");
          const mediaStore = transaction.objectStore("media");

          imageStore.getAll().onsuccess = (e) => {
            const images = (e.target as IDBRequest).result as MediaRecord[];
            images.forEach((image) => {
              const mediaRecord: MediaRecord = {
                ...image,
                category: "image",
              };
              mediaStore.add(mediaRecord);
            });
          };
        }
      };
    });
  }

  async storeMedia(
    id: string,
    file: File,
    category: FileCategory,
  ): Promise<void> {
    if (!this.db) await this.init();

    const mediaRecord: MediaRecord = {
      id,
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      category,
      lastModified: file.lastModified,
    };

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["media"], "readwrite");
      const store = transaction.objectStore("media");
      const request = store.put(mediaRecord);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async storeImage(id: string, file: File): Promise<void> {
    return this.storeMedia(id, file, "image");
  }

  async getMedia(id: string): Promise<File | null> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["media"], "readonly");
      const store = transaction.objectStore("media");
      const request = store.get(id);

      request.onsuccess = () => {
        const result = request.result as MediaRecord | undefined;
        resolve(result ? result.file : null);
      };
      request.onerror = () => reject(request.error);
    });
  }

  async getImage(id: string): Promise<File | null> {
    return this.getMedia(id);
  }

  async getMediaBlob(id: string): Promise<string | null> {
    const file = await this.getMedia(id);
    if (!file) return null;
    return URL.createObjectURL(file);
  }

  async getImageBlob(id: string): Promise<string | null> {
    return this.getMediaBlob(id);
  }

  async deleteMedia(id: string): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["media"], "readwrite");
      const store = transaction.objectStore("media");
      const request = store.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async deleteImage(id: string): Promise<void> {
    return this.deleteMedia(id);
  }

  async getAllMedia(): Promise<MediaRecord[]> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["media"], "readonly");
      const store = transaction.objectStore("media");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async getAllImages(): Promise<MediaRecord[]> {
    const allMedia = await this.getAllMedia();
    return allMedia.filter(
      (media) => media.category === "image",
    ) as MediaRecord[];
  }

  async getStorageUsage(): Promise<{ used: number; quota: number }> {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      const estimate = await navigator.storage.estimate();
      return {
        used: estimate.usage || 0,
        quota: estimate.quota || 0,
      };
    }
    return { used: 0, quota: 0 };
  }

  async requestPersistentStorage(): Promise<boolean> {
    if ("storage" in navigator && "persist" in navigator.storage) {
      return await navigator.storage.persist();
    }
    return false;
  }

  async clearAllMedia(): Promise<void> {
    if (!this.db) await this.init();

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction(["media"], "readwrite");
      const store = transaction.objectStore("media");
      const request = store.clear();

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllImages(): Promise<void> {
    return this.clearAllMedia();
  }
}

export const mediaDB = new MediaDB();
export const imageDB = mediaDB;

export const storeMediaFile = async (
  id: string,
  file: File,
  category: FileCategory,
): Promise<void> => {
  return mediaDB.storeMedia(id, file, category);
};

export const getMediaFile = async (id: string): Promise<File | null> => {
  return mediaDB.getMedia(id);
};

export const getMediaBlob = async (id: string): Promise<string | null> => {
  return mediaDB.getMediaBlob(id);
};

export const deleteMediaFile = async (id: string): Promise<void> => {
  return mediaDB.deleteMedia(id);
};

export const getAllMediaFiles = async (): Promise<MediaRecord[]> => {
  return mediaDB.getAllMedia();
};

export const clearAllMediaFiles = async (): Promise<void> => {
  return mediaDB.clearAllMedia();
};

export const storeImageFile = async (id: string, file: File): Promise<void> => {
  return mediaDB.storeImage(id, file);
};

export const getImageFile = async (id: string): Promise<File | null> => {
  return mediaDB.getImage(id);
};

export const getImageBlob = async (id: string): Promise<string | null> => {
  return mediaDB.getImageBlob(id);
};

export const deleteImageFile = async (id: string): Promise<void> => {
  return mediaDB.deleteImage(id);
};

export const getStorageInfo = async (): Promise<{
  used: number;
  quota: number;
  usedMB: number;
  quotaMB: number;
  percentage: number;
  totalFiles: number;
  totalSize: number;
  availableSpace: number;
  usedPercentage: number;
  files: MediaRecord[];
}> => {
  const { used, quota } = await mediaDB.getStorageUsage();
  const allFiles = await mediaDB.getAllMedia();
  const totalSize = allFiles.reduce((sum, file) => sum + file.size, 0);
  const usedMB = Math.round((used / (1024 * 1024)) * 100) / 100;
  const quotaMB = Math.round((quota / (1024 * 1024)) * 100) / 100;
  const percentage = quota > 0 ? Math.round((used / quota) * 100) : 0;
  const availableSpace = quota - used;

  return {
    used,
    quota,
    usedMB,
    quotaMB,
    percentage,
    totalFiles: allFiles.length,
    totalSize,
    availableSpace,
    usedPercentage: percentage,
    files: allFiles,
  };
};
