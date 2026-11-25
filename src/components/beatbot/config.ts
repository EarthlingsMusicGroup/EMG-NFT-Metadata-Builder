import type { CheckName } from "./checks";

export type PageId = "home" | "project" | "settings";

export type SoundCue =
  | "greeting"
  | "confirm"
  | "question"
  | "step"
  | "open"
  | "tick"
  | "none";

export type TourStep = {
  id: string;
  text: string;
  targets: string[];
  pages?: PageId[];
  /** Speak the line even when the highlight target is on another page. */
  allowMissing?: boolean;
  cue?: SoundCue;
};

export type Tour = {
  id: string;
  title: string;
  summary: string;
  steps: TourStep[];
};

export type FieldTip = {
  text: string;
  byChain?: Record<string, string>;
  check?: CheckName;
  required?: boolean;
  requiredNote?: string;
};

/**
 * Everything BeatBot says and plays lives here. Copy this folder, point
 * `assetBase` at the static files, and mount `<BeatBotLoader />`.
 */
export const BEATBOT = {
  storageKey: "beatbot.prefs.v1",
  assetBase: "/beatbot/",
  modelUrl: "/beatbot/beatbot.glb",
  dracoPath: "/beatbot/draco/",
  autoTourId: "look",
  model: {
    fitHeight: 1.62,
    facing: 0,
  },
  camera: {
    position: [0, 0.92, 3.15] as [number, number, number],
    lookAt: [0, 0.8, 0] as [number, number, number],
    fov: 32,
  },
  chainGroups: {
    evm: [
      "ethereum",
      "polygon",
      "base",
      "arbitrum",
      "optimism",
      "avalanche",
      "bsc",
    ],
  } as Record<string, string[]>,
  sounds: {
    greeting: "confirmation_002",
    confirm: "confirmation_001",
    question: "question_001",
    step: "maximize_001",
    open: "forceField_000",
    ticks: [
      "bong_001",
      "pluck_001",
      "glass_003",
      "laserSmall_000",
      "laserRetro_000",
    ],
  },
  title: "BeatBot",
  subtitle: "Earthlings HQ – Tour Guide",
  invite:
    "I'm BeatBot. Call me BB. Want a short look around, or should I wait until you focus a field?",
  idle: "Focus a field and I'll explain it. Help replays the tour or jumps to a topic.",
  optedOut: "I'll stay quiet. Help is here whenever you want the tour.",
  stepTips: {
    collection:
      "Collection name is the one this step requires. It is copied onto each item as “Name #1”. Description and the external link can wait.",
    images:
      "Drop the files here. They stay in this browser. Metadata stays locked until at least one file is in.",
    metadata:
      "Most chains require a name, a description, and an image. Focus a field for the format. Reset All rebuilds a simple default and clears chain-specific fields.",
    export:
      "JSON Only is one file of every item. ZIP can be one combined file or one JSON per item, with images optional. IPFS stays off until you turn it on.",
  } as Record<string, string>,
  fields: {
    "project-name": {
      text: "Required. This becomes the project name and the collection name.",
      required: true,
      requiredNote: "Project name is required.",
    },
    "project-description": {
      text: "Optional. It is stored on the project and used as the collection description when you leave it filled in.",
    },
    "project-chain": {
      text: "The chain picks which fields and checks you get. It is chosen here, when the project is created.",
    },
    "collection-name": {
      text: "Required to leave this step. Each item is named “this #1”, “#2”, and so on.",
      required: true,
      requiredNote:
        "Enter a collection name to continue. Images stay locked until it isn't blank.",
    },
    "collection-description": {
      text: "Optional. It is copied onto each item, with “ - Item 1” added on the end.",
    },
    "external-url": {
      text: "Optional website for the collection. A value here needs a protocol, like https://.",
      check: "url",
    },
    "creator-address": {
      text: "Wallet stored on the collection. Leave it blank if you don't have it yet.",
      byChain: {
        evm: "EVM address: 0x plus 40 hex characters. Stored on the collection as typed.",
        solana:
          "Solana address in base58, 32–44 characters. It is copied onto the item's creators list when the items are created.",
        xrp: "XRPL classic address. It starts with r, then 24–34 letters or numbers.",
        tezos:
          "Tezos address: tz1, tz2, or tz3, then 33 characters. It is copied into the item's creators list.",
        near: "NEAR account: lowercase letters, digits, dots, underscores, or hyphens, up to 64 characters.",
        cardano:
          "Your Cardano wallet, often starting with addr1. This collection field is stored as typed.",
        flow: "Your Flow account. This collection field is stored as typed.",
      },
    },
    "royalty-percentage": {
      text: "Percent on secondary sales. Stay inside the min and max on this box.",
      byChain: {
        solana:
          "Percent on secondary sales, 0–100 on this box. Items store percent × 100 as seller_fee_basis_points, which must sit between 0 and 10000.",
      },
      check: "royalty",
    },
    "token-symbol": {
      text: "Solana symbol: 1–10 uppercase letters or digits. “ART” passes. “art” gets “Symbol must be 1-10 uppercase alphanumeric characters”.",
      check: "tokenSymbol",
      required: true,
      requiredNote: "Symbol is required on Solana.",
    },
    "xrp-network": {
      text: "Which XRPL network this collection is aimed at: Mainnet, Testnet, or Devnet.",
    },
    "policy-id": {
      text: "Cardano policy ID. Exactly 56 hex characters, or leave it blank until you have one.",
      check: "policyId",
    },
    copies: {
      text: "How many copies each item represents. 1 means unique. The checker wants a whole number above zero.",
      check: "positiveInt",
      required: true,
      requiredNote: "Copies must be a positive integer.",
    },
    "resource-type": {
      text: "Flow resource type. “NFT” is the usual value, and it is what a new item starts with.",
    },
    "storage-type": {
      text: "Where you plan to keep the files. Local means this browser. IPFS and Custom URL are labels you can use at export.",
    },
    "custom-base-url": {
      text: "Base URL used when storage is Custom. Include https://.",
      check: "url",
    },
    "item-name": {
      text: "Required item title. A blank name fails validation with “Name is required”.",
      required: true,
      requiredNote: "Name is required.",
    },
    "item-description": {
      text: "Required. A blank description fails with “Description is required”.",
      required: true,
      requiredNote: "Description is required.",
    },
    "item-image": {
      text: "Required. JSON and ZIP export write this value as it stands. An IPFS upload replaces it with the uploaded file's URL.",
      byChain: {
        xrp: "Required on XRPL, and it has to be a URI: ipfs://, ar://, http://, or https://. A filename fails that check. IPFS upload can replace it with the uploaded URL.",
      },
      check: "itemImage",
      required: true,
      requiredNote: "Image is required.",
    },
    external_url: {
      text: "Optional link for this item. Include https:// or the checker says “Invalid URL format”.",
      check: "url",
    },
    background_color: {
      text: "Optional backdrop. Exactly 6 hex digits, no #. FFFFFF is the usual default.",
      check: "hexColor",
    },
    animation_url: {
      text: "Optional URL of an animation file. Include https://.",
      check: "url",
    },
    "xrp-schema": {
      text: "Required on XRPL. A URI starting with ipfs://, ar://, http://, or https://. New items start with a placeholder ipfs URI.",
      check: "uri",
      required: true,
      requiredNote: "Schema URI is required.",
    },
    "xrp-nft-type": {
      text: "Required on XRPL. The shape is a word, “.v”, then digits. Schema support expects exactly art.v0.",
      check: "nftType",
      required: true,
      requiredNote: "nftType is required.",
    },
    "xrp-issuer": {
      text: "Optional XRPL issuer. Classic addresses start with r, then 24–34 letters or numbers.",
      check: "xrplAddress",
    },
    video: {
      text: "Optional video URI: ipfs://, ar://, http://, or https://. You can also attach a file you already uploaded.",
      check: "uri",
    },
    audio: {
      text: "Optional audio URI: ipfs://, ar://, http://, or https://. You can also attach a file you already uploaded.",
      check: "uri",
    },
    file: {
      text: "Optional extra file URI: ipfs://, ar://, http://, or https://.",
      check: "uri",
    },
    "collection-object-name": {
      text: "XRPL collection name. Once a collection object is present, a blank name fails with “Collection name is required when collection is present”.",
      required: true,
      requiredNote:
        "Collection name is required when collection is present.",
    },
    "media-type": {
      text: "Cardano media type, lowercase, like image/png. The checker says “Invalid MIME type format” when the slash-shape is wrong.",
      check: "mime",
    },
    "issued-at": {
      text: "NEAR issued time. The picker writes an ISO timestamp, which needs a T. A date without T fails.",
      check: "isoDate",
    },
    "artifact-uri": {
      text: "Tezos URI for the full file: ipfs://, ar://, http://, or https://.",
      check: "uri",
    },
    "display-uri": {
      text: "Tezos URI for the preview. Same schemes as the artifact: ipfs://, ar://, http://, or https://.",
      check: "uri",
    },
    minter: {
      text: "Optional Tezos minter. tz1, tz2, or tz3, then 33 characters.",
      check: "tezosAddress",
    },
    "serial-number": {
      text: "Flow serial number. A whole number above zero. New items use their index.",
      check: "positiveInt",
    },
    "attribute-trait": {
      text: "Required once the row exists. An empty trait type fails with “Trait type is required”.",
      required: true,
      requiredNote: "Trait type is required.",
    },
    "attribute-value": {
      text: "Required once the row exists. Words or numbers both count. A blank value fails with “Value is required”.",
      required: true,
      requiredNote: "Value is required.",
    },
    "media-drop": {
      text: "PNG, JPEG, GIF, WebP, SVG, plus audio, video, glTF, PDF, text, and zip. Empty files are rejected, names can't contain slashes, and images cap at 50 MB.",
    },
    "export-format": {
      text: "Combined writes one metadata.json. Separate writes metadata/1.json, metadata/2.json, and so on, inside the ZIP.",
    },
    "include-images": {
      text: "On: the ZIP also has an images folder with the files from this browser. Off: the ZIP carries the JSON only.",
    },
    "ipfs-upload": {
      text: "Optional. Turn it on when you want Pinata or Web3.Storage to host the files. The key stays in this browser.",
    },
    "ipfs-provider": {
      text: "Pinata and Web3.Storage are the two providers this page can upload to.",
    },
    "ipfs-api-key": {
      text: "Required only while upload is on. Paste the provider's key here. I never read it back.",
      check: "ipfsKey",
    },
    "ipfs-gateway": {
      text: "Optional gateway prefix, often https://ipfs.io/ipfs/. Links are written with this host.",
      check: "url",
    },
    "save-project": {
      text: "Saves into this browser. ⌘ or Ctrl+S reminds you to use this button. ⌘ or Ctrl+E, on the Export step, points you at the downloads.",
    },
    "export-project-file": {
      text: "Downloads the project JSON that Import reads. The metadata ZIP lives on the Export step.",
    },
    "batch-edit": {
      text: "Writes one field onto every item. It applies the text as typed, so check the format on a single item first.",
    },
    "reset-all": {
      text: "Replaces every item with the collection name, description, image filename, external URL, a white background, and no attributes. Chain-specific fields are cleared.",
    },
  } as Record<string, FieldTip>,
  /**
   * Which address check to run for `creator-address`. Chains omitted here
   * are stored as typed and have no format check in the app.
   */
  addressChecks: {
    evm: "evmAddress",
    solana: "solanaAddress",
    xrp: "xrplAddress",
    tezos: "tezosAddress",
    near: "nearAddress",
  } as Record<string, CheckName>,
  tours: [
    {
      id: "look",
      title: "Look around",
      summary: "A short tour of the builder.",
      steps: [
        {
          id: "welcome",
          cue: "step",
          targets: ["hero", "brand"],
          text: "Hey, I'm BeatBot — BB if we're moving fast. This page builds collection metadata in your browser. No account, and files stay here unless you choose IPFS.",
        },
        {
          id: "create",
          cue: "step",
          targets: ["create-project"],
          text: "Create Project asks for a name and a chain. That name becomes the collection name. You fill in the rest on the next screen.",
        },
        {
          id: "start",
          cue: "step",
          pages: ["home"],
          targets: ["get-started"],
          text: "Start a new collection, or Import Project if you already have a JSON exported from here.",
        },
        {
          id: "projects",
          cue: "step",
          pages: ["home"],
          targets: ["projects"],
          text: "These projects live in this browser. Open one for Collection, Images, Metadata, then Export. Each chain checks its own fields.",
        },
        {
          id: "how",
          cue: "step",
          pages: ["home"],
          targets: ["how-it-works"],
          text: "Four stops. Images waits for a collection name. Metadata waits for at least one file. Export writes JSON or a ZIP.",
        },
        {
          id: "chains",
          cue: "step",
          pages: ["home"],
          targets: ["chains"],
          text: "Thirteen chains, each with its own required fields. Focus a field later and I'll explain the format and the usual mistake.",
        },
        {
          id: "stepper",
          cue: "step",
          pages: ["project"],
          targets: ["stepper"],
          text: "Same four stops, in order. Green means that step is done. You can go back, and you can move one step ahead once this step is ready.",
        },
        {
          id: "workspace",
          cue: "step",
          pages: ["project"],
          targets: ["builder-step"],
          text: "This is the work for the current step. Focus any field and I'll say what it means, the format it wants, and what the checker rejects.",
        },
        {
          id: "actions",
          cue: "step",
          pages: ["project"],
          targets: ["project-actions"],
          text: "Save writes the project in this browser. This Export button downloads the project JSON that Import reads. Metadata files are the last step.",
        },
        {
          id: "settings",
          cue: "step",
          targets: ["settings"],
          text: "Settings is the storage manager for this device. The theme button sits beside it. I'm in the corner if you want this tour again.",
        },
        {
          id: "close",
          cue: "step",
          targets: [],
          text: "That's the loop. Help replays this, or jumps to the steps, metadata, export, or privacy.",
        },
      ],
    },
    {
      id: "builder",
      title: "The four steps",
      summary: "Collection, images, metadata, export.",
      steps: [
        {
          id: "steps",
          cue: "step",
          targets: ["stepper", "how-it-works"],
          allowMissing: true,
          text: "Every project is Collection, then Images, then Metadata, then Export. A collection name unlocks Images. One file unlocks Metadata.",
        },
        {
          id: "work",
          cue: "step",
          pages: ["project"],
          targets: ["builder-step"],
          allowMissing: true,
          text: "The panel in front of you is the current step. Focus a field and I'll explain that chain's format.",
        },
        {
          id: "save",
          cue: "step",
          targets: ["project-actions"],
          allowMissing: true,
          text: "Save keeps the project in this browser. The header Export downloads the project file. The metadata ZIP is the Export step.",
        },
      ],
    },
    {
      id: "metadata",
      title: "Metadata fields",
      summary: "What the item form checks.",
      steps: [
        {
          id: "editor",
          cue: "step",
          targets: ["metadata-editor"],
          allowMissing: true,
          text: "Most chains require name, description, and image. XRPL also requires a schema URI and nftType art.v0. NEAR checks title and media, which are filled when the items are created.",
        },
        {
          id: "batch",
          cue: "step",
          targets: ["batch-edit"],
          allowMissing: true,
          text: "Batch Edit writes one value onto every item. Reset All rebuilds names from the collection and clears chain-specific fields.",
        },
        {
          id: "preview",
          cue: "step",
          targets: ["preview"],
          allowMissing: true,
          text: "Preview has the picture, a details tab, and the JSON that export writes for the selected item.",
        },
      ],
    },
    {
      id: "export",
      title: "Export",
      summary: "JSON, ZIP, and optional IPFS.",
      steps: [
        {
          id: "files",
          cue: "step",
          targets: ["export-panel"],
          allowMissing: true,
          text: "JSON Only downloads one array of every item. ZIP uses metadata.json, or metadata/1.json and so on if you choose Separate Files. Include Images adds an images folder.",
        },
        {
          id: "ipfs",
          cue: "step",
          targets: ["ipfs"],
          allowMissing: true,
          text: "IPFS is optional. Pick Pinata or Web3.Storage and paste that provider's key. The key stays in this browser. A gateway only changes the links that get written.",
        },
      ],
    },
    {
      id: "privacy",
      title: "Privacy and storage",
      summary: "What stays on this device.",
      steps: [
        {
          id: "local",
          cue: "step",
          targets: ["storage", "settings"],
          allowMissing: true,
          text: "Projects and files live in this browser's IndexedDB. There is no account. IPFS runs only after you turn it on and paste a key.",
        },
        {
          id: "danger",
          cue: "step",
          pages: ["settings"],
          targets: ["storage-actions"],
          allowMissing: true,
          text: "Export Data downloads a backup JSON. Clear All Data asks you to confirm, then removes every project and file from this browser.",
        },
      ],
    },
  ] as Tour[],
};

export function chainGroup(chain: string | null | undefined): string | null {
  if (!chain) return null;
  for (const [group, members] of Object.entries(BEATBOT.chainGroups)) {
    if (members.includes(chain)) return group;
  }
  return null;
}

export function tipText(tip: FieldTip, chain: string | null): string {
  if (chain && tip.byChain?.[chain]) return tip.byChain[chain];
  const group = chainGroup(chain);
  if (group && tip.byChain?.[group]) return tip.byChain[group];
  return tip.text;
}
