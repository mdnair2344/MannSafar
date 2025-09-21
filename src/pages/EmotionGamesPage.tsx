import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Smile,
  CloudRain,
  Mountain,
  Zap,
  Paintbrush,
  Heart,
  Stars,
  ArrowLeft,
} from "lucide-react";

const emotionGames = {
  title: "🎮 Pick Your Mood Game",
  backToDashboard: "Back to Dashboard",
  games: {
    happy: {
      name: "Happy 🎈",
      description: "Pop balloons & celebrate your joy!",
      title: "Balloon Pop 🎈",
      instructions:
        "Tap balloons to pop them 🎉 Every pop adds to your score and is saved in your progress.",
      backButton: "Back",
    },
    sad: {
      name: "Sad ☔",
      description: "Catch raindrops and brighten the sky.",
      title: "Raindrop Catch ☔",
      instructions:
        "Move the bucket with ⬅️ ➡️ keys to catch the raindrops. Missed drops: {{missed}}/{{DROP_LIMIT}}. Catch them to lift your mood and increase your score 🌈.",
      backButton: "Back",
    },
    demotivated: {
      name: "Demotivated 🪜",
      description: "Climb steps and get little wins.",
      title: "Step Climber 🪜",
      instructions:
        "Press SPACE to climb each step. If timing is off, you may slip! Reach higher and see motivational messages appear.",
      motivationalMessages: [
        "Keep going!",
        "You are stronger than you think!",
        "Every step counts!",
        "Almost there!",
        "Believe in yourself!",
      ],
      backButton: "Back",
    },
    angry: {
      name: "Angry 💥",
      description: "Smash bubbles to release the fire.",
      title: "Bubble Smash & Breathe 💥",
      instructions:
        "Smash bubbles rhythmically and earn calm points. Every so often, take a break to breathe deeply and calm your mind.",
      backButton: "Back",
    },
    carefree: {
      name: "Carefree ☁️",
      description: "Paint the clouds, relax & flow.",
      title: "Cloud Painter ☁️🎨",
      instructions:
        "Drag and paint clouds across the sky. Colors change as you paint and there’s no limit – relax and enjoy! ☁️✨",
      backButton: "Back",
    },
    tensed: {
      name: "Tensed 🌸",
      description: "Follow the breathing circle & calm down.",
      title: "Breathing Circle 🌸",
      instructions:
        "Follow the circle’s rhythm. Inhale as it grows, exhale as it shrinks. Each full cycle calms your mind and adds to your progress ✨.",
      backButton: "Back",
    },
    curious: {
      name: "Curious ✨",
      description: "Explore stars & learn new facts.",
      title: "Knowledge Explorer ✨",
      instructions:
        "Click on any star to reveal interesting facts. Each discovery expands your knowledge and fills your starry sky! 🌌",
      facts: [
        "Bananas are berries 🍌",
        "Sharks existed before trees 🌊🌳",
        "Octopuses have three hearts 🐙",
        "Your stomach gets a new lining every 3–4 days 🫀",
        "Butterflies taste with their feet 🦋",
        "Sloths can hold their breath longer than dolphins 🦥",
        "A day on Venus is longer than a year on Venus 🌌",
        "Wombat poop is cube-shaped 🟦",
        "There are more stars in space than grains of sand on Earth ✨",
        "Koalas have fingerprints almost identical to humans 🐨",
        "Water can boil and freeze at the same time 🌡️",
        "Sea otters hold hands while they sleep 🦦",
        "Banana plants are herbs, not trees 🌱",
        "The heart of a blue whale is the size of a car 🚙",
        "Ants don’t have lungs 🐜",
        "The Eiffel Tower grows taller in summer ☀️",
        "A group of flamingos is called a flamboyance 🦩",
        "Your bones are stronger than steel 🦴",
        "Some turtles can breathe through their butts 🐢",
        "Cows have best friends and get stressed when separated 🐄",
      ],
      backButton: "Back",
    },
  },
};

const emotionsList = [
  {
    id: "happy",
    icon: <Smile className="w-8 h-8 text-yellow-400" />,
  },
  {
    id: "sad",
    icon: <CloudRain className="w-8 h-8 text-blue-400" />,
  },
  {
    id: "demotivated",
    icon: <Mountain className="w-8 h-8 text-green-400" />,
  },
  {
    id: "angry",
    icon: <Zap className="w-8 h-8 text-red-500" />,
  },
  {
    id: "carefree",
    icon: <Paintbrush className="w-8 h-8 text-pink-400" />,
  },
  {
    id: "tensed",
    icon: <Heart className="w-8 h-8 text-purple-400" />,
  },
  {
    id: "curious",
    icon: <Stars className="w-8 h-8 text-cyan-400" />,
  },
];

export default function EmotionGamesPage() {
  const navigate = useNavigate();

  return (
    <div className="bg-background text-foreground flex flex-col h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {emotionGames.backToDashboard}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 bg-gradient-to-b from-gray-900 via-black to-gray-950">
        <motion.h1
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl font-bold text-white mb-8 text-center"
        >
          {emotionGames.title}
        </motion.h1>

        {/* Emotion Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl w-full">
          {emotionsList.map((emotion, index) => (
            <motion.div
              key={emotion.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(`/game/${emotion.id}`)}
            >
              <Card className="cursor-pointer bg-gray-800 hover:bg-gray-700 text-white rounded-2xl shadow-xl">
                <CardHeader className="flex flex-row items-center space-x-3">
                  {emotion.icon}
                  <CardTitle className="text-xl">
                    {emotionGames.games[emotion.id].name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-sm opacity-80">
                  {emotionGames.games[emotion.id].description}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}