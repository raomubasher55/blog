export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track blog post reading
export const trackBlogPost = (title: string, slug: string) => {
  event({
    action: 'view_blog_post',
    category: 'engagement',
    label: title,
  });
};

// Track CTA clicks
export const trackCTA = (ctaName: string, location: string) => {
  event({
    action: 'click_cta',
    category: 'conversion',
    label: `${ctaName} - ${location}`,
  });
};

// Track admin actions
export const trackAdminAction = (action: string) => {
  event({
    action: action,
    category: 'admin',
  });
};

// Declare gtag function for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}