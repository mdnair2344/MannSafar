import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import {
  ArrowLeft,
  BookOpen,
  Save,
  Plus,
  Laugh,
  Angry,
  Droplet,
  Cloud,
  Lightbulb,
  Zap,
  HandCoins,
  HeartHandshake // new icon for “supportive / parenting” feel
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/components/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

// mood options reused
const moodOptions = [
  { value: 'Grateful', name: 'Grateful', icon: <HeartHandshake className="h-4 w-4" /> },
  { value: 'Happy', name: 'Happy', icon: <Laugh className="h-4 w-4" /> },
  { value: 'Tired', name: 'Tired', icon: <Droplet className="h-4 w-4" /> },
  { value: 'Stressed', name: 'Stressed', icon: <Zap className="h-4 w-4" /> },
  { value: 'Worried', name: 'Worried', icon: <Cloud className="h-4 w-4" /> },
  { value: 'Demotivated', name: 'Demotivated', icon: <HandCoins className="h-4 w-4" /> },
  { value: 'Frustrated', name: 'Frustrated', icon: <Angry className="h-4 w-4" /> },
  { value: 'Curious', name: 'Curious', icon: <Lightbulb className="h-4 w-4" /> },
];

export function ParentsJournal() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [moodRating, setMoodRating] = useState('Grateful');
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchEntries();
    }
  }, [user]);

  const fetchEntries = async () => {
    try {
      const { data, error } = await supabase
        .from('parents_journal_entries') // separate table for parents
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEntries(data || []);
    } catch (error) {
      console.error('Error fetching entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load journal entries',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('parents_journal_entries')
        .insert({
          user_id: user.id,
          title: title.trim(),
          content: content.trim(),
          mood_rating: moodRating
        });

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Your parenting journal entry has been saved'
      });

      setTitle('');
      setContent('');
      setMoodRating('Grateful');
      fetchEntries();
    } catch (error) {
      console.error('Error saving entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save journal entry',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/family-resources">
  <Button variant="ghost" size="sm">
    <ArrowLeft className="h-4 w-4 mr-2" />
    Back
  </Button>
</Link>

            <h1 className="text-2xl font-bold text-primary">Parents’ Journal</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          {/* Journal Entries List */}
          <div className="lg:col-span-1">
            <div className="text-center mb-6">
              <BookOpen className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold">Your Parenting Entries</h2>
            </div>

            <Button className="w-full mb-4">
              <Plus className="h-4 w-4 mr-2" />
              New Entry
            </Button>

            <div className="space-y-3">
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : entries.length > 0 ? (
                entries.map((entry) => (
                  <Card key={entry.id} className="cursor-pointer hover:bg-accent/10 transition-colors">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-1">{entry.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        {new Date(entry.created_at).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-foreground/80">
                        {entry.content.substring(0, 100)}...
                      </p>
                      {entry.mood_rating && (
                        <div className="mt-2 flex items-center gap-2">
                          {moodOptions.find(mood => mood.value === entry.mood_rating)?.icon}
                          <span className="text-xs text-muted-foreground">
                            Mood: {entry.mood_rating}
                          </span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No parenting journal entries yet. Start writing your first entry!
                </p>
              )}
            </div>
          </div>

          {/* Journal Editor */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
              <CardHeader>
                <CardTitle>Write About Your Parenting Journey</CardTitle>
                <CardDescription>
                  Reflect on your experiences, thoughts, and feelings as a parent
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Entry title (e.g., 'A day with my child')..."
                  className="text-lg"
                />
                <div className="space-y-2">
                  <Label>Current Mood</Label>
                  <Select value={moodRating} onValueChange={setMoodRating}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select your mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moodOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          <div className="flex items-center gap-2">
                            {option.icon}
                            <span>{option.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="How was your day as a parent? What are your thoughts, worries, or wins?"
                  className="min-h-[300px] resize-none"
                />
                <div className="flex justify-between">
                  <p className="text-sm text-muted-foreground">
                    {content.length} characters
                  </p>
                  <Button onClick={handleSave} disabled={saving || !title.trim() || !content.trim()}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Entry'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}