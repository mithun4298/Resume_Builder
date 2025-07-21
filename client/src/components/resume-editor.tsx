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
  Calendar, MapPin, Mail, Phone, Globe, Palette, Type,
  Settings, Download, Eye, FileText
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
// ...existing code...
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"content" | "design" | "settings">("content");
  const [collapsedSections, setCollapsedSections] = useState<Set<SectionKey>>(new Set());
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
    atsOptimized: true
  });

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
      set.has(section) ? set.delete(section) : set.add(section);
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
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={data.personalInfo.firstName}
                      onChange={(e) => updatePersonalInfo("firstName", e.target.value)}
                      placeholder="John"
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={data.personalInfo.lastName}
                      onChange={(e) => updatePersonalInfo("lastName", e.target.value)}
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    value={data.personalInfo.title}
                    onChange={(e) => updatePersonalInfo("title", e.target.value)}
                    placeholder="Software Engineer"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={data.personalInfo.email}
                      onChange={(e) => updatePersonalInfo("email", e.target.value)}
                      placeholder="john@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={data.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo("phone", e.target.value)}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={data.personalInfo.location}
                      onChange={(e) => updatePersonalInfo("location", e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
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
                  onClick={e => { e.stopPropagation(); generateSummaryMutation.mutate(); }}
                  disabled={generateSummaryMutation.isPending}
                  className="px-3 py-1 text-xs"
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  {generateSummaryMutation.isPending ? "Generating..." : "AI Generate"}
                </Button>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${collapsedSections.has("summary") ? "" : "rotate-180"}`} />
              </div>
            </CardHeader>
            {!collapsedSections.has("summary") && (
              <CardContent>
                <Suspense fallback={<div>Loading editor...</div>}>
                  <RichTextEditor
                    value={data.summary}
                    onChange={(value: string) => onChange({ ...data, summary: value })}
                    placeholder="Dynamic software engineer with a passion for..."
                  />
                </Suspense>
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
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${collapsedSections.has("experience") ? "" : "rotate-180"}`} />
              </div>
            </CardHeader>
            {!collapsedSections.has("experience") && (
              <CardContent>
                {data.experience.map((exp, expIndex) => (
                  <div key={expIndex} className="border border-slate-200 rounded-md p-4 bg-slate-50 mb-2 relative">
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={() => removeExperience(expIndex)}
                      title="Remove Experience"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    <div className="grid grid-cols-2 gap-4 mb-2">
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(expIndex, "company", e.target.value)}
                          placeholder="Acme Corporation"
                        />
                      </div>
                      <div>
                        <Label>Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(expIndex, "title", e.target.value)}
                          placeholder="Frontend Developer"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4 mb-2">
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
                          />
                          {!exp.endDate && !exp.current && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">End date</span>
                          )}
                          {exp.current && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Present</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div>
                      <Label>Key Achievements</Label>
                      <div className="space-y-2">
                        {exp.bullets.map((bullet, bulletIndex) => (
                          <div key={bulletIndex} className="flex items-start space-x-2">
                            <span className="text-slate-400 mt-2">•</span>
                            <Input
                              value={bullet}
                              onChange={(e) => updateBulletPoint(expIndex, bulletIndex, e.target.value)}
                              placeholder="Led development of key features that increased user engagement by 25%"
                              className="flex-1"
                            />
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => removeBulletPoint(expIndex, bulletIndex)}
                              className="p-1"
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => addBulletPoint(expIndex)}
                          className="text-primary hover:text-primary/80"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add bullet point
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
                      Add Your First Position
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
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${collapsedSections.has("skills") ? "" : "rotate-180"}`} />
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
                          <X className="w-3 h-3" />
                        </Button>
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
                            className={edu.startDate ? "" : "text-slate-400"}
                          />
                          {!edu.startDate && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Start date</span>
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
                            className={edu.endDate ? "" : "text-slate-400"}
                          />
                          {!edu.endDate && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">End date</span>
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
                  <div key={projectIndex} className="border border-slate-200 rounded-md p-4 bg-slate-50">
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
                        <Input
                          value={cert.issuer}
                          onChange={e => updateCertification(certIndex, "issuer", e.target.value)}
                          placeholder="Amazon Web Services"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <Label>Date</Label>
                        <div className="relative">
                          <Input
                            type="month"
                            value={cert.date}
                            onChange={e => updateCertification(certIndex, "date", e.target.value)}
                          />
                          {!cert.date && (
                            <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">Date</span>
                          )}
                        </div>
                      </div>
                      <div>
                        <Label>URL (Optional)</Label>
                        <Input
                          value={cert.url}
                          onChange={e => updateCertification(certIndex, "url", e.target.value)}
                          placeholder="https://example.com/cert"
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
    <div>
      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-6">
        <button
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "content" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          onClick={() => setActiveTab("content")}
        >Content</button>
        <button
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "design" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          onClick={() => setActiveTab("design")}
        >Design</button>
        <button
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${activeTab === "settings" ? "bg-white text-slate-900 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}
          onClick={() => setActiveTab("settings")}
        >Settings</button>
      </div>

      {activeTab === "content" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="resumeSections">
            {(droppableProvided: any) => (
              <div ref={droppableProvided.innerRef} {...droppableProvided.droppableProps}>
                {sectionOrder.map((key, idx) => (
                  <Draggable key={key} draggableId={key} index={idx}>
                    {(draggableProvided: any) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        className="mb-4"
                      >
                        {renderSection(key)}
                      </div>
                    )}
                  </Draggable>
                ))}
                {droppableProvided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}

      {activeTab === "design" && (
  <div className="space-y-6">
    {/* Template Selector */}
    <Card>
      <CardHeader>
        <h3 className="font-semibold flex items-center">
          <FileText className="w-4 h-4 mr-2" /> Template
        </h3>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {["modern", "classic", "minimal", "creative"].map((template) => (
            <div
              key={template}
              className={`border-2 rounded-lg p-3 cursor-pointer transition-colors ${
                designSettings.template === template
                  ? "border-primary bg-primary/5"
                  : "border-slate-200 hover:border-slate-300"
              }`}
              onClick={() => setDesignSettings({ ...designSettings, template })}
            >
              <div className="text-center">
                <div className="w-full h-20 bg-slate-100 rounded mb-2 flex items-center justify-center">
                  <span className="text-xs font-medium capitalize">{template}</span>
                </div>
                <span className="text-sm capitalize">{template}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>

    {/* Typography Settings */}
    <Card>
      <CardHeader>
        <h3 className="font-semibold flex items-center">
          <Type className="w-4 h-4 mr-2" /> Typography
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={designSettings.fontFamily}
            onValueChange={(value) => setDesignSettings({...designSettings, fontFamily: value})}
          >
            <SelectTrigger><SelectValue/></SelectTrigger>
            <SelectContent>
              <SelectItem value="Inter">Inter</SelectItem>
              <SelectItem value="Roboto">Roboto</SelectItem>
              <SelectItem value="Open Sans">Open Sans</SelectItem>
              <SelectItem value="Source Sans Pro">Source Sans Pro</SelectItem>
              <SelectItem value="Times New Roman">Times New Roman</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Font Size: {designSettings.fontSize}px</Label>
          <Slider
            value={[designSettings.fontSize]}
            onValueChange={([value]) => setDesignSettings({ ...designSettings, fontSize: value })}
            min={9}
            max={16}
            step={0.5}
            className="mt-2"
          />
        </div>
        <div>
          <Label>Line Height: {designSettings.lineHeight}</Label>
          <Slider
            value={[designSettings.lineHeight]}
            onValueChange={([value]) => setDesignSettings({ ...designSettings, lineHeight: value })}
            min={1.2}
            max={2.0}
            step={0.1}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>

    {/* Color Picker */}
    <Card>
      <CardHeader>
        <h3 className="font-semibold flex items-center">
          <Palette className="w-4 h-4 mr-2" /> Colors
        </h3>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="accentColor">Accent Color</Label>
          <div className="flex items-center space-x-3 mt-2">
            <Input
              type="color"
              value={designSettings.accentColor}
              onChange={(e) => setDesignSettings({ ...designSettings, accentColor: e.target.value })}
              className="w-12 h-10"
            />
            <Input
              value={designSettings.accentColor}
              onChange={(e) => setDesignSettings({ ...designSettings, accentColor: e.target.value })}
              placeholder="#2563EB"
            />
          </div>
          <div className="grid grid-cols-6 gap-2 mt-3">
            {["#2563EB","#DC2626","#059669","#7C3AED","#EA580C","#0891B2"].map((color) => (
              <button
                key={color}
                className="w-8 h-8 rounded border-2 border-slate-200 color-swatch"
                data-color={color}
                onClick={() => setDesignSettings({ ...designSettings, accentColor: color })}
                title={`Set accent color to ${color}`}
                aria-label={`Set accent color to ${color}`}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>

    {/* Margin Settings */}
    <Card>
      <CardHeader>
        <h3 className="font-semibold">Layout</h3>
      </CardHeader>
      <CardContent>
        <div>
          <Label>Margins: {designSettings.margins}px</Label>
          <Slider
            value={[designSettings.margins]}
            onValueChange={([value]) => setDesignSettings({ ...designSettings, margins: value })}
            min={10}
            max={40}
            step={5}
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  </div>
)}

{activeTab === "settings" && (
  <div className="space-y-6">
    <Card>
      <CardHeader>
        <h3 className="font-semibold flex items-center">
          <Settings className="w-4 h-4 mr-2" /> Privacy & Sharing
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="isPublic">Make resume public</Label>
            <p className="text-sm text-slate-600">Allow others to view your resume</p>
          </div>
          <Switch
            id="isPublic"
            checked={resumeSettings.isPublic}
            onCheckedChange={(checked) => setResumeSettings({ ...resumeSettings, isPublic: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="allowComments">Allow comments</Label>
            <p className="text-sm text-slate-600">Let others provide feedback</p>
          </div>
          <Switch
            id="allowComments"
            checked={resumeSettings.allowComments}
            onCheckedChange={(checked) => setResumeSettings({ ...resumeSettings, allowComments: checked })}
          />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="showContactInfo">Show contact information</Label>
            <p className="text-sm text-slate-600">Display email and phone on public resume</p>
          </div>
          <Switch
            id="showContactInfo"
            checked={resumeSettings.showContactInfo}
            onCheckedChange={(checked) => setResumeSettings({ ...resumeSettings, showContactInfo: checked })}
          />
        </div>
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <h3 className="font-semibold flex items-center">
          <Check className="w-4 h-4 mr-2" /> ATS Optimization
        </h3>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="atsOptimized">ATS-friendly formatting</Label>
            <p className="text-sm text-slate-600">Optimize layout for Applicant Tracking Systems</p>
          </div>
          <Switch
            id="atsOptimized"
            checked={resumeSettings.atsOptimized}
            onCheckedChange={(checked) => setResumeSettings({ ...resumeSettings, atsOptimized: checked })}
          />
        </div>
        {atsScore && (
          <div className="bg-slate-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <span className="font-medium">Current ATS Score</span>
              <span className="text-2xl font-bold text-accent">
                {atsScore.score}/100
              </span>
            </div>
            {atsScore.feedback.length > 0 && (
              <div className="mb-3">
                <h4 className="font-medium text-sm text-slate-700 mb-2">What's working well:</h4>
                <ul className="space-y-1">
                  {atsScore.feedback.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start">
                      <Check className="w-3 h-3 mr-2 mt-0.5 text-green-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {atsScore.suggestions.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-slate-700 mb-2">Suggestions for improvement:</h4>
                <ul className="space-y-1">
                  {atsScore.suggestions.slice(0, 3).map((item, index) => (
                    <li key={index} className="text-sm text-slate-600 flex items-start">
                      <span className="w-3 h-3 mr-2 mt-0.5 text-orange-500">⚡</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
    <Card>
      <CardHeader>
        <h3 className="font-semibold flex items-center">
          <Download className="w-4 h-4 mr-2" /> Export Options
        </h3>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={onExportPdf}
          disabled={exportPdfPending}
        >
          <Download className="w-4 h-4 mr-2" />
          {exportPdfPending ? "Exporting..." : "Download as PDF"}
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Download className="w-4 h-4 mr-2" />
          Download as Word Doc
        </Button>
        <Button variant="outline" className="w-full justify-start">
          <Eye className="w-4 h-4 mr-2" />
          Preview in new tab
        </Button>
      </CardContent>
    </Card>
    <Card className="border-red-200">
      <CardHeader>
        <h3 className="font-semibold text-red-600">Danger Zone</h3>
      </CardHeader>
      <CardContent>
        <Button variant="destructive" className="w-full">
          Delete Resume
        </Button>
        <p className="text-sm text-slate-600 mt-2">
          This action cannot be undone. This will permanently delete your resume.
        </p>
      </CardContent>
    </Card>
  </div>
)}

      
    </div>
  );
}

export default ResumeEditor;
