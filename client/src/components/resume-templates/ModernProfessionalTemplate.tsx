import React from 'react';
import { TemplateWrapper } from './shared/TemplateWrapper';
import { SectionHeader } from './shared/SectionHeader';
import { TemplateProps } from './shared/types';

export const ModernProfessionalTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#3B82F6'
}) => {
  const { personalInfo, summary, experience, education, skills, projects } = data;

  return (
    <TemplateWrapper accentColor={accentColor}>
      <div className="p-8 space-y-6">
        {/* Header Section */}
        <header className="text-center border-b-2 pb-6 mb-6" style={{ borderColor: accentColor }}>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          <h2 className="text-xl text-gray-600 mb-4">{personalInfo.title}</h2>
          
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600">
            <span>{personalInfo.email}</span>
            <span>•</span>
            <span>{personalInfo.phone}</span>
            <span>•</span>
            <span>{personalInfo.location}</span>
            {personalInfo.linkedin && (
              <>
                <span>•</span>
                <span>{personalInfo.linkedin}</span>
              </>
            )}
            {personalInfo.website && (
              <>
                <span>•</span>
                <span>{personalInfo.website}</span>
              </>
            )}
          </div>
        </header>

        {/* Professional Summary */}
        {summary && (
          <section>
            <SectionHeader title="Professional Summary" variant="modern" accentColor={accentColor} />
            <p className="text-gray-700 leading-relaxed">{summary}</p>
          </section>
        )}

        {/* Experience Section */}
        {experience && experience.length > 0 && (
          <section>
            <SectionHeader title="Professional Experience" variant="modern" accentColor={accentColor} />
            <div className="space-y-6">
              {experience.map((job) => (
                <div key={job.id} className="relative">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900">{job.title}</h4>
                      <p className="text-gray-700 font-medium">{job.company}</p>
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>{job.startDate} - {job.current ? 'Present' : job.endDate}</p>
                      <p>{job.location}</p>
                    </div>
                  </div>
                  
                  {job.description && (
                    <p className="text-gray-700 mb-3">{job.description}</p>
                  )}
                  
                  {job.bullets && job.bullets.length > 0 && (
                    <ul className="space-y-1">
                      {job.bullets.map((bullet, index) => (
                        <li key={index} className="flex items-start">
                          <span 
                            className="w-2 h-2 rounded-full mt-2 mr-3 flex-shrink-0"
                            style={{ backgroundColor: accentColor }}
                          ></span>
                          <span className="text-gray-700">{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills Section */}
        {skills && (
          <section>
            <SectionHeader title="Core Competencies" variant="modern" accentColor={accentColor} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {skills.technical && skills.technical.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Technical Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {skills.technical.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: accentColor }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              {skills.soft && skills.soft.length > 0 && (
                <div>
                  <h5 className="font-semibold text-gray-900 mb-2">Soft Skills</h5>
                  <div className="flex flex-wrap gap-2">
                    {skills.soft.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 rounded-full text-sm border-2 text-gray-700"
                        style={{ borderColor: accentColor }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Projects Section */}
        {projects && projects.length > 0 && (
          <section>
            <SectionHeader title="Key Projects" variant="modern" accentColor={accentColor} />
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                    {project.url && (
                      <a href={project.url} className="text-sm" style={{ color: accentColor }}>
                        View Project →
                      </a>
                    )}
                  </div>
                  <p className="text-gray-700 mb-2">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.technologies.map((tech, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Education Section */}
        {education && education.length > 0 && (
          <section>
            <SectionHeader title="Education" variant="modern" accentColor={accentColor} />
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-700 font-medium">{edu.school}</p>
                  </div>
                  <div className="text-right text-sm text-gray-600">
                    <p>{edu.startDate} - {edu.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </TemplateWrapper>
  );
};