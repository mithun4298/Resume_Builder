import React, { useState } from 'react';
import { TouchList } from '../mobile/TouchList';
import { TouchFormField } from '../mobile/TouchFormField';
import { DatePicker } from '../mobile/DatePicker';
import { ActionSheet } from '../mobile/ActionSheet';
import { Education } from '../../hooks/useResumeData';

interface EducationSectionProps {
  education: Education[];
  onAdd: (education: Omit<Education, 'id'>) => void;
  onUpdate: (id: string, updates: Partial<Education>) => void;
  onDelete: (id: string) => void;
}

export const EducationSection: React.FC<EducationSectionProps> = ({
  education,
  onAdd,
  onUpdate,
  onDelete
}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [actionSheetOpen, setActionSheetOpen] = useState(false);
  const [selectedEducation, setSelectedEducation] = useState<Education | null>(null);

  const [formData, setFormData] = useState<Omit<Education, 'id'> & { location: string }>({
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    gpa: '',
    honors: [],
    location: ''
  });

  const resetForm = () => {
    setFormData({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      honors: [],
      location: ''
    });
    setEditingEducation(null);
  };

  const handleAdd = () => {
    resetForm();
    setIsFormOpen(true);
  const handleEdit = (education: Education) => {
    setFormData({
      institution: education.institution,
      degree: education.degree,
      field: education.field,
      startDate: education.startDate,
      endDate: education.endDate,
      gpa: education.gpa || '',
      honors: education.honors || [],
      location: education.location || ''
    });
    setEditingEducation(education);
    setIsFormOpen(true);
  };
    setIsFormOpen(true);
  };

  const handleSave = () => {
    // Build update object omitting undefined fields for Partial<Education>
    const dataToSave: Partial<Education> = {
      ...formData
    };
    if (formData.gpa) {
      dataToSave.gpa = formData.gpa;
    }
    if (Array.isArray(formData.honors) && formData.honors.length > 0) {
      dataToSave.honors = formData.honors;
    }

    if (editingEducation) {
      onUpdate(editingEducation.id, dataToSave);
    } else {
      onAdd(formData);
    }
    setIsFormOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedEducation) {
      onDelete(selectedEducation.id);
    }
    setActionSheetOpen(false);
    setSelectedEducation(null);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };

  return (
    <div className="education-section p-4 space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Education
        </h2>
        <p className="text-gray-600">
          Add your educational background and qualifications
        </p>
      </div>

      {/* Education Items */}
      <TouchList
        items={education.map((edu, idx) => ({
          id: edu.id,
          title: edu.degree || `Education ${idx + 1}`,
          subtitle: edu.institution,
          description: (edu.startDate || edu.endDate)
            ? `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}${edu.gpa ? ` | GPA: ${edu.gpa}` : ''}`
            : edu.gpa ? `GPA: ${edu.gpa}` : undefined,
        }))}
        renderItem={(item) => {
          const edu = education.find(e => e.id === item.id);
          if (!edu) return null;
          return (
            <div 
              key={edu.id}
              className="bg-white border-2 border-gray-200 rounded-xl overflow-hidden"
            >
              {/* Education Header */}
              <div 
                className="p-4 cursor-pointer"
                onClick={() => {
                  setSelectedEducation(edu);
                  setActionSheetOpen(true);
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-sm text-gray-600">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="text-xs text-gray-500">{item.description}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {education.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(edu.id);
                        }}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    )}
                    
                    <svg 
                      className="w-5 h-5 text-gray-400"
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          );
        }}
      />

      {/* Add New Education Button */}
      <button
        onClick={handleAdd}
        className="w-full py-4 px-6 border-2 border-dashed border-blue-300 text-blue-600 font-semibold rounded-xl hover:border-blue-400 hover:bg-blue-50 transition-all duration-200"
      >
        + Add Education
      </button>

      {/* Education Tips */}
      {education.length === 0 && (
        <div className="bg-blue-50 p-4 rounded-xl">
          <h4 className="font-semibold text-blue-900 mb-2">💡 Education Tips</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Include your highest degree first</li>
            <li>• Add GPA if it's 3.5 or higher</li>
            <li>• Include relevant coursework for entry-level positions</li>
            <li>• Don't forget certifications and online courses</li>
          </ul>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <div className="flex space-x-4">
          <button
            onClick={() => {}}
            className="flex-1 py-4 px-6 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-all duration-200"
          >
            ← Previous
          </button>
          <button
            onClick={() => {}}
            className="flex-1 py-4 px-6 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all duration-200"
          >
            Continue →
          </button>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingEducation ? 'Edit Education' : 'Add Education'}
            </h3>
            <TouchFormField
              label="Institution"
              value={formData.institution}
              onChange={(value) => setFormData({ ...formData, institution: value })}
              placeholder="University of Technology"
              required
            />
            <TouchFormField
              label="Degree"
              value={formData.degree}
              onChange={(value) => setFormData({ ...formData, degree: value })}
              placeholder="Bachelor of Science in Computer Science"
              required
            />
            <TouchFormField
              label="Field of Study"
              value={formData.field}
              onChange={(value) => setFormData({ ...formData, field: value })}
              placeholder="Computer Science"
            />
            <TouchFormField
              label="Location"
              value={formData.location}
              onChange={(value) => setFormData({ ...formData, location: value })}
              placeholder="Boston, MA"
            />
            <div className="grid grid-cols-2 gap-4">
              <DatePicker
                label="Start Date"
                value={formData.startDate}
                onChange={(value) => setFormData({ ...formData, startDate: value })}
                placeholder="MM/YYYY"
              />
              <DatePicker
                label="End Date"
                value={formData.endDate}
                onChange={(value) => setFormData({ ...formData, endDate: value })}
                placeholder="MM/YYYY"
              />
            </div>
            <TouchFormField
              label="GPA"
              value={formData.gpa}
              onChange={(value) => setFormData({ ...formData, gpa: value })}
              placeholder="3.8"
              type="text"
            />
            <TouchFormField
              label="Honors & Awards"
              value={(formData.honors ?? []).join(', ')}
              onChange={(value) => setFormData({ ...formData, honors: value.split(',').map(honor => honor.trim()) })}
              placeholder="Magna Cum Laude, Dean's List"
            />
            <div className="flex justify-end mt-4 space-x-4">
              <button
                onClick={() => setIsFormOpen(false)}
                className="py-2 px-4 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-200"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Sheet */}
      {actionSheetOpen && selectedEducation && (
        <ActionSheet
          isOpen={actionSheetOpen}
          onClose={() => setActionSheetOpen(false)}
          actions={[
            {
              label: 'Edit',
              onPress: () => {
                handleEdit(selectedEducation);
                setActionSheetOpen(false);
              }
            },
            {
              label: 'Delete',
              onPress: handleDelete,
              destructive: true
            }
          ]}
        />
      )}
    </div>
  );
};