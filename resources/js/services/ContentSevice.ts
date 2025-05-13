import { ContentItem } from "@/types";


  class ContentService {
    private cache: Record<string, ContentItem> = {};

    initialize(initialData: Record<string, ContentItem> = {}) {
      this.cache = { ...this.cache, ...initialData };
    }

    async getPageContent(pageName: string): Promise<ContentItem | null> {
      const ref = `page.${pageName}`;

      if (this.cache[ref]) {
        return this.cache[ref];
      }

      try {
        const response = await fetch(`/api/content/${ref}`);
        if (!response.ok) throw new Error('Failed to fetch content');

        const content = await response.json();
        this.cache[ref] = content;
        return content;
      } catch (error) {
        console.error(`Error fetching page content (${pageName}):`, error);
        return null;
      }
    }

    clearCache() {
      this.cache = {};
    }
  }

  export const contentService = new ContentService();
