import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Clock, Download, Eye, Edit, Trash2, ExternalLink } from "lucide-react";
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
  viewMode?: 'grid' | 'list';
  children?: React.ReactNode;
}

export default function ResumeCard({ 
  resume, 
  onEdit, 
  onDelete, 
  onDownload, 
  onPreview,
  viewMode = 'list',
  children 
}: ResumeCardProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isPreviewing, setIsPreviewing] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await onDownload();
    } finally {
      setIsDownloading(false);
    }
  };

  const handlePreview = async () => {
    setIsPreviewing(true);
    try {
      await onPreview();
    } finally {
      setIsPreviewing(false);
    }
  };

  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-all duration-200">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center space-x-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                resume.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {resume.status || 'draft'}
              </span>
              {children}
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{resume.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{resume.templateId} Template</p>
            <div className="flex items-center text-xs text-gray-500 space-x-3">
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

          <div className="grid grid-cols-2 gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handlePreview}
              disabled={isPreviewing}
              className="w-full"
            >
              {isPreviewing ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                  Loading...
                </>
              ) : (
                <>
                  <Eye className="w-3 h-3 mr-1" />
                  Preview
                </>
              )}
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={onEdit}
              className="w-full"
            >
              <Edit className="w-3 h-3 mr-1" />
              Edit
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full"
            >
              {isDownloading ? (
                <>
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="w-3 h-3 mr-1" />
                  Download
                </>
              )}
            </Button>
            
            <Button 
              size="sm" 
              variant="destructive" 
              onClick={onDelete}
              className="w-full"
            >
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // List view (existing layout with enhanced buttons)
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-medium text-gray-900">{resume.title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                resume.status === 'completed' 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {resume.status || 'draft'}
              </span>
              {children}
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{resume.templateId} Template</span>
              <span className="flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {formatDate(resume.updatedAt)}
              </span>
              <span className="flex items-center">
                <Download className="w-3 h-3 mr-1" />
                {resume.downloadCount || 0} downloads
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handlePreview}
            disabled={isPreviewing}
            className="hover:bg-blue-50 hover:border-blue-300"
          >
            {isPreviewing ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600 mr-1"></div>
                Loading...
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-1" />
                Preview
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={onEdit}
            className="hover:bg-gray-50"
          >
            <Edit className="w-4 h-4 mr-1" />
            Edit
          </Button>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={handleDownload}
            disabled={isDownloading}
            className="hover:bg-green-50 hover:border-green-300"
          >
            {isDownloading ? (
              <>
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600 mr-1"></div>
                Downloading...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-1" />
                Download
              </>
            )}
          </Button>
          
          <Button 
            size="sm" 
            variant="destructive" 
            onClick={onDelete}
            className="hover:bg-red-600"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}