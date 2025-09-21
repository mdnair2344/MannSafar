import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import confetti from "canvas-confetti";
import { supabase } from "@/integrations/supabase/client";

interface Balloon {
  id: number;
  left: number;
  delay: number;
  color: string;
  duration: number;
}

const colors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#FF7B9C"];

const happyGameTexts = {
  backButton: "Back",
  title: "Balloon Pop 🎈",
  instructions:
    "Tap balloons to pop them 🎉 Every pop adds to your score and is saved in your progress.",
};

export default function HappyBalloonPop() {
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [score, setScore] = useState(0);
  const [userId, setUserId] = useState<string>("");

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

  /* Load previous score */
  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      const { data, error } = await supabase
        .from("emotion_games")
        .select("content")
        .eq("user_id", userId)
        .eq("emotion", "Happy")
        .single();

      if (!error && data?.content) {
        const content = data.content as { score?: number };
        setScore(content.score ?? 0);
      }
    };
    loadData();
  }, [userId]);

  /* Save score */
  const saveScore = async (newScore: number) => {
    setScore(newScore);
    const { error } = await supabase.from("emotion_games").upsert({
      user_id: userId,
      emotion: "Happy",
      content: { score: newScore },
    });
    if (error) console.error(error);
  };

  /* Spawn balloons */
  useEffect(() => {
    const interval = setInterval(() => {
      setBalloons((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 80,
          delay: Math.random() * 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          duration: 4 + Math.random() * 3,
        },
      ]);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  /* Pop balloon */
  const popBalloon = (id: number) => {
    confetti({
      particleCount: 40,
      spread: 70,
      origin: { y: 0.6 },
    });
    const newScore = score + 1;
    saveScore(newScore);
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  /* Remove balloon after animation completes */
  const handleAnimationComplete = (id: number) => {
    setBalloons((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-black flex flex-col items-center p-6 relative overflow-hidden text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-4">
        <Link to="/emotion-games">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {happyGameTexts.backButton}
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-yellow-300">
          {happyGameTexts.title}
        </h1>
        <div className="text-lg font-semibold">{score}</div>
      </header>

      {/* Balloons floating */}
      <div className="relative w-full h-[500px] overflow-hidden bg-transparent rounded-lg shadow-inner">
        {balloons.map((balloon) => (
          <motion.div
            key={balloon.id}
            initial={{ y: "100vh" }}
            animate={{ y: "-10vh" }}
            transition={{
              duration: balloon.duration,
              delay: balloon.delay,
              ease: "linear",
            }}
            onClick={() => popBalloon(balloon.id)}
            onAnimationComplete={() => handleAnimationComplete(balloon.id)}
            className="absolute w-12 h-16 rounded-full shadow-lg cursor-pointer flex items-center justify-center"
            style={{ left: `${balloon.left}%`, backgroundColor: balloon.color }}
          >
            <span className="text-white text-sm">🎈</span>
          </motion.div>
        ))}
      </div>

      {/* Instructions */}
      <p className="mt-6 text-gray-300 text-center max-w-md">
        {happyGameTexts.instructions}
      </p>
    </div>
  );
}