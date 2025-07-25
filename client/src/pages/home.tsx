import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { createDefaultResumeData, defaultResumeSettings, formatDate } from "@/lib/defaultResumeData";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import Footer from "@/components/footer";
import StatsCard from "@/components/StatsCard";
import QuickActionsWidget from "@/components/QuickActionsWidget";
import ResumeCard from "@/components/ResumeCard";
import ResumeCardSkeleton from "@/components/ResumeCardSkeleton";
import EmptyState from "@/components/EmptyState";
import { Plus, FileText, Calendar, Download, Edit, Trash2, Eye, Clock, Star, TrendingUp, Users, Award } from "lucide-react";
import type { Resume as SharedResume } from "@shared/schema";

console.log('Home component loaded');

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
      return await apiRequest("POST", "/api/resumes", {
        title,
        data: createDefaultResumeData(),
        ...defaultResumeSettings,
      });
    },
    onSuccess: async (response) => {
      const resume = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      setDialogOpen(false);
      setNewResumeTitle("");
      navigate(`/resume-builder?id=${resume.id}`);
      toast({
        title: "Success",
        description: "New resume created successfully!",
        duration: 3000
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


          
          {/* Quick Actions - Now Floating */}
          <QuickActionsWidget 
            onCreateResume={() => setDialogOpen(true)}
            onBrowseTemplates={() => navigate('/templates')}
            onAIAssistant={() => toast({ title: "Coming Soon", description: "AI Assistant feature is in development!" })}
          />

          {/* Resumes Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <ResumeCardSkeleton key={i} />
              ))}
            </div>
          ) : resumes && resumes.length > 0 ? (
            <div className="divide-y">
              {resumes.map((resume) => (
                <ResumeCard
                  key={resume.id}
                  resume={resume}
                  onEdit={() => navigate(`/resume-builder?id=${resume.id}`)}
                  onDelete={() => handleDeleteResume(resume.id)}
                  onDownload={() => handleDownloadResume(resume.id)}
                  onPreview={() => handlePreviewResume(resume.id)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={<FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />}
              title="No resumes yet"
              description="Create your first resume to get started"
              action={
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
              }
            />
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}