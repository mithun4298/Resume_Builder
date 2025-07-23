# Code Cleanup Roadmap - Component Extraction

## 🎯 **Overview**
This document tracks the systematic extraction of hardcoded components from the Resume Builder application to improve code reusability, maintainability, and organization.

## 📋 **Component Extraction Checklist**

### 🔍 **Landing Page Components** (`client/src/pages/landing.tsx`)
- [ ] **HeroSection** - Main banner with title, description, and CTA buttons
- [ ] **FeatureCard** - Individual feature display card  
- [ ] **FeaturesSection** - Grid of features with icons and descriptions
- [ ] **TestimonialCard** - Individual testimonial display
- [ ] **TestimonialsSection** - Grid of user testimonials
- [ ] **CTASection** - Call-to-action section with gradient background
- [ ] **StatsSection** - Statistics display (if present)

### 🏠 **Home Page Components** (`client/src/pages/home.tsx`)
- [x] **StatsCard** - ✅ COMPLETED
- [x] **QuickActionCard** - ✅ COMPLETED  
- [x] **ResumeCard** - ✅ COMPLETED
- [x] **ResumeCardSkeleton** - ✅ COMPLETED
- [x] **EmptyState** - ✅ COMPLETED
- [ ] **WelcomeHeader** - User greeting and dashboard header
- [ ] **CreateResumeDialog** - Modal for creating new resumes
- [ ] **QuickActionsGrid** - Grid of quick action cards

### 📝 **Resume Builder Components** (`client/src/pages/resume-builder.tsx`)
- [ ] **SectionEditor** - Individual resume section editing component
- [ ] **FormField** - Reusable form input component
- [ ] **SkillsEditor** - Specialized skills input component
- [ ] **ExperienceEditor** - Job experience form component
- [ ] **EducationEditor** - Education form component
- [ ] **SidebarNavigation** - Resume builder sidebar
- [ ] **PreviewPanel** - Resume preview container

### 🎨 **Template Components** (Various template files)
- [ ] **SectionHeader** - Standardized section headers across templates
- [ ] **ContactInfo** - Contact information display component
- [ ] **ExperienceItem** - Individual job experience display
- [ ] **EducationItem** - Individual education entry display
- [ ] **SkillTag** - Individual skill display component

### 🔧 **UI Components** (Various files)
- [ ] **LoadingSpinner** - Centralized loading indicator
- [ ] **ErrorBoundary** - Error handling component
- [ ] **ConfirmDialog** - Reusable confirmation modal
- [ ] **TooltipWrapper** - Standardized tooltip component
- [ ] **IconButton** - Reusable icon button component

### 📱 **Navigation Components**
- [ ] **MobileMenu** - Mobile navigation menu
- [ ] **UserMenu** - User profile dropdown
- [ ] **BreadcrumbNavigation** - Page breadcrumbs

## 🎯 **Priority Levels**

### **🔥 High Priority** (Most Reusable/Complex)
1. [ ] **HeroSection** - Used on landing page, could be reused
2. [ ] **FeatureCard** - Highly reusable across pages
3. [ ] **TestimonialCard** - Reusable for social proof
4. [ ] **CreateResumeDialog** - Complex modal with form logic
5. [ ] **SectionEditor** - Core resume building functionality

### **⚡ Medium Priority** (Good for Organization)
6. [ ] **FeaturesSection** - Landing page organization
7. [ ] **TestimonialsSection** - Landing page organization
8. [ ] **CTASection** - Reusable call-to-action
9. [ ] **FormField** - Form standardization
10. [ ] **LoadingSpinner** - UI consistency

### **📌 Lower Priority** (Simple but Good Practice)
11. [ ] **SkillTag** - Simple but reusable
12. [ ] **IconButton** - UI consistency
13. [ ] **ContactInfo** - Template organization
14. [ ] **WelcomeHeader** - Dashboard organization

## 🚀 **Implementation Phases**

### **Phase 1: Landing Page Components** 🎨
**Goal**: Extract and organize landing page components
- [ ] HeroSection
- [ ] FeatureCard
- [ ] TestimonialCard
- [ ] FeaturesSection
- [ ] TestimonialsSection
- [ ] CTASection

**Estimated Impact**: High reusability, cleaner landing page

### **Phase 2: Core Functionality** ⚙️
**Goal**: Extract core application components
- [ ] CreateResumeDialog
- [ ] FormField
- [ ] LoadingSpinner
- [ ] SectionEditor

**Estimated Impact**: Better maintainability, standardized forms

### **Phase 3: Template Components** 📄
**Goal**: Standardize resume template components
- [ ] SectionHeader
- [ ] ExperienceItem
- [ ] EducationItem
- [ ] ContactInfo
- [ ] SkillTag

**Estimated Impact**: Consistent template structure, easier template creation

### **Phase 4: UI Polish** ✨
**Goal**: Extract remaining UI components
- [ ] IconButton
- [ ] TooltipWrapper
- [ ] ConfirmDialog
- [ ] ErrorBoundary
- [ ] MobileMenu
- [ ] UserMenu

**Estimated Impact**: UI consistency, better user experience

## 📊 **Progress Tracking**

### **Completed Components**: 5/30+ (16.7%)
- ✅ StatsCard
- ✅ QuickActionCard  
- ✅ ResumeCard
- ✅ ResumeCardSkeleton
- ✅ EmptyState

### **Current Phase**: Phase 1 - Landing Page Components
### **Next Target**: HeroSection or FeatureCard

## 📝 **Implementation Guidelines**

### **Component Structure**
```typescript
// File path comment
interface ComponentProps {
  // TypeScript interface
}

export default function ComponentName({ props }: ComponentProps) {
  // Component logic
  return (
    // JSX
  );
}
```
