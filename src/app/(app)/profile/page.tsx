
'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PageHeader from '@/components/page-header';
import { Medal, Droplet, Flower2, Award } from 'lucide-react';
import ClientOnly from '@/components/client-only';

const medalTiers = {
  0: { name: 'No Medal', color: 'text-gray-400', level: 0 },
  1: { name: 'Bronze', color: 'text-yellow-600', level: 1 },
  2: { name: 'Silver', color: 'text-gray-400', level: 2 },
  3: { name: 'Gold', color: 'text-yellow-400', level: 3 },
  4: { name: 'Diamond', color: 'text-blue-400', level: 4 },
  5: { name: 'Expert', color: 'text-purple-500', level: 5 },
};

const getMedalForCompletions = (completions: number) => {
  if (completions >= 5) return medalTiers[5];
  if (completions >= 4) return medalTiers[4];
  if (completions >= 3) return medalTiers[3];
  if (completions >= 2) return medalTiers[2];
  if (completions >= 1) return medalTiers[1];
  return medalTiers[0];
};

const getMedalForStreak = (streak: number) => {
    if (streak >= 5) return medalTiers[5];
    if (streak >= 4) return medalTiers[4];
    if (streak >= 3) return medalTiers[3];
    if (streak >= 2) return medalTiers[2];
    if (streak >= 1) return medalTiers[1];
    return medalTiers[0];
}

const medalGuide = [
    { level: 1, name: 'Bronze', color: 'text-yellow-600' },
    { level: 2, name: 'Silver', color: 'text-gray-400' },
    { level: 3, name: 'Gold', color: 'text-yellow-400' },
    { level: 4, name: 'Diamond', color: 'text-blue-400' },
    { level: 5, name: 'Expert', color: 'text-purple-500' },
];

export default function ProfilePage() {
    const [userName, setUserName] = useState('User');
    const [meditationCompletions, setMeditationCompletions] = useState(0);
    const [hydrationStreak, setHydrationStreak] = useState(0);

    useEffect(() => {
        try {
            const name = localStorage.getItem('userName');
            if (name) {
                setUserName(name);
            }
            const stats = localStorage.getItem('userStats');
            if (stats) {
                const parsedStats = JSON.parse(stats);
                setMeditationCompletions(parsedStats.meditationCompletions || 0);
                setHydrationStreak(parsedStats.hydrationStreak || 0);
            }
        } catch (error) {
            console.error("Failed to load user data from localStorage", error);
        }
    }, []);

    const meditationMedal = getMedalForCompletions(meditationCompletions);
    const hydrationMedal = getMedalForStreak(hydrationStreak);

  return (
    <ClientOnly>
        <div className="flex flex-col gap-8">
        <PageHeader
            title={`Welcome, ${userName}!`}
            subtitle="Here is a summary of your achievements and journey so far."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 font-headline text-2xl'>
                        <Flower2 className='w-6 h-6 text-primary' />
                        Meditation Mastery
                    </CardTitle>
                    <CardDescription>
                        You get a new medal for each session you complete.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Medal className={`w-24 h-24 ${meditationMedal.color}`} />
                    <p className='text-2xl font-bold'>{meditationMedal.name}</p>
                    <p className='text-muted-foreground'>
                        {meditationCompletions} sessions completed
                    </p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 font-headline text-2xl'>
                        <Droplet className='w-6 h-6 text-primary' />
                        Hydration Hero
                    </CardTitle>
                    <CardDescription>
                        Medals are awarded for meeting your goal on consecutive days.
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4">
                    <Medal className={`w-24 h-24 ${hydrationMedal.color}`} />
                    <p className='text-2xl font-bold'>{hydrationMedal.name}</p>
                     <p className='text-muted-foreground'>
                        {hydrationStreak} day streak
                    </p>
                </CardContent>
            </Card>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className='flex items-center gap-2 font-headline text-2xl'>
                    <Award className='w-6 h-6 text-primary' />
                    Medal Guidelines
                </CardTitle>
                <CardDescription>
                    Here's how you can earn medals and level up your wellness journey.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Flower2 className="w-5 h-5"/>
                        Meditation Mastery
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                       {medalGuide.map(medal => (
                         <li key={`meditation-${medal.level}`} className="flex items-center gap-2">
                            <Medal className={`w-5 h-5 ${medal.color}`} />
                            <span><span className="font-bold">{medal.name}:</span> Complete {medal.level} session{medal.level > 1 ? 's' : ''}</span>
                        </li>
                       ))}
                    </ul>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Droplet className="w-5 h-5"/>
                        Hydration Hero
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                        {medalGuide.map(medal => (
                         <li key={`hydration-${medal.level}`} className="flex items-center gap-2">
                            <Medal className={`w-5 h-5 ${medal.color}`} />
                            <span><span className="font-bold">{medal.name}:</span> Reach your goal for {medal.level} day{medal.level > 1 ? 's' : ''} in a row</span>
                        </li>
                       ))}
                    </ul>
                </div>
            </CardContent>
        </Card>

        </div>
    </ClientOnly>
  );
}
