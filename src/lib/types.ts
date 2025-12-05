export type ChainType =
  | "ethereum"
  | "solana"
  | "xrp"
  | "polygon"
  | "tezos"
  | "base"
  | "arbitrum"
  | "optimism"
  | "avalanche"
  | "bsc"
  | "cardano"
  | "flow"
  | "near";

export interface MetadataAttribute {
  trait_type: string;
  value: string | number;
  description?: string;
  display_type?: "number" | "boost_number" | "boost_percentage" | "date";
  max_value?: number;
}

export interface SolanaAttribute {
  trait_type: string;
  value: string;
}

export interface BaseMetadata {
  name: string;
  description: string;
  image: string;
  external_url?: string;
}

export interface EthereumMetadata extends BaseMetadata {
  attributes?: MetadataAttribute[];
  background_color?: string;
  animation_url?: string;
  youtube_url?: string;
  video_url?: string;
  audio_url?: string;
}

export interface SolanaMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  external_url?: string;
  attributes?: SolanaAttribute[];
  properties?: {
    files?: Array<{ uri: string; type: string }>;
    category?: string;
    creators?: Array<{ address: string; share: number; verified?: boolean }>;
  };
  collection?: {
    name: string;
    family: string;
  };
  seller_fee_basis_points?: number;
}

export interface XRPMetadata extends BaseMetadata {
  schema?: string;
  format_version?: string;
  nftType?: string;
  media_type?: string;
  file?: string;
  video?: string;
  audio?: string;
  issuer?: string;
  network?:
    | "mainnet"
    | "testnet"
    | "devnet"
    | "XRPL MainNet"
    | "XRPL TestNet"
    | "XRPL DevNet"
    | string;
  attributes?: MetadataAttribute[];
  collection?: {
    name: string;
    family?: string;
    description?: string;
  };
  additional_metadata?: Record<string, string | number | boolean>;
  token_taxon?: number;
  flags?: number;
  transfer_fee?: number;
}

export interface CardanoMetadata extends BaseMetadata {
  mediaType?: string;
  files?: Array<{
    name: string;
    mediaType: string;
    src: string;
    hash?: string;
  }>;
  attributes?: MetadataAttribute[];
  version?: string;
  mint?: {
    policy_id: string;
    asset_name: string;
  };
}

export interface NearMetadata {
  title: string;
  description: string;
  media: string;
  media_hash?: string;
  copies?: number;
  issued_at?: string;
  expires_at?: string;
  starts_at?: string;
  updated_at?: string;
  extra?: string;
  reference?: string;
  reference_hash?: string;
  reference_blob?: string;
  name?: string;
  image?: string;
  external_url?: string;
}

export interface TezosMetadata extends BaseMetadata {
  attributes?: MetadataAttribute[];
  artifactUri?: string;
  displayUri?: string;
  thumbnailUri?: string;
  creators?: string[];
  formats?: Array<{
    uri: string;
    mimeType: string;
    hash?: string;
    fileSize?: number;
  }>;
  decimals?: number;
  symbol?: string;
  tags?: string[];
  date?: string;
  minter?: string;
  rights?: string;
  language?: string;
}

export interface FlowMetadata extends BaseMetadata {
  attributes?: MetadataAttribute[];
  thumbnail?: string;
  serialNumber?: number;
  externalURL?: string;
  resourceID?: string;
  resourceType?: string;
}

export type AnyMetadata =
  | EthereumMetadata
  | SolanaMetadata
  | XRPMetadata
  | CardanoMetadata
  | NearMetadata
  | TezosMetadata
  | FlowMetadata;

export type FileCategory =
  | "image"
  | "audio"
  | "video"
  | "model"
  | "document"
  | "archive";

export type SupportedFileType =
  | "image/png"
  | "image/jpeg"
  | "image/gif"
  | "image/webp"
  | "image/svg+xml"
  | "audio/mpeg"
  | "audio/wav"
  | "audio/flac"
  | "audio/mp4"
  | "audio/ogg"
  | "video/mp4"
  | "video/webm"
  | "video/quicktime"
  | "video/x-msvideo"
  | "model/gltf-binary"
  | "model/gltf+json"
  | "application/octet-stream"
  | "application/pdf"
  | "text/html"
  | "text/plain"
  | "application/zip"
  | "application/x-7z-compressed";

export interface MediaFile {
  id: string;
  name: string;
  index: number;
  size: number;
  type: SupportedFileType;
  category: FileCategory;
  lastModified: number;
}

export interface MetadataEntry {
  id: string;
  imageId: string;
  metadata: AnyMetadata;
  index: number;
}

export interface ProjectConfig {
  chain: ChainType;
  collectionName: string;
  collectionDescription: string;
  externalUrl: string;
  creatorAddress: string;
  royaltyPercentage: number;
  symbol: string;
  storageType: "local" | "ipfs" | "custom";
  customBaseUrl?: string;
  policyId?: string;
  copies?: number;
  resourceType?: string;
  minter?: string;
  nftType?: string;
  issuer?: string;
}

export interface ValidationError {
  field: string;
  message: string;
  entryId: string;
}

export interface ExportOptions {
  format: "combined" | "separate";
  includeImages: boolean;
  uploadToIPFS: boolean;
  ipfsGateway?: string;
  ipfsApiKey?: string;
  ipfsProvider?: "pinata" | "web3storage";
}

export interface ChainSchema {
  id: ChainType;
  name: string;
  description: string;
  icon: string;
  defaultMetadata: Partial<AnyMetadata>;
  requiredFields: string[];
  optionalFields: string[];
  supportsAttributes: boolean;
  attributeFormat: "ethereum" | "solana";
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  projectConfig: ProjectConfig;
  images: MediaFile[];
  metadataEntries: MetadataEntry[];
  exportOptions: ExportOptions;
  currentStep: number;
  viewMode: "table" | "cards";
  status: "draft" | "ready" | "exported";
  stats: {
    totalItems: number;
    completedItems: number;
    validationErrors: number;
  };
}

export interface ProjectSummary {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  chain: ChainType;
  totalItems: number;
  status: "draft" | "ready" | "exported";
  thumbnail?: string;
}

export interface ProjectStore {
  projects: Project[];
  currentProjectId: string | null;
  getCurrentProject: () => Project | null;
  createProject: (name: string, description?: string) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string, newName: string) => string;
  exportProject: (id: string) => string;
  importProject: (projectData: string) => string;
  setCurrentProject: (id: string | null) => void;
  getProjectSummary: (id: string) => ProjectSummary | null;
  getAllProjectSummaries: () => ProjectSummary[];
  clearAllProjects: () => Promise<void>;
}
