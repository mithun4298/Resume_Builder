import React, { Suspense } from "react";
import { Card } from "./ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "./ui/select";

interface LivePreviewProps {
  resumeData: any;
  template: string;
  accentColor: string;
  onTemplateChange: (template: string) => void;
  onAccentColorChange: (color: string) => void;
}

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

const LivePreview: React.FC<LivePreviewProps> = ({ resumeData, template, accentColor, onTemplateChange, onAccentColorChange }) => {
  const selected = templates.find(t => t.value === template) || templates[0];
  const TemplateComponent = selected.component;
  return (
    <div className="w-full max-w-3xl mx-auto my-6">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex gap-2 items-center">
          <span className="font-medium">Template:</span>
          <Select value={template} onValueChange={onTemplateChange}>
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
                onClick={() => onAccentColorChange(color)}
                aria-label={`Accent color ${color}`}
              />
            ))}
          </div>
        </div>
      </div>
      <Card className="p-6 bg-white shadow-lg border max-h-[80vh] overflow-auto">
        <Suspense fallback={<div className="text-center text-gray-400 py-16">Loading preview...</div>}>
          <TemplateComponent resumeData={resumeData} accentColor={accentColor} />
        </Suspense>
      </Card>
    </div>
  );
};

export default LivePreview;
