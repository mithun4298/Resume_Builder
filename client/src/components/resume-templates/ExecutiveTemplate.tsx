import React from 'react';
import { TemplateWrapper, SectionHeader, TemplateProps } from './shared';

export const ExecutiveTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#1F2937'
}) => {
  const { personalInfo, summary, experience, education, skills, achievements } = data;

  return (
    <TemplateWrapper accentColor={accentColor}>
      <div className="bg-white">
        {/* Header Section */}
        <header className="bg-gray-900 text-white p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-2">
              {personalInfo.firstName} {personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-gray-300 mb-4">{personalInfo.title}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="flex items-center">
                <span className="mr-2">📧</span>
                <span>{personalInfo.email}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📱</span>
                <span>{personalInfo.phone}</span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">📍</span>
                <span>{personalInfo.location}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto p-8 space-y-8">
          {/* Executive Summary */}
          {summary && (
            <section>
              <SectionHeader title="EXECUTIVE SUMMARY" accentColor={accentColor} />
              <div className="bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-700 leading-relaxed text-lg">{summary}</p>
              </div>
            </section>
          )}

          {/* Core Competencies */}
          {skills && (
            <section>
              <SectionHeader title="CORE COMPETENCIES" accentColor={accentColor} />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {skills.leadership && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Leadership</h4>
                    <ul className="space-y-1">
                      {skills.leadership.map((skill, index) => (
                        <li key={index} className="text-gray-700 flex items-center">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {skills.strategic && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Strategic</h4>
                    <ul className="space-y-1">
                      {skills.strategic.map((skill, index) => (
                        <li key={index} className="text-gray-700 flex items-center">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {skills.technical && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Technical</h4>
                    <ul className="space-y-1">
                      {skills.technical.map((skill, index) => (
                        <li key={index} className="text-gray-700 flex items-center">
                          <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                          {skill}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Professional Experience */}
          {experience && experience.length > 0 && (
            <section>
              <SectionHeader title="PROFESSIONAL EXPERIENCE" accentColor={accentColor} />
              
              <div className="space-y-8">
                {experience.map((job) => (
                  <div key={job.id} className="border-l-4 border-gray-200 pl-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-gray-600">{job.company}</p>
                      </div>
                      <p className="text-gray-600">{job.dates}</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <SectionHeader title="EDUCATION" accentColor={accentColor} />
              <div className="space-y-8">
                {education.map((edu) => (
                  <div key={edu.id} className="border-l-4 border-gray-200 pl-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-gray-600">{edu.school}</p>
                      </div>
                      <p className="text-gray-600">{edu.dates}</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{edu.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Achievements */}
          {achievements && achievements.length > 0 && (
            <section>
              <SectionHeader title="ACHIEVEMENTS" accentColor={accentColor} />
              <ul className="space-y-4">
                {achievements.map((achievement, index) => (
                  <li key={index} className="text-gray-700 flex items-center">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
                    {achievement}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </TemplateWrapper>
  );
};