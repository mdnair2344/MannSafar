import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";


interface Raindrop {
  id: number;
  left: number; // % position
  speed: number; // px per frame
  top: number; // current top in px
}

const DROP_LIMIT = 10; // max misses

export default function SadRaindropCatch() {
  const [raindrops, setRaindrops] = useState<Raindrop[]>([]);
  const [bucketX, setBucketX] = useState(50); // % of game width
  const [score, setScore] = useState(0);
  const [missed, setMissed] = useState(0);
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
        .eq("emotion", "Sad")
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
      emotion: "Sad",
      content: { score: newScore },
    });
    if (error) console.error(error);
  };

  /* Spawn raindrops */
  useEffect(() => {
    const interval = setInterval(() => {
      setRaindrops((prev) => [
        ...prev,
        {
          id: Date.now(),
          left: Math.random() * 90,
          speed: 2 + Math.random() * 3,
          top: 0,
        },
      ]);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  /* Move bucket with arrow keys */
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") setBucketX((prev) => Math.max(0, prev - 5));
      if (e.key === "ArrowRight") setBucketX((prev) => Math.min(90, prev + 5));
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  /* Raindrop animation loop */
  useEffect(() => {
    const frame = setInterval(() => {
      setRaindrops((prev) => {
        return prev
          .map((drop) => ({ ...drop, top: drop.top + drop.speed }))
          .filter((drop) => {
            const gameWidth = 500;
            const bucketWidth = 80;
            const bucketLeftPx = (bucketX / 100) * gameWidth - (bucketWidth / 2);
            const bucketRightPx = bucketLeftPx + bucketWidth;
            const dropLeftPx = (drop.left / 100) * gameWidth;

            if (
              drop.top >= 460 &&
              dropLeftPx >= bucketLeftPx &&
              dropLeftPx <= bucketRightPx
            ) {
              saveScore(score + 1);
              return false; // remove caught
            } else if (drop.top >= 500) {
              setMissed((m) => m + 1);
              return false; // remove missed
            }
            return true;
          });
      });
    }, 50);

    return () => clearInterval(frame);
  }, [bucketX, raindrops, score]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-blue-900 flex flex-col items-center p-6 relative overflow-hidden">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-4 text-white">
        <Link to="/emotion-games">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-blue-300">
          Catch the Raindrops
        </h1>
        <div className="text-lg font-semibold">Score: {score}</div>
      </header>

      {/* Game Area */}
      <div className="relative w-[500px] h-[500px] overflow-hidden bg-gradient-to-t from-blue-500 to-blue-200 rounded-lg shadow-inner">
        {raindrops.map((drop) => (
          <motion.div
            key={drop.id}
            initial={{ top: 0 }}
            animate={{ top: drop.top }}
            transition={{ duration: 0 }}
            className="absolute w-4 h-8 rounded-full bg-blue-600 shadow-lg"
            style={{ left: `${drop.left}%` }}
          />
        ))}

        {/* Bucket */}
        <div
          className="absolute bottom-4 w-20 h-10 bg-yellow-400 rounded-lg shadow-md"
          style={{ left: `${bucketX}%`, transform: "translateX(-50%)" }}
        />
      </div>

      {/* Instructions */}
      <p className="mt-6 text-blue-100 text-center max-w-md">
        Use the left and right arrow keys to move the bucket.  
        Don’t miss more than {DROP_LIMIT} raindrops!  
        Missed so far: {missed}
      </p>
    </div>
  );
}