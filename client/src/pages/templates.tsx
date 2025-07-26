import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Search, Eye, Plus, Star, Filter, Grid, List, Sparkles, ArrowRight } from "lucide-react";
import { ClassicTemplate } from "@/components/resume-templates/ClassicTemplate";
import { MinimalTemplate } from "@/components/resume-templates/MinimalTemplate";
import { CreativeTemplate } from "@/components/resume-templates/CreativeTemplate";
import { ModernProfessionalTemplate } from "@/components/resume-templates/ModernProfessionalTemplate";
import TwoColumnTemplate from "@/components/resume-templates/TwoColumnTemplate";
import { ExecutiveTemplate } from "@/components/resume-templates/ExecutiveTemplate";

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
    id: "minimal",
    name: "Minimal Template",
    description: "Simple and clean layout for modern resumes.",
    category: "Creative",
    difficulty: "Beginner",
    features: ["Minimal Design", "Clean", "Modern"],
    preview: "/api/templates/minimal/preview.png",
    popular: true,
    new: false,
    component: MinimalTemplate
  },
  {
    id: "creative",
    name: "Creative Template",
    description: "Colorful and creative layout for standout resumes.",
    category: "Creative",
    difficulty: "Intermediate",
    features: ["Creative Design", "Colorful", "Unique"],
    preview: "/api/templates/creative/preview.png",
    popular: false,
    new: true,
    component: CreativeTemplate
  },
  {
    id: "modern",
    name: "Modern Professional",
    description: "Contemporary design with professional accents.",
    category: "Professional",
    difficulty: "Intermediate",
    features: ["Modern Design", "Professional", "Eye-catching"],
    preview: "/api/templates/modern/preview.png",
    popular: true,
    new: false,
    component: ModernProfessionalTemplate
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
    name: "Executive Template",
    description: "Premium design for senior executives and leadership positions",
    category: "Executive",
    difficulty: "Advanced",
    features: ["Luxury Design", "Executive Level", "Premium"],
    preview: "/api/templates/executive/preview.png",
    popular: false,
    new: true,
    component: ExecutiveTemplate
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
      const resJson = await response.json();
      const resumeId = resJson?.data?.resume?.id;
      console.log(resumeId);
      queryClient.invalidateQueries({ queryKey: ["/api/resumes"] });
      
      setTimeout(() => {
        console.log('🔍 Actually navigating now...');
        navigate(`/resume-builder?id=${resumeId}`);
      }, 100);
      
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
            <div className="mt-6 flex justify-center">
              <Badge variant="secondary" className="text-sm">
                {templates.length} Templates Available
              </Badge>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-blue-600 mb-2">{templates.length}</div>
              <div className="text-sm text-gray-600">Total Templates</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {templates.filter(t => t.popular).length}
              </div>
              <div className="text-sm text-gray-600">Popular Templates</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {categories.length - 1}
              </div>
              <div className="text-sm text-gray-600">Categories</div>
            </div>
            <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {templates.filter(t => t.new).length}
              </div>
              <div className="text-sm text-gray-600">New Templates</div>
            </div>
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
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {filteredTemplates.map(template => (
              <Card key={template.id} className={`group hover:shadow-lg transition-all duration-200 ${viewMode === "list" ? "flex flex-row" : ""}`}>
                {viewMode === "grid" ? (
                  <>
                    <div className="relative">
                      {template.popular && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge variant="default" className="bg-blue-600">
                            <Star className="w-3 h-3 mr-1" />
                            Popular
                          </Badge>
                        </div>
                      )}
                      {template.new && (
                        <div className="absolute top-2 right-2 z-10">
                          <Badge variant="secondary" className="bg-green-600 text-white">
                            New
                          </Badge>
                        </div>
                      )}
                      <div className="aspect-[3/4] bg-gray-100 rounded-t-lg overflow-hidden">
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <template.component data={sampleResumeData} scale={0.2} />
                        </div>
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {template.difficulty}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {template.description}
                      </p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {template.features.slice(0, 3).map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                        {template.features.length > 3 && (
                          <Badge variant="secondary" className="text-xs">
                            +{template.features.length - 3} more
                          </Badge>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </>
                ) : (
                  <>
                    <div className="w-48 flex-shrink-0">
                      <div className="aspect-[3/4] bg-gray-100 rounded-l-lg overflow-hidden relative">
                        {template.popular && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge variant="default" className="bg-blue-600 text-xs">
                              Popular
                            </Badge>
                          </div>
                        )}
                        {template.new && (
                          <div className="absolute top-2 right-2 z-10">
                            <Badge variant="secondary" className="bg-green-600 text-white text-xs">
                              New
                            </Badge>
                          </div>
                        )}
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <template.component data={sampleResumeData} scale={0.15} />
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {template.name}
                          </h3>
                          <div className="flex items-center gap-2 mb-3">
                            <Badge variant="outline">{template.category}</Badge>
                            <Badge variant="outline">{template.difficulty}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-4">{template.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {template.features.map(feature => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setPreviewTemplate(template)}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                        <Button
                          onClick={() => handleUseTemplate(template.id)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>

      {/* Preview Dialog */}
      {previewTemplate && (
        <Dialog open={!!previewTemplate} onOpenChange={() => setPreviewTemplate(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>{previewTemplate.name}</span>
                <div className="flex items-center gap-2">
                  {previewTemplate.popular && (
                    <Badge variant="default" className="bg-blue-600">
                      <Star className="w-3 h-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {previewTemplate.new && (
                    <Badge variant="secondary" className="bg-green-600 text-white">
                      New
                    </Badge>
                  )}
                </div>
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              <div className="mb-4 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">{previewTemplate.description}</p>
                <div className="flex flex-wrap gap-2">
                  {previewTemplate.features.map(feature => (
                    <Badge key={feature} variant="outline" className="text-xs">
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden bg-white">
                <div className="transform scale-75 origin-top-left" style={{ width: '133.33%', height: '133.33%' }}>
                  {previewTemplate.component && (
                    <previewTemplate.component data={sampleResumeData} />
                  )}
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Category:</span> {previewTemplate.category}
                  </div>
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Difficulty:</span> {previewTemplate.difficulty}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setPreviewTemplate(null)}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      setPreviewTemplate(null);
                      handleUseTemplate(previewTemplate.id);
                    }}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Use This Template
                  </Button>
                </div>
              </div>
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