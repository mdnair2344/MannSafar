import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Gamepad2, Users, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ---------------- Story Builder interactive game ---------------- */
function StoryBuilderGame() {
  const [sentences, setSentences] = React.useState<string[]>([]);
  const [newSentence, setNewSentence] = React.useState('');

  const addSentence = () => {
    if (!newSentence.trim()) return;
    setSentences([...sentences, newSentence.trim()]);
    setNewSentence('');
  };

  const clearStory = () => {
    setSentences([]);
    setNewSentence('');
  };

  const fullStory = sentences.join(' ');

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add your sentence..."
          value={newSentence}
          onChange={(e) => setNewSentence(e.target.value)}
        />
        <Button onClick={addSentence}>Add</Button>
        <Button variant="secondary" onClick={clearStory}>
          Clear
        </Button>
      </div>

      {sentences.length > 0 && (
        <div className="mt-4 space-y-3">
          <div>
            <h3 className="font-semibold mb-1">Story so far (sentence by sentence):</h3>
            <div className="rounded-md border p-3 text-sm space-y-1">
              {sentences.map((line, i) => (
                <p key={i}>
                  <span className="font-bold">{i + 1}.</span> {line}
                </p>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-1">📖 Full Story:</h3>
            <div className="rounded-md border p-3 text-sm italic">{fullStory}</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- Idea Jar interactive game ---------------- */
function IdeaJarGame() {
  const [ideas, setIdeas] = useState<string[]>([]);
  const [newIdea, setNewIdea] = useState('');
  const [picked, setPicked] = useState<string | null>(null);

  const addIdea = () => {
    if (!newIdea.trim()) return;
    setIdeas([...ideas, newIdea.trim()]);
    setNewIdea('');
    setPicked(null);
  };

  const pickRandom = () => {
    if (ideas.length === 0) return;
    const random = ideas[Math.floor(Math.random() * ideas.length)];
    setPicked(random);
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Add a new activity idea..."
          value={newIdea}
          onChange={(e) => setNewIdea(e.target.value)}
        />
        <Button onClick={addIdea}>Add</Button>
      </div>
      <div>
        <Button variant="secondary" onClick={pickRandom} disabled={ideas.length === 0}>
          Pick Random Idea
        </Button>
      </div>
      {picked && <p className="mt-2 text-center text-lg font-semibold">🎉 Today’s activity: {picked}</p>}
      {ideas.length > 0 && (
        <ul className="list-disc pl-5 space-y-1 text-sm">
          {ideas.map((idea, i) => (
            <li key={i}>{idea}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ---------------- Emotion Charades interactive game ---------------- */
function EmotionCharadesGame() {
  const emotions = ['Happy', 'Sad', 'Angry', 'Excited', 'Surprised', 'Scared', 'Confused', 'Proud', 'Shy'];
  const [current, setCurrent] = React.useState<string | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [guess, setGuess] = React.useState('');
  const [feedback, setFeedback] = React.useState<string | null>(null);
  const [score, setScore] = React.useState(0);

  const startRound = () => {
    const e = emotions[Math.floor(Math.random() * emotions.length)];
    setCurrent(e);
    setRevealed(false);
    setGuess('');
    setFeedback(null);
  };

  const checkGuess = () => {
    if (!current) return;
    if (guess.trim().toLowerCase() === current.toLowerCase()) {
      setFeedback('✅ Correct!');
      setScore(score + 1);
    } else {
      setFeedback(`❌ Wrong. It was "${current}"`);
    }
    setRevealed(true);
  };

  return (
    <div className="space-y-4 text-center">
      {!current && <Button onClick={startRound}>🎬 Start Round</Button>}

      {current && !revealed && (
        <>
          <p className="font-semibold mb-1">🤫 Parent, act this emotion:</p>
          <p className="text-2xl font-bold">{current}</p>

          <div className="mt-4">
            <Input placeholder="Child's guess..." value={guess} onChange={(e) => setGuess(e.target.value)} />
            <Button className="mt-2" onClick={checkGuess}>
              Submit Guess
            </Button>
          </div>
        </>
      )}

      {revealed && (
        <>
          {feedback && <p className="text-lg font-semibold">{feedback}</p>}
          <Button className="mt-3" onClick={startRound}>
            Next Round
          </Button>
        </>
      )}

      <p className="text-sm text-muted-foreground">Score: {score}</p>
    </div>
  );
}

/* ---------------- Games page ---------------- */
export function GamesPage() {
  const games = [
    {
      icon: <Gamepad2 className="h-8 w-8 text-orange-400 mb-2" />,
      title: 'Story Builder',
      description: 'Take turns adding sentences to build a fun story together.',
      action: 'Build Story',
      component: <StoryBuilderGame />,
    },
    {
      icon: <Users className="h-8 w-8 text-orange-400 mb-2" />,
      title: 'Emotion Charades',
      description: 'Act out emotions and let your child guess them. Great for empathy building.',
      action: 'Play Game',
      component: <EmotionCharadesGame />,
    },
    {
      icon: <Lightbulb className="h-8 w-8 text-orange-400 mb-2" />,
      title: 'Idea Jar',
      description: 'Write activity ideas on slips, draw one and do it together!',
      action: 'Make a Jar',
      component: <IdeaJarGame />,
    },
  ];

  const [openGame, setOpenGame] = useState<any | null>(null);

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* --- Back Button --- */}
        <div className="flex items-center justify-between mb-6">
          <Link to="/family-resources">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Family Resources
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Family Games</h1>
        </div>

        <p className="text-muted-foreground mb-8">
          Fun, simple activities designed to strengthen the bond between parents and children.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {games.map((game, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition border flex flex-col items-center text-center p-4"
            >
              <CardHeader className="flex flex-col items-center">
                {game.icon}
                <CardTitle>{game.title}</CardTitle>
                <CardDescription>{game.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => setOpenGame(game)}>{game.action}</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Dialog open={!!openGame} onOpenChange={() => setOpenGame(null)}>
        <DialogContent className="max-w-lg">
          {openGame && (
            <>
              <DialogHeader>
                <DialogTitle>{openGame.title}</DialogTitle>
                <DialogDescription>{openGame.description}</DialogDescription>
              </DialogHeader>

              {openGame.component ? (
                <div className="mt-4">{openGame.component}</div>
              ) : (
                <ul className="list-disc pl-5 mt-4 space-y-1 text-sm">
                  {openGame.steps?.map((s: string, i: number) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}