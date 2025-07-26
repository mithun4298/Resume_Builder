import React from 'react';
import { TemplateWrapper } from './shared/TemplateWrapper';
import { SectionHeader } from './shared/SectionHeader';
import { TemplateProps } from './shared/types';

export const TechTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#3B82F6'
}) => {
  const { personalInfo, summary, experience, education, skills, projects, certifications } = data;

  return (
    <TemplateWrapper accentColor={accentColor}>
      <div className="bg-white">
        {/* Header Section */}
        <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2">
                  {personalInfo.firstName} {personalInfo.lastName}
                </h1>
                <h2 className="text-xl text-blue-100 mb-4">{personalInfo.title}</h2>
                
                <div className="flex flex-wrap gap-4 text-sm text-blue-200">
                  <span>📧 {personalInfo.email}</span>
                  <span>📱 {personalInfo.phone}</span>
                  <span>📍 {personalInfo.location}</span>
                  {personalInfo.github && <span>🔗 {personalInfo.github}</span>}
                  {personalInfo.linkedin && <span>💼 {personalInfo.linkedin}</span>}
                </div>
              </div>
              
              {/* Tech Stack Highlight */}
              <div className="hidden md:block bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-2">Primary Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {skills?.primary?.slice(0, 4).map((tech, index) => (
                    <span key={index} className="bg-white/20 px-2 py-1 rounded text-xs">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-6xl mx-auto p-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Summary */}
              {summary && (
                <section>
                  <SectionHeader title="ABOUT" accentColor={accentColor} />
                  <p className="text-gray-700 leading-relaxed">{summary}</p>
                </section>
              )}

              {/* Experience */}
              {experience && experience.length > 0 && (
                <section>
                  <SectionHeader title="EXPERIENCE" accentColor={accentColor} />
                  
                  <div className="space-y-6">
                    {experience.map((job) => (
                      <div key={job.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold mb-2">{job.position}</h3>
                        <div className="text-gray-500 mb-2">
                          <span>{job.company}</span> • <span>{job.location}</span> • <span>{job.dates}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{job.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Content */}
            <div className="space-y-8">
              {/* Education */}
              {education && education.length > 0 && (
                <section>
                  <SectionHeader title="EDUCATION" accentColor={accentColor} />
                  <div className="space-y-6">
                    {education.map((edu) => (
                      <div key={edu.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold mb-2">{edu.degree}</h3>
                        <div className="text-gray-500 mb-2">
                          <span>{edu.school}</span> • <span>{edu.dates}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Skills */}
              {skills && (
                <section>
                  <SectionHeader title="SKILLS" accentColor={accentColor} />
                  <div className="grid grid-cols-2 gap-4">
                    {(skills.secondary ?? []).map((skill, index) => (
                      <div key={index} className="bg-blue-50 p-2 rounded">
                        {skill}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Projects */}
              {projects && projects.length > 0 && (
                <section>
                  <SectionHeader title="PROJECTS" accentColor={accentColor} />
                  <div className="space-y-6">
                    {projects.map((project) => (
                      <div key={project.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                        <div className="text-gray-500 mb-2">
                          <span>{project.dates}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{project.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Certifications */}
              {certifications && certifications.length > 0 && (
                <section>
                  <SectionHeader title="CERTIFICATIONS" accentColor={accentColor} />
                  <div className="space-y-6">
                    {certifications.map((cert) => (
                      <div key={cert.id} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold mb-2">{cert.name}</h3>
                        <div className="text-gray-500 mb-2">
                          <span>{cert.issuer}</span> • <span>{cert.dates}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{cert.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </TemplateWrapper>
  );
};