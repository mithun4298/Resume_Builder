import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface EnhancedHeroProps {
  user: any;
  resumes: any[];
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
  newResumeTitle: string;
  setNewResumeTitle: (title: string) => void;
  onCreateResume: (title: string) => void;
  isCreating: boolean;
}

export default function EnhancedHero({ 
  user, 
  resumes, 
  dialogOpen, 
  setDialogOpen, 
  newResumeTitle, 
  setNewResumeTitle, 
  onCreateResume, 
  isCreating 
}: EnhancedHeroProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg text-white mb-8 overflow-hidden relative">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative px-8 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mr-4">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">
                  Welcome back, {user?.firstName || 'User'}! 👋
                </h1>
                <p className="text-blue-100 mt-1">
                  Ready to create your next career opportunity?
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold">{resumes?.length || 0}</div>
                <div className="text-blue-100 text-sm">Resumes</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {resumes?.reduce((sum, r) => sum + (r.downloadCount || 0), 0) || 0}
                </div>
                <div className="text-blue-100 text-sm">Downloads</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">94%</div>
                <div className="text-blue-100 text-sm">Success Rate</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {resumes ? new Set(resumes.map(r => r.templateId)).size : 0}
                </div>
                <div className="text-blue-100 text-sm">Templates</div>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0 md:ml-8">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-white text-blue-600 hover:bg-blue-50 font-semibold px-6 py-3">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create New Resume
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Resume</DialogTitle>
                </DialogHeader>
                {/* Dialog content here */}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}