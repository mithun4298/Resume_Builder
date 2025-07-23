import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, Download, Edit, Eye } from "lucide-react";

interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  status?: 'draft' | 'completed';
  downloadCount?: number;
}

interface RecentActivityProps {
  resumes: Resume[];
}

export default function RecentActivity({ resumes }: RecentActivityProps) {
  // Get recent activities (last 5 updated resumes)
  const recentResumes = resumes
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getActivityIcon = (resume: Resume) => {
    const hoursSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(resume.updatedAt).getTime()) / (1000 * 60 * 60)
    );
    
    if (hoursSinceUpdate < 1) return <Edit className="w-4 h-4 text-blue-500" />;
    if (hoursSinceUpdate < 24) return <FileText className="w-4 h-4 text-green-500" />;
    return <Clock className="w-4 h-4 text-gray-400" />;
  };

  const getActivityText = (resume: Resume) => {
    const hoursSinceUpdate = Math.floor(
      (new Date().getTime() - new Date(resume.updatedAt).getTime()) / (1000 * 60 * 60)
    );
    
    if (hoursSinceUpdate < 1) return "Currently editing";
    if (hoursSinceUpdate < 24) return "Recently updated";
    return "Last modified";
  };

  if (recentResumes.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Activity
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recentResumes.map((resume) => (
            <div key={resume.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50">
              <div className="flex items-center gap-3">
                {getActivityIcon(resume)}
                <div>
                  <p className="font-medium text-gray-900">{resume.title}</p>
                  <p className="text-sm text-gray-500">
                    {getActivityText(resume)} • {formatDate(resume.updatedAt)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {resume.status && (
                  <Badge variant={resume.status === 'completed' ? 'default' : 'secondary'}>
                    {resume.status}
                  </Badge>
                )}
                {resume.downloadCount && resume.downloadCount > 0 && (
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Download className="w-3 h-3" />
                    {resume.downloadCount}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}