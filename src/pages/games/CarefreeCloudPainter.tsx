import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

interface Cloud {
  x: number;
  y: number;
  color: string;
  size: number;
}

const colors = ["#FFB6C1", "#ADD8E6", "#FFD700", "#90EE90", "#FFA07A"];

export default function CloudPainter() {
  const [clouds, setClouds] = useState<Cloud[]>([]);
  const [userId, setUserId] = useState<string>("");
  const canvasRef = useRef<HTMLDivElement>(null);

  /* Fetch current user */
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || "demo-user");
    };
    fetchUser();
  }, []);

  /* Load previous clouds */
  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      const { data, error } = await supabase
        .from("emotion_games")
        .select("content")
        .eq("user_id", userId)
        .eq("emotion", "Carefree")
        .single();

      if (!error && data?.content) {
        const content = data.content as { clouds_painted?: Cloud[] };
        setClouds(content.clouds_painted ?? []);
      }
    };
    loadData();
  }, [userId]);

  /* Save clouds */
  const saveClouds = async (newClouds: Cloud[]) => {
    setClouds(newClouds);
    const { error } = await supabase.from("emotion_games").upsert({
      user_id: userId,
      emotion: "Carefree",
      content: { clouds_painted: newClouds },
    });

    if (error) console.error(error);
  };

  /* Handle painting clouds */
  const handlePaint = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const newCloud: Cloud = {
      x,
      y,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: 30 + Math.random() * 40,
    };
    saveClouds([...clouds, newCloud]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-black to-gray-950 flex flex-col items-center p-6">
      {/* Header */}
      <header className="w-full grid grid-cols-3 items-center mb-4">
        <div className="justify-self-start">
          <Link to="/emotion-games">
            <Button variant="ghost" size="sm" className="text-white">
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold text-pink-300 text-center">
          Paint Your Clouds
        </h1>
        
        <div></div>
      </header>

      {/* Painting canvas */}
      <div
        ref={canvasRef}
        onMouseDown={handlePaint}
        className="w-full max-w-lg h-[400px] bg-blue-50 rounded-lg shadow-inner relative cursor-crosshair overflow-hidden"
      >
        {clouds.map((cloud, i) => (
          <div
            key={i}
            className="absolute rounded-full shadow-lg opacity-80"
            style={{
              left: cloud.x - cloud.size / 2,
              top: cloud.y - cloud.size / 2,
              width: cloud.size,
              height: cloud.size,
              backgroundColor: cloud.color,
            }}
          />
        ))}
      </div>

      {/* Instructions */}
      <p className="mt-6 text-gray-300 text-center max-w-md">
        Click on the canvas to paint colorful clouds. Enjoy your carefree moment!
      </p>
    </div>
  );
}