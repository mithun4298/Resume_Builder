import React, { useState, lazy, Suspense } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Button } from "@/components/ui/button";
import "./resume-editor.module.css";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import {
  GripVertical, ChevronDown, Plus, X, Sparkles, Check,
  Settings, Download, Eye, FileText, Type, Palette
} from "lucide-react";
import type { ResumeData } from "@shared/schema";

// Replace with your own rich text editor component path
const RichTextEditor = lazy(() => import("@/components/ui/rich-text-editor"));

interface ResumeEditorProps {
  data: ResumeData;
  onChange: (data: ResumeData) => void;
  atsScore?: { score: number; feedback: string[]; suggestions: string[] } | null;
  isCalculating?: boolean;
  onExportPdf?: () => void;
  exportPdfPending?: boolean;
}

interface DesignSettings {
  template: string;
  fontSize: number;
  lineHeight: number;
  margins: number;
  accentColor: string;
  fontFamily: string;
}

interface ResumeSettings {
  isPublic: boolean;
  allowComments: boolean;
  showContactInfo: boolean;
  atsOptimized: boolean;
  fileName: string;
  includeContactInfo: boolean;
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

function ResumeEditor({ data, onChange, atsScore, isCalculating, onExportPdf, exportPdfPending }: ResumeEditorProps) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"content" | "design" | "settings">("content");
  
  // All sections collapsed by default
  const [collapsedSections, setCollapsedSections] = useState<Set<SectionKey>>(
    new Set([...SECTION_KEYS])
  );
  
  // Use sectionOrder from data, fallback to default if missing
  const sectionOrder = data.sectionOrder && data.sectionOrder.length === SECTION_KEYS.length
    ? data.sectionOrder as SectionKey[]
    : [...SECTION_KEYS];
    
  const [newSkill, setNewSkill] = useState("");
  const [designSettings, setDesignSettings] = useState<DesignSettings>({
    template: "modern",
    fontSize: 11,
    lineHeight: 1.6,
    margins: 20,
    accentColor: "#2563EB",
    fontFamily: "Inter"
  });
  
  const [resumeSettings, setResumeSettings] = useState<ResumeSettings>({
    isPublic: false,
    allowComments: false,
    showContactInfo: true,
    atsOptimized: true,
    fileName: "Resume",
    includeContactInfo: true
  });

  // AI Provider selection
  const [aiProvider, setAiProvider] = useState<'openai' | 'gemini'>('openai');
  const [suggestionLoading, setSuggestionLoading] = useState(false);
  // Summary length and tone selection
  const [summaryLength, setSummaryLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [summaryTone, setSummaryTone] = useState<'formal' | 'confident' | 'friendly'>('formal');

  // Drag-and-drop section ordering
  function handleDragEnd(result: any) {
    if (!result.destination) return;
    const items = Array.from(sectionOrder);
    const [removed] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, removed);
    // Update sectionOrder in ResumeData via onChange
    onChange({
      ...data,
      sectionOrder: items
    });
  }

  function toggleSection(section: SectionKey) {
    setCollapsedSections(prev => {
      const set = new Set(prev);
      if (set.has(section)) {
        set.delete(section); // expand
      } else {
        set.add(section); // collapse
      }
      return set;
    });
  }

  // --- HANDLERS: all standard update/add/remove handlers ---
  function updatePersonalInfo(field: string, value: string) {
    onChange({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        [field]: value
      }
    });
  }

  function addExperience() {
    onChange({
      ...data,
      experience: [
        ...data.experience,
        { title: "", company: "", location: "", startDate: "", endDate: "", current: false, bullets: [""] }
      ]
    });
  }

  function removeExperience(index: number) {
    const newExperience = [...data.experience];
    newExperience.splice(index, 1);
    onChange({ ...data, experience: newExperience });
  }

  function updateExperience(index: number, field: string, value: string | boolean) {
    const newExperience = [...data.experience];
    newExperience[index] = { ...newExperience[index], [field]: value };
    onChange({ ...data, experience: newExperience });
  }

  function addBulletPoint(expIndex: number) {
    const newExperience = [...data.experience];
    newExperience[expIndex].bullets.push("");
    onChange({ ...data, experience: newExperience });
  }

  function removeBulletPoint(expIndex: number, bulletIndex: number) {
    const newExperience = [...data.experience];
    newExperience[expIndex].bullets.splice(bulletIndex, 1);
    onChange({ ...data, experience: newExperience });
  }

  function updateBulletPoint(expIndex: number, bulletIndex: number, value: string) {
    const newExperience = [...data.experience];
    newExperience[expIndex].bullets[bulletIndex] = value;
    onChange({ ...data, experience: newExperience });
  }

  function addSkill(type: "technical" | "soft") {
    if (!newSkill.trim()) return;
    const skillList = [...data.skills[type], newSkill.trim()];
    onChange({
      ...data,
      skills: {
        ...data.skills,
        [type]: skillList
      }
    });
    setNewSkill("");
  }

  function removeSkill(type: "technical" | "soft", index: number) {
    const skillList = [...data.skills[type]];
    skillList.splice(index, 1);
    onChange({
      ...data,
      skills: {
        ...data.skills,
        [type]: skillList
      }
    });
  }

  function addEducation() {
    onChange({
      ...data,
      education: [
        ...data.education,
        { institution: "", degree: "", field: "", startDate: "", endDate: "", gpa: "" }
      ]
    });
  }

  function removeEducation(index: number) {
    const newEducation = [...data.education];
    newEducation.splice(index, 1);
    onChange({ ...data, education: newEducation });
  }

  function updateEducation(index: number, field: string, value: string) {
    const newEducation = [...data.education];
    newEducation[index] = { ...newEducation[index], [field]: value };
    onChange({ ...data, education: newEducation });
  }

  function addProject() {
    onChange({
      ...data,
      projects: [
        ...data.projects,
        { name: "", description: "", technologies: [], url: "" }
      ]
    });
  }

  function removeProject(index: number) {
    const newProjects = [...data.projects];
    newProjects.splice(index, 1);
    onChange({ ...data, projects: newProjects });
  }

  function updateProject(index: number, field: string, value: string) {
    const newProjects = [...data.projects];
    newProjects[index] = { ...newProjects[index], [field]: value };
    onChange({ ...data, projects: newProjects });
  }

  function addProjectTechnology(projectIndex: number, tech: string) {
    const newProjects = [...data.projects];
    newProjects[projectIndex].technologies.push(tech.trim());
    onChange({ ...data, projects: newProjects });
  }

  function removeProjectTechnology(projectIndex: number, techIndex: number) {
    const newProjects = [...data.projects];
    newProjects[projectIndex].technologies.splice(techIndex, 1);
    onChange({ ...data, projects: newProjects });
  }

  // --- CERTIFICATIONS HANDLERS ---
  function addCertification() {
    onChange({
      ...data,
      certifications: [
        ...data.certifications,
        { name: "", issuer: "", date: "", url: "" }
      ]
    });
  }

  function removeCertification(index: number) {
    const newCerts = [...data.certifications];
    newCerts.splice(index, 1);
    onChange({ ...data, certifications: newCerts });
  }

  function updateCertification(index: number, field: string, value: string) {
    const newCerts = [...data.certifications];
    newCerts[index] = { ...newCerts[index], [field]: value };
    onChange({ ...data, certifications: newCerts });
  }

  // Suggestion handler
  async function handleAISuggestions() {
    setSuggestionLoading(true);
    try {
      let response;
      if (aiProvider === 'openai') {
        response = await apiRequest('POST', '/api/ai/generate-summary', {
          experience: data.experience,
          skills: [...data.skills.technical, ...data.skills.soft],
          title: data.personalInfo.title,
        });
        const result = await response.json();
        if (result.summary && result.summary.trim()) {
          onChange({ ...data, summary: result.summary });
          toast({ title: 'Success', description: 'OpenAI summary generated!' });
        } else {
          toast({ title: 'Error', description: 'No summary returned from OpenAI', variant: 'destructive' });
        }
      } else {
        response = await apiRequest('POST', '/api/ai/gemini/suggestions', {
          profile: data.personalInfo,
          resumeDraft: data.summary,
          length: summaryLength,
          tone: summaryTone,
        });
        const result = await response.json();
        if (result.summary && result.summary.trim()) {
          onChange({ ...data, summary: result.summary });
          toast({ title: 'Success', description: 'Gemini summary generated!' });
        } else {
          toast({ title: 'Error', description: 'No summary returned from Gemini', variant: 'destructive' });
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'AI suggestion failed', variant: 'destructive' });
    } finally {
      setSuggestionLoading(false);
    }
  }

  // AI summary
  const generateSummaryMutation = useMutation({
    mutationFn: async () => {
      if (!data.personalInfo.title) throw new Error("Please add a professional title first");
      return await apiRequest("POST", "/api/ai/generate-summary", {
        experience: data.experience,
        skills: [...data.skills.technical, ...data.skills.soft],
        title: data.personalInfo.title,
      });
    },
    onSuccess: async (response) => {
      const result = await response.json();
      onChange({ ...data, summary: result.summary });
      toast({ title: "Success", description: "AI summary generated successfully!" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({ title: "Unauthorized", description: "You are logged out. Logging in again...", variant: "destructive" });
        setTimeout(() => window.location.reload(), 1500);
      }
    }
  });

  // Add AI handlers for each section
  async function handleAIExperience(expIndex: number) {
    setSuggestionLoading(true);
    try {
      let response;
      const exp = data.experience[expIndex];
      if (aiProvider === 'openai') {
        response = await apiRequest('POST', '/api/ai/generate-bullet-points', {
          jobTitle: exp.title,
          company: exp.company,
          responsibilities: exp.bullets.join('\n'),
        });
        const result = await response.json();
        if (result.bulletPoints && Array.isArray(result.bulletPoints)) {
          const newExperience = [...data.experience];
          newExperience[expIndex].bullets = result.bulletPoints;
          onChange({ ...data, experience: newExperience });
          toast({ title: 'Success', description: 'AI bullet points generated!' });
        } else {
          toast({ title: 'Error', description: 'No bullet points returned from AI', variant: 'destructive' });
        }
      } else {
        response = await apiRequest('POST', '/api/ai/gemini/generate-bullet-points', {
          jobTitle: exp.title,
          company: exp.company,
          responsibilities: exp.bullets.join('\n'),
        });
        const result = await response.json();
        if (result.bulletPoints && Array.isArray(result.bulletPoints)) {
          const newExperience = [...data.experience];
          newExperience[expIndex].bullets = result.bulletPoints;
          onChange({ ...data, experience: newExperience });
          toast({ title: 'Success', description: 'Gemini bullet points generated!' });
        } else {
          toast({ title: 'Error', description: 'No bullet points returned from Gemini', variant: 'destructive' });
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'AI suggestion failed', variant: 'destructive' });
    } finally {
      setSuggestionLoading(false);
    }
  }

  async function handleAISkills() {
    setSuggestionLoading(true);
    try {
      let response;
      if (aiProvider === 'openai') {
        response = await apiRequest('POST', '/api/ai/suggest-skills', {
          jobTitle: data.personalInfo.title,
          experience: data.experience,
        });
        const result = await response.json();
        if (result.skills && result.skills.technical && result.skills.soft) {
          onChange({
            ...data,
            skills: {
              technical: result.skills.technical,
              soft: result.skills.soft,
            },
          });
          toast({ title: 'Success', description: 'AI skills generated!' });
        } else {
          toast({ title: 'Error', description: 'No skills returned from AI', variant: 'destructive' });
        }
      } else {
        response = await apiRequest('POST', '/api/ai/gemini/suggest-skills', {
          jobTitle: data.personalInfo.title,
          experience: data.experience,
        });
        const result = await response.json();
        // Debug log
        console.debug('[Gemini Debug] Frontend raw response:', result);
        let technical = result.skills?.technical || [];
        let soft = result.skills?.soft || [];
        // Fallback: try to parse if empty and response text exists
        if ((technical.length === 0 || soft.length === 0) && result.skills) {
          let rawText = '';
          if (typeof result.skills === 'string') {
            rawText = result.skills;
          } else if (result.skills.rawText) {
            rawText = result.skills.rawText;
          }
          if (!rawText && result.skills.technical && typeof result.skills.technical === 'string') {
            rawText = result.skills.technical;
          }
          if (rawText) {
            // Remove all code block markers and trim whitespace/newlines
            rawText = rawText.replace(/```json|```/g, '').trim();
            // Remove leading/trailing newlines and spaces
            rawText = rawText.replace(/^\s+|\s+$/g, '');
            console.debug('[Gemini Debug] Cleaned skills string for JSON.parse:', rawText);
            try {
              const parsed = JSON.parse(rawText);
              technical = parsed.technical || technical;
              soft = parsed.soft || soft;
            } catch (e) {
              console.debug('[Gemini Debug] Fallback JSON parse failed:', e, rawText);
            }
          }
        }
        if (technical.length > 0 && soft.length > 0) {
          onChange({
            ...data,
            skills: {
              technical,
              soft,
            },
          });
          toast({ title: 'Success', description: 'Gemini skills generated!' });
        } else {
          toast({ title: 'Error', description: 'No skills returned from Gemini', variant: 'destructive' });
        }
      }
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'AI suggestion failed', variant: 'destructive' });
    } finally {
      setSuggestionLoading(false);
    }
  }

  // --- SECTION RENDERERS ---
  function renderSection(key: SectionKey) {
    switch (key) {
      case "personal":
        return (
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => toggleSection("personal")}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">Personal Information</h3>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${collapsedSections.has("personal") ? "" : "rotate-180"}`} />
            </CardHeader>
            {!collapsedSections.has("personal") && (
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>First Name</Label>
                    <Input
                      value={data.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input
                      value={data.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Professional Title</Label>
                    <Input
                      value={data.personalInfo.title}
                      onChange={(e) => updatePersonalInfo("title", e.target.value)}
                      placeholder="Software Engineer"
                    />
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Phone</Label>
                    <Input
                      type="tel"
                      value={data.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  <div>
                    <Label>Location</Label>
                    <Input
                      value={data.personalInfo.location}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Website/Portfolio</Label>
                    <Input
                      value={data.personalInfo.website}
                      onChange={(e) => updatePersonalInfo("website", e.target.value)}
                      placeholder="https://johndoe.com"
                    />
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );

      case "summary":
        return (
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => toggleSection("summary")}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">Professional Summary</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAISuggestions();
                  }}
                  disabled={suggestionLoading}
                  className="px-3 py-1 text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {suggestionLoading ? "Generating..." : "AI Generate"}
                </Button>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${collapsedSections.has("summary") ? "" : "rotate-180"}`} />
              </div>
            </CardHeader>
            {!collapsedSections.has("summary") && (
              <CardContent>
                <Textarea
                  value={data.summary}
                  onChange={(e) => onChange({ ...data, summary: e.target.value })}
                  placeholder="Write a compelling professional summary that highlights your key achievements and skills..."
                  rows={4}
                />
              </CardContent>
            )}
          </Card>
        );

      case "experience":
        return (
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => toggleSection("experience")}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">Work Experience</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); addExperience(); }}
                  className="px-3 py-1 text-xs"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  Add Experience
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); handleAIExperience(0); }}
                  disabled={suggestionLoading || data.experience.length === 0}
                  className="px-3 py-1 text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {suggestionLoading ? "Generating..." : "AI Generate"}
                </Button>
              </div>
            </CardHeader>
            {!collapsedSections.has("experience") && (
              <CardContent className="space-y-4">
                {data.experience.map((exp, expIndex) => (
                  <div key={expIndex} className="border border-slate-200 rounded-md p-4 bg-slate-50 relative">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeExperience(expIndex)}
                      title="Remove Experience"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(expIndex, "title", e.target.value)}
                          placeholder="Software Engineer"
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(expIndex, "company", e.target.value)}
                          placeholder="Google"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label>Location</Label>
                        <Input
                          value={exp.location}
                          onChange={(e) => updateExperience(expIndex, "location", e.target.value)}
                          placeholder="San Francisco, CA"
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <div className="relative">
                          <Input
                            type="month"
                            value={exp.startDate}
                            onChange={(e) => updateExperience(expIndex, "startDate", e.target.value)}
                            className={exp.startDate ? "" : "text-slate-400"}
                          />
                          {!exp.startDate && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Start date</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <div className="relative">
                          <Input
                            type="month"
                            value={exp.endDate}
                            onChange={(e) => updateExperience(expIndex, "endDate", e.target.value)}
                            disabled={exp.current}
                            className={exp.endDate || exp.current ? "" : "text-slate-400"}
                          />
                          {!exp.endDate && !exp.current && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">End date</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="checkbox"
                        id={`current-${expIndex}`}
                        checked={exp.current}
                        onChange={(e) => updateExperience(expIndex, "current", e.target.checked)}
                        className="rounded"
                        title="Currently work here"
                      />
                      <Label htmlFor={`current-${expIndex}`}>I currently work here</Label>
                    </div>
                    <div>
                      <Label>Key Achievements & Responsibilities</Label>
                      <div className="space-y-2 mt-2">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex items-center space-x-2">
                            <Input
                              value={bullet}
                              onChange={(e) => updateBulletPoint(expIndex, bulletIndex, e.target.value)}
                              placeholder="• Developed and maintained web applications using React and Node.js"
                            />
                            <Button
                              size="icon"
                              variant="outline"
                              onClick={() => removeBulletPoint(expIndex, bulletIndex)}
                              disabled={exp.bullets.length === 1}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => addBulletPoint(expIndex)}
                          className="mt-2"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add Bullet Point
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {data.experience.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="mb-4">No work experience added yet</p>
                    <Button onClick={addExperience} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Job
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );

      case "skills":
        return (
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => toggleSection("skills")}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">Skills</h3>
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => { e.stopPropagation(); handleAISkills(); }}
                  disabled={suggestionLoading}
                  className="px-3 py-1 text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {suggestionLoading ? "Generating..." : "AI Generate"}
                </Button>
              </div>
            </CardHeader>
            {!collapsedSections.has("skills") && (
              <CardContent className="space-y-4">
                <div>
                  <Label className="mb-2 block">Technical Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {data.skills.technical.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {skill}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSkill("technical", index)}
                          className="ml-2 p-0 h-auto text-xs"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a technical skill"
                      onKeyPress={(e) => { if (e.key === "Enter") addSkill("technical"); }}
                    />
                    <Button onClick={() => addSkill("technical")} disabled={!newSkill.trim()}>
                      Add
                    </Button>
                  </div>
                </div>
                <div>
                  <Label className="mb-2 block">Soft Skills</Label>
                  <div className="flex flex-wrap gap-2 mb-3">
                    {data.skills.soft.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center">
                        {skill}
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSkill("soft", index)}
                          className="ml-2 p-0 h-auto text-xs"
                        >
                          <X className="w-3 h-3" /> </Button>
                          </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a soft skill"
                      onKeyPress={(e) => { if (e.key === "Enter") addSkill("soft"); }}
                    />
                    <Button onClick={() => addSkill("soft")} disabled={!newSkill.trim()}>
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            )}
          </Card>
        );

      case "education":
        return (
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => toggleSection("education")}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">Education</h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => { e.stopPropagation(); addEducation(); }}
                className="px-3 py-1 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Education
              </Button>
            </CardHeader>
            {!collapsedSections.has("education") && (
              <CardContent className="space-y-4">
                {data.education.map((edu, eduIndex) => (
                  <div key={eduIndex} className="border border-slate-200 rounded-md p-4 bg-slate-50 relative">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeEducation(eduIndex)}
                      title="Remove Education"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(eduIndex, "institution", e.target.value)}
                          placeholder="University of California, Berkeley"
                        />
                      </div>
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(eduIndex, "degree", e.target.value)}
                          placeholder="Bachelor of Science"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div>
                        <Label>Field of Study</Label>
                        <Input
                          value={edu.field}
                          onChange={(e) => updateEducation(eduIndex, "field", e.target.value)}
                          placeholder="Computer Science"
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <div className="relative">
                          <Input
                            type="month"
                            value={edu.startDate}
                            onChange={(e) => updateEducation(eduIndex, "startDate", e.target.value)}
                          />
                          {!edu.startDate && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Start</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <div className="relative">
                          <Input
                            type="month"
                            value={edu.endDate}
                            onChange={(e) => updateEducation(eduIndex, "endDate", e.target.value)}
                          />
                          {!edu.endDate && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">End</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>GPA (Optional)</Label>
                      <Input
                        value={edu.gpa}
                        onChange={(e) => updateEducation(eduIndex, "gpa", e.target.value)}
                        placeholder="3.8"
                      />
                    </div>
                  </div>
                ))}
                {data.education.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="mb-4">No education added yet</p>
                    <Button onClick={addEducation} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your Education
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );

      case "projects":
        return (
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => toggleSection("projects")}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">Projects</h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={(e) => { e.stopPropagation(); addProject(); }}
                className="px-3 py-1 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Project
              </Button>
            </CardHeader>
            {!collapsedSections.has("projects") && (
              <CardContent className="space-y-4">
                {data.projects.map((project, projectIndex) => (
                  <div key={projectIndex} className="border border-slate-200 rounded-md p-4 bg-slate-50 relative">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeProject(projectIndex)}
                      title="Remove Project"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Project Name</Label>
                        <Input
                          value={project.name}
                          onChange={(e) => updateProject(projectIndex, "name", e.target.value)}
                          placeholder="E-commerce Website"
                        />
                      </div>
                      <div>
                        <Label>Project URL (Optional)</Label>
                        <Input
                          value={project.url}
                          onChange={(e) => updateProject(projectIndex, "url", e.target.value)}
                          placeholder="https://github.com/username/project"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <Label>Description</Label>
                      <Suspense fallback={<div>Loading editor...</div>}>
                        <RichTextEditor
                          value={project.description}
                          onChange={(value: string) => updateProject(projectIndex, "description", value)}
                          placeholder="Built a full-stack e-commerce platform using React and Node.js..."
                        />
                      </Suspense>
                    </div>
                    <div>
                      <Label>Technologies Used</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="secondary" className="flex items-center">
                            {tech}
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeProjectTechnology(projectIndex, techIndex)}
                              className="ml-2 p-0 h-auto text-xs"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                      <div className="flex space-x-2 mt-2">
                        <Input
                          placeholder="Add technology (e.g., React, Node.js)"
                          onKeyPress={(e) => {
                            if (e.key === "Enter" && e.currentTarget.value.trim()) {
                              addProjectTechnology(projectIndex, e.currentTarget.value.trim());
                              e.currentTarget.value = "";
                            }
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {data.projects.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="mb-4">No projects added yet</p>
                    <Button onClick={addProject} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Project
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );

      case "certifications":
        return (
          <Card>
            <CardHeader
              className="flex flex-row items-center justify-between space-y-0 pb-2 cursor-pointer"
              onClick={() => toggleSection("certifications")}
            >
              <div className="flex items-center space-x-3">
                <GripVertical className="w-4 h-4 text-slate-400" />
                <h3 className="font-semibold text-slate-900">Certifications</h3>
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={e => { e.stopPropagation(); addCertification(); }}
                className="px-3 py-1 text-xs"
              >
                <Plus className="w-3 h-3 mr-1" />
                Add Certification
              </Button>
            </CardHeader>
            {!collapsedSections.has("certifications") && (
              <CardContent className="space-y-4">
                {data.certifications.map((cert, certIndex) => (
                  <div key={certIndex} className="border border-slate-200 rounded-md p-4 bg-slate-50 relative">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeCertification(certIndex)}
                      title="Remove Certification"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Certification Name</Label>
                        <Input
                          value={cert.name}
                          onChange={e => updateCertification(certIndex, "name", e.target.value)}
                          placeholder="AWS Certified Solutions Architect"
                        />
                      </div>
                      <div>
                        <Label>Issuer</Label>
                        <Input value={cert.issuer} onChange={e => updateCertification(certIndex, "issuer", e.target.value)} placeholder="Amazon" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Date Obtained</Label>
                        <Input
                          type="month"
                          value={cert.date}
                          onChange={e => updateCertification(certIndex, "date", e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Credential URL (Optional)</Label>
                        <Input
                          value={cert.url}
                          onChange={e => updateCertification(certIndex, "url", e.target.value)}
                          placeholder="https://aws.amazon.com/verification"
                        />
                      </div>
                    </div>
                  </div>
                ))}
                {data.certifications.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <p className="mb-4">No certifications added yet</p>
                    <Button onClick={addCertification} variant="outline">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Your First Certification
                    </Button>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        );

      default:
        return null;
    }
  }

  // --- MAIN RENDER ---
  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header with tabs and global AI provider selection */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">Resume Editor</h2>
        <div className="flex items-center space-x-4">
          {/* Global AI Provider Selection */}
          <div className="flex items-center space-x-2">
            <Label className="text-xs">AI Model:</Label>
            <Select value={aiProvider} onValueChange={(value) => setAiProvider(value as 'openai' | 'gemini')}>
              <SelectTrigger className="w-28 h-8 text-xs">
                <SelectValue placeholder="AI Provider" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">OpenAI</SelectItem>
                <SelectItem value="gemini">Gemini</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {onExportPdf && (
            <Button
              size="sm"
              variant="outline"
              onClick={onExportPdf}
              disabled={exportPdfPending}
              className="px-3 py-1 text-xs"
            >
              <FileText className="w-4 h-4 mr-1" />
              {exportPdfPending ? "Exporting..." : "Export PDF"}
            </Button>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab("content")}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "content"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <FileText className="w-4 h-4 mr-2" />
          Content
        </button>
        <button
          onClick={() => setActiveTab("design")}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "design"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Palette className="w-4 h-4 mr-2" />
          Design
        </button>
        <button
          onClick={() => setActiveTab("settings")}
          className={`flex-1 flex items-center justify-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === "settings"
              ? "bg-white text-slate-900 shadow-sm"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Settings className="w-4 h-4 mr-2" />
          Settings
        </button>
      </div>

      {/* ATS Score Display */}
      {atsScore && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-blue-900">ATS Compatibility Score</h3>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-600">{atsScore.score}%</div>
                <div className={`w-3 h-3 rounded-full ${atsScore.score >= 80 ? 'bg-green-500' : atsScore.score >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {atsScore.feedback.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Feedback:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  {atsScore.feedback.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
            {atsScore.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-blue-900 mb-2">Suggestions:</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
                  {atsScore.suggestions.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Tab Content */}
      {activeTab === "content" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="sections">
            {(provided: any) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {sectionOrder.map((sectionKey, index) => (
                  <Draggable key={sectionKey} draggableId={sectionKey} index={index}>
                    {(provided: any) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        {renderSection(sectionKey)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {activeTab === "design" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Template Selection</h3>
            </CardHeader>
            <CardContent>
              <Select
                value={designSettings.template}
                onValueChange={(value) => setDesignSettings(prev => ({ ...prev, template: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a template" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="modern">Modern</SelectItem>
                  <SelectItem value="elegant">Elegant</SelectItem>
                  <SelectItem value="bold">Bold</SelectItem>
                  <SelectItem value="two-column">Two Column</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Typography</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Font Family</Label>
                <Select
                  value={designSettings.fontFamily}
                  onValueChange={(value) => setDesignSettings(prev => ({ ...prev, fontFamily: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Inter">Inter</SelectItem>
                    <SelectItem value="Roboto">Roboto</SelectItem>
                    <SelectItem value="Open Sans">Open Sans</SelectItem>
                    <SelectItem value="Lato">Lato</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Font Size: {designSettings.fontSize}px</Label>
                <Slider
                  value={[designSettings.fontSize]}
                  onValueChange={([value]) => setDesignSettings(prev => ({ ...prev, fontSize: value }))}
                  min={9}
                  max={14}
                  step={0.5}
                  className="mt-2"
                />
              </div>
              <div>
                <Label>Line Height: {designSettings.lineHeight}</Label>
                <Slider
                  value={[designSettings.lineHeight]}
                  onValueChange={([value]) => setDesignSettings(prev => ({ ...prev, lineHeight: value }))}
                  min={1.2}
                  max={2.0}
                  step={0.1}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Layout</h3>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Margins: {designSettings.margins}px</Label>
                <Slider
                  value={[designSettings.margins]}
                  onValueChange={([value]) => setDesignSettings(prev => ({ ...prev, margins: value }))}
                  min={10}
                  max={40}
                  step={5}
                  className="mt-2"
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Colors</h3>
            </CardHeader>
            <CardContent>
              <div>
                <Label>Accent Color</Label>
                <div className="flex items-center space-x-2 mt-2">
                  <input
                    type="color"
                    value={designSettings.accentColor}
                    onChange={(e) => setDesignSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                    className="w-12 h-8 rounded border"
                    title="Accent color picker"
                  />
                  <Input
                    value={designSettings.accentColor}
                    onChange={(e) => setDesignSettings(prev => ({ ...prev, accentColor: e.target.value }))}
                    placeholder="#2563EB"
                    className="flex-1"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Privacy Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Make Resume Public</Label>
                  <p className="text-sm text-slate-600">Allow others to view your resume</p>
                </div>
                <Switch
                  checked={resumeSettings.isPublic}
                  onCheckedChange={(checked) =>
                    setResumeSettings(prev => ({...prev, isPublic: checked }))
                  }
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Enable ATS Optimization</Label>
                  <p className="text-sm text-slate-600">Automatically optimize for ATS systems</p>
                </div>
                <Switch
                  checked={resumeSettings.atsOptimized}
                  onCheckedChange={(checked) => setResumeSettings(prev => ({ ...prev, atsOptimized: checked }))}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h3 className="font-semibold text-slate-900">Export Settings</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Default File Name</Label>
                <Input
                  value={resumeSettings.fileName}
                  onChange={(e) => setResumeSettings(prev => ({ ...prev, fileName: e.target.value }))}
                  placeholder="John_Doe_Resume"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Include Contact Info in PDF</Label>
                  <p className="text-sm text-slate-600">Show contact information in exported PDF</p>
                </div>
                <Switch
                  checked={resumeSettings.includeContactInfo}
                  onCheckedChange={(checked) => setResumeSettings(prev => ({ ...prev, includeContactInfo: checked }))}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default ResumeEditor;
