import { Button } from "@/components/ui/button";
import { Star, FileText, Sparkles, Download, Users, Zap, ShieldCheck, LayoutGrid, Smile, CheckCircle, TrendingUp, Award, Clock, Globe } from "lucide-react";
import { motion } from "framer-motion";
import React, { Suspense } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Header } from "@/components";

import ParticleBackground from "@/components/particle-bg";
import TemplateCarousel from "@/components/TemplateCarousel/TemplateCarousel";
import TestimonialsSection from "@/components/landing/TestimonialsSection";
import StatsSection from "@/components/landing/StatsSection";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/footer";
// Import the extracted components
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import TemplateShowcaseSection from "@/components/landing/TemplateShowcaseSection";

// Loading fallback components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
);

const TemplateLoadingFallback = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
        <div className="w-full h-48 bg-gray-200 rounded-lg mb-4"></div>
        <div className="h-4 bg-gray-200 rounded mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    ))}
  </div>
);

// Features data
const features = [
  {
    icon: <Sparkles className="h-7 w-7 text-blue-500" />,
    title: "AI-Powered Content",
    description: "Generate professional summaries and bullet points with AI assistance.",
  },
  {
    icon: <LayoutGrid className="h-7 w-7 text-indigo-500" />,
    title: "Modern Templates",
    description: "Choose from beautiful, ATS-optimized templates.",
  },
  {
    icon: <Download className="h-7 w-7 text-green-500" />,
    title: "1-Click PDF Export",
    description: "Download your resume instantly as a polished PDF.",
  },
  {
    icon: <Users className="h-7 w-7 text-pink-500" />,
    title: "Real-time Preview",
    description: "See your changes live as you edit.",
  },
  {
    icon: <Zap className="h-7 w-7 text-yellow-500" />,
    title: "Lightning Fast",
    description: "Build and export resumes in minutes, not hours.",
  },
  {
    icon: <ShieldCheck className="h-7 w-7 text-teal-500" />,
    title: "Secure & Private",
    description: "Your data is encrypted and never sold.",
  },
  {
    icon: <Smile className="h-7 w-7 text-purple-500" />,
    title: "Easy to Use",
    description: "Intuitive, distraction-free interface for everyone.",
  },
  {
    icon: <CheckCircle className="h-7 w-7 text-orange-500" />,
    title: "Trusted Results",
    description: "Loved by job seekers and recruiters alike.",
  },
];

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Software Engineer",
    company: "Google",
    content: "This resume builder helped me land my dream job at Google! The AI suggestions were spot-on and the templates are beautiful.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Product Manager",
    company: "Microsoft",
    content: "I've tried many resume builders, but this one stands out. The real-time preview and PDF export quality are exceptional.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "UX Designer",
    company: "Apple",
    content: "The templates are gorgeous and the AI content suggestions saved me hours. Got multiple interview calls within a week!",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Data Scientist",
    company: "Netflix",
    content: "As someone who struggled with resume formatting, this tool was a game-changer. Clean, professional, and ATS-friendly.",
    rating: 5,
  },
  {
    name: "Jessica Thompson",
    role: "Marketing Manager",
    company: "Spotify",
    content: "The ease of use is incredible. I updated my resume in 15 minutes and it looks better than anything I've created before.",
    rating: 5,
  },
  {
    name: "Alex Martinez",
    role: "DevOps Engineer",
    company: "Amazon",
    content: "Finally, a resume builder that understands tech roles. The AI suggestions were relevant and the export quality is perfect.",
    rating: 5,
  },
];

const stats = [
  {
    value: "50K+",
    label: "Resumes Created",
    description: "Professional resumes built by our users",
    icon: <TrendingUp className="h-8 w-8 text-blue-500" />
  },
  {
    value: "95%",
    label: "Success Rate",
    description: "Users who got interviews within 30 days",
    icon: <Award className="h-8 w-8 text-green-500" />
  },
  {
    value: "5 Min",
    label: "Average Build Time",
    description: "From start to professional PDF",
    icon: <Clock className="h-8 w-8 text-purple-500" />
  },
  {
    value: "120+",
    label: "Countries",
    description: "Users worldwide trust our platform",
    icon: <Globe className="h-8 w-8 text-indigo-500" />
  },
];

export default function Landing() {
  const { isAuthenticated, isLoading } = useAuth();

  // Button logic
  const primaryButtonText = isAuthenticated ? "Go to Resume Builder" : "Get Started Free";
  const primaryButtonAction = isAuthenticated
    ? () => (window.location.href = "/resume-builder")
    : () => (window.location.href = "/api/login");

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Header component */}
      <Header />

      {/* Particle Background with lazy loading */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>

      {/* Hero Section - Using extracted component */}
      <HeroSection 
        title="Your Next Job Starts Here"
        subtitle="Beautiful, {keywords} Resumes in Minutes"
        description="Build a beautiful, professional resume in minutes with AI-powered guidance and modern design."
        primaryButtonText={primaryButtonText}
        primaryButtonAction={primaryButtonAction}
        showAnimatedKeywords={true}
        animatedWords={["Smart", "Professional", "Modern", "AI-Powered"]}
      />

      {/* Features Section - Using extracted component */}
      <FeaturesSection 
        features={features}
        title="Everything You Need to Land Your Dream Job"
        subtitle="Our AI-powered platform combines cutting-edge technology with beautiful design to create resumes that get results."
        sectionId="features"
        className="py-24 bg-white/50"
      />

      {/* Template Showcase Section - Using extracted component */}
      <TemplateShowcaseSection 
        title="Beautiful Templates That Stand Out"
        subtitle="Choose from our collection of professionally designed, ATS-optimized templates."
        className="py-24"
        templateCarouselComponent={
          <Suspense fallback={<TemplateLoadingFallback />}>
            <TemplateCarousel />
          </Suspense>
        }
      />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* CTA Section */}
      <CTASection />

      {/* Footer Section */}
      <Footer />
    </div>
  );
}