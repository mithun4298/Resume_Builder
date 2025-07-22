import React from "react";
import type { ResumeData } from "@shared/schema";
import { dummyITResumeData } from "../dummyITResumeData";

export interface TechFocusedProps {
  data?: ResumeData;
  scale?: number;
}

const TechFocused: React.FC<TechFocusedProps> = ({ data = dummyITResumeData, scale = 1 }) => {
  return (
    <div 
      className="bg-gray-50 text-gray-900 shadow-lg max-w-[210mm] mx-auto font-mono"
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '210mm',
        minHeight: '297mm',
        fontSize: '10px'
      }}
    >
      {/* Header */}
      <div className="bg-gray-900 text-green-400 p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-gray-300 text-sm">~/resume</span>
        </div>
        <div className="space-y-2">
          <div className="text-gray-300">$ whoami</div>
          <h1 className="text-2xl font-bold text-green-400">{data.personalInfo.firstName} {data.personalInfo.lastName}</h1>
          <h2 className="text-lg text-blue-400"># {data.personalInfo.title}</h2>
          <div className="mt-4 space-y-1 text-sm">
            <div><span className="text-yellow-400">email:</span> {data.personalInfo.email}</div>
            <div><span className="text-yellow-400">phone:</span> {data.personalInfo.phone}</div>
            <div><span className="text-yellow-400">location:</span> {data.personalInfo.location}</div>
            <div><span className="text-yellow-400">website:</span> {data.personalInfo.website}</div>
            {/* Removed github line for schema consistency */}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Summary */}
        <section className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-500">
          <h3 className="text-green-600 font-bold mb-2">Summary</h3>
          <div className="text-gray-700 font-sans" dangerouslySetInnerHTML={{ __html: data.summary }} />
        </section>

        {/* Skills */}
        <section className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-blue-500">
          <h3 className="text-blue-600 font-bold mb-3">Skills</h3>
          <div className="grid grid-cols-4 gap-2">
            {data.skills.technical && data.skills.technical.map((skill, index) => (
              <div 
                key={"tech-"+index}
                className="bg-gray-100 border border-gray-300 px-2 py-1 rounded text-center text-gray-700 font-sans text-xs"
              >
                {skill}
              </div>
            ))}
            {data.skills.soft && data.skills.soft.map((skill, index) => (
              <div 
                key={"soft-"+index}
                className="bg-gray-100 border border-gray-300 px-2 py-1 rounded text-center text-gray-700 font-sans text-xs"
              >
                {skill}
              </div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-purple-500">
          <h3 className="text-purple-600 font-bold mb-4">Experience</h3>
          <div className="space-y-4">
            {data.experience.map((exp, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-gray-900 font-bold font-sans">{exp.title}</h4>
                    <p className="text-gray-600 font-sans">{exp.company}</p>
                  </div>
                  <span className="bg-gray-100 px-2 py-1 rounded text-gray-600 text-xs">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <ul className="space-y-1 font-sans text-sm">
                  {exp.bullets && exp.bullets.map((desc, i) => (
                    <li key={i} className="flex items-start text-gray-700">
                      <span className="text-green-500 mr-2">&gt;</span>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Projects */}
        {data.projects && data.projects.length > 0 && (
          <section className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-orange-500">
            <h3 className="text-orange-600 font-bold mb-4">Projects</h3>
            <div className="space-y-3">
              {data.projects.map((project, index) => (
                <div key={index} className="bg-gray-50 rounded p-3">
                  <h4 className="text-gray-900 font-bold font-sans mb-1">
                    {project.name}
                    {project.url && (
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-700 underline">[Link]</a>
                    )}
                  </h4>
                  {project.technologies && project.technologies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {project.technologies.map((tech, i) => (
                        <span key={i} className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-xs">{tech}</span>
                      ))}
                    </div>
                  )}
                  {project.description && (
                    <div className="text-gray-700 font-sans text-sm mb-2" dangerouslySetInnerHTML={{ __html: project.description }} />
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education */}
        <section className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-500">
          <h3 className="text-red-600 font-bold mb-3">Education</h3>
          <div className="space-y-2">
            {data.education.map((edu, index) => (
              <div key={index}>
                <h4 className="text-gray-900 font-bold font-sans">{edu.degree} in {edu.field}</h4>
                <p className="text-gray-600 font-sans">{edu.institution} • {edu.startDate} - {edu.endDate}</p>
                {edu.gpa && <p className="text-gray-600 font-sans text-xs">GPA: {edu.gpa}</p>}
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default TechFocused;
