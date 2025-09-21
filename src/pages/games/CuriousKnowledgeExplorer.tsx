import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

function getRandomPosition() {
  return {
    left: Math.floor(Math.random() * 95) + "%",
    top: Math.floor(Math.random() * 85) + "%",
  };
}

const factPool = [
  "Honey never spoils.",
  "Bananas are berries but strawberries aren't.",
  "Octopuses have three hearts.",
  "There are more stars in the universe than grains of sand on Earth.",
  "Sharks existed before trees.",
  "A day on Venus is longer than a year on Venus.",
  "Sloths can hold their breath longer than dolphins.",
  "The Eiffel Tower can be 15 cm taller during summer.",
  "Wombat poop is cube-shaped.",
  "Water can boil and freeze at the same time.",
];

export default function CuriousKnowledgeExplorer() {
  const [discovered, setDiscovered] = useState<string[]>([]);
  const [userId, setUserId] = useState<string>("");
  const [currentFact, setCurrentFact] = useState<string | null>(null);
  const [showBigStar, setShowBigStar] = useState(false);
  const [smallStars, setSmallStars] = useState<{ left: string; top: string }[]>([]);
  const navigate = useNavigate();

  /* Fetch current user */
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUserId(user?.id || "demo-user");
    };
    fetchUser();
  }, []);

  /* Load discovered facts */
  useEffect(() => {
    if (!userId) return;
    const loadData = async () => {
      const { data, error } = await supabase
        .from("emotion_games")
        .select("content")
        .eq("user_id", userId)
        .eq("emotion", "Curious")
        .single();
      if (!error && data?.content) {
        const content = data.content as { discovered?: string[] };
        setDiscovered(content.discovered ?? []);
      }
    };
    loadData();
  }, [userId]);

  /* Save discovered facts */
  const saveDiscovered = async (newDiscovered: string[]) => {
    setDiscovered(newDiscovered);
    const { error } = await supabase.from("emotion_games").upsert({
      user_id: userId,
      emotion: "Curious",
      content: { discovered: newDiscovered },
    });
    if (error) console.error(error);
  };

  /* Initialize random stars */
  useEffect(() => {
    if (smallStars.length === 0 && !showBigStar) {
      const stars = Array.from({ length: 10 }, () => getRandomPosition());
      setSmallStars(stars);
    }
  }, [smallStars.length, showBigStar]);

  /* Discover new fact when a star is clicked */
  const discoverFact = () => {
    if (showBigStar) return;
    const remainingFacts = factPool.filter((f) => !discovered.includes(f));
    if (!remainingFacts.length) return;

    const fact = remainingFacts[Math.floor(Math.random() * remainingFacts.length)];
    const newDiscovered = [...discovered, fact];
    saveDiscovered(newDiscovered);
    setCurrentFact(fact);

    const stars = Array.from({ length: 10 }, () => getRandomPosition());
    setSmallStars(stars);

    setTimeout(() => {
      setCurrentFact(null);
      setSmallStars([]);
      if (newDiscovered.length % 5 === 0) {
        setShowBigStar(true);
      } else {
        const newStars = Array.from({ length: 10 }, () => getRandomPosition());
        setSmallStars(newStars);
      }
    }, 7000);
  };

  const handleBigStarClick = () => {
    setShowBigStar(false);
    navigate("/emotion-games");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-indigo-950 to-black flex flex-col items-center p-6 relative overflow-hidden text-white">
      {/* Header */}
      <header className="w-full flex justify-between items-center mb-6">
        <Link to="/emotion-games">
          <Button variant="ghost" size="sm" className="text-white">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-yellow-300">Explore Knowledge</h1>
        <div></div> {/* Spacer */}
      </header>

      {/* Stars container */}
      <div className="flex flex-col items-center mt-8 relative w-full max-w-3xl h-[400px]">
        {smallStars.map((pos, i) => (
          <div
            key={i}
            onClick={discoverFact}
            className="absolute bg-yellow-200 text-black rounded-full p-2 shadow-lg text-sm cursor-pointer select-none"
            style={{
              left: pos.left,
              top: pos.top,
              transform: `rotate(${i * 15}deg)`,
              transition: "all 0.5s ease",
            }}
            title="Click to discover a fun fact"
          >
            ✨
          </div>
        ))}

        {currentFact && (
          <div className="absolute bg-yellow-100 text-black rounded-lg p-4 shadow-xl left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 max-w-xl text-center text-lg font-semibold pointer-events-none">
            {currentFact}
          </div>
        )}

        {showBigStar && (
          <div
            onClick={handleBigStarClick}
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer bg-yellow-400 text-black rounded-full p-10 shadow-2xl text-3xl font-bold flex flex-col items-center justify-center select-none"
            style={{ width: "250px", height: "250px" }}
          >
            <div className="mb-4">🌟</div>
            <div>Congratulations!</div>
            <div className="text-center text-sm font-normal mt-2 px-4">
              You've discovered 5 new fun facts!
            </div>
          </div>
        )}
      </div>

      {/* Instructions */}
      <p className="mt-8 text-center text-gray-300 max-w-md">
        Click on the stars to discover fun facts and enjoy exploring!
      </p>
    </div>
  );
}