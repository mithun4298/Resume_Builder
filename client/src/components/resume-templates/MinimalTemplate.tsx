import React from 'react';
import { TemplateWrapper, SectionHeader, TemplateProps } from './shared';

export const MinimalTemplate: React.FC<TemplateProps> = ({
  data,
  accentColor = '#6b7280'
}) => {
  const { personalInfo, summary, experience, education, skills } = data;

  return (
    <TemplateWrapper accentColor={accentColor}>
      <div className="bg-white max-w-4xl mx-auto p-8 font-light">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl font-light text-gray-900 mb-1">
            {personalInfo.firstName} {personalInfo.lastName}
          </h1>
          {personalInfo.title && (
            <h2 className="text-lg text-gray-600 mb-4">{personalInfo.title}</h2>
          )}
          
          <div className="flex flex-wrap gap-4 text-sm text-gray-500">
            {personalInfo.email && <span>{personalInfo.email}</span>}
            {personalInfo.phone && <span>{personalInfo.phone}</span>}
            {personalInfo.location && <span>{personalInfo.location}</span>}
          </div>
        </header>

        <div className="space-y-6">
          {summary && (
            <section>
              <SectionHeader title="Summary" variant="minimal" accentColor={accentColor} />
              <p className="text-gray-700 leading-relaxed">{summary}</p>
            </section>
          )}

          {experience && experience.length > 0 && (
            <section>
              <SectionHeader title="Experience" variant="minimal" accentColor={accentColor} />
              <div className="space-y-4">
                {experience.map((job) => (
                  <div key={job.id}>
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-medium text-gray-900">{job.title}</h3>
                      <span className="text-sm text-gray-500">{job.dates}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{job.company}</p>
                    {job.description && (
                      <p className="text-gray-700 text-sm leading-relaxed">{job.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {education && education.length > 0 && (
            <section>
              <SectionHeader title="Education" variant="minimal" accentColor={accentColor} />
              <div className="space-y-2">
                {education.map((edu) => (
                  <div key={edu.id} className="flex justify-between items-baseline">
                    <div>
                      <h3 className="font-medium text-gray-900">{edu.degree}</h3>
                      <p className="text-gray-600">{edu.school}</p>
                    </div>
                    <span className="text-sm text-gray-500">{edu.dates}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills && (skills.technical || skills.soft) && (
            <section>
              <SectionHeader title="Skills" variant="minimal" accentColor={accentColor} />
              <div className="space-y-2">
                {skills.technical && (
                  <div>
                    <span className="text-gray-900 font-medium">Technical: </span>
                    <span className="text-gray-700">{skills.technical.join(', ')}</span>
                  </div>
                )}
                {skills.soft && (
                  <div>
                    <span className="text-gray-900 font-medium">Professional: </span>
                    <span className="text-gray-700">{skills.soft.join(', ')}</span>
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

export default MinimalTemplate;