import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Checking auth...');
        // Use the correct endpoint from your routes
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        
        console.log('Auth response status:', response.status);
        
        if (response.ok) {
          const userData = await response.json();
          console.log('User data:', userData);
          setUser(userData);
          setIsAuthenticated(true);
        } else {
          console.log('Auth failed, response not ok');
          setIsAuthenticated(false);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setIsAuthenticated(false);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch('/api/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      // Redirect to login or home page
      window.location.href = '/api/login';
    }
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    logout
  };
}