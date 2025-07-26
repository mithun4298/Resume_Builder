import { ClassicTemplate } from './ClassicTemplate';
import { MinimalTemplate } from './MinimalTemplate';
import { ModernProfessionalTemplate } from './ModernProfessionalTemplate';
import { TechTemplate } from './TechTemplate';
import { CreativeTemplate } from './CreativeTemplate';
import { ExecutiveTemplate } from './ExecutiveTemplate';

export { ClassicTemplate } from './ClassicTemplate';
export { MinimalTemplate } from './MinimalTemplate';
export { ModernProfessionalTemplate } from './ModernProfessionalTemplate';
export { TechTemplate } from './TechTemplate';
export { CreativeTemplate } from './CreativeTemplate';
export { ExecutiveTemplate } from './ExecutiveTemplate';

// Template registry for dynamic loading
export const TEMPLATE_REGISTRY = {
    classic: ClassicTemplate,
    minimalist: MinimalTemplate,
    tech: TechTemplate,
    modern: ModernProfessionalTemplate,
    creative: CreativeTemplate,
    executive: ExecutiveTemplate,
} as const;

export type TemplateId = keyof typeof TEMPLATE_REGISTRY;