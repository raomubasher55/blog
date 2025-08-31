'use client';

import { useEffect } from 'react';
import { trackBlogPost } from '@/lib/gtag';

interface BlogPostTrackerProps {
  title: string;
  slug: string;
}

export default function BlogPostTracker({ title, slug }: BlogPostTrackerProps) {
  useEffect(() => {
    // Track blog post view
    trackBlogPost(title);

    // Track scroll depth
    let maxScroll = 0;
    let tracked25 = false;
    let tracked50 = false;
    let tracked75 = false;
    let tracked100 = false;

    const trackScrollDepth = () => {
      const scrollPercent = Math.round(
        (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
      );

      maxScroll = Math.max(maxScroll, scrollPercent);

      if (scrollPercent >= 25 && !tracked25) {
        tracked25 = true;
        if (window.gtag) {
          window.gtag('event', 'scroll_depth_25', {
            event_category: 'engagement',
            event_label: title,
            custom_parameter: slug,
          });
        }
      }
      if (scrollPercent >= 50 && !tracked50) {
        tracked50 = true;
        if (window.gtag) {
          window.gtag('event', 'scroll_depth_50', {
            event_category: 'engagement',
            event_label: title,
            custom_parameter: slug,
          });
        }
      }
      if (scrollPercent >= 75 && !tracked75) {
        tracked75 = true;
        if (window.gtag) {
          window.gtag('event', 'scroll_depth_75', {
            event_category: 'engagement',
            event_label: title,
            custom_parameter: slug,
          });
        }
      }
      if (scrollPercent >= 100 && !tracked100) {
        tracked100 = true;
        if (window.gtag) {
          window.gtag('event', 'scroll_depth_100', {
            event_category: 'engagement',
            event_label: title,
            custom_parameter: slug,
          });
        }
      }
    };

    window.addEventListener('scroll', trackScrollDepth, { passive: true });

    return () => {
      window.removeEventListener('scroll', trackScrollDepth);
    };
  }, [title, slug]);

  return null;
}