import React from 'react';
import { TemplateWrapper, SectionHeader, TemplateProps } from './shared';

export const ClassicTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#374151'
}) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <TemplateWrapper accentColor={accentColor}>
      <div className="bg-white max-w-4xl mx-auto p-8 font-serif">
        {/* Header Section */}
        <header className="text-center border-b-2 border-gray-300 pb-6 mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <h2 className="text-xl text-gray-600 mb-4">{personalInfo.title}</h2>
          )}
          
          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-600">
            {personalInfo.email && (
              <span>{personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span>{personalInfo.phone}</span>
            )}
            {personalInfo.location && (
              <span>{personalInfo.location}</span>
            )}
            {personalInfo.website && (
              <span>{personalInfo.website}</span>
            )}
          </div>
        </header>

        <div className="space-y-8">
          {/* Professional Summary */}
          {summary && (
            <section>
              <SectionHeader title="PROFESSIONAL SUMMARY" variant="classic" accentColor={accentColor} />
              <p className="text-gray-700 leading-relaxed text-justify">{summary}</p>
            </section>
          )}

          {/* Professional Experience */}
          {experience && experience.length > 0 && (
            <section>
              <SectionHeader title="PROFESSIONAL EXPERIENCE" variant="classic" accentColor={accentColor} />
              
              <div className="space-y-6">
                {experience.map((job) => (
                  <div key={job.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                        <p className="text-lg text-gray-700 font-medium">{job.company}</p>
                      </div>
                      <p className="text-gray-600 font-medium">{job.dates}</p>
                    </div>
                    {job.description && (
                      <p className="text-gray-700 leading-relaxed mt-2">{job.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education && education.length > 0 && (
            <section>
              <SectionHeader title="EDUCATION" variant="classic" accentColor={accentColor} />
              <div className="space-y-4">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-700">{edu.school}</p>
                    </div>
                    <p className="text-gray-600">{edu.dates}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills && (
            <section>
              <SectionHeader title="CORE COMPETENCIES" variant="classic" accentColor={accentColor} />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {skills.technical && skills.technical.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.technical.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {skills.soft && skills.soft.length > 0 && (
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3">Professional Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.soft.map((skill, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>
    </TemplateWrapper>
  );
};

// Default export
export default ClassicTemplate;