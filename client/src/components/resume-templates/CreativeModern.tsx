import React from "react";
import type { ResumeData } from "@shared/schema";
import { dummyITResumeData } from "../dummyITResumeData";

export interface CreativeModernProps {
  data?: ResumeData;
  scale?: number;
}

const CreativeModern: React.FC<CreativeModernProps> = ({ data = dummyITResumeData, scale = 1 }) => {
  return (
    <div 
      className="bg-gradient-to-br from-purple-50 to-blue-50 text-gray-900 shadow-lg max-w-[210mm] mx-auto font-sans"
      style={{ 
        transform: `scale(${scale})`,
        transformOrigin: 'top center',
        width: '210mm',
        minHeight: '297mm',
        fontSize: '11px'
      }}
    >
      {/* Header Card */}
      <div className="p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400 to-blue-400 rounded-bl-full opacity-10"></div>
          <div className="relative z-10">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
              {data.personalInfo.firstName} {data.personalInfo.lastName}
            </h1>
            <h2 className="text-xl text-gray-700 mb-4">{data.personalInfo.title}</h2>
            <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                {data.personalInfo.email}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {data.personalInfo.phone}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                {data.personalInfo.location}
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                {data.personalInfo.website}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Cards */}
      <div className="px-8 pb-8 space-y-6">
        {/* Summary Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
            Summary
          </h3>
          <div className="text-gray-700 leading-relaxed" dangerouslySetInnerHTML={{ __html: data.summary }} />
        </div>

        {/* Experience Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
            Experience
          </h3>
          <div className="space-y-6">
            {data.experience.map((exp, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900 text-base">{exp.title}</h4>
                    <p className="text-purple-600 font-medium">{exp.company}</p>
                  </div>
                  <span className="bg-gradient-to-r from-purple-100 to-blue-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {exp.startDate} - {exp.current ? "Present" : exp.endDate}
                  </span>
                </div>
                <ul className="space-y-2">
                  {exp.bullets && exp.bullets.map((desc, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700">
                      <div className="w-1.5 h-1.5 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      {desc}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Education & Skills Grid */}
        <div className="grid grid-cols-2 gap-6">
          {/* Education Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
              Education
            </h3>
            <div className="space-y-4">
              {data.education.map((edu, index) => (
                <div key={index} className="border-l-3 border-gradient-to-b from-purple-500 to-blue-500 pl-4">
                  <h4 className="font-semibold text-gray-900">{edu.degree} in {edu.field}</h4>
                  <p className="text-gray-700">{edu.institution}</p>
                  <p className="text-gray-500 text-sm">{edu.startDate} - {edu.endDate}</p>
                  {edu.gpa && <p className="text-gray-500 text-sm">GPA: {edu.gpa}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* Skills Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-500 to-blue-500 rounded"></div>
              Skills
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {data.skills.technical && data.skills.technical.map((skill, index) => (
                <div 
                  key={"tech-"+index}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-gray-700 px-3 py-2 rounded-lg text-center text-sm hover:from-purple-100 hover:to-blue-100 transition-colors"
                >
                  {skill}
                </div>
              ))}
              {data.skills.soft && data.skills.soft.map((skill, index) => (
                <div 
                  key={"soft-"+index}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 text-gray-700 px-3 py-2 rounded-lg text-center text-sm hover:from-purple-100 hover:to-blue-100 transition-colors"
                >
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeModern;
