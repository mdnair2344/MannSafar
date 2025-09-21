import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export default function TensedBreathingCircle() {
  const [phase, setPhase] = useState<"inhale" | "exhale">("inhale");
  const [breathingCycles, setBreathingCycles] = useState(0);
  const [userId, setUserId] = useState<string>("");

  const phaseRef = useRef<"inhale" | "exhale">(phase);
  const cyclesRef = useRef<number>(breathingCycles);

  /* Fetch current user */
  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUserId(user?.id || "demo-user");
    };
    fetchUser();
  }, []);

  /* Load previous cycles */
  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      const { data, error } = await supabase
        .from("emotion_games")
        .select("content")
        .eq("user_id", userId)
        .eq("emotion", "Tensed")
        .single();

      if (!error && data?.content) {
        const content = data.content as { breathing_cycles?: number };
        setBreathingCycles(content.breathing_cycles ?? 0);
        cyclesRef.current = content.breathing_cycles ?? 0;
      }
    };
    loadData();
  }, [userId]);

  /* Save cycles */
  const saveCycles = async (newCycles: number) => {
    setBreathingCycles(newCycles);
    cyclesRef.current = newCycles;
    const { error } = await supabase.from("emotion_games").upsert({
      user_id: userId,
      emotion: "Tensed",
      content: { breathing_cycles: newCycles },
    });
    if (error) console.error(error);
  };

  /* Breathing cycle loop */
  useEffect(() => {
    const interval = setInterval(() => {
      const newPhase = phaseRef.current === "inhale" ? "exhale" : "inhale";
      setPhase(newPhase);
      phaseRef.current = newPhase;

      if (newPhase === "inhale") {
        saveCycles(cyclesRef.current + 1);
      }
    }, 4000); // 4s per phase

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-teal-950 to-black flex flex-col items-center p-6 relative overflow-hidden">
      {/* Header */}
      <header className="w-full grid grid-cols-3 items-center mb-6 text-white">
        <div className="justify-self-start">
          <Link to="/emotion-games">
            <Button variant="ghost" size="sm" className="text-white">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
        </div>

        <h1 className="text-2xl font-bold text-cyan-300 text-center">
          Breathing Exercise
        </h1>

        <div className="text-lg font-semibold justify-self-end">
          Cycles: {breathingCycles}
        </div>
      </header>

      {/* Breathing Circle */}
      <div className="flex flex-col items-center justify-center flex-1 text-white">
        <motion.div
          key={phase}
          animate={{
            scale: phase === "inhale" ? 1.5 : 0.8,
            opacity: phase === "inhale" ? 1 : 0.7,
          }}
          transition={{ duration: 4, ease: "easeInOut" }}
          className="w-40 h-40 rounded-full bg-gradient-to-r from-cyan-400 to-teal-500 shadow-2xl"
        />
        <p className="mt-6 text-xl font-semibold text-cyan-200">
          {phase === "inhale" ? "Inhale" : "Exhale"}
        </p>
      </div>

      {/* Instructions */}
      <p className="mt-6 text-teal-200 text-center max-w-md">
        Follow the circle. Inhale as it grows, exhale as it shrinks.  
        Each full breath counts as one cycle.
      </p>
    </div>
  );
}