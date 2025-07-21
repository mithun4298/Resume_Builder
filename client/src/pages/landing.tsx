import { Button } from "@/components/ui/button";
import { Star, FileText, Sparkles, Download, Users, Zap, ShieldCheck, LayoutGrid, Smile, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import React, { Suspense } from "react";

// Lazy loaded components
const ParticleBackground = React.lazy(() => import("@/components/particle-bg"));
const AnimatedKeywords = React.lazy(() => import("@/components/animated-keywords"));
const TemplateCarousel = React.lazy(() => import("@/components/TemplateCarousel"));

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

// Loading fallback components
const LoadingSpinner = () => (
  <div className="flex items-center justify-center p-4">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
  </div>
);

const KeywordsLoadingFallback = () => (
  <span className="text-2xl font-bold text-blue-600 animate-pulse">Smart</span>
);

const TemplateLoadingFallback = () => (
  <div className="text-center py-12">
    <div className="animate-pulse">
      <div className="h-64 bg-gray-200 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
    </div>
  </div>
);

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-x-hidden">
      {/* Particle Background with lazy loading */}
      <Suspense fallback={null}>
        <ParticleBackground />
      </Suspense>
      
      {/* Navigation */}
      <nav className="bg-white/80 shadow-sm fixed top-0 left-0 right-0 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
              <FileText className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">ResumeAI</span>
          </div>
          <div className="hidden md:flex items-center space-x-8 text-slate-700 font-medium">
            <a href="#features" className="hover:text-primary transition-colors">
              Features
            </a>
            <a href="#testimonials" className="hover:text-primary transition-colors">
              Testimonials
            </a>
            <a href="#pricing" className="hover:text-primary transition-colors">
              Pricing
            </a>
          </div>
          <Button
            onClick={() => (window.location.href = "/api/login")}
            className="bg-primary hover:bg-primary/90 px-6 py-2 text-base font-semibold shadow-md"
          >
            Get Started
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center pt-32 pb-24 text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-4"
        >
          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 drop-shadow-lg tracking-tight mb-2">
            Your Next Job Starts Here
          </h1>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 0.18, duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <div className="inline-block text-2xl md:text-4xl font-extrabold leading-tight">
            <span
              className="block drop-shadow-xl animate-textcolor"
              style={{
                color: "#f43f5e",
                animation: "textcolor-x 3.5s ease-in-out infinite",
                textShadow: "0 4px 24px rgba(80,0,180,0.18), 0 1px 0 #fff",
                filter: "brightness(1.15) contrast(1.15)",
              }}
            >
              Beautiful,{' '}
              <Suspense fallback={<KeywordsLoadingFallback />}>
                <AnimatedKeywords className="inline" words={["Smart", "Professional", "Modern", "AI-Powered"]} />
              </Suspense>
              {' '}Resumes in Minutes
            </span>
          </div>
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-lg md:text-2xl text-slate-700 mb-10 max-w-2xl mx-auto"
        >
          Build a beautiful, professional resume in minutes with AI-powered guidance and modern design.
        </motion.p>
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Button
            size="lg"
            onClick={() => (window.location.href = "/api/login")}
            className="relative bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-lg px-8 py-3 shadow-xl transition-transform duration-200 hover:scale-105 focus:ring-2 focus:ring-blue-400 group"
          >
            Get Started Free
            <span className="inline-block ml-3 align-middle">
              <motion.svg
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="inline-block align-middle"
                initial={{ x: 0 }}
                animate={{ x: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              >
                <path
                  d="M7 14h14m0 0l-5-5m5 5l-5 5"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </motion.svg>
            </span>
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Everything You Need to Land Your Dream Job
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our AI-powered platform combines cutting-edge technology with beautiful design to create resumes that get results.
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Template Showcase */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">
              Beautiful Templates That Stand Out
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our collection of professionally designed, ATS-optimized templates.
            </p>
          </motion.div>
          
          <Suspense fallback={<TemplateLoadingFallback />}>
            <TemplateCarousel />
          </Suspense>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Ready to Build Your Perfect Resume?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of job seekers who have successfully landed their dream jobs with our AI-powered resume builder.
            </p>
            <Button
              size="lg"
              onClick={() => (window.location.href = "/api/login")}
              className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3 shadow-xl transition-transform duration-200 hover:scale-105"
            >
              Start Building Now
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
}