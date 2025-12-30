import { describe, it, expect, vi, beforeEach } from 'vitest';
import { linkService } from './linkService';
import { adminDb } from '../lib/firebaseAdmin';

// Mock firebaseAdmin and sensitiveService
vi.mock('../lib/firebaseAdmin', () => ({
    adminDb: {
        collection: vi.fn(),
    },
}));

// Mock sensitiveService to avoid network calls and just return transformed text
vi.mock('./sensitiveService', () => ({
    sensitiveService: {
        safeUserText: vi.fn(async (text: string) => text.replace('bad', '***')),
    }
}));

describe('linkService', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should save link with sanitized content', async () => {
        const mockAdd = vi.fn().mockResolvedValue({ id: 'test-id' });
        (adminDb.collection as any).mockReturnValue({
            add: mockAdd,
        });

        const link = {
            link: 'http://example.com',
            title: 'bad title',
            description: 'bad description',
            topicId: 'topic1',
            score: 0,
            agree: 0,
            disagree: 0,
            commentCnt: 0,
            createBy: 'user1',
            createTime: null,
        };

        const id = await linkService.saveLink(link);

        expect(id).toBe('test-id');
        expect(mockAdd).toHaveBeenCalledWith(expect.objectContaining({
            title: '*** title',
            description: '*** description',
        }));
    });
});
