import Mint from 'mint-filter';

let filter: Mint | null = null;


const DICT_URLS = [
    "https://raw.githubusercontent.com/importcjj/sensitive/master/dict/dict.txt",
    "https://gitee.com/seven4q/sensitive-words/raw/master/words.txt"
];

export const sensitiveService = {
    async init() {
        if (filter) return;

        try {
            const words = new Set<string>();

            // Add some default basic words to ensure it works even if fetch fails
            ["badword", "sensitive"].forEach(w => words.add(w));

            // Fetch from URLs (timeout 5s)
            const fetchPromises = DICT_URLS.map(async (url) => {
                try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 5000);
                    const res = await fetch(url, { signal: controller.signal });
                    clearTimeout(timeoutId);
                    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
                    const text = await res.text();
                    text.split('\n').forEach(line => {
                        const word = line.trim();
                        if (word) words.add(word);
                    });
                } catch (e) {
                    console.error(`Failed to load sensitive words from ${url}:`, e);
                }
            });

            await Promise.all(fetchPromises);

            filter = new Mint(Array.from(words));
        } catch (e) {
            console.error("Failed to initialize sensitive filter", e);
            // Fallback to empty filter or basic one
            if (!filter) filter = new Mint(["badword"]);
        }
    },

    async isAllowText(text: string): Promise<{ allowed: boolean; word?: string }> {
        if (!filter) await this.init();

        // Mint filter verify returns true if valid (no sensitive words)
        // verify(text) -> boolean
        const valid = filter!.verify(text);
        return { allowed: valid, word: valid ? undefined : "sensitive content" };
    },

    async safeUserText(text: string): Promise<string> {
        if (!filter) await this.init();
        const result = filter!.filter(text, { replace: true });
        return result.text as string;
    }
};
