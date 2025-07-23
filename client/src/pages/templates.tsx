import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Search, Eye, Plus, Star, Filter, Grid, List, Sparkles } from "lucide-react";

// Template data structure
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  features: string[];
  preview: string;
  popular: boolean;
  new: boolean;
  component: React.ComponentType<any>;
}

// Import your template components
import ClassicTemplate from "@/components/resume-templates/ClassicTemplate";
import ModernTemplate from "@/components/resume-templates/ModernTemplate";
import BoldTemplate from "@/components/resume-templates/BoldTemplate";
import ElegantTemplate from "@/components/resume-templates/ElegantTemplate";
import TwoColumnTemplate from "@/components/resume-templates/TwoColumnTemplate";
import ExecutiveLuxury from "@/components/resume-templates/ExecutiveLuxury";

// Sample resume data for previews
const sampleResumeData = {
  personalInfo: {
    firstName: "John",
    lastName: "Doe",
    title: "Software Engineer",
    email: "john.doe@email.com",
    phone: "(555) 123-4567",
    location: "San Francisco, CA",
    website: "johndoe.dev"
  },
  summary: "Experienced software engineer with 5+ years developing scalable web applications...",
  experience: [
    {
      title: "Senior Software Engineer",
      company: "Tech Corp",
      startDate: "2022",
      endDate: "Present",
      current: true,
      bullets: [
        "Led development of microservices architecture serving 1M+ users",
        "Improved application performance by 40% through optimization"
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Science",
      field: "Computer Science",
      institution: "University of Technology",
      startDate: "2016",
      endDate: "2020",
      gpa: "3.8"
    }
  ],
  skills: {
    technical: ["JavaScript", "React", "Node.js", "Python", "AWS"],
    soft: ["Leadership", "Communication", "Problem Solving"]
  },
  projects: [],
  certifications: []
};

// Available templates
const templates: Template[] = [
  {
    id: "classic",
    name: "Classic Professional",
    description: "Clean and traditional design perfect for corporate environments",
    category: "Professional",
    difficulty: "Beginner",
    features: ["ATS-Friendly", "Clean Layout", "Professional"],
    preview: "/api/templates/classic/preview.png",
    popular: true,
    new: false,
    component: ClassicTemplate
  },
  {
    id: "modern",
    name: "Modern Minimalist",
    description: "Contemporary design with clean lines and modern typography",
    category: "Creative",
    difficulty: "Intermediate",
    features: ["Modern Design", "Minimalist", "Eye-catching"],
    preview: "/api/templates/modern/preview.png",
    popular: true,
    new: false,
    component: ModernTemplate
  },
  {
    id: "bold",
    name: "Bold Impact",
    description: "Strong visual hierarchy with bold typography and striking design",
    category: "Creative",
    difficulty: "Advanced",
    features: ["Bold Typography", "High Impact", "Creative"],
    preview: "/api/templates/bold/preview.png",
    popular: false,
    new: true,
    component: BoldTemplate
  },
  {
    id: "elegant",
    name: "Elegant Classic",
    description: "Sophisticated design with elegant typography and refined layout",
    category: "Professional",
    difficulty: "Intermediate",
    features: ["Elegant Design", "Sophisticated", "Refined"],
    preview: "/api/templates/elegant/preview.png",
    popular: true,
    new: false,
    component: ElegantTemplate
  },
  {
    id: "two-column",
    name: "Two Column Pro",
    description: "Efficient two-column layout maximizing space utilization",
    category: "Professional",
    difficulty: "Beginner",
    features: ["Two Column", "Space Efficient", "Organized"],
    preview: "/api/templates/two-column/preview.png",
    popular: false,
    new: false,
    component: TwoColumnTemplate
  },
  {
    id: "executive",
    name: "Executive Luxury",
    description: "Premium design for senior executives and leadership positions",
    category: "Executive",
    difficulty: "Advanced",
    features: ["Luxury Design", "Executive Level", "Premium"],
    preview: "/api/templates/executive/preview.png",
    popular: false,
    new: true,
    component: ExecutiveLuxury
  }
];

export default function Templates() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // State management
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [newResumeTitle, setNewResumeTitle] = useState("");
  const [selectedTemplateId, setSelectedTemplateId] = useState("");

  // Get unique categories and difficulties
  const categories = ["all", ...new Set(templates.map(t => t.category))];
  const difficulties = ["all", ...new Set(templates.map(t => t.difficulty))];

  // Filter templates
  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === "all" || template.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  // Create resume with template mutation
  const createResumeMutation = useMutation({
    mutationFn: async ({ title, templateId }: { title: string; templateId: string }) => {
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
        templateId,
        isPublic: false,
      });
    },
    onSuccess: async (response) => {
      const resume = await response.json();
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      navigate(`/resume/${resume.id}`);
      toast({
        title: "Success",
        description: "New resume created successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create resume. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleUseTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setNewResumeTitle("");
  };

  const handleCreateResume = () => {
    if (!newResumeTitle.trim()) {
      toast({
        title: "Error",
        description: "Please enter a resume title.",
        variant: "destructive",
      });
      return;
    }
    
    createResumeMutation.mutate({
      title: newResumeTitle,
      templateId: selectedTemplateId
    });
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Professional Resume Templates
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our collection of professionally designed templates. 
              Each template is crafted to help you stand out and land your dream job.
            </p>
          </div>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex flex-col sm:flex-row gap-4 flex-1">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search templates..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category === "all" ? "All Categories" : category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    {difficulties.map(difficulty => (
                      <SelectItem key={difficulty} value={difficulty}>
                        {difficulty === "all" ? "All Levels" : difficulty}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Templates Grid/List */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 ${viewMode === "list" ? "sm:grid-cols-1" : ""}`}>
            {filteredTemplates.map(template => (
              <Card key={template.id} className="relative">
                <CardHeader>
                  <CardTitle>{template.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    {template.popular && <Badge variant="secondary">Popular</Badge>}
                    {template.new && <Badge variant="secondary">New</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <img src={template.preview} alt={`${template.name} Preview`} className="w-full h-48 object-cover rounded-lg" />
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">{template.description}</p>
                    <div className="mt-2 flex items-center gap-2">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span className="text-sm text-gray-600">{template.difficulty}</span>
                    </div>
                    <div className="mt-2 flex items-center gap-2">
                      {template.features.map(feature => (
                        <Badge key={feature} variant="outline">{feature}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setPreviewTemplate(template)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </Button>
                    <Button
                      variant="default"
                      size="sm"
                      onClick={() => handleUseTemplate(template.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Preview Dialog */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={setPreviewTemplate}>
          <DialogContent className="max-w-5xl">
            <DialogHeader>
              <DialogTitle>{previewTemplate.name}</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <previewTemplate.component data={sampleResumeData} />
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Create Resume Dialog */}
      {selectedTemplateId && (
        <Dialog open={!!selectedTemplateId} onOpenChange={() => setSelectedTemplateId("")}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Resume</DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <Label htmlFor="resume-title">Resume Title</Label>
              <Input
                id="resume-title"
                value={newResumeTitle}
                onChange={(e) => setNewResumeTitle(e.target.value)}
                className="mt-2"
              />
              <Button
                variant="default"
                className="mt-4"
                onClick={handleCreateResume}
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Create Resume
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <Footer />
    </div>
  );
}