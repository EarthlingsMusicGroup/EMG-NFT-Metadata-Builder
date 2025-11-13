export interface IPFSUploadResult {
  cid: string;
  url: string;
  gateway: string;
}

export interface IPFSUploadProgress {
  current: number;
  total: number;
  percentage: number;
  status: string;
}

export interface IPFSProvider {
  name: string;
  apiEndpoint: string;
  requiresAuth: boolean;
}

export const IPFS_PROVIDERS = {
  pinata: {
    name: "Pinata",
    apiEndpoint: "https://api.pinata.cloud/pinning/pinFileToIPFS",
    requiresAuth: true,
  },
  web3storage: {
    name: "Web3.Storage",
    apiEndpoint: "https://api.web3.storage/upload",
    requiresAuth: true,
  },
} as const;

export type IPFSProviderType = keyof typeof IPFS_PROVIDERS;

export class IPFSUploader {
  private gateway: string;
  private apiKey: string;
  private provider: IPFSProviderType;

  constructor(
    apiKey: string,
    provider: IPFSProviderType = "pinata",
    gateway?: string,
  ) {
    if (!apiKey || apiKey.trim() === "") {
      throw new Error("API key is required for IPFS uploads");
    }
    this.apiKey = apiKey;
    this.provider = provider;
    this.gateway = gateway || "https://ipfs.io/ipfs/";
  }

  async uploadFile(
    file: File | Blob,
    onProgress?: (progress: IPFSUploadProgress) => void,
  ): Promise<IPFSUploadResult> {
    try {
      if (!file) {
        throw new Error("No file provided for upload");
      }

      const maxFileSize = 100 * 1024 * 1024;
      if (file.size > maxFileSize) {
        throw new Error(
          `File is too large (${Math.round(file.size / 1024 / 1024)}MB). Maximum size is 100MB.`,
        );
      }

      const allowedTypes = [
        "image/",
        "video/",
        "audio/",
        "application/json",
        "text/",
        "application/octet-stream",
      ];
      const isValidType =
        allowedTypes.some((type) => file.type.startsWith(type)) ||
        file.type === "";
      if (!isValidType) {
        throw new Error(`Unsupported file type: ${file.type}`);
      }

      onProgress?.({
        current: 0,
        total: 100,
        percentage: 0,
        status: "Preparing upload...",
      });

      const formData = new FormData();
      formData.append("file", file);

      onProgress?.({
        current: 25,
        total: 100,
        percentage: 25,
        status: "Uploading to IPFS...",
      });

      const providerConfig = IPFS_PROVIDERS[this.provider];
      const headers: Record<string, string> = {};

      if (this.provider === "pinata") {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
      } else if (this.provider === "web3storage") {
        headers["Authorization"] = `Bearer ${this.apiKey}`;
      }

      const response = await fetch(providerConfig.apiEndpoint, {
        method: "POST",
        headers,
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = `IPFS upload failed: ${response.statusText}`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch {
          const errorText = await response.text();
          if (errorText) {
            errorMessage += `. ${errorText}`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      let cid: string;
      if (this.provider === "pinata") {
        cid = data.IpfsHash;
      } else if (this.provider === "web3storage") {
        cid = data.cid;
      } else {
        throw new Error("Unsupported IPFS provider");
      }

      if (!cid) {
        throw new Error("No CID returned from IPFS provider");
      }

      onProgress?.({
        current: 100,
        total: 100,
        percentage: 100,
        status: "Upload complete",
      });

      return {
        cid,
        url: `${this.gateway}${cid}`,
        gateway: this.gateway,
      };
    } catch (error) {
      throw new Error(
        `Failed to upload to IPFS: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  }

  async uploadJSON(
    data: any,
    onProgress?: (progress: IPFSUploadProgress) => void,
  ): Promise<IPFSUploadResult> {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    return this.uploadFile(blob, onProgress);
  }

  async uploadMultipleFiles(
    files: Array<{ file: File | Blob; name: string }>,
    onProgress?: (progress: IPFSUploadProgress) => void,
  ): Promise<IPFSUploadResult[]> {
    const results: IPFSUploadResult[] = [];

    for (let i = 0; i < files.length; i++) {
      const { file } = files[i];
      const percentage = Math.round(((i + 1) / files.length) * 100);

      onProgress?.({
        current: i + 1,
        total: files.length,
        percentage,
        status: `Uploading file ${i + 1} of ${files.length}...`,
      });

      const result = await this.uploadFile(file);
      results.push(result);
    }

    return results;
  }

  getCIDUrl(cid: string): string {
    return `${this.gateway}${cid}`;
  }
}

export function createIPFSUploader(
  apiKey?: string,
  provider: IPFSProviderType = "pinata",
  gateway?: string,
): IPFSUploader {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "IPFS API key is required. Please provide a valid API key from Pinata or Web3.Storage.",
    );
  }
  return new IPFSUploader(apiKey, provider, gateway);
}

export function validateIPFSConfig(
  apiKey?: string,
  provider?: IPFSProviderType,
): {
  valid: boolean;
  error?: string;
} {
  if (!apiKey || apiKey.trim() === "") {
    return {
      valid: false,
      error: "API key is required",
    };
  }

  if (provider && !IPFS_PROVIDERS[provider]) {
    return {
      valid: false,
      error: "Invalid IPFS provider",
    };
  }

  return { valid: true };
}
