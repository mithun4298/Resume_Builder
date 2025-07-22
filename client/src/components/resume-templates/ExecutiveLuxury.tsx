import React from "react";
import { dummyITResumeData } from "../dummyITResumeData";
import type { ResumeData } from "@shared/schema";

export interface ExecutiveLuxuryProps {
  data?: ResumeData;
  scale?: number;
}

const ExecutiveLuxury: React.FC<ExecutiveLuxuryProps> = ({ data = dummyITResumeData, scale = 1 }) => {
  return (
    <div 
      className="bg-gradient-to-br from-slate-50 to-gray-100 text-gray-900 shadow-2xl max-w-[210mm] mx-auto font-serif relative overflow-hidden"
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '210mm',
        minHeight: '297mm',
        fontSize: '11px'
      }}
    >
      {/* Luxury Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-amber-100/30 to-transparent rounded-full -translate-y-48 translate-x-48"></div>
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-slate-200/30 to-transparent rounded-full translate-y-32 -translate-x-32"></div>

      {/* Header */}
      <div className="relative p-12 border-b border-amber-200">
        <div className="max-w-4xl">
          <h1 className="text-5xl font-light text-slate-800 mb-3 tracking-wide">
            {data.personalInfo.firstName} {data.personalInfo.lastName}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-amber-600 mb-4"></div>
          <h2 className="text-2xl text-slate-600 font-light tracking-wider mb-8">
            {data.personalInfo.title}
          </h2>
          
          <div className="grid grid-cols-2 gap-8 text-slate-700">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="font-light">{data.personalInfo.email}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="font-light">{data.personalInfo.phone}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                <span className="font-light">{data.personalInfo.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                {data.personalInfo.website && <span className="font-light">{data.personalInfo.website}</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="relative p-12 grid grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="col-span-2 space-y-10">
          {/* Executive Summary */}
          <section>
            <h3 className="text-2xl font-light text-slate-800 mb-6 relative">
              Summary
              <div className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            </h3>
            <div className="text-slate-700 leading-relaxed font-light text-base" dangerouslySetInnerHTML={{ __html: data.summary }} />
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-2xl font-light text-slate-800 mb-8 relative">
              Experience
              <div className="absolute -bottom-2 left-0 w-16 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            </h3>
            <div className="space-y-8">
              {data.experience.map((exp, index) => (
                <div key={index} className="relative">
                  <div className="flex justify-between items-baseline mb-3">
                    <h4 className="text-xl font-medium text-slate-800">{exp.title}</h4>
                    <span className="text-slate-600 font-light bg-amber-50 px-3 py-1 rounded">
                      {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                    </span>
                  </div>
                  <p className="text-lg text-amber-700 font-light italic mb-4">{exp.company}</p>
                  <ul className="space-y-3">
                    {exp.bullets && exp.bullets.map((desc, i) => (
                      <li key={i} className="text-slate-700 font-light flex items-start leading-relaxed">
                        <div className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-2.5 mr-4 flex-shrink-0"></div>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <div className="space-y-10">
          {/* Education */}
          <section>
            <h3 className="text-xl font-light text-slate-800 mb-6 relative">
              Education
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            </h3>
            <div className="space-y-6">
              {data.education.map((edu, index) => (
                <div key={index} className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-amber-100">
                  <h4 className="font-medium text-slate-800 mb-1">{edu.degree} in {edu.field}</h4>
                  <p className="text-slate-700 font-light">{edu.institution}</p>
                  <p className="text-slate-600 font-light text-sm mt-1">{edu.startDate} - {edu.endDate}</p>
                  {edu.gpa && <p className="text-slate-600 font-light text-sm mt-1">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Core Competencies */}
          <section>
            <h3 className="text-xl font-light text-slate-800 mb-6 relative">
              Skills
              <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
            </h3>
            <div className="space-y-3">
              {data.skills.technical && data.skills.technical.map((skill, index) => (
                <div key={"tech-"+index} className="bg-gradient-to-r from-amber-50 to-slate-50 border border-amber-100 rounded-lg px-4 py-2">
                  <span className="text-slate-700 font-light">{skill}</span>
                </div>
              ))}
              {data.skills.soft && data.skills.soft.map((skill, index) => (
                <div key={"soft-"+index} className="bg-gradient-to-r from-amber-50 to-slate-50 border border-amber-100 rounded-lg px-4 py-2">
                  <span className="text-slate-700 font-light">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Certifications */}
          {data.certifications && data.certifications.length > 0 && (
            <section>
              <h3 className="text-xl font-light text-slate-800 mb-6 relative">
                Certifications
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
              </h3>
              <ul className="space-y-2">
                {data.certifications.map((cert, i) => (
                  <li key={i} className="bg-white/70 backdrop-blur-sm rounded-lg p-3 shadow-sm border border-amber-100">
                    <span className="text-slate-700 font-light text-sm">
                      <strong>{cert.name}</strong> ({cert.issuer}, {cert.date})
                      {cert.url && (
                        <span className="ml-2"><a href={cert.url} target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">[Link]</a></span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Projects */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h3 className="text-xl font-light text-slate-800 mb-6 relative">
                Projects
                <div className="absolute -bottom-2 left-0 w-12 h-0.5 bg-gradient-to-r from-amber-400 to-amber-600"></div>
              </h3>
              <div className="space-y-6">
                {data.projects.map((project, i) => (
                  <div key={i} className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-amber-100">
                    <div className="flex items-center mb-2">
                      <span className="font-semibold text-slate-800 text-base">{project.name}</span>
                      {project.url && (
                        <span className="ml-2"><a href={project.url} target="_blank" rel="noopener noreferrer" className="text-amber-700 underline">[Link]</a></span>
                      )}
                    </div>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="text-xs text-slate-600 mb-2">Tech: {project.technologies.join(", ")}</div>
                    )}
                    {project.description && (
                      <div className="text-slate-700 font-light text-sm" dangerouslySetInnerHTML={{ __html: project.description }} />
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutiveLuxury;
