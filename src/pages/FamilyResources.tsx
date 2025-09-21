import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent
} from '@/components/ui/card';
import { BookOpen, Gamepad2, Notebook, Lightbulb, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '@/components/ui/dialog';

export function FamilyResources() {
  // state inside the dialog: which emotion selected
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);

  // your hacks data
  const hacks: Record<string, string> = {
    Happy: 'Celebrate their joy, ask what made them happy and encourage similar activities.',
    Tensed: 'Guide them in deep breathing or do a calming activity like drawing or walking.',
    Lonely: 'Arrange a playdate, talk about their feelings, and reassure them you’re there.',
    Demotivated: 'Break tasks into small wins, praise efforts, share inspiring stories.',
    Curious: 'Give them a small experiment, reading or project to satisfy curiosity safely.',
    Carefree: 'Encourage positive exploration but gently explain boundaries.',
    Angry: 'Stay calm, give them space, teach naming emotions and deep breathing.'
  };

  const emotions = Object.keys(hacks); // ["Happy", "Tensed", ...]

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <Link to="/">
          <Button variant="outline" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card className="bg-card/30 backdrop-blur-sm border-2 border-primary/20 rounded-2xl shadow-md">
          <CardHeader className="bg-gradient-to-r from-orange-400/10 to-pink-400/10 rounded-t-2xl">
            <div className="flex items-start md:items-center space-x-4">
              <div className="p-4 rounded-xl bg-orange-400/10">
                <BookOpen className="h-7 w-7 text-orange-400" />
              </div>
              <div>
                <CardTitle className="text-3xl font-extrabold tracking-tight">
                  Family Resources
                </CardTitle>
                <CardDescription className="text-lg text-muted-foreground">
                  Support, tips & tools for your child’s growth 🌱
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                {/* Parents Journal */}
                <Link to="/parents-journal" className="block">
                  <Card className="hover:shadow-lg transition border cursor-pointer">
                    <CardHeader className="flex flex-col items-center text-center">
                      <Notebook className="h-8 w-8 mb-2 text-orange-400" />
                      <CardTitle>Parents’ Journal</CardTitle>
                      <CardDescription>
                        Track your parenting journey
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                {/* Games */}
                <Link to="/games" className="block">
                  <Card className="hover:shadow-lg transition border cursor-pointer">
                    <CardHeader className="flex flex-col items-center text-center">
                      <Gamepad2 className="h-8 w-8 mb-2 text-orange-400" />
                      <CardTitle>Games</CardTitle>
                      <CardDescription>
                        Fun activities for families
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </Link>

                {/* Parenting Hacks with two-step dialog */}
                <Dialog
                  onOpenChange={() => {
                    // reset selection when closing
                    setSelectedEmotion(null);
                  }}
                >
                  <DialogTrigger asChild>
                    <Card className="hover:shadow-lg transition border cursor-pointer">
                      <CardHeader className="flex flex-col items-center text-center">
                        <Lightbulb className="h-8 w-8 mb-2 text-orange-400" />
                        <CardTitle>Parenting Hacks</CardTitle>
                        <CardDescription>Quick tips for emotions</CardDescription>
                      </CardHeader>
                    </Card>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>Parenting Hacks</DialogTitle>
                      <DialogDescription>
                        {selectedEmotion
                          ? `Tips for ${selectedEmotion}`
                          : 'Choose an emotion to see hacks'}
                      </DialogDescription>
                    </DialogHeader>

                    {!selectedEmotion ? (
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        {emotions.map((emotion) => (
                          <Button
                            key={emotion}
                            variant="secondary"
                            onClick={() => setSelectedEmotion(emotion)}
                          >
                            {emotion}
                          </Button>
                        ))}
                      </div>
                    ) : (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm text-muted-foreground">
                          {hacks[selectedEmotion]}
                        </p>
                        <Button
                          variant="outline"
                          onClick={() => setSelectedEmotion(null)}
                          className="mt-3"
                        >
                          ← Choose another emotion
                        </Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}