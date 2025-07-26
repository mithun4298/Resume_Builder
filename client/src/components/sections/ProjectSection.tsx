import React, { useState, useEffect } from 'react';
import { useResumeData } from '@/hooks/useResumeData';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Plus, ExternalLink } from 'lucide-react';

interface ProjectSectionProps {
  onNext: () => void;
  onPrevious: () => void;
}

export const ProjectSection: React.FC<ProjectSectionProps> = ({ onNext, onPrevious }) => {
  const { resumeData, addProject, updateProject, deleteProject, enableAutoSave } = useResumeData();
  const [projects, setProjects] = useState(resumeData.projects || []);

  useEffect(() => {
    setProjects(resumeData.projects || []);
  }, [resumeData.projects]);

  useEffect(() => {
    enableAutoSave(true);
  }, [projects, enableAutoSave]);

  return (
    <div className="project-section space-y-6 pb-24">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Projects</h2>
        <p className="text-gray-600">Showcase your notable projects and achievements</p>
      </div>
      <div className="space-y-4">
        {projects.map((project, index) => (
          <Card key={project.id} className="relative">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Project {index + 1}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteProject(project.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor={`proj-title-${project.id}`}>Project Title *</Label>
                <Input
                  id={`proj-title-${project.id}`}
                  placeholder="e.g., Portfolio Website"
                  value={project.title}
                  onChange={e => updateProject(project.id, { title: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`proj-desc-${project.id}`}>Description *</Label>
                <Input
                  id={`proj-desc-${project.id}`}
                  placeholder="Describe your project..."
                  value={project.description}
                  onChange={e => updateProject(project.id, { description: e.target.value })}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`proj-url-${project.id}`}>Project URL (Optional)</Label>
                <div className="relative">
                  <Input
                    id={`proj-url-${project.id}`}
                    type="url"
                    placeholder="https://..."
                    value={project.url || ''}
                    onChange={e => updateProject(project.id, { url: e.target.value })}
                    className="w-full pr-10"
                  />
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500 hover:text-blue-700"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}
                </div>
              </div>
              {(!project.title?.trim() || !project.description?.trim()) && (
                <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
                  Please fill in all required fields (marked with *)
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="text-center">
        <Button
          onClick={() => addProject({ title: '', description: '', url: '' })}
          variant="outline"
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" /> Add Project
        </Button>
      </div>
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Project Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Highlight projects relevant to your target role</li>
            <li>• Include links to live demos or source code</li>
            <li>• Focus on impact, technologies used, and your role</li>
            <li>• Use clear, concise descriptions</li>
          </ul>
        </CardContent>
      </Card>
      <div className="sticky bottom-0 bg-white pt-4 pb-safe">
        <div className="flex space-x-4">
          <Button
            onClick={onPrevious}
            variant="outline"
            className="flex-1 py-4 px-6"
          >
            ← Previous
          </Button>
          <Button
            onClick={() => {
              // Validate projects before proceeding
              const validProjects = projects.filter(
                proj => proj.title?.trim() && proj.description?.trim()
              );
              if (validProjects.length !== projects.length) {
                validProjects.forEach(proj => {
                  updateProject(proj.id, proj);
                });
              }
              onNext();
            }}
            className="flex-1 py-4 px-6 bg-blue-600 hover:bg-blue-700"
          >
            Next →
          </Button>
        </div>
      </div>
    </div>
  );
}
