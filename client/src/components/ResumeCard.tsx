import React from "react";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Download, Eye, Edit, Trash2 } from "lucide-react";
import { formatDate } from "@/lib/defaultResumeData";

interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  status?: 'draft' | 'completed';
  downloadCount?: number;
}

interface ResumeCardProps {
  resume: Resume;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onPreview: () => void;
}

export default function ResumeCard({ resume, onEdit, onDelete, onDownload, onPreview }: ResumeCardProps) {
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{resume.title}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{resume.templateId} Template</span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(resume.updatedAt)}
              </span>
              <span className="flex items-center">
                <Download className="w-3 h-3 mr-1" />
                {resume.downloadCount || 0}
              </span>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={onDownload}>
              <Download className="w-4 h-4 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}