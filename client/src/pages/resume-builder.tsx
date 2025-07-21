import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { loadHtml2PdfScript } from "@/lib/loadHtml2Pdf";
import { isUnauthorizedError } from "@/lib/authUtils";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/header";
import ResumeEditor from "@/components/resume-editor";
import ResumePreview from "@/components/resume-preview";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import type { Resume, ResumeData } from "@shared/schema";

import Footer from "@/components/footer";

export default function ResumeBuilder() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [atsScore, setAtsScore] = useState<{ score: number; feedback: string[]; suggestions: string[] } | null>(null);
  // Add template selection state for preview/export
  const [selectedTemplate, setSelectedTemplate] = useState<string>("modern");

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

  const { data: resume, isLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes", id],
    enabled: !!id && isAuthenticated,
    retry: false,
  });

  // Initialize resume data when resume is loaded
  useEffect(() => {
    if (resume && resume.data) {
      setResumeData(resume.data as ResumeData);
    }
  }, [resume]);

  const updateResumeMutation = useMutation({
    mutationFn: async (data: ResumeData) => {
      if (!id) throw new Error("No resume ID");
      return await apiRequest("PUT", `/api/resumes/${id}`, { data });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/resumes", id] });
      toast({
        title: "Saved",
        description: "Resume saved successfully!",
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
        description: "Failed to save resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const exportPdfMutation = useMutation({
    mutationFn: async () => {
      if (!id) throw new Error("No resume ID");
      const response = await fetch(`/api/resumes/${id}/export`, {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) throw new Error("Export failed");
      const blob = await response.blob();
      // Check if the blob is a valid PDF by reading the first few bytes
      const arrayBuffer = await blob.slice(0, 4).arrayBuffer();
      const header = new TextDecoder().decode(arrayBuffer);
      if (header !== '%PDF') {
        // Try to get error text for debugging
        const errorText = await blob.text();
        throw new Error("Invalid PDF file. Server response: " + errorText);
      }
      return blob;
    },
    onSuccess: (blob) => {
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${resume?.title || "resume"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Success",
        description: "Resume exported successfully!",
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
        description: error.message || "Failed to export resume. Please try again.",
        variant: "destructive",
      });
      // Optionally log the error for debugging
      // eslint-disable-next-line no-console
      if (error.message) console.error(error.message);
    },
  });

  const calculateATSMutation = useMutation({
    mutationFn: async (data: ResumeData) => {
      const response = await apiRequest("POST", "/api/ai/calculate-ats-score", { resumeData: data });
      return response.json();
    },
    onSuccess: (data) => {
      setAtsScore(data);
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
        description: "Failed to calculate ATS score. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Auto-save functionality
  useEffect(() => {
    if (!resumeData || !id) return;

    const timeoutId = setTimeout(() => {
      updateResumeMutation.mutate(resumeData);
    }, 60000); // Auto-save after 60 seconds of inactivity

    return () => clearTimeout(timeoutId);
  }, [resumeData, id]);

  // Calculate ATS score when resume data changes - only if sufficient content exists
  // ATS score calculation temporarily disabled
  // useEffect(() => {
  //   if (!resumeData) return;
  //   
  //   // Only calculate ATS score if there's meaningful content
  //   const hasContent = resumeData.summary || 
  //                     resumeData.experience.length > 0 || 
  //                     resumeData.education.length > 0 ||
  //                     resumeData.skills.technical.length > 0;
  //   
  //   if (!hasContent) return;
  //
  //   const timeoutId = setTimeout(() => {
  //     calculateATSMutation.mutate(resumeData);
  //   }, 3000); // Calculate ATS score after 3 seconds of inactivity
  //
  //   return () => clearTimeout(timeoutId);
  // }, [resumeData]);

  const handleResumeDataChange = (newData: ResumeData) => {
    setResumeData(newData);
  };

  if (authLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  if (!id) {
    navigate("/");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-slate-600">Loading resume...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-slate-600 mb-4">Resume not found</p>
            <Button onClick={() => navigate("/")}>Go Back Home</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header>
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            className="md:hidden"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            onClick={() => exportPdfMutation.mutate()}
            disabled={exportPdfMutation.isPending}
            className="bg-primary hover:bg-primary/90"
          >
            {exportPdfMutation.isPending ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </Header>

      <div className="flex h-[calc(100vh-4rem)]">
        {/* Editor Panel */}
        <div className={`${showPreview ? "hidden" : "block"} md:block w-full md:w-1/2 lg:w-2/5 bg-white border-r border-slate-200 overflow-y-auto`}>
          {resumeData && (
            <ResumeEditor
              data={resumeData}
              onChange={handleResumeDataChange}
              atsScore={atsScore}
              isCalculating={calculateATSMutation.isPending}
              onExportPdf={() => exportPdfMutation.mutate()}
              exportPdfPending={exportPdfMutation.isPending}
            />
          )}
        </div>

        {/* Preview Panel */}
        <div className={`${showPreview ? "block" : "hidden"} md:block w-full md:w-1/2 lg:w-3/5 bg-slate-50`}>
          {resumeData && (
            <ResumePreview 
              data={resumeData} 
              template={selectedTemplate}
              setSelectedTemplate={setSelectedTemplate}
              fontSize={11}
              lineHeight={1.6}
              margins={20}
              accentColor="#2563EB"
              fontFamily="Inter"
              className="resume-preview-root"
            />
          )}
        </div>
      </div>

      {/* Mobile Bottom Actions */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4">
        <div className="flex space-x-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setShowPreview(!showPreview)}
          >
            {showPreview ? <EyeOff className="w-4 h-4 mr-2" /> : <Eye className="w-4 h-4 mr-2" />}
            {showPreview ? "Edit" : "Preview"}
          </Button>
          <Button
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={() => exportPdfMutation.mutate()}
            disabled={exportPdfMutation.isPending}
          >
            {exportPdfMutation.isPending ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>
    </div>
  );
}
