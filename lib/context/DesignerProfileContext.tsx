'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DesignerProfile } from '../types';

interface DesignerProfileContextType {
  profile: DesignerProfile | null;
  updateProfile: (profile: DesignerProfile) => void;
  clearProfile: () => void;
  isOnboardingComplete: boolean;
}

const DesignerProfileContext = createContext<DesignerProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'designer_profile';

export function DesignerProfileProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<DesignerProfile | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load profile from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setProfile(JSON.parse(stored));
      } catch (error) {
        console.error('Failed to parse stored profile:', error);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (profile && isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile, isLoaded]);

  const updateProfile = (newProfile: DesignerProfile) => {
    setProfile(newProfile);
  };

  const clearProfile = () => {
    setProfile(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const isOnboardingComplete = profile?.completedOnboarding ?? false;

  return (
    <DesignerProfileContext.Provider
      value={{
        profile,
        updateProfile,
        clearProfile,
        isOnboardingComplete,
      }}
    >
      {children}
    </DesignerProfileContext.Provider>
  );
}

export function useDesignerProfile() {
  const context = useContext(DesignerProfileContext);
  if (context === undefined) {
    throw new Error('useDesignerProfile must be used within a DesignerProfileProvider');
  }
  return context;
}
