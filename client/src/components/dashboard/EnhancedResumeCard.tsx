import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Edit, Download, Eye, Trash2, Copy, 
  Calendar, FileText, CheckCircle, AlertCircle 
} from "lucide-react";

interface EnhancedResumeCardProps {
  resume: any;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onPreview: () => void;
  onDuplicate: () => void;
  completionPercentage: number;
}

export default function EnhancedResumeCard({
  resume,
  onEdit,
  onDelete,
  onDownload,
  onPreview,
  onDuplicate,
  completionPercentage
}: EnhancedResumeCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-blue-500">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg text-gray-900">{resume.title}</h3>
              <Badge variant={resume.status === 'completed' ? 'default' : 'secondary'}>
                {resume.status === 'completed' ? (
                  <CheckCircle className="w-3 h-3 mr-1" />
                ) : (
                  <AlertCircle className="w-3 h-3 mr-1" />
                )}
                {resume.status || 'draft'}
              </Badge>
            </div>
            
            <div className="flex items-center text-sm text-gray-600 mb-3">
              <Calendar className="w-4 h-4 mr-1" />
              Updated {formatDate(resume.updatedAt)}
            </div>
            
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-600">Completion</span>
                <span className="font-medium">{completionPercentage}%</span>
              </div>
              <Progress value={completionPercentage} className="h-2" />
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" onClick={onEdit} className="bg-blue-600 hover:bg-blue-700">
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </Button>
            <Button size="sm" variant="outline" onClick={onPreview}>
              <Eye className="w-4 h-4 mr-1" />
              Preview
            </Button>
          </div>
          
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" onClick={onDownload}>
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDuplicate}>
              <Copy className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onDelete}>
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}