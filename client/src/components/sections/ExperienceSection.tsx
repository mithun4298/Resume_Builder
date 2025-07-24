import React, { useState } from 'react';
import { TouchList } from '../mobile/TouchList';
import { TouchFormField } from '../mobile/TouchFormField';
import { DatePicker } from '../mobile/DatePicker';
import { ActionSheet } from '../mobile/ActionSheet';
import { Experience } from '../../hooks/useResumeData';

interface ExperienceSectionProps {
  experiences: Experience[];
  onAdd: (experience: Omit<Experience, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Experience>) => void;
  onDelete: (id: string) => void;
  onReorder: (experiences: Experience[]) => void;
}

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({
  experiences,
  onAdd,
  onUpdate,
  onDelete,
  onReorder
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [selectedExperience, setSelectedExperience] = useState<Experience | null>(null);

  const [formData, setFormData] = useState<Omit<Experience, 'id'>>({
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    current: false,
    description: '',
    achievements: []
  });

  const resetForm = () => {
    setFormData({
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    });
    setEditingExperience(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsFormOpen(true);
  };

  const handleEdit = (experience: Experience) => {
    setFormData({
      company: experience.company,
      position: experience.position,
      startDate: experience.startDate,
      endDate: experience.endDate,
      current: experience.current,
      description: experience.description,
      achievements: experience.achievements
    });
    setEditingExperience(experience);
    setIsFormOpen(true);
  };

  const handleSave = () => {
    if (editingExperience) {
      onUpdate(editingExperience.id, formData);
    } else {
      onAdd(formData);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleItemClick = (experience: Experience) => {
    setSelectedExperience(experience);
    setActionSheetOpen(true);
  };

  const formatExperienceForList = (experience: Experience) => {
    const startDate = new Date(experience.startDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    const endDate = experience.current ? 'Present' : new Date(experience.endDate).toLocaleDateString('en-US', { 
      month: 'short', 
      year: 'numeric' 
    });
    
    return {
      title: experience.position,
      subtitle: experience.company,
      description: `${startDate} - ${endDate}`,
      content: experience.description
    };
  };

  const isFormValid = () => {
    return formData.company.trim() && 
           formData.position.trim() && 
           formData.startDate && 
           (formData.current || formData.endDate);
  };

  return (
    <div className="experience-section space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Work Experience</h2>
        <p className="text-gray-600">Add your professional experience to showcase your career journey</p>
      </div>

      {/* Experience List */}
      {experiences.length > 0 && (
        <TouchList
          items={experiences}
          renderItem={formatExperienceForList}
          onItemClick={handleItemClick}
          onReorder={onReorder}
          emptyMessage="No work experience added yet"
        />
      )}

      {/* Add New Experience Button */}
      {!isFormOpen && (
        <button
          onClick={handleAdd}
          className="w-full py-4 px-6 border-2 border-dashed border-blue-300 text-blue-600 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
          <span>Add Work Experience</span>
        </button>
      )}

      {/* Add/Edit Form */}
      {isFormOpen && (
        <div className="bg-white border-2 border-gray-200 rounded-xl p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              {editingExperience ? 'Edit Experience' : 'Add New Experience'}
            </h3>
            <button
              onClick={() => setIsFormOpen(false)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          <div className="space-y-4">
            <TouchFormField
              label="Company"
              value={formData.company}
              onChange={(value) => setFormData({ ...formData, company: value })}
              placeholder="Tech Company Inc."
              required
            />

            <TouchFormField
              label="Position"
              value={formData.position}
              onChange={(value) => setFormData({ ...formData, position: value })}
              placeholder="Software Engineer"
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(value) => setFormData({ ...formData, startDate: value })}
                required
              />

              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(value) => setFormData({ ...formData, endDate: value })}
                showCurrentOption
                currentLabel="Present"
                required={!formData.current}
              />
            </div>

            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="current"
                checked={formData.current}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  current: e.target.checked,
                  endDate: e.target.checked ? 'current' : ''
                })}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              />
              <label htmlFor="current" className="text-sm font-medium text-gray-900">
                I currently work here
              </label>
            </div>

            <TouchFormField
              label="Job Description"
              value={formData.description}
              onChange={(value) => setFormData({ ...formData, description: value })}
              multiline
              rows={4}
              placeholder="• Developed and maintained web applications using React and Node.js&#10;• Collaborated with cross-functional teams to deliver high-quality software&#10;• Improved application performance by 30% through code optimization"
              helpText="Use bullet points to describe your key responsibilities and achievements"
            />

            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => setIsFormOpen(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={!isFormValid()}
                className="flex-1 py-3 px-4 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {editingExperience ? 'Update' : 'Add'} Experience
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Sheet */}
      {actionSheetOpen && selectedExperience && (
        <ActionSheet
          isOpen={actionSheetOpen}
          onClose={() => {
            setActionSheetOpen(false);
            setSelectedExperience(null);
          }}
          actions={[
            {
              label: 'Edit Experience',
              onPress: () => {
                handleEdit(selectedExperience);
                setActionSheetOpen(false);
                setSelectedExperience(null);
              },
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              )
            },
            {
              label: 'Delete Experience',
              onPress: () => {
                onDelete(selectedExperience.id);
                setActionSheetOpen(false);
                setSelectedExperience(null);
              },
              variant: 'destructive',
              icon: (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )
            }
          ]}
        />
      )}
    </div>
  );
};