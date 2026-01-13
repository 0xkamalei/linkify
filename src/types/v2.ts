/**
 * Linkify V2 Frontend Types
 * Mirrors server types with client-side adaptations
 */

// ============================================================================
// User
// ============================================================================

export interface UserSettings {
  defaultSpace: string;
  defaultReadStatus: "unread" | "read_later" | "read";
  theme: "light" | "dark" | "auto";
  compactView: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  createdAt: any; // Firestore Timestamp or Date
  updatedAt: any;
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
  isPublic: boolean;
  order: number;
  createdAt: any;
  updatedAt: any;
}

// ============================================================================
// Folder
// ============================================================================

export interface Folder {
  id?: string;
  userId: string;
  spaceId: string;
  name: string;
  icon?: string;
  color?: string;
  parentId?: string;
  isPublic: boolean;
  order: number;
  createdAt: any;
  updatedAt: any;
}

// Tree structure for UI rendering
export interface FolderNode extends Folder {
  children: FolderNode[];
  level: number; // Depth in tree (0 = root)
  expanded?: boolean; // UI state for expand/collapse
}

// ============================================================================
// Tag
// ============================================================================

export interface Tag {
  id?: string;
  userId: string;
  name: string;
  color?: string;
  usageCount: number;
  createdAt: any;
}

// ============================================================================
// Link
// ============================================================================

export type ReadStatus = "unread" | "read_later" | "read";

export interface Link {
  id?: string;
  userId: string;
  spaceId: string;
  folderId?: string;

  // Basic information
  url: string;
  title: string;
  description?: string;
  favicon?: string;
  domain: string;

  // Organization
  tags: string[]; // Tag IDs

  // Read status
  readStatus: ReadStatus;
  lastReadAt?: any;

  // Timestamps
  createdAt: any;
  updatedAt: any;

  // Public sharing
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
  | "gte"
  | "lte"
  | "between";

export type CollectionLogic = "AND" | "OR";

export interface CollectionRule {
  field: CollectionRuleField;
  operator: CollectionRuleOperator;
  value: any;
  logic?: CollectionLogic;
}

export interface SmartCollection {
  id?: string;
  userId: string;
  name: string;
  icon: string;
  isSystem: boolean;
  rules: CollectionRule[];
  order: number;
  createdAt: any;
  updatedAt: any;
}

// ============================================================================
// Note (Private Comment)
// ============================================================================

export interface Note {
  id?: string;
  userId: string;
  linkId: string;
  content: string;
  createdAt: any;
  updatedAt?: any;
}

// ============================================================================
// Enhanced Types for UI
// ============================================================================

export interface LinkWithDetails extends Link {
  folderName?: string;
  tagNames?: string[];
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
// Filter State
// ============================================================================

export interface LinkFilters {
  spaceId?: string;
  folderId?: string;
  tags?: string[];
  tagLogic?: "AND" | "OR";
  readStatus?: ReadStatus | ReadStatus[];
  domain?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
  offset?: number;
  sortBy?: "createdAt" | "updatedAt" | "title" | "domain";
  sortOrder?: "asc" | "desc";
}

// ============================================================================
// Form Input Types
// ============================================================================

export interface CreateLinkInput {
  url: string;
  title: string;
  description?: string;
  spaceId: string;
  folderId?: string;
  tags?: string[];
  readStatus?: ReadStatus;
}

export interface UpdateLinkInput {
  title?: string;
  description?: string;
  folderId?: string;
  tags?: string[];
  readStatus?: ReadStatus;
  isPublic?: boolean;
}

export interface CreateFolderInput {
  name: string;
  spaceId: string;
  parentId?: string;
  icon?: string;
  color?: string;
}

export interface CreateSpaceInput {
  name: string;
  icon?: string;
  color?: string;
  isPublic?: boolean;
}

export interface CreateTagInput {
  name: string;
  color?: string;
}

// ============================================================================
// Batch Operations
// ============================================================================

export interface BatchLinkUpdate {
  linkIds: string[];
  updates: {
    folderId?: string;
    tags?: string[];
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
  url?: string;
  children?: BookmarkNode[];
  addDate?: number;
}

export interface ImportOptions {
  spaceId: string;
  keepStructure: boolean;
  duplicateHandling: "skip" | "overwrite" | "create";
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
// API Response Types
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  hasMore: boolean;
  nextOffset?: number;
}

// ============================================================================
// System Collections
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

// ============================================================================
// UI State Types
// ============================================================================

export interface ViewMode {
  type: "list" | "compact" | "grid";
}

export interface SidebarState {
  isOpen: boolean;
  activeSection: "spaces" | "folders" | "tags" | "collections";
}

export interface ModalState {
  isOpen: boolean;
  mode: "create" | "edit";
  data?: any;
}
