import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";

interface Bubble {
  id: number;
  left: number;
  delay: number;
}

export default function AngrySmashBubble() {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const [bubblesSmashed, setBubblesSmashed] = useState(0);
  const [calmPoints, setCalmPoints] = useState(0);
  const [userId, setUserId] = useState<string>("");
  const [showBreathModal, setShowBreathModal] = useState(false);
  const [breathCount, setBreathCount] = useState(0);
  const breathInterval = useRef<NodeJS.Timeout | null>(null);
  const [spawningPaused, setSpawningPaused] = useState(false);

  /* Fetch user */
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || "demo-user");
    };
    fetchUser();
  }, []);

  /* Load previous scores */
  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      const { data, error } = await supabase
        .from("emotion_games")
        .select("content")
        .eq("user_id", userId)
        .eq("emotion", "Angry")
        .single();

      if (!error && data?.content) {
        const content = data.content as unknown as { bubbles_smashed?: number; calm_points?: number };
        setBubblesSmashed(content?.bubbles_smashed ?? 0);
        setCalmPoints(content?.calm_points ?? 0);
      }
    };
    loadData();
  }, [userId]);

  /* Save scores */
  const saveScore = async (count: number, calm: number) => {
    setBubblesSmashed(count);
    setCalmPoints(calm);
    const { error } = await supabase.from("emotion_games").upsert({
      user_id: userId,
      emotion: "Angry",
      content: { bubbles_smashed: count, calm_points: calm } as unknown,
    });
    if (error) console.error(error);
  };

  /* Spawn bubbles periodically */
  useEffect(() => {
    if (spawningPaused) return;

    const interval = setInterval(() => {
      setBubbles((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 80,
          delay: Math.random() * 2,
        },
      ]);
    }, 2000);

    return () => clearInterval(interval);
  }, [spawningPaused]);

  /* Smash bubble */
  const smashBubble = (id: number) => {
    confetti({
      particleCount: 30,
      spread: 70,
      origin: { y: 0.6 },
      colors: ["#FF4500", "#FF6347", "#FFA07A"],
    });

    const newCount = bubblesSmashed + 1;
    let newCalm = calmPoints;

    if (newCount % 10 === 0) {
      setSpawningPaused(true);
      setShowBreathModal(true);
    }

    if (newCount % 5 === 0) {
      newCalm++;
    }

    saveScore(newCount, newCalm);
    setBubbles((prev) => prev.filter((b) => b.id !== id));
  };

  /* Handle breathing exercise */
  useEffect(() => {
    if (!showBreathModal) {
      if (breathInterval.current) {
        clearInterval(breathInterval.current);
        breathInterval.current = null;
      }
      setBreathCount(0);
      return;
    }

    breathInterval.current = setInterval(() => {
      setBreathCount((count) => {
        if (count >= 4) { // 5 breaths
          setShowBreathModal(false);
          setSpawningPaused(false);
          if (breathInterval.current) {
            clearInterval(breathInterval.current);
            breathInterval.current = null;
          }
          return 0;
        }
        return count + 1;
      });
    }, 4000);
  }, [showBreathModal]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-black flex flex-col items-center p-6 relative overflow-hidden text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-4">
        <Link to="/emotion-games">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-yellow-300">Bubble Smash & Breathe</h1>
        <div className="text-lg font-semibold text-yellow-300">
          Smashed: {bubblesSmashed} | Calm Points: {calmPoints}
        </div>
      </header>

      {/* Game area */}
      <div className="relative w-full h-[500px] overflow-hidden rounded-lg bg-red-800 shadow-inner">
        {bubbles.map((b) => (
          <motion.div
            key={b.id}
            initial={{ y: "-10vh" }}
            animate={{ y: "100%" }}
            transition={{ duration: 6, delay: b.delay, ease: "linear" }}
            onClick={() => smashBubble(b.id)}
            className="absolute w-12 h-12 rounded-full bg-red-600 cursor-pointer flex items-center justify-center shadow-lg"
            style={{ left: `${b.left}%` }}
          >
            💢
          </motion.div>
        ))}
      </div>

      {/* Breathing modal */}
      {showBreathModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50 p-4">
          <div className="bg-white rounded-lg p-8 w-full max-w-md text-center shadow-lg">
            <h2 className="text-xl font-bold mb-4 text-gray-900">Breathing Break</h2>
            <p className="mb-4 text-gray-700">Take a deep breath in... and out... Repeat 5 times</p>
            <p className="mb-6 font-semibold text-indigo-600 text-2xl">
              Breath count: {breathCount} / 5
            </p>
            <Button
              onClick={() => {
                setShowBreathModal(false);
                setSpawningPaused(false);
                if (breathInterval.current) clearInterval(breathInterval.current);
              }}
              className="bg-indigo-600 hover:bg-indigo-700 text-white"
            >
              Skip
            </Button>
          </div>
        </div>
      )}

      <p className="mt-6 text-red-300 text-center max-w-md">
        Smash the bubbles rhythmically to earn calm points. Every 5 bubbles gives a calm point. Take a break every 10 bubbles to breathe deeply and relax.
      </p>
    </div>
  );
}