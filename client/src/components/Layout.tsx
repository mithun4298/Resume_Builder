import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './footer';
import { Toaster } from '@/components/ui/toaster';

interface LayoutProps {
  children?: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <Header>
        {children}
      </Header>
      
      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Toast Notifications */}
      <Toaster />
    </div>
  );
}

// Alternative Layout for pages that need custom header content
export function LayoutWithCustomHeader({ 
  children, 
  headerContent 
}: { 
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header>
        {headerContent}
      </Header>
      
      <main className="flex-1">
        {children}
      </main>
      
      <Footer />
      <Toaster />
    </div>
  );
}