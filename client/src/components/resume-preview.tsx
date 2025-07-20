import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Monitor, Smartphone, Maximize } from "lucide-react";
import type { ResumeData } from "@shared/schema";

interface ResumePreviewProps {
  data: ResumeData;
  template?: string;
  fontSize?: number;
  lineHeight?: number;
  margins?: number;
  accentColor?: string;
  fontFamily?: string;
}

const SECTION_KEYS = [
  "personal",
  "summary",
  "experience",
  "skills",
  "education",
  "projects"
] as const;
type SectionKey = typeof SECTION_KEYS[number];

export default function ResumePreview({ 
  data, 
  template = "modern",
  fontSize = 11,
  lineHeight = 1.6,
  margins = 20,
  accentColor = "#2563EB",
  fontFamily = "Inter"
}: ResumePreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  const getFullName = () => {
    return [data.personalInfo.firstName, data.personalInfo.lastName]
      .filter(Boolean)
      .join(" ") || "Your Name";
  };

  const baseStyle = {
    fontSize: `${fontSize}px`,
    lineHeight: lineHeight,
    fontFamily: fontFamily,
    padding: `${margins}px`,
  };

  // Helper to render each section by key
  function renderSection(key: SectionKey) {
    switch (key) {
      case "personal":
        return (
          <div style={{ backgroundColor: accentColor }} className="text-white p-8 mb-8 rounded-t">
            <h1 className="text-3xl font-bold mb-2">{getFullName()}</h1>
            {data.personalInfo.title && (
              <p className="text-xl opacity-90 mb-4">{data.personalInfo.title}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm">
              {data.personalInfo.email && (
                <div className="flex items-center">
                  <span>✉</span>
                  <span className="ml-2">{data.personalInfo.email}</span>
                </div>
              )}
              {data.personalInfo.phone && (
                <div className="flex items-center">
                  <span>📞</span>
                  <span className="ml-2">{data.personalInfo.phone}</span>
                </div>
              )}
              {data.personalInfo.location && (
                <div className="flex items-center">
                  <span>📍</span>
                  <span className="ml-2">{data.personalInfo.location}</span>
                </div>
              )}
            </div>
          </div>
        );
      case "summary":
        return data.summary ? (
          <div className="mb-6">
            <h2 style={{ color: accentColor, borderColor: accentColor }} className="text-lg font-bold mb-3 border-b-2 pb-1">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-slate-700">{data.summary}</p>
          </div>
        ) : null;
      case "experience":
        return data.experience.length > 0 ? (
          <div className="mb-6">
            <h2 style={{ color: accentColor, borderColor: accentColor }} className="text-lg font-bold mb-3 border-b-2 pb-1">
              PROFESSIONAL EXPERIENCE
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-slate-900">{exp.title}</h3>
                      <p style={{ color: accentColor }} className="font-medium">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{formatDate(exp.startDate || "")} - {exp.current ? "Present" : formatDate(exp.endDate || "")}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-slate-700 space-y-1">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "skills":
        return (data.skills.technical.length > 0 || data.skills.soft.length > 0) ? (
          <div className="mb-6">
            <h2 style={{ color: accentColor, borderColor: accentColor }} className="text-lg font-bold mb-3 border-b-2 pb-1">
              SKILLS
            </h2>
            {data.skills.technical.length > 0 && (
              <div className="mb-3">
                <p className="font-medium text-slate-800 mb-2">Technical Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {data.skills.technical.map((skill, index) => (
                    <span key={index} style={{ backgroundColor: `${accentColor}20`, color: accentColor }} 
                          className="px-2 py-1 rounded text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {data.skills.soft.length > 0 && (
              <div>
                <p className="font-medium text-slate-800 mb-2">Soft Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {data.skills.soft.map((skill, index) => (
                    <span key={index} style={{ backgroundColor: `${accentColor}20`, color: accentColor }} 
                          className="px-2 py-1 rounded text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null;
      case "education":
        return data.education.length > 0 ? (
          <div className="mb-6">
            <h2 style={{ color: accentColor, borderColor: accentColor }} className="text-lg font-bold mb-3 border-b-2 pb-1">
              EDUCATION
            </h2>
            <div className="space-y-3">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-slate-900">{edu.degree} in {edu.field}</h3>
                      <p style={{ color: accentColor }} className="font-medium">{edu.institution}</p>
                      {edu.gpa && <p className="text-sm text-slate-600">GPA: {edu.gpa}</p>}
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{formatDate(edu.startDate || "")} - {formatDate(edu.endDate || "")}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      case "projects":
        return data.projects.length > 0 ? (
          <div className="mb-6">
            <h2 style={{ color: accentColor, borderColor: accentColor }} className="text-lg font-bold mb-3 border-b-2 pb-1">
              PROJECTS
            </h2>
            <div className="space-y-4">
              {data.projects.map((project, index) => (
                <div key={index}>
                  <h3 className="font-semibold text-slate-900">{project.name}</h3>
                  <p className="text-slate-700 mb-2">{project.description}</p>
                  {project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {project.technologies.map((tech, techIndex) => (
                        <span key={techIndex} className="text-xs px-2 py-1 bg-slate-100 text-slate-700 rounded">
                          {tech}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ) : null;
      default:
        return null;
    }
  }

  // Use sectionOrder from data, fallback to default
  const sectionOrder: SectionKey[] = (data.sectionOrder && data.sectionOrder.length === SECTION_KEYS.length)
    ? data.sectionOrder as SectionKey[]
    : [...SECTION_KEYS];

  const renderModernTemplate = () => (
    <div style={baseStyle} className="bg-white shadow-lg overflow-hidden">
      {sectionOrder.map((key) => renderSection(key))}
    </div>
  );

  const renderClassicTemplate = () => (
    <div style={baseStyle} className="bg-white shadow-lg overflow-hidden">
      {/* Centered header */}
      <div className="text-center border-b-2 border-slate-800 pb-6 mb-6">
        <h1 className="text-4xl font-serif font-bold text-slate-900 mb-2">
          {getFullName()}
        </h1>
        {data.personalInfo.title && (
          <p className="text-lg text-slate-600 mb-3 italic">{data.personalInfo.title}</p>
        )}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-600">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>
      
      <div className="space-y-6">
        {/* Summary */}
        {data.summary && (
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-3 uppercase tracking-wide">
              Summary
            </h2>
            <div className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
              <p className="text-slate-700">{data.summary}</p>
            </div>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-lg font-serif font-bold text-slate-900 mb-3 uppercase tracking-wide">
              Experience
            </h2>
            <div className="space-y-4">
              {data.experience.map((exp, index) => (
                <div key={index} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-slate-900">{exp.title}</h3>
                      <p className="font-medium text-slate-700">{exp.company}</p>
                    </div>
                    <div className="text-right text-sm text-slate-600">
                      <p>{formatDate(exp.startDate || "")} - {exp.current ? "Present" : formatDate(exp.endDate || "")}</p>
                      {exp.location && <p>{exp.location}</p>}
                    </div>
                  </div>
                  {exp.bullets.length > 0 && (
                    <ul className="list-disc list-inside text-slate-700 space-y-1 ml-4">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex}>{bullet}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div style={baseStyle} className="bg-white shadow-lg overflow-hidden">
      {/* Clean minimal header */}
      <div className="mb-8">
        <h1 className="text-2xl font-light text-slate-900 mb-1">
          {getFullName()}
        </h1>
        {data.personalInfo.title && (
          <p className="text-slate-600 mb-3">{data.personalInfo.title}</p>
        )}
        <div className="flex gap-4 text-sm text-slate-500">
          {data.personalInfo.email && <span>{data.personalInfo.email}</span>}
          {data.personalInfo.phone && <span>{data.personalInfo.phone}</span>}
          {data.personalInfo.location && <span>{data.personalInfo.location}</span>}
        </div>
      </div>
      
      <div className="space-y-8">
        {/* Summary */}
        {data.summary && (
          <div>
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-3">
              Summary
            </h2>
            <p className="text-slate-700 leading-relaxed">{data.summary}</p>
          </div>
        )}

        {/* Experience */}
        {data.experience.length > 0 && (
          <div>
            <h2 className="text-sm font-medium text-slate-500 uppercase tracking-widest mb-4">
              Experience
            </h2>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="font-medium text-slate-900">{exp.title}</h3>
                    <span className="text-sm text-slate-500">
                      {formatDate(exp.startDate || "")} - {exp.current ? "Present" : formatDate(exp.endDate || "")}
                    </span>
                  </div>
                  <p className="text-slate-600 mb-2">{exp.company} • {exp.location}</p>
                  {exp.bullets.length > 0 && (
                    <ul className="space-y-1 text-slate-700">
                      {exp.bullets.map((bullet, bulletIndex) => (
                        <li key={bulletIndex} className="flex items-start">
                          <span className="mr-2 mt-1.5" style={{ color: accentColor }}>•</span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div style={baseStyle} className="bg-white shadow-lg overflow-hidden">
      {/* Creative asymmetric layout */}
      <div className="flex">
        {/* Left sidebar */}
        <div style={{ backgroundColor: accentColor }} className="w-1/3 text-white p-6">
          <h1 className="text-2xl font-bold mb-2">{getFullName()}</h1>
          {data.personalInfo.title && (
            <p className="text-lg opacity-90 mb-6">{data.personalInfo.title}</p>
          )}
          
          {/* Contact info */}
          <div className="space-y-2 text-sm mb-6">
            {data.personalInfo.email && <p>{data.personalInfo.email}</p>}
            {data.personalInfo.phone && <p>{data.personalInfo.phone}</p>}
            {data.personalInfo.location && <p>{data.personalInfo.location}</p>}
          </div>

          {/* Skills in sidebar */}
          {(data.skills.technical.length > 0 || data.skills.soft.length > 0) && (
            <div>
              <h3 className="font-bold mb-3 text-lg">SKILLS</h3>
              {data.skills.technical.length > 0 && (
                <div className="mb-4">
                  <p className="font-medium mb-2">Technical:</p>
                  <div className="space-y-1">
                    {data.skills.technical.map((skill, index) => (
                      <div key={index} className="text-sm opacity-90">{skill}</div>
                    ))}
                  </div>
                </div>
              )}
              {data.skills.soft.length > 0 && (
                <div>
                  <p className="font-medium mb-2">Soft Skills:</p>
                  <div className="space-y-1">
                    {data.skills.soft.map((skill, index) => (
                      <div key={index} className="text-sm opacity-90">{skill}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Right main content */}
        <div className="w-2/3 p-6">
          {/* Summary */}
          {data.summary && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-3" style={{ color: accentColor }}>ABOUT</h2>
              <p className="text-slate-700 leading-relaxed">{data.summary}</p>
            </div>
          )}

          {/* Experience */}
          {data.experience.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4" style={{ color: accentColor }}>EXPERIENCE</h2>
              <div className="space-y-4">
                {data.experience.map((exp, index) => (
                  <div key={index} className="relative pl-6">
                    <div className="absolute left-0 top-2 w-3 h-3 rounded-full" style={{ backgroundColor: accentColor }}></div>
                    <div className="absolute left-1.5 top-5 w-0.5 h-full bg-slate-200"></div>
                    <h3 className="font-bold text-slate-900">{exp.title}</h3>
                    <p className="font-medium text-slate-600">{exp.company} • {exp.location}</p>
                    <p className="text-sm text-slate-500 mb-2">
                      {formatDate(exp.startDate || "")} - {exp.current ? "Present" : formatDate(exp.endDate || "")}
                    </p>
                    {exp.bullets.length > 0 && (
                      <ul className="list-disc list-inside text-slate-700 space-y-1">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <li key={bulletIndex}>{bullet}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderTemplate = () => {
    switch (template) {
      case "classic":
        return renderClassicTemplate();
      case "minimal":
        return renderMinimalTemplate();
      case "creative":
        return renderCreativeTemplate();
      default:
        return renderModernTemplate();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Preview Header */}
      <div className="flex items-center justify-between p-4 bg-white border-b border-slate-200">
        <div className="flex items-center space-x-4">
          <h2 className="font-semibold text-slate-900">Live Preview</h2>
          <div className="flex items-center space-x-2">
            <Button size="sm" variant="outline" className="px-3 py-1 text-xs">
              <Smartphone className="w-3 h-3 mr-1" />
              Mobile
            </Button>
            <Button size="sm" className="px-3 py-1 text-xs">
              <Monitor className="w-3 h-3 mr-1" />
              Desktop
            </Button>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-slate-600">
            <span>Template: {template}</span>
          </div>
          <Button size="sm" variant="outline" className="px-3 py-1 text-xs">
            <Maximize className="w-3 h-3 mr-1" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Preview Content */}
      <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-lg overflow-hidden">
            {renderTemplate()}
          </Card>
        </div>
      </div>
    </div>
  );
}