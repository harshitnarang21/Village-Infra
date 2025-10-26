import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import BrowserDatabase from '../database/BrowserDatabase';

export type UserRole = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  villageId: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: UserRole, fullName: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [database] = useState(() => BrowserDatabase.getInstance());

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Initialize database
        await database.initialize();
        
        // Check for existing session
        const userSession = localStorage.getItem('userSession');
        if (userSession) {
          try {
            const sessionData = JSON.parse(userSession);
            const dbUser = await database.getUserById(sessionData.userId);
            
            if (dbUser && sessionData.expiresAt > Date.now()) {
              setUser({
                id: dbUser.id,
                name: dbUser.full_name,
                email: dbUser.email,
                role: dbUser.role,
                villageId: dbUser.village_id
              });
            } else {
              localStorage.removeItem('userSession');
            }
          } catch (error) {
            console.error('Invalid session:', error);
            localStorage.removeItem('userSession');
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [database]);

  const login = async (email: string, password: string, role: UserRole, fullName: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Try to find existing user
      let dbUser = await database.getUserByEmail(email);
      
      if (dbUser) {
        // Verify password using browser-compatible method
        const isValidPassword = await database.verifyPassword(password, dbUser.password_hash);
        if (!isValidPassword) {
          return false;
        }
      } else {
        // Create new user for demo purposes
        // In production, you'd have a separate registration process
        const hashedPassword = await database.hashPassword(password);
        
        // For demo, we'll use the first village in the database
        // In production, this would be determined during registration
        const villages = await database.getVillages();
        const villageId = villages.length > 0 ? villages[0].id : 'default-village';
        
        const userId = await database.createUser({
          full_name: fullName,
          email: email,
          password_hash: hashedPassword,
          role: role,
          village_id: villageId
        });
        
        dbUser = await database.getUserById(userId);
      }
      
      if (dbUser) {
        // Create session data (browser-compatible alternative to JWT)
        const sessionData = {
          userId: dbUser.id,
          email: dbUser.email,
          role: dbUser.role,
          expiresAt: Date.now() + (24 * 60 * 60 * 1000) // 24 hours
        };
        
        localStorage.setItem('userSession', JSON.stringify(sessionData));
        
        setUser({
          id: dbUser.id,
          name: dbUser.full_name,
          email: dbUser.email,
          role: dbUser.role,
          villageId: dbUser.village_id
        });
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userSession');
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Initializing database...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
