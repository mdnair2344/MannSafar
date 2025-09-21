import React, { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/components/auth/AuthProvider";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { ParentDashboard } from "@/components/dashboard/ParentDashboard";
import { TherapistDashboard } from "@/components/dashboard/TherapistDashboard";
import { AuthPage } from "@/pages/AuthPage";
import NotFound from "./pages/NotFound";
import { ProfilePage } from "@/pages/ProfilePage";
import { AICompanion } from "./pages/AICompanion";
import { PersonalJournal } from "./pages/PersonalJournal";
import { ProgressTracker } from "./pages/ProgressTracker";
import { DummyProgressTracker } from "./pages/DummyProgressTracker";
import { ShareFeelings } from "./pages/ShareFeelings";
import  EmotionGamesPage from "./pages/EmotionGamesPage";
import { BeginJourney } from "@/pages/BeginJourney";
import { ClientManagement } from "./pages/ClientManagement";
import { AssessmentTools } from "./pages/AssessmentTools";
import { SessionNotes } from "./pages/SessionNotes";
import { ProgressAnalytics } from "./pages/ProgressAnalytics";
import { AllUpdates } from "./pages/AllUpdates";
import { ClientProvider } from "./pages/ClientContext";
import { AddNewClientForm } from "./pages/AddNewClientForm";
import { ChildReports } from "./pages/ChildReports";
import { CommunicationHub } from "./pages/CommunicationHub";
import { FamilyResources } from "./pages/FamilyResources";
import  FaceDetection from "@/pages/FaceDetection";
import VoiceDetection from "@/pages/VoiceDetection";
import { DropdownInput } from "@/pages/DropdownInput";
import { MoodAssessmentPage } from "./pages/MoodAssessmentPage";
import { Settings } from "./pages/Settings";
import LovyDubbyPage from "./pages/LovyDubbyPage";
import { supabase } from "@/integrations/supabase/client";
import { ParentsJournal } from './pages/ParentsJournal';

import HappyBalloonPop from "@/pages/games/HappyBalloonPop";
import SadRaindropCatch from "@/pages/games/SadRainDropCatch";
import DemotivatedClimber from "@/pages/games/DemotivatedMotivationMountain";
import AngryBubbleSmash from "@/pages/games/AngryBubbleSmash";
import CarefreeCloudPainter from "@/pages/games/CarefreeCloudPainter";
import TensedBreathing from "@/pages/games/TensedBreathingCircle";
import CuriousStarExplorer from "@/pages/games/CuriousKnowledgeExplorer";
import { GamesPage } from './pages/GamesPage';

const queryClient = new QueryClient();
function DashboardRedirect() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        setLoadingProfile(true);
        try {
          const { data, error } = await supabase
            .from("profiles")
            .select("user_type")
            .eq("id", user.id)
            .single();

          if (error) throw error;
          setProfile(data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
          setProfile(null);
        } finally {
          setLoadingProfile(false);
        }
      };

      fetchProfile();
    }
  }, [user]);

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Fetching profile...</p>
        </div>
      </div>
    );
  }

  const userType = profile?.user_type;

  switch (userType) {
    case "student":
      return <Dashboard />;
    case "parent":
      return <ParentDashboard />;
    case "therapist":
      return <TherapistDashboard />;
    default:
      return <Dashboard />;
  }
}
function AppContent() {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <AuthPage />;
  }
  
  return (
    <ClientProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<DashboardRedirect />} />
        <Route path="/ai-companion" element={<AICompanion />} />
        <Route path="/personal-journal" element={<PersonalJournal />} />
        <Route path="/progress-tracker" element={<ProgressTracker />} />
        <Route path="/dummyprogress-tracker" element={<DummyProgressTracker />} />
        <Route path="/profile" element={<ProfilePage />} />
        {/* <Route path="/share-feelings" element={<ShareFeelings />} /> */}
        <Route path="/emotion-games" element={<EmotionGamesPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/share-feelings" element={<BeginJourney />} />
        <Route path="/face-detection" element={<FaceDetection />} />
        <Route path="/voice-detection" element={<VoiceDetection />} />
        <Route path="/dropdown-input" element={<DropdownInput />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/mood-assessment/:emotion" element={<MoodAssessmentPage />} />
        <Route path="/lovydubby" element={<LovyDubbyPage />} />
        <Route path="/clients" element={<ClientManagement />} />
         <Route path="/" element={<AddNewClientForm />} />
        <Route path="/notes" element={<SessionNotes />} />
        <Route path="/parents-journal" element={<ParentsJournal />} />
        <Route path="/analytics" element={<ProgressAnalytics />} />
        <Route path="/assessments" element={<AssessmentTools />} />
        <Route path="/all-updates" element={<AllUpdates />} />
        <Route path="/child-reports" element={<ChildReports />} />
         <Route path="/" element={<AddNewClientForm />} />
        <Route path="/messages" element={<CommunicationHub />} />
        <Route path="/family-resources" element={<FamilyResources />} />
        <Route path="/game/happy" element={<HappyBalloonPop />} />
        <Route path="/game/sad" element={<SadRaindropCatch />} />
        <Route path="/game/demotivated" element={<DemotivatedClimber />} />
        <Route path="/game/angry" element={<AngryBubbleSmash />} />
        <Route path="/game/carefree" element={<CarefreeCloudPainter />} />
        <Route path="/game/tensed" element={<TensedBreathing />} />
         <Route path="/game/curious" element={<CuriousStarExplorer/>} />
         <Route path="/games" element={<GamesPage />} />
      </Routes>
    </BrowserRouter>
     </ClientProvider>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <div className="dark">
        <Toaster />
        <Sonner />
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
