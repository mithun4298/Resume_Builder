
import React, { useState } from 'react';
import { TouchFormField } from '@/components/mobile/TouchFormField';
import { useResumeData } from '@/hooks/useResumeData';
import { Plus, X, Star } from 'lucide-react';

interface SkillsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
}

interface Skill {
  id: string;
  name: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  category: string;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({ onNext, onPrevious }) => {
  const { resumeData, addSkill, updateSkill, deleteSkill, bulkAddSkills } = useResumeData();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Technical');
  const [bulkSkills, setBulkSkills] = useState('');

  const skillCategories = [
    'Technical',
    'Programming Languages',
    'Frameworks & Libraries',
    'Tools & Software',
    'Soft Skills',
    'Languages',
    'Other'
  ];

  const skillLevels: Array<{ value: Skill['level']; label: string; stars: number }> = [
    { value: 'Beginner', label: 'Beginner', stars: 1 },
    { value: 'Intermediate', label: 'Intermediate', stars: 2 },
    { value: 'Advanced', label: 'Advanced', stars: 3 },
    { value: 'Expert', label: 'Expert', stars: 4 }
  ];

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      addSkill({
        name: newSkillName.trim(),
        level: 'Intermediate',
        category: newSkillCategory
      });
      setNewSkillName('');
    }
  };

  const handleBulkAdd = () => {
    if (bulkSkills.trim()) {
      const skills = bulkSkills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill.length > 0);
      
      bulkAddSkills(skills);
      setBulkSkills('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddSkill();
    }
  };

  const isCompleted = resumeData.skills.length >= 3;

  // Group skills by category
  const groupedSkills = resumeData.skills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  const renderStars = (level: Skill['level']) => {
    const levelData = skillLevels.find(l => l.value === level);
    const stars = levelData?.stars || 2;
    
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4].map(i => (
          <Star
            key={i}
            className={`w-4 h-4 ${i <= stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills & Expertise</h2>
        <p className="text-gray-600">Add your technical and soft skills</p>
      </div>

      {/* Add Single Skill */}
      <div className="bg-white p-4 rounded-xl border-2 border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Individual Skill</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TouchFormField
              label="Skill Name"
              value={newSkillName}
              onChange={setNewSkillName}
              placeholder="e.g., JavaScript, Project Management"
              onKeyPress={handleKeyPress}
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={newSkillCategory}
                onChange={(e) => setNewSkillCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {skillCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <button
            onClick={handleAddSkill}
            disabled={!newSkillName.trim()}
            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex items-center justify-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Skill</span>
          </button>
        </div>
      </div>

      {/* Bulk Add Skills */}
      <div className="bg-green-50 p-4 rounded-xl border-2 border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Add Multiple Skills</h3>
        
        <TouchFormField
          label="Skills (comma-separated)"
          value={bulkSkills}
          onChange={setBulkSkills}
          placeholder="React, Node.js, Python, Project Management, Communication"
          helpText="Separate each skill with a comma"
        />
        
        <button
          onClick={handleBulkAdd}
          disabled={!bulkSkills.trim()}
          className="w-full mt-3 py-3 px-4 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
        >
          Add All Skills
        </button>
      </div>

      {/* Skills List */}
      {resumeData.skills.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Your Skills ({resumeData.skills.length})</h3>
          
          {Object.entries(groupedSkills).map(([category, skills]) => (
            <div key={category} className="bg-gray-50 p-4 rounded-xl">
              <h4 className="font-medium text-gray-900 mb-3">{category}</h4>
              <div className="space-y-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between bg-white p-3 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <span className="font-medium text-gray-900">{skill.name}</span>
                        {renderStars(skill.level)}
                      </div>
                      <span className="text-sm text-gray-500">{skill.level}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <select
                        value={skill.level}
                        onChange={(e) => updateSkill(skill.id, { level: e.target.value as Skill['level'] })}
                        className="text-sm px-2 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        {skillLevels.map(level => (
                          <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => deleteSkill(skill.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors duration-200"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Completion Status */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${isCompleted ? 'bg-green-500' : 'bg-orange-500'}`} />
          <span className="text-sm font-medium">
            {isCompleted ? '✅ Section Complete' : `⏳ Add ${3 - resumeData.skills.length} more skills to complete`}
          </span>
        </div>
        {!isCompleted && (
          <p className="text-xs text-gray-600 mt-2">
            Minimum 3 skills required. You have {resumeData.skills.length} skills.
          </p>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <div className="flex space-x-4">
          <button
            onClick={onPrevious}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            ← Previous
          </button>
          <button
            onClick={onNext}
            disabled={!isCompleted}
            className={`flex-1 py-4 px-6 font-semibold rounded-xl transition-all duration-200 ${
              isCompleted
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isCompleted ? 'Continue →' : `Add ${3 - resumeData.skills.length} More Skills`}
          </button>
        </div>
      </div>
    </div>
  );
};