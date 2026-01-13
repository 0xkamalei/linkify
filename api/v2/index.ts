import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { cors } from 'hono/cors';
import { authMiddleware, getUserId, optionalAuthMiddleware } from './middleware/auth';

// Services
import { spaceService } from '../../server/services/spaceService';
import { folderService } from '../../server/services/folderService';
import { tagService } from '../../server/services/tagService';
import { linkServiceV2 } from '../../server/services/linkServiceV2';
import { commentServiceV2 } from '../../server/services/commentServiceV2';
import { smartCollectionService } from '../../server/services/smartCollectionService';
import { userService } from '../../server/services/userService';

const app = new Hono().basePath('/api/v2');

// Middleware
app.use('*', logger());
app.use('*', cors());

// Global error handler
app.onError((err, c) => {
  console.error('API Error:', err);
  return c.json({ error: 'Internal Server Error', message: err.message }, 500);
});

// ============================================================================
// Authentication Routes
// ============================================================================

app.get('/auth/me', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const user = await userService.getUser(userId);

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  return c.json(user);
});

// ============================================================================
// User Routes
// ============================================================================

app.get('/users/stats', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const stats = await userService.getUserStats(userId);
  return c.json(stats);
});

app.put('/users/settings', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const settings = await c.req.json();

  await userService.updateSettings(userId, settings);
  return c.json({ success: true });
});

app.put('/users/profile', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const updates = await c.req.json();

  await userService.updateUser(userId, updates);
  return c.json({ success: true });
});

// ============================================================================
// Space Routes
// ============================================================================

app.get('/spaces', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const spaces = await spaceService.listSpaces(userId);
  return c.json(spaces);
});

app.get('/spaces/:id', authMiddleware, async (c) => {
  const spaceId = c.req.param('id');
  const space = await spaceService.getSpaceWithStats(spaceId);

  if (!space) {
    return c.json({ error: 'Space not found' }, 404);
  }

  return c.json(space);
});

app.post('/spaces', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const spaceData = await c.req.json();

  const spaceId = await spaceService.createSpace(userId, spaceData);
  return c.json({ id: spaceId });
});

app.put('/spaces/:id', authMiddleware, async (c) => {
  const spaceId = c.req.param('id');
  const updates = await c.req.json();

  await spaceService.updateSpace(spaceId, updates);
  return c.json({ success: true });
});

app.delete('/spaces/:id', authMiddleware, async (c) => {
  const spaceId = c.req.param('id');
  await spaceService.deleteSpace(spaceId);
  return c.json({ success: true });
});

app.post('/spaces/:id/toggle-public', authMiddleware, async (c) => {
  const spaceId = c.req.param('id');
  const isPublic = await spaceService.togglePublic(spaceId);
  return c.json({ isPublic });
});

app.post('/spaces/reorder', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const { spaceIds } = await c.req.json();

  await spaceService.reorderSpaces(spaceIds, userId);
  return c.json({ success: true });
});

// ============================================================================
// Folder Routes
// ============================================================================

app.get('/folders', authMiddleware, async (c) => {
  const spaceId = c.req.query('spaceId');

  if (!spaceId) {
    return c.json({ error: 'spaceId required' }, 400);
  }

  const tree = c.req.query('tree') === 'true';

  if (tree) {
    const folderTree = await folderService.getFolderTree(spaceId);
    return c.json(folderTree);
  } else {
    const folders = await folderService.listFolders(spaceId);
    return c.json(folders);
  }
});

app.get('/folders/:id', authMiddleware, async (c) => {
  const folderId = c.req.param('id');
  const folder = await folderService.getFolderWithStats(folderId);

  if (!folder) {
    return c.json({ error: 'Folder not found' }, 404);
  }

  return c.json(folder);
});

app.get('/folders/:id/path', authMiddleware, async (c) => {
  const folderId = c.req.param('id');
  const path = await folderService.getFolderPath(folderId);
  return c.json(path);
});

app.post('/folders', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const { spaceId, ...folderData } = await c.req.json();

  const folderId = await folderService.createFolder(userId, spaceId, folderData);
  return c.json({ id: folderId });
});

app.put('/folders/:id', authMiddleware, async (c) => {
  const folderId = c.req.param('id');
  const updates = await c.req.json();

  await folderService.updateFolder(folderId, updates);
  return c.json({ success: true });
});

app.delete('/folders/:id', authMiddleware, async (c) => {
  const folderId = c.req.param('id');
  const cascade = c.req.query('cascade') !== 'false'; // Default true

  await folderService.deleteFolder(folderId, cascade);
  return c.json({ success: true });
});

app.post('/folders/:id/move', authMiddleware, async (c) => {
  const folderId = c.req.param('id');
  const { newParentId } = await c.req.json();

  await folderService.moveFolder(folderId, newParentId);
  return c.json({ success: true });
});

app.post('/folders/:id/toggle-public', authMiddleware, async (c) => {
  const folderId = c.req.param('id');
  const isPublic = await folderService.togglePublic(folderId);
  return c.json({ isPublic });
});

app.post('/folders/reorder', authMiddleware, async (c) => {
  const { folderIds, parentId } = await c.req.json();

  await folderService.reorderFolders(folderIds, parentId);
  return c.json({ success: true });
});

// ============================================================================
// Tag Routes
// ============================================================================

app.get('/tags', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const search = c.req.query('search');

  if (search) {
    const tags = await tagService.searchTags(userId, search);
    return c.json(tags);
  }

  const tags = await tagService.listTags(userId);
  return c.json(tags);
});

app.get('/tags/popular', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const limit = parseInt(c.req.query('limit') || '10');

  const tags = await tagService.getPopularTags(userId, limit);
  return c.json(tags);
});

app.get('/tags/:id', authMiddleware, async (c) => {
  const tagId = c.req.param('id');
  const tag = await tagService.getTag(tagId);

  if (!tag) {
    return c.json({ error: 'Tag not found' }, 404);
  }

  return c.json(tag);
});

app.post('/tags', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const tagData = await c.req.json();

  const tagId = await tagService.createTag(userId, tagData);
  return c.json({ id: tagId });
});

app.put('/tags/:id', authMiddleware, async (c) => {
  const tagId = c.req.param('id');
  const updates = await c.req.json();

  await tagService.updateTag(tagId, updates);
  return c.json({ success: true });
});

app.delete('/tags/:id', authMiddleware, async (c) => {
  const tagId = c.req.param('id');
  await tagService.deleteTag(tagId);
  return c.json({ success: true });
});

app.post('/tags/:id/merge', authMiddleware, async (c) => {
  const sourceTagId = c.req.param('id');
  const { targetTagId } = await c.req.json();

  await tagService.mergeTags(sourceTagId, targetTagId);
  return c.json({ success: true });
});

// ============================================================================
// Link Routes
// ============================================================================

app.get('/links', authMiddleware, async (c) => {
  const userId = getUserId(c);

  // Build filters from query params
  const filters: any = {};

  if (c.req.query('spaceId')) filters.spaceId = c.req.query('spaceId');
  if (c.req.query('folderId')) filters.folderId = c.req.query('folderId');
  if (c.req.query('readStatus')) filters.readStatus = c.req.query('readStatus');
  if (c.req.query('domain')) filters.domain = c.req.query('domain');
  if (c.req.query('search')) filters.search = c.req.query('search');

  if (c.req.query('tags')) {
    filters.tags = c.req.query('tags')!.split(',');
    filters.tagLogic = c.req.query('tagLogic') || 'AND';
  }

  if (c.req.query('startDate')) {
    filters.startDate = new Date(c.req.query('startDate')!);
  }
  if (c.req.query('endDate')) {
    filters.endDate = new Date(c.req.query('endDate')!);
  }

  filters.limit = parseInt(c.req.query('limit') || '50');
  filters.offset = parseInt(c.req.query('offset') || '0');
  filters.sortBy = c.req.query('sortBy') || 'createdAt';
  filters.sortOrder = c.req.query('sortOrder') || 'desc';

  const links = await linkServiceV2.getLinks(filters);
  return c.json(links);
});

app.get('/links/:id', authMiddleware, async (c) => {
  const linkId = c.req.param('id');
  const link = await linkServiceV2.getLink(linkId);

  if (!link) {
    return c.json({ error: 'Link not found' }, 404);
  }

  return c.json(link);
});

app.post('/links', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const linkData = await c.req.json();

  const linkId = await linkServiceV2.createLink(userId, linkData);
  return c.json({ id: linkId });
});

app.put('/links/:id', authMiddleware, async (c) => {
  const linkId = c.req.param('id');
  const updates = await c.req.json();

  await linkServiceV2.updateLink(linkId, updates);
  return c.json({ success: true });
});

app.patch('/links/:id/status', authMiddleware, async (c) => {
  const linkId = c.req.param('id');
  const { readStatus } = await c.req.json();

  await linkServiceV2.updateReadStatus(linkId, readStatus);
  return c.json({ success: true });
});

app.delete('/links/:id', authMiddleware, async (c) => {
  const linkId = c.req.param('id');
  await linkServiceV2.deleteLink(linkId);
  return c.json({ success: true });
});

app.post('/links/batch', authMiddleware, async (c) => {
  const batchUpdate = await c.req.json();
  await linkServiceV2.batchUpdateLinks(batchUpdate);
  return c.json({ success: true });
});

app.get('/links/domains/list', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const spaceId = c.req.query('spaceId');

  const domains = await linkServiceV2.getUniqueDomains(userId, spaceId);
  return c.json(domains);
});

app.get('/links/check-duplicate', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const url = c.req.query('url');

  if (!url) {
    return c.json({ error: 'url required' }, 400);
  }

  const duplicate = await linkServiceV2.findDuplicateUrl(userId, url);
  return c.json({ duplicate: !!duplicate, link: duplicate });
});

// ============================================================================
// Smart Collection Routes
// ============================================================================

app.get('/collections', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const collections = await smartCollectionService.listCollections(userId);
  return c.json(collections);
});

app.get('/collections/:id', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const collectionId = c.req.param('id');

  const collection = await smartCollectionService.getCollectionWithStats(collectionId, userId);

  if (!collection) {
    return c.json({ error: 'Collection not found' }, 404);
  }

  return c.json(collection);
});

app.get('/collections/:id/links', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const collectionId = c.req.param('id');
  const limit = parseInt(c.req.query('limit') || '50');
  const offset = parseInt(c.req.query('offset') || '0');

  const links = await smartCollectionService.getCollectionLinks(collectionId, userId, limit, offset);
  return c.json(links);
});

app.post('/collections', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const collectionData = await c.req.json();

  const collectionId = await smartCollectionService.createCollection(userId, collectionData);
  return c.json({ id: collectionId });
});

app.put('/collections/:id', authMiddleware, async (c) => {
  const collectionId = c.req.param('id');
  const updates = await c.req.json();

  await smartCollectionService.updateCollection(collectionId, updates);
  return c.json({ success: true });
});

app.delete('/collections/:id', authMiddleware, async (c) => {
  const collectionId = c.req.param('id');
  await smartCollectionService.deleteCollection(collectionId);
  return c.json({ success: true });
});

app.post('/collections/reorder', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const { collectionIds } = await c.req.json();

  await smartCollectionService.reorderCollections(collectionIds, userId);
  return c.json({ success: true });
});

// ============================================================================
// Note (Comment) Routes
// ============================================================================

app.get('/notes', authMiddleware, async (c) => {
  const linkId = c.req.query('linkId');

  if (!linkId) {
    return c.json({ error: 'linkId required' }, 400);
  }

  const notes = await commentServiceV2.listNotes(linkId);
  return c.json(notes);
});

app.post('/notes', authMiddleware, async (c) => {
  const userId = getUserId(c);
  const { linkId, content } = await c.req.json();

  const noteId = await commentServiceV2.createNote(userId, linkId, content);
  return c.json({ id: noteId });
});

app.put('/notes/:id', authMiddleware, async (c) => {
  const noteId = c.req.param('id');
  const { content } = await c.req.json();

  await commentServiceV2.updateNote(noteId, content);
  return c.json({ success: true });
});

app.delete('/notes/:id', authMiddleware, async (c) => {
  const noteId = c.req.param('id');
  await commentServiceV2.deleteNote(noteId);
  return c.json({ success: true });
});

// ============================================================================
// Public Routes (no auth required)
// ============================================================================

app.get('/public/:username', optionalAuthMiddleware, async (c) => {
  const username = c.req.param('username');
  const user = await userService.getUserByUsername(username);

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  // Get public spaces
  const allSpaces = await spaceService.listSpaces(user.id);
  const publicSpaces = allSpaces.filter(space => space.isPublic);

  return c.json({
    user: {
      username: user.username,
      displayName: user.displayName,
      avatar: user.avatar,
    },
    spaces: publicSpaces,
  });
});

app.get('/public/:username/:folderId', optionalAuthMiddleware, async (c) => {
  const username = c.req.param('username');
  const folderId = c.req.param('folderId');

  const user = await userService.getUserByUsername(username);
  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const folder = await folderService.getFolder(folderId);
  if (!folder || !folder.isPublic) {
    return c.json({ error: 'Folder not found or not public' }, 404);
  }

  // Get links in this folder
  const links = await linkServiceV2.getLinks({
    folderId,
    limit: 100,
  });

  const publicLinks = links.filter(link => link.isPublic);

  return c.json({
    user: {
      username: user.username,
      displayName: user.displayName,
    },
    folder: {
      name: folder.name,
      icon: folder.icon,
      color: folder.color,
    },
    links: publicLinks,
  });
});

export default app;
