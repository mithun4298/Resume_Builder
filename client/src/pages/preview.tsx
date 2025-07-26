import React, { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Button } from '@/components/ui/button';
import { Download, ArrowLeft, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Resume {
  id: string;
  title: string;
  templateId: string;
  updatedAt: string;
  status?: 'draft' | 'completed';
  downloadCount?: number;
  data?: any;
}

const PreviewPage: React.FC = () => {
  const [resume, setResume] = useState<Resume | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocation();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  // Extract resumeId from URL (/preview/:id)
  const getResumeId = () => {
    const match = location.match(/\/preview\/?([\w-]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const resumeId = getResumeId();
    if (!resumeId) {
      setError('No resume ID provided.');
      setLoading(false);
      return;
    }
    setLoading(true);
    apiRequest('GET', `/api/resumes/${resumeId}`)
      .then(async (res) => {
        if (!res.ok) throw new Error('Resume not found');
        const json = await res.json();
        // Support both {data: resume} and resume directly
        const resumeData = json.data || json;
        setResume(resumeData);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [location]);

  const handleDownload = async () => {
    if (!resume) return;

    try {
      const response = await fetch('/api/resumes/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resume),
      });

      if (!response.ok) {
        throw new Error('Failed to generate PDF');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = `${resume.data?.personalInfo?.firstName || 'Resume'}_Preview.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Complete",
        description: "Resume downloaded successfully.",
        variant: "default",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download resume.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-8">
        {loading ? (
          <div className="text-center text-gray-500">Loading preview...</div>
        ) : error ? (
          <div className="text-center text-red-500">{error}</div>
        ) : resume ? (
          <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8 mb-8">
            <div className="flex justify-between items-center mb-4">
              <Button variant="ghost" onClick={() => navigate('/')}>
                <ArrowLeft className="mr-2" /> Back
              </Button>
              <div className="flex space-x-2">
                <Button onClick={handleDownload}>
                  <Download className="mr-2" /> Download
                </Button>
                <Button>
                  <Share2 className="mr-2" /> Share
                </Button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">{resume.title}</h1>
            <div className="text-sm text-gray-500 mb-6 text-center">Last updated: {new Date(resume.updatedAt).toLocaleString()}</div>
            {/* Render resume sections here. Replace with your actual resume template component if available. */}
            <div className="space-y-4">
              <div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Personal Info</h2>
                <pre className="bg-slate-100 rounded p-2 overflow-x-auto text-sm">{JSON.stringify(resume.data?.personalInfo, null, 2)}</pre>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Summary</h2>
                <div className="bg-slate-100 rounded p-2 text-sm">{resume.data?.summary || 'N/A'}</div>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Experience</h2>
                <pre className="bg-slate-100 rounded p-2 overflow-x-auto text-sm">{JSON.stringify(resume.data?.experience, null, 2)}</pre>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Education</h2>
                <pre className="bg-slate-100 rounded p-2 overflow-x-auto text-sm">{JSON.stringify(resume.data?.education, null, 2)}</pre>
              </div>
              <div>
                <h2 className="text-xl font-semibold text-blue-700 mb-2">Skills</h2>
                <pre className="bg-slate-100 rounded p-2 overflow-x-auto text-sm">{JSON.stringify(resume.data?.skills, null, 2)}</pre>
              </div>
              {/* Add more sections as needed */}
            </div>
            <div className="flex justify-center mt-8">
              <Button onClick={() => window.print()} className="bg-blue-600 hover:bg-blue-700">Print / Save as PDF</Button>
            </div>
          </div>
        ) : null}
      </main>
      <Footer />
    </div>
  );
};

export default PreviewPage;