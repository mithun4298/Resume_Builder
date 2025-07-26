import React from 'react';
import { TemplateWrapper, SectionHeader, TemplateProps } from './shared';

export const CreativeTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#7c3aed'
}) => {
  const { personalInfo, summary, experience, education, skills, projects = [] } = data;

  return (
    <TemplateWrapper accentColor={accentColor}>
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 max-w-4xl mx-auto">
        {/* Header Section */}
        <header className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-8 rounded-t-lg">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            {personalInfo.title && (
              <h2 className="text-xl text-purple-100 mb-4">{personalInfo.title}</h2>
            )}
            
            <div className="flex flex-wrap justify-center gap-6 text-sm text-purple-100">
              {personalInfo.email && <span>📧 {personalInfo.email}</span>}
              {personalInfo.phone && <span>📱 {personalInfo.phone}</span>}
              {personalInfo.location && <span>📍 {personalInfo.location}</span>}
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {summary && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <SectionHeader title="CREATIVE VISION" variant="creative" accentColor={accentColor} />
              <p className="text-gray-700 leading-relaxed italic">{summary}</p>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section className="bg-white rounded-lg p-6 shadow-sm">
              <SectionHeader title="EXPERIENCE JOURNEY" variant="creative" accentColor={accentColor} />
              <div className="space-y-6">
                {experience.map((job, index) => (
                  <div key={job.id} className="relative">
                    {index !== experience.length - 1 && (
                      <div className="absolute left-4 top-8 w-0.5 h-full bg-purple-200"></div>
                    )}
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold mr-4 relative z-10">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                            <p className="text-gray-700 font-semibold">{job.company}</p>
                          </div>
                          <div className="text-right text-sm text-gray-600">
                            <p className="font-medium">{job.startDate} - {job.current ? 'Present' : job.endDate}</p>
                            <p>{job.location}</p>
                          </div>
                        </div>
                        
                        {job.description && (
                          <p className="text-gray-700 mb-3">{job.description}</p>
                        )}
                        
                        {job.bullets && job.bullets.length > 0 && (
                          <ul className="space-y-1">
                            {job.bullets.map((bullet, bulletIndex) => (
                              <li key={bulletIndex} className="flex items-start">
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
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills & Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Skills Section */}
            {skills && (
              <section className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <h3 className="text-lg font-bold" style={{ color: accentColor }}>
                    DESIGN TOOLS
                  </h3>
                </div>
                <div className="space-y-4">
                  {skills.technical && skills.technical.length > 0 && (
                    <div>
                      <h5 className="font-semibold text-gray-900 mb-2">Technical Skills</h5>
                      <div className="flex flex-wrap gap-2">
                        {skills.technical.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 rounded-full text-sm text-white font-medium"
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
                      <h5 className="font-semibold text-gray-900 mb-2">Creative Skills</h5>
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
              <section className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-center mb-4">
                  <div 
                    className="w-3 h-3 rounded-full mr-3"
                    style={{ backgroundColor: accentColor }}
                  ></div>
                  <h3 className="text-lg font-bold" style={{ color: accentColor }}>
                    PORTFOLIO HIGHLIGHTS
                  </h3>
                </div>
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="border-l-4 pl-4" style={{ borderColor: accentColor }}>
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{project.name}</h4>
                        {project.url && (
                          <a href={project.url} className="text-sm" style={{ color: accentColor }}>
                            View →
                          </a>
                        )}
                      </div>
                      <p className="text-gray-700 text-sm mb-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.map((tech, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded"
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
          </div>

          {/* Education Section */}
          {education && education.length > 0 && (
            <section className="bg-white rounded-2xl p-6 shadow-sm">
              <div className="flex items-center mb-4">
                <div 
                  className="w-3 h-3 rounded-full mr-3"
                  style={{ backgroundColor: accentColor }}
                ></div>
                <h3 className="text-lg font-bold" style={{ color: accentColor }}>
                  EDUCATION
                </h3>
              </div>
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{edu.degree}</h4>
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
      </div>
    </TemplateWrapper>
  );
};