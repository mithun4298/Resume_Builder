import React, { Suspense } from "react";
import { Card } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";
import { useResumeData } from "../hooks/useResumeData";

// Remove LivePreviewProps, use context instead

const templates = [
  { value: "modern", label: "Modern", component: React.lazy(() => import("./resume-templates/ModernTemplate")) },
  { value: "classic", label: "Classic", component: React.lazy(() => import("./resume-templates/ClassicTemplate")) },
  { value: "minimalist", label: "Minimalist", component: React.lazy(() => import("./resume-templates/MinimalistTemplate")) },
  { value: "elegant", label: "Elegant", component: React.lazy(() => import("./resume-templates/ElegantTemplate")) },
  { value: "bold", label: "Bold", component: React.lazy(() => import("./resume-templates/BoldTemplate")) },
  { value: "two-column", label: "Two Column", component: React.lazy(() => import("./resume-templates/TwoColumnTemplate")) },
];

const accentColors = [
  "#2563EB", "#F59E42", "#10B981", "#EF4444", "#A21CAF", "#FBBF24"
];

const LivePreview: React.FC = () => {
  const { resumeData, selectTemplate } = useResumeData();
  const [accentColor, setAccentColor] = React.useState("#2563EB");
  const selectedTemplate = resumeData.selectedTemplate || "modern";
  const selected = templates.find(t => t.value === selectedTemplate);
  const TemplateComponent = ((selected && selected.component) ? selected.component : templates[0].component) as React.ComponentType<any>;
  const selectedValue = (selected && selected.value) ? selected.value : templates[0].value;

  // Helper: which templates support accentColor
  const supportsAccentColor = ["modern", "minimalist"].includes(selectedValue);

  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex gap-2 items-center">
          <span className="font-medium">Template:</span>
          <Select value={selectedTemplate} onValueChange={selectTemplate}>
            <SelectTrigger className="w-32"><SelectValue /> </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2 items-center">
          <span className="font-medium">Accent:</span>
          <div className="flex gap-1">
            {accentColors.map(color => (
              <button
                key={color}
                className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${accentColor === color ? 'border-black scale-110 ring-2 ring-offset-2 ring-black' : 'border-gray-300'}`}
                style={{ backgroundColor: color }}
                onClick={() => setAccentColor(color)}
                aria-label={`Accent color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
      <Card className="p-6 bg-white shadow-lg border max-h-[80vh] overflow-auto">
        <Suspense fallback={<div className="text-center text-gray-400 py-16">Loading preview...</div>}>
          {supportsAccentColor ? (
            <TemplateComponent
              resumeData={{
                ...resumeData,
                experience: resumeData.experiences || [],
                skills: Array.isArray(resumeData.skills)
                  ? { technical: resumeData.skills.map(s => s.name), soft: [] }
                  : resumeData.skills
              }}
              accentColor={accentColor}
            />
          ) : (
            <TemplateComponent
              resumeData={{
                ...resumeData,
                experience: resumeData.experiences || [],
                skills: Array.isArray(resumeData.skills)
                  ? { technical: resumeData.skills.map(s => s.name), soft: [] }
                  : resumeData.skills
              }}
            />
          )}
        </Suspense>
      </Card>
    </div>
  );
};

export default LivePreview;
