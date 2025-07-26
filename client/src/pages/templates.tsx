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
import { Search, Eye, Plus, Star, Filter, Grid, List, Sparkles, Check, Download, X } from "lucide-react";
import { TEMPLATE_CONFIGS, TemplateConfig } from "@/data/templateData";
import { TEMPLATE_REGISTRY } from "@/components/resume-templates";

// Define Template interface if not already defined
interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: string;
  features: string[];
  suitableFor: string[];
  accentColor: string;
  recommended?: boolean;
  preview?: string;
}

// Use TEMPLATE_CONFIGS as the templates data
const templates: Template[] = TEMPLATE_CONFIGS;

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
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

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
      setCreateDialogOpen(false);
      setNewResumeTitle("");
      setSelectedTemplateId("");
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
    setCreateDialogOpen(true);
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

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template);
  };

  const renderTemplatePreview = (config: Template, isFullPreview = false) => {
    const TemplateComponent = TEMPLATE_REGISTRY[config.id];
    
    if (!TemplateComponent) {
      return (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center rounded-lg">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-2 mx-auto"></div>
            <span className="text-gray-500 text-sm">{config.name}</span>
          </div>
        </div>
      );
    }

    // Sample data for preview
    const sampleData = {
      personalInfo: {
        firstName: 'John',
        lastName: 'Doe',
        title: 'Software Engineer',
        email: 'john.doe@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        website: 'johndoe.dev'
      },
      summary: 'Experienced software engineer with 5+ years of experience in full-stack development.',
      experience: [
        {
          id: '1',
          title: 'Senior Software Engineer',
          company: 'Tech Corp',
          startDate: '2020',
          endDate: 'Present',
          current: true,
          location: 'San Francisco, CA',
          description: 'Lead development of web applications',
          bullets: [
            'Built scalable web applications serving 100k+ users',
            'Led team of 5 developers in agile environment'
          ],
          dates: '2020 - Present'
        }
      ],
      skills: {
        technical: ['JavaScript', 'React', 'Node.js', 'Python'],
        soft: ['Leadership', 'Communication', 'Problem Solving', 'Teamwork']
      },
      education: [
        {
          id: '1',
          degree: 'BS Computer Science',
          school: 'University of Technology',
          startDate: '2015',
          endDate: '2019'
        }
      ],
      projects: [
        {
          id: '1',
          name: 'E-commerce Platform',
          description: 'Built full-stack e-commerce platform with React and Node.js',
          technologies: ['React', 'Node.js', 'MongoDB'],
          url: 'https://github.com/johndoe/ecommerce'
        }
      ]
    };

    if (isFullPreview) {
      return (
        <div className="w-full h-full max-w-4xl mx-auto overflow-auto">
          <div className="bg-white shadow-lg rounded-lg p-4">
            <div className="w-full max-w-[210mm] mx-auto">
              <TemplateComponent data={sampleData} accentColor={config.accentColor} />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="w-full h-48 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 bg-white rounded-lg mb-2 mx-auto opacity-80"></div>
          <div className="text-gray-600 text-sm font-medium">{config.name}</div>
        </div>
      </div>
    );
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
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"}`}>
            {filteredTemplates.map(template => (
              <Card key={template.id} className={`group hover:shadow-lg transition-all duration-200 ${viewMode === "list" ? "flex flex-row" : ""}`}>
                {viewMode === "grid" ? (
                  <>
                    <div className="relative">
                      {template.recommended && (
                        <div className="absolute top-2 left-2 z-10">
                          <Badge variant="default" className="bg-blue-600">
                            <Star className="w-3 h-3 mr-1" />
                            Recommended
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
                        {renderTemplatePreview(template)}
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
                          onClick={() => handlePreviewTemplate(template)}
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
                        {template.recommended && (
                          <div className="absolute top-2 left-2 z-10">
                            <Badge variant="default" className="bg-blue-600 text-xs">
                              Recommended
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
                        {renderTemplatePreview(template)}
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
                          onClick={() => handlePreviewTemplate(template)}
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
                  {previewTemplate.recommended && (
                    <Badge variant="default" className="bg-blue-600">
                      <Star className="w-3 h-3 mr-1" />
                      Recommended
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
                {renderTemplatePreview(previewTemplate, true)}
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
      {createDialogOpen && (
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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