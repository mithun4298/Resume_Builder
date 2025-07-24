import React, { useState } from 'react';
import { TouchFormField } from '../mobile/TouchFormField';
import { ActionSheet } from '../mobile/ActionSheet';
import { useResumeData, Skill } from '../../hooks/useResumeData';
import { cn } from '@/lib/utils';

interface SkillsSectionProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const SkillsSection: React.FC<SkillsSectionProps> = ({
  onNext,
  onPrevious
}) => {
  const { resumeData, addSkill, updateSkill, deleteSkill } = useResumeData();
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillLevel, setNewSkillLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'>('Intermediate');
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

  const skillCategories = [
    'Programming Languages',
    'Frameworks & Libraries',
    'Tools & Technologies',
    'Soft Skills',
    'Languages',
    'Other'
  ];

  const handleAddSkill = () => {
    if (newSkillName.trim()) {
      addSkill({
        name: newSkillName.trim(),
        level: newSkillLevel,
        category: 'Other'
      });
      setNewSkillName('');
      setNewSkillLevel('Intermediate');
    }
  };

  const handleSkillClick = (skill: Skill) => {
    setSelectedSkill(skill);
    setActionSheetOpen(true);
  };

  const handleEditSkill = (skill: Skill) => {
    setEditingSkill(skill);
    setNewSkillName(skill.name);
    setNewSkillLevel(skill.level);
    setActionSheetOpen(false);
  };

  const handleUpdateSkill = () => {
    if (editingSkill && newSkillName.trim()) {
      updateSkill(editingSkill.id, {
        name: newSkillName.trim(),
        level: newSkillLevel
      });
      setEditingSkill(null);
      setNewSkillName('');
      setNewSkillLevel('Intermediate');
    }
  };

  const handleDeleteSkill = (skill: Skill) => {
    deleteSkill(skill.id);
    setActionSheetOpen(false);
    setSelectedSkill(null);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Beginner': return 'bg-red-100 text-red-800';
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'Advanced': return 'bg-blue-100 text-blue-800';
      case 'Expert': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getLevelProgress = (level: string) => {
    switch (level) {
      case 'Beginner': return 25;
      case 'Intermediate': return 50;
      case 'Advanced': return 75;
      case 'Expert': return 100;
      default: return 0;
    }
  };

  const groupedSkills = resumeData.skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div className="skills-section space-y-6 pb-24">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Skills</h2>
        <p className="text-gray-600">Add your technical and soft skills</p>
      </div>

      {/* Add New Skill Form */}
      <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          {editingSkill ? 'Edit Skill' : 'Add New Skill'}
        </h3>

        <div className="space-y-4">
          <TouchFormField
            label="Skill Name"
            value={newSkillName}
            onChange={setNewSkillName}
            placeholder="e.g., JavaScript, Project Management, Spanish"
            required
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Proficiency Level
            </label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {skillLevels.map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setNewSkillLevel(level)}
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all duration-200",
                    newSkillLevel === level
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                  )}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            {editingSkill && (
              <button
                onClick={() => {
                  setEditingSkill(null);
                  setNewSkillName('');
                  setNewSkillLevel('Intermediate');
                }}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
            )}
            <button
              onClick={editingSkill ? handleUpdateSkill : handleAddSkill}
              disabled={!newSkillName.trim()}
              className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
            >
              {editingSkill ? 'Update' : 'Add'} Skill
            </button>
          </div>
        </div>
      </div>

      {/* Skills Display */}
      {resumeData.skills.length > 0 ? (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, categorySkills]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">{category}</h3>
              <div className="grid gap-3">
                {categorySkills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => handleSkillClick(skill)}
                    className="bg-white border-2 border-gray-200 rounded-xl p-4 cursor-pointer hover:border-blue-300 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{skill.name}</span>
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        getLevelColor(skill.level)
                      )}>
                        {skill.level}
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${getLevelProgress(skill.level)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No skills added yet</h3>
          <p className="text-gray-600">Add your first skill using the form above</p>
        </div>
      )}

      {/* Skills Tips */}
      <div className="bg-blue-50 p-4 rounded-xl">
        <h4 className="font-semibold text-blue-900 mb-2">💡 Skills Tips</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Include both technical and soft skills</li>
          <li>• Be honest about your proficiency levels</li>
          <li>• Focus on skills relevant to your target job</li>
          <li>• Include programming languages, tools, and frameworks</li>
          <li>• Don't forget languages and certifications</li>
        </ul>
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
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Continue →
          </button>
        </div>
      </div>

      {/* Action Sheet */}
      {actionSheetOpen && selectedSkill && (
        <ActionSheet
          isOpen={actionSheetOpen}
          onClose={() => {
            setActionSheetOpen(false);
            setSelectedSkill(null);
          }}
          actions={[
            {
              label: 'Edit Skill',
              onPress: () => handleEditSkill(selectedSkill),
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              )
            },
            {
              label: 'Delete Skill',
              onPress: () => handleDeleteSkill(selectedSkill),
              variant: 'destructive',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-.724A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm4-1a1 1 0 100 2h6a1 1 0 100-2H11zm-4 4a1 1 0 100 2h6a1 1 0 100-2H11z" clipRule="evenodd" />
                </svg>
              )
            }
          ]}
        />
      )}
    </div>
  );
};
