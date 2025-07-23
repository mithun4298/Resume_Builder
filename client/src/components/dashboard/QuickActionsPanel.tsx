import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Plus, FileText, Users, Zap, Target, 
  BarChart3, ArrowRight, Sparkles 
} from "lucide-react";

interface QuickActionsPanelProps {
  onCreateResume: () => void;
  onBrowseTemplates: () => void;
  onViewAnalytics: () => void;
  onAIAssistant: () => void;
}

export default function QuickActionsPanel({
  onCreateResume,
  onBrowseTemplates,
  onViewAnalytics,
  onAIAssistant
}: QuickActionsPanelProps) {
  const quickActions = [
    {
      icon: <Plus className="w-5 h-5" />,
      title: "Create Resume",
      description: "Start building a new resume from scratch",
      onClick: onCreateResume,
      color: "bg-blue-500 hover:bg-blue-600"
    },
    {
      icon: <FileText className="w-5 h-5" />,
      title: "Browse Templates",
      description: "Explore our collection of professional templates",
      onClick: onBrowseTemplates,
      color: "bg-green-500 hover:bg-green-600"
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: "View Analytics",
      description: "Track your resume performance and downloads",
      onClick: onViewAnalytics,
      color: "bg-purple-500 hover:bg-purple-600"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "AI Assistant",
      description: "Get AI-powered suggestions for your resume",
      onClick: onAIAssistant,
      color: "bg-orange-500 hover:bg-orange-600"
    }
  ];

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Button
              key={index}
              variant="outline"
              className="h-auto p-4 flex flex-col items-start text-left hover:shadow-md transition-all"
              onClick={action.onClick}
            >
              <div className={`p-2 rounded-lg text-white mb-3 ${action.color}`}>
                {action.icon}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
              <ArrowRight className="w-4 h-4 mt-2 text-gray-400" />
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}