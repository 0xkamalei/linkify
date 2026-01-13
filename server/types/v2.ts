import type { Timestamp } from "firebase-admin/firestore";

/**
 * Linkify V2 Data Models
 * Private link management system with spaces, folders, tags, and smart collections
 */

// ============================================================================
// User
// ============================================================================

export interface UserSettings {
  defaultSpace: string; // Default space ID
  defaultReadStatus: "unread" | "read_later" | "read";
  theme: "light" | "dark" | "auto";
  compactView: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string; // Unique username for public profile URLs
  displayName: string;
  avatar?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  settings: UserSettings;
}

// ============================================================================
// Space
// ============================================================================

export interface Space {
  id?: string;
  userId: string;
  name: string;
  icon?: string;
  color?: string;
  isPublic: boolean; // Whether this space is publicly accessible
  order: number; // Display order
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// Folder
// ============================================================================

export interface Folder {
  id?: string;
  userId: string;
  spaceId: string; // Which space this folder belongs to
  name: string;
  icon?: string;
  color?: string;
  parentId?: string; // Parent folder ID for nesting (undefined = root level)
  isPublic: boolean; // Whether this folder is publicly accessible (inherits from space but can override)
  order: number; // Display order within parent
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// Tag
// ============================================================================

export interface Tag {
  id?: string;
  userId: string;
  name: string;
  color?: string;
  usageCount: number; // Number of links using this tag
  createdAt: Timestamp;
}

// ============================================================================
// Link
// ============================================================================

export type ReadStatus = "unread" | "read_later" | "read";

export interface Link {
  id?: string;
  userId: string;
  spaceId: string;
  folderId?: string; // Optional - links can exist without a folder

  // Link basic information
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  domain: string; // Extracted from URL (e.g., "github.com"), used for filtering/grouping

  // Organization
  tags: string[]; // Array of tag IDs

  // Read status tracking
  readStatus: ReadStatus;
  lastReadAt?: Timestamp; // When status was last changed to "read"

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Public sharing (inherits from Folder/Space but can override)
  isPublic: boolean;
}

// ============================================================================
// Smart Collection
// ============================================================================

export type CollectionRuleField =
  | "folderId"
  | "tagId"
  | "readStatus"
  | "domain"
  | "createdAt";

export type CollectionRuleOperator =
  | "equals"
  | "contains"
  | "in"
  | "gte" // greater than or equal
  | "lte" // less than or equal
  | "between";

export type CollectionLogic = "AND" | "OR";

export interface CollectionRule {
  field: CollectionRuleField;
  operator: CollectionRuleOperator;
  value: any; // Type varies based on field
  logic?: CollectionLogic; // Logic connector to next rule (undefined for last rule)
}

export interface SmartCollection {
  id?: string;
  userId: string;
  name: string;
  icon: string;
  isSystem: boolean; // True for system presets, false for user-created
  rules: CollectionRule[];
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// Note (Private Comment)
// ============================================================================

export interface Note {
  id?: string;
  userId: string;
  linkId: string;
  content: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

// ============================================================================
// Helper Types for API Responses
// ============================================================================

export interface LinkWithDetails extends Link {
  folderName?: string;
  tagNames?: string[]; // Resolved tag names from tag IDs
  noteCount?: number;
}

export interface FolderWithStats extends Folder {
  linkCount: number;
  childFolderCount: number;
}

export interface SpaceWithStats extends Space {
  linkCount: number;
  folderCount: number;
}

// ============================================================================
// Query Filters
// ============================================================================

export interface LinkFilters {
  spaceId?: string;
  folderId?: string;
  tags?: string[]; // Array of tag IDs
  tagLogic?: "AND" | "OR"; // How to combine multiple tags
  readStatus?: ReadStatus | ReadStatus[];
  domain?: string;
  search?: string; // Search in title, URL, description
  startDate?: Date | Timestamp;
  endDate?: Date | Timestamp;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "updatedAt" | "title" | "domain";
  sortOrder?: "asc" | "desc";
}

// ============================================================================
// Batch Operations
// ============================================================================

export interface BatchLinkUpdate {
  linkIds: string[];
  updates: {
    folderId?: string;
    tags?: string[]; // Replace or append based on operation
    tagOperation?: "replace" | "append" | "remove";
    readStatus?: ReadStatus;
    isPublic?: boolean;
  };
}

// ============================================================================
// Import/Export
// ============================================================================

export interface BookmarkNode {
  type: "folder" | "bookmark";
  title: string;
  url?: string; // Only for bookmarks
  children?: BookmarkNode[]; // Only for folders
  addDate?: number; // Unix timestamp
}

export interface ImportOptions {
  spaceId: string;
  keepStructure: boolean; // Keep folder hierarchy or flatten
  duplicateHandling: "skip" | "overwrite" | "create"; // How to handle duplicate URLs
}

export interface ImportResult {
  success: boolean;
  foldersCreated: number;
  linksImported: number;
  linksSkipped: number;
  errors: string[];
}

export type ExportFormat = "json" | "html" | "markdown" | "csv";

// ============================================================================
// System Collections Presets
// ============================================================================

export const SYSTEM_COLLECTIONS = {
  UNREAD: "system:unread",
  READ_LATER: "system:read_later",
  READ: "system:read",
  RECENT_7_DAYS: "system:recent_7_days",
  THIS_WEEK: "system:this_week",
  THIS_MONTH: "system:this_month",
  BY_DOMAIN: "system:by_domain",
} as const;
