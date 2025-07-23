import React, { useState } from "react";
// Only one import for DragDropContext, Droppable, Draggable
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import Toolbar from "./Editor/Toolbar";
import LivePreview from "./LivePreview";
import SectionModal from "./Editor/SectionModal";
import PersonalInfoSection from "./Editor/ResumeSections/PersonalInfoSection";
import SummarySection from "./Editor/ResumeSections/SummarySection";
import ExperienceSection from "./Editor/ResumeSections/ExperienceSection";
import SkillsSection from "./Editor/ResumeSections/SkillsSection";
import EducationSection from "./Editor/ResumeSections/EducationSection";
import ProjectsSection from "./Editor/ResumeSections/ProjectsSection";
import CertificationsSection from "./Editor/ResumeSections/CertificationsSection";
import { ResumeData, Experience } from "../types/resume";

import type { DroppableProvided, DraggableProvided, DraggableStateSnapshot, DropResult } from "react-beautiful-dnd";

// Dummy initial data for demonstration
const initialData: ResumeData = {
  personalInfo: { firstName: '', lastName: '', title: '', email: '', phone: '', location: '', website: '' },
  summary: '',
  experience: [],
  education: [],
  skills: { technical: [], soft: [] },
  projects: [],
  certifications: [],
};

const sectionOrderDefault = [
  'Personal Info',
  'Summary',
  'Experience',
  'Skills',
  'Education',
  'Projects',
  'Certifications',
];

const ResumeEditor: React.FC = () => {
  const [data, setData] = useState<ResumeData>(initialData);
  const [template, setTemplate] = useState("modern");
  const [accentColor, setAccentColor] = useState("#2563EB");
  const [modalOpen, setModalOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [sectionOrder, setSectionOrder] = useState<string[]>(sectionOrderDefault);

  // Handlers for section editing
  const handleSectionEdit = (section: string) => {
    setActiveSection(section);
    setModalOpen(true);
  };
  const handleModalClose = () => {
    setModalOpen(false);
    setActiveSection(null);
  };

  // Handlers for Toolbar
  const handleTemplateClick = () => {};
  const handleManageSectionsClick = () => {};
  const handleExportClick = () => {};

  // Section change handlers (example for Experience)
  const handleExperienceChange = (idx: number, field: string, value: any) => {
    const updated = [...data.experience];
    const key = field as keyof Experience;
    if (key === "current") {
      updated[idx][key] = Boolean(value);
    } else if (key === "bullets") {
      updated[idx][key] = Array.isArray(value) ? value : String(value).split(",").map((b: string) => b.trim());
    } else {
      updated[idx][key] = value;
    }
    setData({ ...data, experience: updated });
  };
  // ...similar handlers for other sections

  // Drag and drop handler
  const onDragEnd = (result: any) => {
    if (!result.destination) return;
    const newOrder = Array.from(sectionOrder);
    const [removed] = newOrder.splice(result.source.index, 1);
    newOrder.splice(result.destination.index, 0, removed);
    setSectionOrder(newOrder);
  };

  // Section render map
  const sectionComponents: { [key: string]: React.ReactNode } = {
    'Personal Info': (
      <div className="relative group">
        <PersonalInfoSection personalInfo={data.personalInfo} onChange={e => {
          const { name, value } = e.target;
          setData({ ...data, personalInfo: { ...data.personalInfo, [name]: value } });
        }} />
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleSectionEdit('Personal Info')}>Edit</button>
      </div>
    ),
    'Summary': (
      <div className="relative group">
        <SummarySection summary={data.summary} onChange={v => setData({ ...data, summary: v })} onGenerate={() => {}} loading={false} />
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleSectionEdit('Summary')}>Edit</button>
      </div>
    ),
    'Experience': (
      <div className="relative group">
        <ExperienceSection experience={data.experience} onChange={handleExperienceChange} onAdd={() => setData({ ...data, experience: [...data.experience, { title: '', current: false, company: '', startDate: '', endDate: '', bullets: [], location: '' }] })} onRemove={idx => setData({ ...data, experience: data.experience.filter((_, i) => i !== idx) })} />
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleSectionEdit('Experience')}>Edit</button>
      </div>
    ),
    'Skills': (
      <div className="relative group">
        <SkillsSection skills={data.skills} onChange={(type, idx, value) => {
          const updated = { ...data.skills };
          updated[type][idx] = value;
          setData({ ...data, skills: updated });
        }} onAdd={type => setData({ ...data, skills: { ...data.skills, [type]: [...data.skills[type], ''] } })} onRemove={(type, idx) => setData({ ...data, skills: { ...data.skills, [type]: data.skills[type].filter((_, i) => i !== idx) } })} />
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleSectionEdit('Skills')}>Edit</button>
      </div>
    ),
    'Education': (
      <div className="relative group">
        <EducationSection education={data.education} onChange={(idx, field, value) => {
          const updated = [...data.education];
          updated[idx] = { ...updated[idx], [field]: value };
          setData({ ...data, education: updated });
        }} onAdd={() => setData({ ...data, education: [...data.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }] })} onRemove={idx => setData({ ...data, education: data.education.filter((_, i) => i !== idx) })} />
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleSectionEdit('Education')}>Edit</button>
      </div>
    ),
    'Projects': (
      <div className="relative group">
        <ProjectsSection projects={data.projects} onChange={(idx, field, value) => {
          const updated = [...data.projects];
          if (field === 'technologies') {
            (updated[idx] as any).technologies = value.split(',').map((t: string) => t.trim());
          } else if (field === 'name' || field === 'description') {
            (updated[idx] as any)[field] = value;
          }
          setData({ ...data, projects: updated });
        }} onAdd={() => setData({ ...data, projects: [...data.projects, { name: '', description: '', technologies: [] }] })} onRemove={idx => setData({ ...data, projects: data.projects.filter((_, i) => i !== idx) })} />
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleSectionEdit('Projects')}>Edit</button>
      </div>
    ),
    'Certifications': (
      <div className="relative group">
        <CertificationsSection certifications={data.certifications} onChange={(idx, field, value) => {
          const updated = [...data.certifications];
          updated[idx] = { ...updated[idx], [field]: value };
          setData({ ...data, certifications: updated });
        }} onAdd={() => setData({ ...data, certifications: [...data.certifications, { name: '', issuer: '', date: '' }] })} onRemove={idx => setData({ ...data, certifications: data.certifications.filter((_, i) => i !== idx) })} />
        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition" onClick={() => handleSectionEdit('Certifications')}>Edit</button>
      </div>
    ),
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toolbar
        onTemplateClick={handleTemplateClick}
        onManageSectionsClick={handleManageSectionsClick}
        onExportClick={handleExportClick}
      />
      <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto px-4 py-8">
        {/* Editor Panel */}
        <div className="flex-1 space-y-6">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="sections-droppable">
              {(provided: any) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {sectionOrder.map((section, idx) => (
                    <Draggable key={section} draggableId={section} index={idx}>
                      {(dragProvided: any, dragSnapshot: any) => (
                        <div
                          ref={dragProvided.innerRef}
                          {...dragProvided.draggableProps}
                          {...dragProvided.dragHandleProps}
                          className={`mb-4 bg-white rounded-lg shadow border transition-all ${dragSnapshot.isDragging ? 'ring-2 ring-blue-400' : ''}`}
                        >
                          {sectionComponents[section]}
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {/* Live Preview Panel */}
        <div className="flex-1">
          <LivePreview
            resumeData={data}
            template={template}
            accentColor={accentColor}
            onTemplateChange={setTemplate}
            onAccentColorChange={setAccentColor}
          />
        </div>
      </div>
      {/* Section Modal Example (for editing sections) */}
      <SectionModal
        open={modalOpen}
        title={activeSection || ''}
        onClose={handleModalClose}
        onNext={() => {}}
        onBack={() => {}}
        onSave={() => {}}
        isFirstStep={false}
        isLastStep={true}
      >
        {activeSection === 'Personal Info' && (
          <PersonalInfoSection personalInfo={data.personalInfo} onChange={e => {
            const { name, value } = e.target;
            setData({ ...data, personalInfo: { ...data.personalInfo, [name]: value } });
          }} />
        )}
        {activeSection === 'Summary' && (
          <SummarySection summary={data.summary} onChange={v => setData({ ...data, summary: v })} onGenerate={() => {}} loading={false} />
        )}
        {activeSection === 'Experience' && (
          <ExperienceSection experience={data.experience} onChange={handleExperienceChange} onAdd={() => setData({ ...data, experience: [...data.experience, { title: '', current: false, company: '', startDate: '', endDate: '', bullets: [], location: '' }] })} onRemove={idx => setData({ ...data, experience: data.experience.filter((_, i) => i !== idx) })} />
        )}
        {activeSection === 'Skills' && (
          <SkillsSection skills={data.skills} onChange={(type, idx, value) => {
            const updated = { ...data.skills };
            updated[type][idx] = value;
            setData({ ...data, skills: updated });
          }} onAdd={type => setData({ ...data, skills: { ...data.skills, [type]: [...data.skills[type], ''] } })} onRemove={(type, idx) => setData({ ...data, skills: { ...data.skills, [type]: data.skills[type].filter((_, i) => i !== idx) } })} />
        )}
        {activeSection === 'Education' && (
          <EducationSection education={data.education} onChange={(idx, field, value) => {
            const updated = [...data.education];
            updated[idx] = { ...updated[idx], [field]: value };
            setData({ ...data, education: updated });
          }} onAdd={() => setData({ ...data, education: [...data.education, { institution: '', degree: '', field: '', startDate: '', endDate: '', gpa: '' }] })} onRemove={idx => setData({ ...data, education: data.education.filter((_, i) => i !== idx) })} />
        )}
        {activeSection === 'Projects' && (
          <ProjectsSection projects={data.projects} onChange={(idx, field, value) => {
            const updated = [...data.projects];
            if (field === 'technologies') {
              (updated[idx] as any).technologies = value.split(',').map((t: string) => t.trim());
            } else if (field === 'name' || field === 'description') {
              (updated[idx] as any)[field] = value;
            }
            setData({ ...data, projects: updated });
          }} onAdd={() => setData({ ...data, projects: [...data.projects, { name: '', description: '', technologies: [] }] })} onRemove={idx => setData({ ...data, projects: data.projects.filter((_, i) => i !== idx) })} />
        )}
        {activeSection === 'Certifications' && (
          <CertificationsSection certifications={data.certifications} onChange={(idx, field, value) => {
            const updated = [...data.certifications];
            updated[idx] = { ...updated[idx], [field]: value };
            setData({ ...data, certifications: updated });
          }} onAdd={() => setData({ ...data, certifications: [...data.certifications, { name: '', issuer: '', date: '' }] })} onRemove={idx => setData({ ...data, certifications: data.certifications.filter((_, i) => i !== idx) })} />
        )}
      </SectionModal>
    </div>
  );
};

export default ResumeEditor;
