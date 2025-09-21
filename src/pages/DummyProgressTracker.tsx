import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BarChart3, TrendingUp, Calendar, Target, TrendingDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip as ChartTooltip,
    Legend as ChartLegend,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
} from 'chart.js';

ChartJS.register(
    ArcElement, ChartTooltip, ChartLegend, CategoryScale, LinearScale, PointElement, LineElement
);

const emotionColors: { [key: string]: string } = {
    'Happy': '#fb7185',
    'Lonely': '#60a5fa',
    'Angry': '#fbbf24',
    'Carefree': '#4ade80',
    'Demotivated': '#a78bfa',
    'Tensed': '#f472b6',
    'Curious': '#6366f1',
};

export function DummyProgressTracker() {
    const [stats, setStats] = useState({
        averageMood: 4,
        streakDays: 5,
        journalEntries: 12,
        aiConversations: 8,
        assessments: 10,
        moodEntries: 10
    });

    const [moodData, setMoodData] = useState({
        labels: ['9 AM', '12 PM', '3 PM', '6 PM'],
        datasets: [{
            label: "Today's Mood Score",
            data: [5, 4, 3, 4],
            borderColor: "#1E63F6",
            backgroundColor: ['#fb7185','#4ade80','#fbbf24','#60a5fa'],
            pointBackgroundColor: ['#fb7185','#4ade80','#fbbf24','#60a5fa'],
            pointBorderColor: "#fff",
            pointRadius: 5,
            pointHoverRadius: 7,
            tension: 0.3,
            fill: false,
        }],
    });

    const [weeklyMoodData, setWeeklyMoodData] = useState({
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: [{
            label: "Most Selected Mood",
            data: [5, 4, 4, 3, 5, 4, 3],
            borderColor: "#4ade80",
            pointBackgroundColor: ['#fb7185','#4ade80','#fbbf24','#60a5fa','#a78bfa','#f472b6','#6366f1'],
            pointBorderColor: "#fff",
            pointRadius: 6,
            pointHoverRadius: 8,
            tension: 0.3,
            fill: false,
        }],
    });

    const [mostSelectedMoods, setMostSelectedMoods] = useState([
        { date: 'Mon', mood: 'Happy', color: '#fb7185' },
        { date: 'Tue', mood: 'Carefree', color: '#4ade80' },
        { date: 'Wed', mood: 'Curious', color: '#6366f1' },
        { date: 'Thu', mood: 'Tensed', color: '#f472b6' },
        { date: 'Fri', mood: 'Happy', color: '#fb7185' },
        { date: 'Sat', mood: 'Lonely', color: '#60a5fa' },
        { date: 'Sun', mood: 'Angry', color: '#fbbf24' },
    ]);

    const [reasonsData, setReasonsData] = useState({
        labels: ['Work', 'Family', 'Friends', 'Health', 'Hobby'],
        datasets: [{
            data: [3, 5, 2, 4, 6],
            backgroundColor: ['#fb7185','#4ade80','#fbbf24','#60a5fa','#a78bfa'],
            borderColor: "#1f2937",
            borderWidth: 1,
        }],
    });

    const [moodHeatmap, setMoodHeatmap] = useState([
        { day: 1, color: '#fb7185' }, { day: 2, color: '#4ade80' }, { day: 3, color: '#fbbf24' },
        { day: 4, color: '#60a5fa' }, { day: 5, color: '#a78bfa' }, { day: 6, color: '#f472b6' },
        { day: 7, color: '#6366f1' }
    ]);

    const [moodSwingDetected, setMoodSwingDetected] = useState(true);

    return (
        <div className="min-h-screen bg-background text-foreground">
            <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
                <div className="container mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link to="/">
                            <Button variant="ghost" size="sm">
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Dashboard
                            </Button>
                        </Link>
                        <h1 className="text-2xl font-bold text-primary">Progress Tracker</h1>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <BarChart3 className="h-16 w-16 text-accent mx-auto mb-6" />
                        <h1 className="text-4xl font-bold mb-4">Progress Tracker</h1>
                        <p className="text-xl text-muted-foreground">
                            Monitor your wellness journey with detailed analytics and insights.
                        </p>
                    </div>

                    {/* Mood Swing Alert
                    {moodSwingDetected && (
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 text-white shadow-xl mb-8">
                            <CardHeader>
                                <CardTitle className="flex items-center text-primary">
                                    <TrendingDown className="h-6 w-6 mr-2" />
                                    Sudden Mood Swing Detected
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="mb-4">Your recent mood entries show a significant change.</p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <Button className="w-full">Schedule with a Psychiatrist</Button>
                                    <Button className="w-full">Call Therapist</Button>
                                    <Button className="w-full">Play Emotion Games</Button>
                                </div>
                            </CardContent>
                        </Card>
                    )} */}

                    {/* Stats */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <TrendingUp className="h-5 w-5 mr-2 text-primary" />
                                    Mood Entries
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">{stats.moodEntries}</div>
                                <p className="text-sm text-muted-foreground">Total assessments</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="h-5 w-5 mr-2 text-accent" />
                                    Streak
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-accent">{stats.streakDays} days</div>
                                <p className="text-sm text-muted-foreground">Daily check-ins</p>
                            </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Target className="h-5 w-5 mr-2 text-primary" />
                                    Goals Met
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-3xl font-bold text-primary">85%</div>
                                <p className="text-sm text-muted-foreground">This month</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts */}
                    <div className="grid lg:grid-cols-2 gap-8 mt-8">
                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle>Daily Mood Trend</CardTitle>
                                <CardDescription>Your mood ratings for all entries</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Line data={moodData} />
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
                            <CardHeader>
                                <CardTitle>Weekly Most Selected Mood Trend</CardTitle>
                                <CardDescription>Most frequent mood for each of the last 7 days</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Line data={weeklyMoodData} />
                                <div className="mt-6 grid grid-cols-7 gap-2 text-center">
                                    {mostSelectedMoods.map((item, index) => (
                                        <div key={index} className="flex flex-col items-center">
                                            <div className="w-6 h-6 rounded-full mb-1" style={{ backgroundColor: item.color }} />
                                            <span className="text-xs">{item.mood}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Reasons Breakdown</CardTitle>
                                <CardDescription>Why you've felt a certain way recently.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <Pie data={reasonsData} options={{ responsive: true, maintainAspectRatio: false, cutout: '50%' }} />
                            </CardContent>
                        </Card>

                        <Card className="bg-card/50 backdrop-blur-sm border-primary/20 lg:col-span-2">
                            <CardHeader>
                                <CardTitle>Monthly Mood Heatmap</CardTitle>
                                <CardDescription>Your primary emotion for each day.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="max-w-[500px] mx-auto grid grid-cols-7 gap-1 text-center">
                                    {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(day => (
                                        <div key={day} className="text-sm font-semibold text-muted-foreground">{day}</div>
                                    ))}
                                    {moodHeatmap.map((item, index) => (
                                        <div
                                            key={index}
                                            className="w-12 h-12 rounded-md flex items-center justify-center text-xs font-bold transition-transform duration-200 hover:scale-105"
                                            style={{ backgroundColor: item.color }}
                                        >
                                            {item.day}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
