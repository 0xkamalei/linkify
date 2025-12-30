import { describe, it, expect, beforeAll } from 'vitest';
import { sensitiveService } from './sensitiveService';

describe('sensitiveService', () => {
    beforeAll(async () => {
        await sensitiveService.init();
    });

    it('should allow clean text', async () => {
        const { allowed } = await sensitiveService.isAllowText('Hello world');
        expect(allowed).toBe(true);
    });

    it('should detect sensitive words (using default badword)', async () => {
        const { allowed } = await sensitiveService.isAllowText('This contains a sensitive word');
        // Note: we added 'sensitive' as a default bad word in the service
        expect(allowed).toBe(false);
    });

    it('should sanitize text', async () => {
        const clean = await sensitiveService.safeUserText('This is sensitive info');
        expect(clean).toContain('*********');
        expect(clean).not.toContain('sensitive');
    });
});
