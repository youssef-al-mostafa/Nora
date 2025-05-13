import { useState, useEffect } from 'react';
import { contentService } from '../services/ContentSevice';
import type { ContentItem } from '../types';

export function usePageContent(pageName: string) {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const data = await contentService.getPageContent(pageName);
        setContent(data);
        setError(null);
      } catch (err) {
        setError('Failed to load content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchContent();
  }, [pageName]);

  return {
    content,
    attrs: content?.attrs || {},
    loading,
    error
  };
}
