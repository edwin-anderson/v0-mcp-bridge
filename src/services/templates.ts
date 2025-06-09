import type { UITemplate } from '../types/index.js';

// UI Pattern Templates Repository - Visual patterns only, no project structure
export const UI_TEMPLATES: UITemplate[] = [
  // Form Templates
  {
    name: 'login-form',
    category: 'forms',
    description: 'Login form with email, password, and submit button',
    visual_pattern: 'Vertical form with Card container, Input fields, and primary Button',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Input', 'Button', 'Label'],
    responsive_features: ['Mobile-first layout', 'Touch-friendly inputs', 'Adaptive spacing'],
    accessibility_features: ['ARIA labels', 'Keyboard navigation', 'Screen reader support'],
    variants: [
      {
        name: 'with-social',
        description: 'Includes social login buttons',
        modifications: ['Add social Button variants', 'Include separator with "or" text']
      },
      {
        name: 'with-remember',
        description: 'Includes remember me checkbox',
        modifications: ['Add Checkbox component', 'Include forgot password Link']
      }
    ]
  },
  {
    name: 'contact-form',
    category: 'forms',
    description: 'Contact form with name, email, message, and submit',
    visual_pattern: 'Vertical form with structured Input layout and Textarea for messages',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Input', 'Textarea', 'Button', 'Label'],
    responsive_features: ['Responsive grid layout', 'Mobile-optimized spacing'],
    accessibility_features: ['Required field indicators', 'Error message associations'],
    variants: [
      {
        name: 'with-validation',
        description: 'Includes real-time validation',
        modifications: ['Add error states', 'Include success feedback']
      }
    ]
  },

  // Card Templates
  {
    name: 'product-card',
    category: 'cards',
    description: 'Product card with image, title, price, and action button',
    visual_pattern: 'Card with AspectRatio image, content section, and action area',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'CardFooter', 'Button', 'Badge'],
    responsive_features: ['Flexible image sizing', 'Responsive typography'],
    accessibility_features: ['Alt text for images', 'Semantic pricing information'],
    variants: [
      {
        name: 'with-rating',
        description: 'Includes star rating display',
        modifications: ['Add rating stars', 'Include review count']
      },
      {
        name: 'compact',
        description: 'Smaller, condensed layout',
        modifications: ['Reduced padding', 'Smaller image ratio']
      }
    ]
  },
  {
    name: 'user-profile-card',
    category: 'cards',
    description: 'User profile card with avatar, name, role, and contact info',
    visual_pattern: 'Card with Avatar, user details, and optional action buttons',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Avatar', 'Badge', 'Button'],
    responsive_features: ['Avatar size adaptation', 'Content overflow handling'],
    accessibility_features: ['Profile image alt text', 'Contact information structure'],
    variants: [
      {
        name: 'with-stats',
        description: 'Includes user statistics',
        modifications: ['Add stats grid', 'Include metric displays']
      }
    ]
  },

  // Navigation Templates
  {
    name: 'header-nav',
    category: 'navigation',
    description: 'Header navigation with logo, menu items, and user actions',
    visual_pattern: 'Horizontal header with flex layout and responsive menu',
    shadcn_components: ['NavigationMenu', 'Button', 'Avatar', 'DropdownMenu', 'Sheet'],
    responsive_features: ['Mobile hamburger menu', 'Collapsible navigation'],
    accessibility_features: ['Keyboard navigation', 'Focus indicators', 'Menu announcements'],
    variants: [
      {
        name: 'with-search',
        description: 'Includes search functionality',
        modifications: ['Add search Input', 'Include search results dropdown']
      },
      {
        name: 'minimal',
        description: 'Clean, minimal design',
        modifications: ['Reduced visual elements', 'Simple typography']
      }
    ]
  },
  {
    name: 'sidebar-nav',
    category: 'navigation',
    description: 'Sidebar navigation with collapsible menu items',
    visual_pattern: 'Vertical sidebar with hierarchical menu structure',
    shadcn_components: ['Sheet', 'Button', 'Accordion', 'Separator', 'ScrollArea'],
    responsive_features: ['Collapsible on mobile', 'Smooth transitions'],
    accessibility_features: ['ARIA expanded states', 'Landmark navigation'],
    variants: [
      {
        name: 'with-icons',
        description: 'Includes icons for menu items',
        modifications: ['Add Lucide icons', 'Icon-text alignment']
      }
    ]
  },

  // Layout Templates
  {
    name: 'dashboard-grid',
    category: 'layouts',
    description: 'Dashboard layout with responsive grid of widgets',
    visual_pattern: 'CSS Grid layout with Card-based widgets',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Separator'],
    responsive_features: ['Responsive grid columns', 'Mobile-first stacking'],
    accessibility_features: ['Logical reading order', 'Widget landmarks'],
    variants: [
      {
        name: 'with-sidebar',
        description: 'Includes navigation sidebar',
        modifications: ['Add sidebar layout', 'Adjust grid columns']
      }
    ]
  },
  {
    name: 'hero-section',
    category: 'layouts',
    description: 'Hero section with title, description, and call-to-action',
    visual_pattern: 'Centered content with large typography and button',
    shadcn_components: ['Button', 'Badge'],
    responsive_features: ['Responsive typography scaling', 'Mobile padding adjustments'],
    accessibility_features: ['Heading hierarchy', 'Focus-visible buttons'],
    variants: [
      {
        name: 'with-image',
        description: 'Includes background or featured image',
        modifications: ['Add image container', 'Overlay text handling']
      }
    ]
  },

  // Data Display Templates
  {
    name: 'data-table',
    category: 'data-display',
    description: 'Data table with sorting, filtering, and pagination',
    visual_pattern: 'Table with header controls and pagination footer',
    shadcn_components: ['Table', 'Button', 'Input', 'Select', 'Pagination'],
    responsive_features: ['Horizontal scroll on mobile', 'Collapsible columns'],
    accessibility_features: ['Sortable column announcements', 'Table navigation'],
    variants: [
      {
        name: 'with-actions',
        description: 'Includes row action buttons',
        modifications: ['Add action column', 'Include row selection']
      }
    ]
  },
  {
    name: 'stats-grid',
    category: 'data-display',
    description: 'Statistics grid with metrics and trend indicators',
    visual_pattern: 'Grid of Cards with metric displays and visual indicators',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Badge', 'Progress'],
    responsive_features: ['Responsive grid layout', 'Mobile-optimized spacing'],
    accessibility_features: ['Metric value announcements', 'Trend descriptions'],
    variants: [
      {
        name: 'with-charts',
        description: 'Includes small chart visualizations',
        modifications: ['Add chart containers', 'Include data visualization']
      }
    ]
  },
  {
    name: 'search-form',
    category: 'forms',
    description: 'Search form with input field, filters, and autocomplete suggestions',
    visual_pattern: 'Horizontal form with search Input, filter dropdowns, and results area',
    shadcn_components: ['Card', 'Input', 'Button', 'Select', 'Popover', 'Command'],
    responsive_features: ['Mobile-optimized layout', 'Collapsible filters', 'Touch-friendly controls'],
    accessibility_features: ['Search suggestions announcements', 'Filter labels', 'Results count'],
    variants: [
      {
        name: 'with-autocomplete',
        description: 'Includes search suggestions and autocomplete',
        modifications: ['Add Command component', 'Real-time search suggestions']
      },
      {
        name: 'advanced-filters',
        description: 'Multiple filter categories and date ranges',
        modifications: ['Category Select components', 'Date range picker']
      }
    ]
  },
  {
    name: 'settings-form',
    category: 'forms',
    description: 'User preferences form with toggles, selects, and grouped settings',
    visual_pattern: 'Sectioned form with setting groups, switches, and descriptive labels',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Switch', 'Select', 'Label', 'Separator'],
    responsive_features: ['Mobile-optimized sections', 'Collapsible setting groups'],
    accessibility_features: ['Setting descriptions', 'Toggle state announcements', 'Grouped controls'],
    variants: [
      {
        name: 'privacy-settings',
        description: 'Privacy and security focused settings',
        modifications: ['Privacy-specific controls', 'Security badges']
      },
      {
        name: 'notification-settings',
        description: 'Notification preferences and channels',
        modifications: ['Notification type toggles', 'Channel selection']
      }
    ]
  },

  // Tier 1 Common Templates - High Priority

  // Additional Form Templates
  {
    name: 'signup-form',
    category: 'forms',
    description: 'User registration form with email verification and password confirmation',
    visual_pattern: 'Vertical form with Input validation, password strength, and terms acceptance',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Input', 'Button', 'Label', 'Checkbox'],
    responsive_features: ['Mobile-first layout', 'Touch-friendly inputs', 'Responsive validation'],
    accessibility_features: ['Password requirements announcement', 'Error field associations', 'Form validation feedback'],
    variants: [
      {
        name: 'with-social',
        description: 'Includes social registration options',
        modifications: ['Add social Button variants', 'OAuth provider integration']
      },
      {
        name: 'multi-step',
        description: 'Multi-step registration process',
        modifications: ['Add progress indicator', 'Step navigation controls']
      }
    ]
  },
  {
    name: 'checkout-form',
    category: 'forms',
    description: 'E-commerce checkout form with payment and shipping details',
    visual_pattern: 'Multi-section form with billing, shipping, and payment sections',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Input', 'Select', 'Button', 'Label', 'Separator'],
    responsive_features: ['Mobile-optimized layout', 'Collapsible sections', 'Touch-friendly controls'],
    accessibility_features: ['Payment security announcements', 'Required field indicators', 'Form section landmarks'],
    variants: [
      {
        name: 'guest-checkout',
        description: 'Simplified guest checkout option',
        modifications: ['Remove account creation', 'Streamlined fields']
      },
      {
        name: 'express-checkout',
        description: 'One-click checkout with saved details',
        modifications: ['Saved payment methods', 'Address selection']
      }
    ]
  },

  // Additional Card Templates
  {
    name: 'pricing-card',
    category: 'cards',
    description: 'Subscription pricing plan with features list and CTA button',
    visual_pattern: 'Card with pricing header, features list, and prominent action button',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'CardFooter', 'Button', 'Badge', 'Separator'],
    responsive_features: ['Responsive grid layout', 'Mobile-optimized pricing display'],
    accessibility_features: ['Price announcements', 'Feature list navigation', 'Plan comparison support'],
    variants: [
      {
        name: 'popular',
        description: 'Highlighted as most popular plan',
        modifications: ['Add popular Badge', 'Enhanced visual prominence']
      },
      {
        name: 'enterprise',
        description: 'Enterprise plan with custom pricing',
        modifications: ['Contact sales Button', 'Custom feature highlights']
      }
    ]
  },

  // Additional Layout Templates
  {
    name: 'auth-layout',
    category: 'layouts',
    description: 'Centered authentication layout for login and signup pages',
    visual_pattern: 'Centered Card with brand logo and form container',
    shadcn_components: ['Card', 'CardHeader', 'CardContent'],
    responsive_features: ['Centered on all screen sizes', 'Mobile-optimized spacing'],
    accessibility_features: ['Focus management', 'Skip to main content', 'Logical tab order'],
    variants: [
      {
        name: 'with-background',
        description: 'Includes branded background image or pattern',
        modifications: ['Add background container', 'Overlay styling']
      },
      {
        name: 'split-screen',
        description: 'Split layout with form and promotional content',
        modifications: ['Two-column layout', 'Content section with benefits']
      }
    ]
  },
  {
    name: 'landing-page',
    category: 'layouts',
    description: 'Marketing landing page with hero, features, testimonials, and CTA sections',
    visual_pattern: 'Multi-section layout with hero banner, feature grid, and call-to-action areas',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Button', 'Badge', 'Separator'],
    responsive_features: ['Mobile-first sections', 'Responsive grids', 'Touch-optimized CTAs'],
    accessibility_features: ['Section landmarks', 'Heading hierarchy', 'Skip navigation'],
    variants: [
      {
        name: 'saas-landing',
        description: 'SaaS product focused with pricing and features',
        modifications: ['Pricing section', 'Feature comparison table']
      },
      {
        name: 'app-landing',
        description: 'Mobile app promotion with download links',
        modifications: ['App store badges', 'Device mockups']
      }
    ]
  },
  {
    name: 'profile-layout',
    category: 'layouts',
    description: 'User profile page with header, tabs, and content sections',
    visual_pattern: 'Header with user info, tabbed navigation, and content area',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Avatar', 'Tabs', 'TabsList', 'TabsContent', 'Button'],
    responsive_features: ['Mobile tab navigation', 'Responsive profile header'],
    accessibility_features: ['Tab navigation', 'Profile information structure', 'Action button labels'],
    variants: [
      {
        name: 'public-profile',
        description: 'Public-facing profile with social features',
        modifications: ['Social links', 'Public activity feed']
      },
      {
        name: 'settings-profile',
        description: 'Account settings and preferences',
        modifications: ['Settings forms', 'Privacy controls']
      }
    ]
  },
  {
    name: 'error-page',
    category: 'layouts',
    description: 'Error page layout for 404, 500, and other error states',
    visual_pattern: 'Centered layout with error illustration, message, and navigation options',
    shadcn_components: ['Card', 'CardHeader', 'CardContent', 'Button'],
    responsive_features: ['Mobile-centered layout', 'Responsive error messaging'],
    accessibility_features: ['Clear error communication', 'Navigation alternatives', 'Screen reader friendly'],
    variants: [
      {
        name: '404-not-found',
        description: 'Page not found with search and navigation',
        modifications: ['Search suggestions', 'Popular pages links']
      },
      {
        name: 'maintenance',
        description: 'Maintenance mode with estimated time',
        modifications: ['Maintenance message', 'Status updates']
      }
    ]
  },

  // Modals & Overlays Templates - New Category
  {
    name: 'confirmation-dialog',
    category: 'modals',
    description: 'Confirmation dialog for destructive actions like delete or logout',
    visual_pattern: 'Dialog with title, description, and action buttons (Cancel/Confirm)',
    shadcn_components: ['Dialog', 'DialogContent', 'DialogHeader', 'DialogTitle', 'DialogDescription', 'DialogFooter', 'Button'],
    responsive_features: ['Mobile-optimized sizing', 'Touch-friendly buttons'],
    accessibility_features: ['Focus trap', 'Escape key handling', 'Action button emphasis'],
    variants: [
      {
        name: 'destructive',
        description: 'Emphasized warning for destructive actions',
        modifications: ['Red warning styling', 'Enhanced confirmation text']
      },
      {
        name: 'with-input',
        description: 'Requires text input for confirmation',
        modifications: ['Add Input field', 'Validation for confirmation text']
      }
    ]
  },
  {
    name: 'image-gallery',
    category: 'modals',
    description: 'Lightbox modal for viewing images with navigation and zoom',
    visual_pattern: 'Full-screen Dialog with image display, navigation arrows, and controls',
    shadcn_components: ['Dialog', 'DialogContent', 'Button', 'ScrollArea'],
    responsive_features: ['Touch gestures support', 'Mobile swipe navigation'],
    accessibility_features: ['Keyboard navigation', 'Image alt text', 'Close button prominence'],
    variants: [
      {
        name: 'with-thumbnails',
        description: 'Includes thumbnail navigation strip',
        modifications: ['Add thumbnail ScrollArea', 'Active image highlighting']
      },
      {
        name: 'with-zoom',
        description: 'Supports image zoom and pan functionality',
        modifications: ['Zoom controls', 'Pan gesture support']
      }
    ]
  },
  {
    name: 'drawer-panel',
    category: 'modals',
    description: 'Side panel overlay for detailed content or navigation',
    visual_pattern: 'Sheet component sliding from side with header and scrollable content',
    shadcn_components: ['Sheet', 'SheetContent', 'SheetHeader', 'SheetTitle', 'SheetDescription', 'ScrollArea', 'Button'],
    responsive_features: ['Mobile-first design', 'Responsive width adjustment'],
    accessibility_features: ['Focus management', 'Close button accessibility', 'Content landmarks'],
    variants: [
      {
        name: 'navigation',
        description: 'Mobile navigation menu with hierarchical links',
        modifications: ['Navigation menu structure', 'Link grouping']
      },
      {
        name: 'form-panel',
        description: 'Side panel containing form inputs',
        modifications: ['Form layout optimization', 'Submit/cancel actions']
      }
    ]
  }
];

export function getTemplate(name: string): UITemplate | undefined {
  return UI_TEMPLATES.find(template => template.name === name);
}

export function getTemplatesByCategory(category: UITemplate['category']): UITemplate[] {
  return UI_TEMPLATES.filter(template => template.category === category);
}

export function getAllTemplates(): UITemplate[] {
  return UI_TEMPLATES;
}

export function searchTemplates(query: string): UITemplate[] {
  const lowercaseQuery = query.toLowerCase();
  return UI_TEMPLATES.filter(template =>
    template.name.toLowerCase().includes(lowercaseQuery) ||
    template.description.toLowerCase().includes(lowercaseQuery) ||
    template.visual_pattern.toLowerCase().includes(lowercaseQuery)
  );
}