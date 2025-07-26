import React from 'react';
import { cn } from '@/lib/utils';

export const ClassicTemplatePreview = ({ resumeData }: { resumeData: any }) => {
  const getSectionTitleStyles = () => "text-lg font-semibold text-black mb-2 border-b border-black pb-1 uppercase tracking-wide";
  const getSkillTagStyles = () => "px-2 py-1 bg-gray-200 text-gray-800 text-xs font-medium rounded";
  const getExperienceBorderStyles = () => "border-l-2 border-black pl-4";

  return (
    <div className="bg-gray-50 border border-gray-800 rounded-lg p-6 space-y-4 max-h-96 overflow-y-auto">
      <div className="text-center border-b-4 border-black pb-4">
        <h1 className="text-2xl font-bold text-gray-900">
          {resumeData.personalInfo.firstName} {resumeData.personalInfo.lastName}
        </h1>
        <div className="flex flex-wrap justify-center gap-4 mt-2 text-sm text-gray-600">
          {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
          {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
          {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
        </div>
      </div>
      {resumeData.summary && (
        <div>
          <h2 className={getSectionTitleStyles()}>Professional Summary</h2>
          <p className="text-gray-700 text-sm leading-relaxed">{resumeData.summary}</p>
        </div>
      )}
      {resumeData.experiences.length > 0 && (
        <div>
          <h2 className={getSectionTitleStyles()}>Work Experience</h2>
          <div className="space-y-3">
            {resumeData.experiences.slice(0, 2).map((exp: any) => (
              <div key={exp.id} className={getExperienceBorderStyles()}>
                <h3 className="font-medium text-gray-900">{exp.title}</h3>
                <p className="text-sm text-gray-600">{exp.company} • {exp.startDate} - {exp.endDate || 'Present'}</p>
                {exp.bullets && exp.bullets.length > 0 && (
                  <ul className="list-disc ml-4 text-sm text-gray-700 mt-1">
                    {exp.bullets.slice(0, 2).map((desc: string, i: number) => (
                      <li key={i}>{desc}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
            {resumeData.experiences.length > 2 && (
              <p className="text-sm text-gray-500 italic">+ {resumeData.experiences.length - 2} more positions</p>
            )}
          </div>
        </div>
      )}
      {resumeData.education.length > 0 && (
        <div>
          <h2 className={getSectionTitleStyles()}>Education</h2>
          <div className="space-y-2">
            {resumeData.education.slice(0, 2).map((edu: any) => (
              <div key={edu.id}>
                <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                <p className="text-sm text-gray-600">{edu.institution} • {edu.endDate}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      {resumeData.skills.length > 0 && (
        <div>
          <h2 className={getSectionTitleStyles()}>Skills</h2>
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.slice(0, 8).map((skill: any) => (
              <span key={skill.id} className={getSkillTagStyles()}>{skill.name}</span>
            ))}
            {resumeData.skills.length > 8 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded">
                +{resumeData.skills.length - 8} more
              </span>
            )}
          </div>
        </div>
      )}
      {resumeData.certifications.length > 0 && (
        <div>
          <h2 className={getSectionTitleStyles()}>Certifications</h2>
          <div className="space-y-2">
            {resumeData.certifications.slice(0, 3).map((cert: any) => (
              <div key={cert.id}>
                <h3 className="font-medium text-gray-900">{cert.name}</h3>
                <p className="text-sm text-gray-600">{cert.issuer} • {cert.date}</p>
              </div>
            ))}
            {resumeData.certifications.length > 3 && (
              <p className="text-sm text-gray-500 italic">
                +{resumeData.certifications.length - 3} more certifications
              </p>
            )}
          </div>
        </div>
      )}
      {resumeData.projects && resumeData.projects.length > 0 && (
        <div>
          <h2 className={getSectionTitleStyles()}>Projects</h2>
          <div className="space-y-2">
            {resumeData.projects.slice(0, 3).map((proj: any) => (
              <div key={proj.id}>
                <h3 className="font-medium text-gray-900">{proj.name}</h3>
                <p className="text-sm text-gray-600">{proj.description}</p>
                {proj.url && (
                  <a href={proj.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline text-xs">
                    {proj.url}
                  </a>
                )}
              </div>
            ))}
            {resumeData.projects.length > 3 && (
              <p className="text-sm text-gray-500 italic">
                +{resumeData.projects.length - 3} more projects
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
