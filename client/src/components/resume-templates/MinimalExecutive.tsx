import React from "react";
import type { ResumeData } from "@shared/schema";
import { dummyITResumeData } from "../dummyITResumeData";

export interface MinimalExecutiveProps {
  data?: ResumeData;
  scale?: number;
}

const MinimalExecutive: React.FC<MinimalExecutiveProps> = ({ data = dummyITResumeData, scale = 1 }) => {
  return (
    <div 
      className="bg-white text-gray-900 shadow-lg max-w-[210mm] mx-auto font-sans"
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '210mm',
        minHeight: '297mm',
        fontSize: '11px'
      }}
    >
      {/* Header */}
      <div className="border-b-4 border-gray-900 p-8">
        <h1 className="text-4xl font-light text-gray-900 mb-2 tracking-wide">
          {(data.personalInfo.firstName + ' ' + data.personalInfo.lastName).toUpperCase()}
        </h1>
        <h2 className="text-xl text-gray-600 font-light mb-6 tracking-wider">
          {data.personalInfo.title}
        </h2>
        <div className="flex justify-between text-sm text-gray-700 font-light">
          <span>{data.personalInfo.email}</span>
          <span>{data.personalInfo.phone}</span>
          <span>{data.personalInfo.location}</span>
          <span>{data.personalInfo.website}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-12 p-8">
        {/* Left Column */}
        <div className="col-span-2 space-y-8">
          {/* Summary */}
          <section>
            <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wider border-b border-gray-300 pb-2">
              Summary
            </h3>
            <div className="text-gray-700 leading-relaxed font-light" dangerouslySetInnerHTML={{ __html: data.summary }} />
          </section>

          {/* Experience */}
          <section>
            <h3 className="text-lg font-light text-gray-900 mb-6 tracking-wider border-b border-gray-300 pb-2">
              Experience
            </h3>
            <div className="space-y-6">
              {data.experience.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-base font-medium text-gray-900">{exp.title}</h4>
                    <span className="text-sm text-gray-600 font-light">{exp.startDate} - {exp.current ? "Present" : exp.endDate}</span>
                  </div>
                  <p className="text-gray-700 font-light italic mb-3">{exp.company}</p>
                  <ul className="space-y-2">
                    {exp.bullets && exp.bullets.map((desc, i) => (
                      <li key={i} className="text-gray-700 font-light flex items-start">
                        <span className="mr-3 text-gray-400">•</span>
                        {desc}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* Education */}
          <section>
            <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wider border-b border-gray-300 pb-2">
              Education
            </h3>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index}>
                  <h4 className="font-medium text-gray-900 text-sm">{edu.degree} in {edu.field}</h4>
                  <p className="text-gray-700 font-light text-sm">{edu.institution}</p>
                  <p className="text-gray-600 font-light text-xs">{edu.startDate} - {edu.endDate}</p>
                  {edu.gpa && <p className="text-gray-600 font-light text-xs">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wider border-b border-gray-300 pb-2">
              Skills
            </h3>
            <div className="space-y-2">
              {data.skills.technical && data.skills.technical.map((skill, index) => (
                <div key={"tech-"+index} className="text-gray-700 font-light text-sm py-1">
                  {skill}
                </div>
              ))}
              {data.skills.soft && data.skills.soft.map((skill, index) => (
                <div key={"soft-"+index} className="text-gray-700 font-light text-sm py-1">
                  {skill}
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          {data.projects && data.projects.length > 0 && (
            <section>
              <h3 className="text-lg font-light text-gray-900 mb-4 tracking-wider border-b border-gray-300 pb-2">
                Projects
              </h3>
              <div className="space-y-4">
                {data.projects.map((project, i) => (
                  <div key={i} className="border-b border-gray-200 pb-2 mb-2">
                    <div className="flex items-center mb-1">
                      <span className="font-semibold text-gray-900 text-sm">{project.name}</span>
                      {project.url && (
                        <span className="ml-2"><a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-700 underline">[Link]</a></span>
                      )}
                    </div>
                    {project.technologies && project.technologies.length > 0 && (
                      <div className="text-xs text-gray-600 mb-1">Tech: {project.technologies.join(", ")}</div>
                    )}
                    {project.description && (
                      <div className="text-gray-700 font-light text-xs" dangerouslySetInnerHTML={{ __html: project.description }} />
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

export default MinimalExecutive;
