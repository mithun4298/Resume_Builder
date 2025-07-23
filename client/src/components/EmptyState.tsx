import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FileText, Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel: string;
  icon?: React.ReactNode;
  onAction?: () => void;
  // Props for create resume dialog
  dialogOpen?: boolean;
  onDialogOpenChange?: (open: boolean) => void;
  newResumeTitle?: string;
  onTitleChange?: (title: string) => void;
  onCreateResume?: () => void;
  isCreating?: boolean;
}

export default function EmptyState({
  title,
  description,
  actionLabel,
  icon = <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />,
  onAction,
  dialogOpen,
  onDialogOpenChange,
  newResumeTitle,
  onTitleChange,
  onCreateResume,
  isCreating = false
}: EmptyStateProps) {
  // If dialog props are provided, render with dialog
  if (dialogOpen !== undefined && onDialogOpenChange && newResumeTitle !== undefined && onTitleChange && onCreateResume) {
    return (
      <div className="p-12 text-center">
        {icon}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        <Dialog open={dialogOpen} onOpenChange={onDialogOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              {actionLabel}
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
                  onChange={(e) => onTitleChange(e.target.value)}
                  placeholder="e.g., Software Engineer Resume"
                />
              </div>
              <Button 
                onClick={onCreateResume}
                disabled={!newResumeTitle.trim() || isCreating}
                className="w-full"
              >
                {isCreating ? "Creating..." : "Create Resume"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Simple empty state without dialog
  return (
    <div className="p-12 text-center">
      {icon}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      {onAction && (
        <Button onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}