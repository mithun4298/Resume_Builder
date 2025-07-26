import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Bell, ChevronRight, Home, FileText as FileIcon, Layout, FolderOpen } from "lucide-react";
import { useLocation } from "wouter";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - Logo and Navigation */}
          <div className="flex items-center space-x-4">
            <div 
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => navigate(isAuthenticated ? "/home" : "/")}
            >
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-white">ResumeAI</span>
            </div>
            
            {/* Navigation breadcrumb - only show when authenticated */}
            {isAuthenticated && (
              <div className="hidden md:flex items-center space-x-1 text-sm text-white/80">
                <span>Dashboard</span>
                <ChevronRight className="w-3 h-3" />
                <span className="text-white font-medium">
                  {location === "/builder" ? "Resume Editor" : 
                   location === "/templates" ? "Templates" :
                   location === "/my-resumes" ? "My Resumes" : "Home"}
                </span>
              </div>
            )}
          </div>
          
          {/* Right side - Actions and User */}
          <div className="flex items-center space-x-4">
            {/* Auto-save indicator - only show in builder */}
            {location === "/builder" && (
              <Button 
                variant="ghost" 
                size="sm"
                className="hidden md:flex items-center space-x-2 text-white/80 hover:text-white hover:bg-white/10"
              >
                <span>Auto-saved</span>
              </Button>
            )}
            
            {/* Custom children content */}
            {children}
            
            {/* User section */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                {/* Navigation buttons */}
                <div className="hidden md:flex items-center space-x-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/home")}
                    className={`text-white/80 hover:text-white hover:bg-white/10 ${location === "/home" ? "bg-white/20" : ""}`}
                  >
                    <Home className="w-4 h-4 mr-1" />
                    Home
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/resume-builder")}
                    className={`text-white/80 hover:text-white hover:bg-white/10 ${location === "/resume-builder" ? "bg-white/20" : ""}`}
                  >
                    <FileIcon className="w-4 h-4 mr-1" />
                    Builder
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/templates")}
                    className={`text-white/80 hover:text-white hover:bg-white/10 ${location === "/templates" ? "bg-white/20" : ""}`}
                  >
                    <Layout className="w-4 h-4 mr-1" />
                    Templates
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => navigate("/home")}
                    className={`text-white/80 hover:text-white hover:bg-white/10 ${location === "/home" ? "bg-white/20" : ""}`}
                  >
                    <FolderOpen className="w-4 h-4 mr-1" />
                    My Resumes
                  </Button>
                </div>

                {/* Notifications */}
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="w-8 h-8 p-0 bg-white/10 hover:bg-white/20 text-white"
                >
                  <Bell className="w-4 h-4" />
                </Button>
                
                {/* User profile */}
                <div className="flex items-center space-x-2">
                  {user && typeof user === 'object' && 'profileImageUrl' in user && user.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl as string} 
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover border-2 border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center border-2 border-white/20">
                      <span className="text-white text-sm font-medium">
                        {user && typeof user === 'object' && 'firstName' in user && user.firstName ? 
                          (user.firstName as string)[0] : 
                          (user && typeof user === 'object' && 'email' in user && user.email ? 
                            (user.email as string)[0] : "U")}
                      </span>
                    </div>
                  )}
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.location.href = '/api/logout'}
                    className="text-white/80 hover:text-white hover:bg-white/10"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              /* Not authenticated - show login button */
              <Button
                onClick={() => window.location.href = "/api/login"}
                className="bg-white text-blue-600 hover:bg-white/90 font-semibold"
              >
                Get Started
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}