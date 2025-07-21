
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Maximize } from "lucide-react";
import type { ResumeData } from "@shared/schema";
import React, { useState } from "react";
import TemplateSelector from "./resume-templates/TemplateSelector";
const ModernTemplate = React.lazy(() => import("./resume-templates/ModernTemplate"));
const ClassicTemplate = React.lazy(() => import("./resume-templates/ClassicTemplate"));
const MinimalistTemplate = React.lazy(() => import("./resume-templates/MinimalistTemplate"));
const ElegantTemplate = React.lazy(() => import("./resume-templates/ElegantTemplate"));
const BoldTemplate = React.lazy(() => import("./resume-templates/BoldTemplate"));
const TwoColumnTemplate = React.lazy(() => import("./resume-templates/TwoColumnTemplate"));


interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
  setSelectedTemplate?: (template: string) => void;
  fontSize?: number;
  lineHeight?: number;
  margins?: number;
  accentColor?: string;
  fontFamily?: string;
  className?: string;
}


const SECTION_KEYS = [
  "personal",
  "summary",
  "experience",
  "skills",
  "education",
  "certifications",
  "projects"
] as const;
type SectionKey = typeof SECTION_KEYS[number];


export default function ResumePreview({
  data,
  template = "modern",
  setSelectedTemplate,
  fontSize,
  lineHeight,
  margins,
  accentColor,
  fontFamily,
  className = ""
}: ResumePreviewProps) {

  const templates = [
    {
      key: "modern",
      name: "Modern",
      preview: <span className="font-bold text-primary">Modern</span>
    },
    {
      key: "classic",
      name: "Classic",
      preview: <span className="font-serif text-lg">Classic</span>
    },
    {
      key: "minimalist",
      name: "Minimalist",
      preview: <span className="text-slate-500">Minimalist</span>
    },
    {
      key: "elegant",
      name: "Elegant",
      preview: <span className="italic text-purple-700">Elegant</span>
    },
    {
      key: "bold",
      name: "Bold",
      preview: <span className="font-black text-red-600">Bold</span>
    },
    {
      key: "twocolumn",
      name: "Two Column",
      preview: <span className="font-semibold text-cyan-700">2-Column</span>
    }
  ];

  const renderSelectedTemplate = () => {
    switch (template) {
      case "classic":
        return <ClassicTemplate resumeData={data} />;
      case "minimalist":
        return <MinimalistTemplate resumeData={data} />;
      case "elegant":
        return <ElegantTemplate resumeData={data} />;
      case "bold":
        return <BoldTemplate resumeData={data} />;
      case "twocolumn":
        return <TwoColumnTemplate resumeData={data} />;
      default:
        return <ModernTemplate resumeData={data} />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <h2 className="font-semibold text-slate-900">Live Preview</h2>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>Template: {templates.find(t => t.key === template)?.name}</span>
          </div>
        </div>
      </div>

      {/* Template Selector */}
      <div className="p-4 bg-slate-50">
        <TemplateSelector
          templates={templates}
          selected={template}
          onSelect={setSelectedTemplate ?? (() => {})}
        />
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg overflow-hidden">
            <React.Suspense fallback={<div className="p-8 text-center">Loading template...</div>}>
              {renderSelectedTemplate()}
            </React.Suspense>
          </Card>
        </div>
      </div>
    </div>
  );
}