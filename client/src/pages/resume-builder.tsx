import { useState, useEffect, useCallback } from "react";
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
import { Card } from "@/components/ui/card"; // <--- Needed for hidden export
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import type { Resume, ResumeData } from "@shared/schema";
import React from "react";

// Lazy import your templates
const ModernTemplate = React.lazy(() => import("@/components/resume-templates/ModernTemplate"));
const ClassicTemplate = React.lazy(() => import("@/components/resume-templates/ClassicTemplate"));
const MinimalistTemplate = React.lazy(() => import("@/components/resume-templates/MinimalistTemplate"));
const ElegantTemplate = React.lazy(() => import("@/components/resume-templates/ElegantTemplate"));
const BoldTemplate = React.lazy(() => import("@/components/resume-templates/BoldTemplate"));
const TwoColumnTemplate = React.lazy(() => import("@/components/resume-templates/TwoColumnTemplate"));

export default function ResumeBuilder() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [atsScore, setAtsScore] = useState(null);

  // Template selection for preview/export
  const [selectedTemplate, setSelectedTemplate] = useState("modern");

  // PDF Export state
  const [exportPdfPending, setExportPdfPending] = useState(false);
  const [pendingExport, setPendingExport] = useState(false);

  // Auth Redirect
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

  // Resume Query
  const { data: resume, isLoading } = useQuery<Resume>({
    queryKey: ["/api/resumes", id],
    enabled: !!id && isAuthenticated,
    retry: false,
  });

  useEffect(() => {
    if (resume && resume.data) setResumeData(resume.data as ResumeData);
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

  // --- Export Trigger ---
  const exportPdf = useCallback(async () => {
    if (!showPreview) {
      setShowPreview(true);
      await new Promise((res) => setTimeout(res, 600));
    }
    setPendingExport(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPreview]);

  // PDF Export Effect (triggers offscreen resume for export)
  useEffect(() => {
    if (!pendingExport) return;
    const doExport = async () => {
      try {
        setExportPdfPending(true);

        if (!resumeData) {
          toast({
            title: "Error",
            description: "Resume data not loaded. Cannot export PDF.",
            variant: "destructive",
          });
          return;
        }

        await loadHtml2PdfScript();
        await new Promise((r) => setTimeout(r, 100));

        const element = document.querySelector(".resume-preview-root-ui");
        if (!element) {
          toast({
            title: "Error",
            description: "Resume preview not found. Please try again.",
            variant: "destructive",
          });
          return;
        }
        if (!element.textContent || element.textContent.trim().length < 50) {
          toast({
            title: "Error",
            description: "Resume preview is empty. Please ensure your resume has content.",
            variant: "destructive",
          });
          return;
        }
        if (!(window).html2pdf) {
          toast({
            title: "Error",
            description: "PDF library not loaded. Please try again.",
            variant: "destructive",
          });
          return;
        }

        const opt = {
          margin: 0,
          filename: `${resume?.title || "resume"}.pdf`,
          image: { type: "jpeg", quality: 0.98 },
          html2canvas: {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            logging: false
          },
          jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        };

        await window.html2pdf().set(opt).from(element).save();

        toast({
          title: "Success",
          description: "Resume exported successfully!",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: error.message || "Failed to export resume. Please try again.",
          variant: "destructive",
        });
      } finally {
        setExportPdfPending(false);
        setPendingExport(false);
      }
    };
    doExport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendingExport, resumeData, resume, toast]);

  // Auto-save
  useEffect(() => {
    if (!resumeData || !id) return;
    const timeoutId = setTimeout(() => {
      updateResumeMutation.mutate(resumeData);
    }, 60000);
    return () => clearTimeout(timeoutId);
  }, [resumeData, id]);

  // Change Handler
  const handleResumeDataChange = (newData: ResumeData) => setResumeData(newData);

  // Error/Loading States
  if (authLoading || !isAuthenticated) return <div>Loading...</div>;
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

  // ------- UI --------
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
            onClick={exportPdf}
            disabled={exportPdfPending}
            className="bg-primary hover:bg-primary/90"
          >
            {exportPdfPending ? "Exporting..." : "Export PDF"}
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
              onExportPdf={exportPdf}
              exportPdfPending={exportPdfPending}
            />
          )}
        </div>
        {/* Main Preview Panel (UI) */}
        <div className={`md:block w-full md:w-1/2 lg:w-3/5 bg-slate-50 ${showPreview ? '' : 'hidden md:block'}`}>
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
            onClick={exportPdf}
            disabled={exportPdfPending}
          >
            {exportPdfPending ? "Exporting..." : "Export PDF"}
          </Button>
        </div>
      </div>

      {/* --- HIDDEN EXPORT-ONLY RENDER: ONLY VISIBLE TO SCRIPT --- */}
      {pendingExport && resumeData && (
        <div
          style={{
            position: "fixed",
            left: "-9999px",
            top: 0,
            opacity: 0,
            pointerEvents: "none",
            zIndex: -1
          }}
        >
          <div
            className="resume-preview-root-ui"
            style={{
              width: "210mm", // A4 width
              minHeight: "295mm", // A4 height
              background: "white",
              color: "black",
              boxSizing: "border-box",
              padding: "5mm 5mm",
            }}
          >
            <React.Suspense fallback={<div>Loading...</div>}>
              {selectedTemplate === "classic" && <ClassicTemplate resumeData={resumeData} />}
              {selectedTemplate === "minimalist" && <MinimalistTemplate resumeData={resumeData} />}
              {selectedTemplate === "elegant" && <ElegantTemplate resumeData={resumeData} />}
              {selectedTemplate === "bold" && <BoldTemplate resumeData={resumeData} />}
              {selectedTemplate === "twocolumn" && <TwoColumnTemplate resumeData={resumeData} />}
              {["classic", "minimalist", "elegant", "bold", "twocolumn"].indexOf(selectedTemplate) === -1 && (
                <ModernTemplate resumeData={resumeData} />
              )}
            </React.Suspense>
          </div>
        </div>
      )}
    </div>
  );
}
