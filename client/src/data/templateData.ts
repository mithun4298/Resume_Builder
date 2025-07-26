import { TemplateId } from '@/components/resume-templates';

export interface TemplateConfig {
  id: TemplateId;
  name: string;
  description: string;
  category: string;
  features: string[];
  recommended?: boolean;
  preview: string;
  accentColor: string;
  suitableFor: string[];
}

export const TEMPLATE_CONFIGS: TemplateConfig[] = [
  {
    id: 'modern',
    name: 'Modern Professional',
    description: 'Clean, contemporary design perfect for tech and creative professionals',
    category: 'Professional',
    features: ['Clean Layout', 'Modern Typography', 'Skill Highlights', 'ATS Friendly'],
    recommended: true,
    preview: '/templates/modern-preview.png',
    accentColor: '#3B82F6',
    suitableFor: ['Software Engineer', 'Designer', 'Product Manager', 'Marketing']
  },
  {
    id: 'classic',
    name: 'Classic Professional',
    description: 'Traditional, elegant design ideal for corporate and formal industries',
    category: 'Traditional',
    features: ['Professional Layout', 'Traditional Format', 'Easy to Read', 'Industry Standard'],
    preview: '/templates/classic-preview.png',
    accentColor: '#1F2937',
    suitableFor: ['Finance', 'Law', 'Consulting', 'Healthcare']
  },
  {
    id: 'minimalist',
    name: 'Minimalist',
    description: 'Clean, content-focused design that emphasizes your experience',
    category: 'Simple',
    features: ['Minimal Design', 'Content Focus', 'Clean Typography', 'Space Efficient'],
    preview: '/templates/minimalist-preview.png',
    accentColor: '#374151',
    suitableFor: ['Executive', 'Academic', 'Research', 'Consulting']
  },
  {
    id: 'tech',
    name: 'Tech Focused',
    description: 'Developer-friendly template with project highlights and technical skills',
    category: 'Technical',
    features: ['Project Showcase', 'Technical Skills', 'GitHub Integration', 'Code Friendly'],
    preview: '/templates/tech-preview.png',
    accentColor: '#10B981',
    suitableFor: ['Software Developer', 'Data Scientist', 'DevOps', 'Technical Lead']
  },
  {
    id: 'creative',
    name: 'Creative Portfolio',
    description: 'Vibrant, visual design perfect for creative professionals',
    category: 'Creative',
    features: ['Visual Appeal', 'Color Gradients', 'Portfolio Focus', 'Creative Layout'],
    preview: '/templates/creative-preview.png',
    accentColor: '#8B5CF6',
    suitableFor: ['Designer', 'Artist', 'Photographer', 'Creative Director']
  },
  {
    id: 'executive',
    name: 'Executive Luxury',
    description: 'Sophisticated, high-end design for senior leadership positions',
    category: 'Executive',
    features: ['Luxury Design', 'Executive Focus', 'Premium Layout', 'Leadership Emphasis'],
    preview: '/templates/executive-preview.png',
    accentColor: '#DC2626',
    suitableFor: ['CEO', 'Director', 'VP', 'Senior Manager']
  }
];

export const getTemplateConfig = (templateId: TemplateId): TemplateConfig | undefined => {
  return TEMPLATE_CONFIGS.find(config => config.id === templateId);
};

export const getTemplatesByCategory = (category: string): TemplateConfig[] => {
  return TEMPLATE_CONFIGS.filter(config => config.category === category);
};

export const getRecommendedTemplates = (): TemplateConfig[] => {
  return TEMPLATE_CONFIGS.filter(config => config.recommended);
};