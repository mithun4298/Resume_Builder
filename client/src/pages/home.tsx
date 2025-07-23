import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import { formatDate } from "@/lib/utils";
import Footer from "@/components/footer";  // Add this import
import { Plus, FileText, Calendar, Download, Edit, Trash2, Eye, Clock, Star, TrendingUp, Users, Award } from "lucide-react";
import type { Resume as SharedResume } from "@shared/schema";

interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  status?: 'draft' | 'completed';
  downloadCount?: number;
}

export default function Home() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const queryClient = useQueryClient();
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, authLoading, toast]);

  const { data: resumes, isLoading } = useQuery<Resume[]>({
    queryKey: ["/api/resumes"],
    retry: false,
  });

  const deleteResumeMutation = useMutation({
    mutationFn: async (resumeId: string) => {
      return await apiRequest("DELETE", `/api/resumes/${resumeId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      toast({
        title: "Resume Deleted",
        description: "Your resume has been successfully deleted.",
        variant: "default",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const createResumeMutation = useMutation({
    mutationFn: async (title: string) => {
      const defaultResumeData = {
        personalInfo: {
          firstName: "",
          lastName: "",
          title: "",
          email: "",
          phone: "",
          location: "",
          website: "",
        },
        summary: "",
        experience: [],
        education: [],
        skills: { technical: [], soft: [] },
        projects: [],
        certifications: [],
        sectionOrder: [
          "personal",
          "summary",
          "experience",
          "skills",
          "education",
          "projects"
        ],
      };

      return await apiRequest("POST", "/api/resumes", {
        title,
        data: defaultResumeData,
        templateId: "modern",
        isPublic: false,
      });
    },
    onSuccess: async (response) => {
      const resume = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      setDialogOpen(false);
      setNewResumeTitle("");
      navigate(`/resume/${resume.id}`);
      toast({
        title: "Success",
        description: "New resume created successfully!",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleDeleteResume = (resumeId: string) => {
    deleteResumeMutation.mutate(resumeId);
  };

  const handleDownloadResume = async (resumeId: string) => {
    try {
      const response = await apiRequest("GET", `/api/resumes/${resumeId}/download`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `resume-${resumeId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Download Started",
        description: "Your resume is being downloaded as PDF.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download resume. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePreviewResume = (resumeId: string) => {
    window.open(`/preview/${resumeId}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-sm border mb-8">
            <div className="px-6 py-8">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Welcome back, {user && typeof user === 'object' && 'firstName' in user ? user.firstName : 'User'}! 👋
                  </h1>
                  <p className="mt-2 text-gray-600">
                    Manage your resumes and create new ones with AI assistance.
                  </p>
                </div>
                <div className="mt-4 md:mt-0">
                  <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Create New Resume
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create New Resume</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="title">Resume Title</Label>
                          <Input
                            id="title"
                            value={newResumeTitle}
                            onChange={(e) => setNewResumeTitle(e.target.value)}
                            placeholder="e.g., Software Engineer Resume"
                          />
                        </div>
                        <Button 
                          onClick={() => createResumeMutation.mutate(newResumeTitle)}
                          disabled={!newResumeTitle.trim() || createResumeMutation.isPending}
                          className="w-full"
                        >
                          {createResumeMutation.isPending ? "Creating..." : "Create Resume"}
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatsCard
              icon={<FileText className="w-6 h-6 text-blue-600" />}
              title="Total Resumes"
              value={resumes?.length.toString() || "0"}
              subtitle="Created"
            />
            <StatsCard
              icon={<Download className="w-6 h-6 text-green-600" />}
              title="Downloads"
              value={resumes?.reduce((sum, resume) => sum + (resume.downloadCount || 0), 0).toString() || "0"}
              subtitle="This month"
            />
            <StatsCard
              icon={<TrendingUp className="w-6 h-6 text-purple-600" />}
              title="Success Rate"
              value="94%"
              subtitle="Interview rate"
            />
            <StatsCard
              icon={<Award className="w-6 h-6 text-orange-600" />}
              title="Templates Used"
              value={resumes ? new Set(resumes.map(r => r.templateId)).size.toString() : "0"}
              subtitle="Different styles"
            />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <QuickActionCard
                icon={<Plus className="w-5 h-5" />}
                title="Create Resume"
                description="Start building a new resume from scratch"
                onClick={() => setDialogOpen(true)}
              />
              <QuickActionCard
                icon={<FileText className="w-5 h-5" />}
                title="Browse Templates"
                description="Explore our collection of professional templates"
                onClick={() => navigate('/templates')}
              />
              <QuickActionCard
                icon={<Users className="w-5 h-5" />}
                title="AI Assistant"
                description="Get help writing compelling content"
                onClick={() => toast({ title: "Coming Soon", description: "AI Assistant feature is in development!" })}
              />
            </div>
          </div>

          {/* Resumes Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-3 bg-slate-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : resumes && resumes.length > 0 ? (
            <div className="divide-y">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => navigate(`/resume/${resume.id}`)}
                  onDelete={() => handleDeleteResume(resume.id)}
                  onDownload={() => handleDownloadResume(resume.id)}
                  onPreview={() => handlePreviewResume(resume.id)}
                />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No resumes yet</h3>
              <p className="text-gray-600 mb-6">Create your first resume to get started</p>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Resume
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Create New Resume</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Resume Title</Label>
                      <Input
                        id="title"
                        value={newResumeTitle}
                        onChange={(e) => setNewResumeTitle(e.target.value)}
                        placeholder="e.g., Software Engineer Resume"
                      />
                    </div>
                    <Button 
                      onClick={() => createResumeMutation.mutate(newResumeTitle)}
                      disabled={!newResumeTitle.trim() || createResumeMutation.isPending}
                      className="w-full"
                    >
                      {createResumeMutation.isPending ? "Creating..." : "Create Resume"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

// Supporting Components
interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle: string;
}

function StatsCard({ icon, title, value, subtitle }: StatsCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          {icon}
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-xs text-gray-500">{subtitle}</p>
        </div>
      </div>
    </div>
  );
}

interface QuickActionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}

function QuickActionCard({ icon, title, description, onClick }: QuickActionCardProps) {
  return (
    <button
      onClick={onClick}
      className="text-left p-4 border rounded-lg hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center mb-2">
        <div className="text-blue-600 mr-2">{icon}</div>
        <h3 className="font-medium text-gray-900">{title}</h3>
      </div>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );
}

interface ResumeCardProps {
  resume: Resume;
  onEdit: () => void;
  onDelete: () => void;
  onDownload: () => void;
  onPreview: () => void;
}

function ResumeCard({ resume, onEdit, onDelete, onDownload, onPreview }: ResumeCardProps) {
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