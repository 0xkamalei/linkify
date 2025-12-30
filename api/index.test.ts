import { describe, it, expect, vi, beforeEach } from 'vitest';
import { app } from './index';

// Mock the services to avoid DB calls
vi.mock('../server/services/linkService', () => ({
    linkService: {
        listLinks: vi.fn(),
        saveLink: vi.fn(),
        getLink: vi.fn(),
    }
}));

import { linkService } from '../server/services/linkService';

describe('API Endpoints', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('GET /api/links', () => {
        it('should return a list of links', async () => {
            const mockLinks = [{ id: '1', title: 'Test Link', link: 'http://test.com' }];
            (linkService.listLinks as any).mockResolvedValue(mockLinks);

            const res = await app.request('/api/links');
            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data).toEqual(mockLinks);
        });

        it('should return 500 on error', async () => {
            (linkService.listLinks as any).mockRejectedValue(new Error('DB Error'));

            const res = await app.request('/api/links');
            expect(res.status).toBe(500);
            const data = await res.json();
            expect(data).toHaveProperty('error');
        });
    });

    describe('POST /api/links', () => {
        it('should create a link', async () => {
            (linkService.saveLink as any).mockResolvedValue('new-id');

            const res = await app.request('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: 'New', link: 'http://new.com' })
            });

            expect(res.status).toBe(200);
            const data = await res.json();
            expect(data).toEqual({ id: 'new-id' });
        });
    });
});
