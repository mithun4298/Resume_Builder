import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { FileText, Bell, ChevronRight } from "lucide-react";

interface HeaderProps {
  children?: React.ReactNode;
}

export default function Header({ children }: HeaderProps) {
  const { user } = useAuth();

  return (
    <header className="bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">ResumeAI</span>
            </div>
            <div className="hidden md:flex items-center space-x-1 text-sm text-slate-600">
              <span>Templates</span>
              <ChevronRight className="w-3 h-3" />
              <span className="text-primary font-medium">Resume Editor</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              className="hidden md:flex items-center space-x-2 text-slate-600 hover:text-slate-900"
            >
              <span>Auto-saved</span>
            </Button>
            
            {children}
            
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm"
                className="w-8 h-8 p-0 bg-slate-100 hover:bg-slate-200"
              >
                <Bell className="w-4 h-4 text-slate-600" />
              </Button>
              
              <div className="flex items-center space-x-2">
                {user && typeof user === 'object' && 'profileImageUrl' in user && user.profileImageUrl ? (
                  <img 
                    src={user.profileImageUrl as string} 
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user && typeof user === 'object' && 'firstName' in user && user.firstName ? (user.firstName as string)[0] : (user && typeof user === 'object' && 'email' in user && user.email ? (user.email as string)[0] : "U")}
                    </span>
                  </div>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.location.href = '/api/logout'}
                  className="text-slate-600 hover:text-slate-900"
                >
                  Logout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
//
}
