
'use client';
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PageHeader from '@/components/page-header';
import { Medal, Droplet, Flower2, Award, Dumbbell, Share2 } from 'lucide-react';
import ClientOnly from '@/components/client-only';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

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
    const [workoutCompletions, setWorkoutCompletions] = useState(0);
    const { toast } = useToast();

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
                setWorkoutCompletions(parsedStats.workoutCompletions || 0);
            }
        } catch (error) {
            console.error("Failed to load user data from localStorage", error);
        }
    }, []);

    const meditationMedal = getMedalForCompletions(meditationCompletions);
    const hydrationMedal = getMedalForStreak(hydrationStreak);
    const workoutMedal = getMedalForCompletions(workoutCompletions);

    const handleShare = (title: string, text: string) => {
        if (navigator.share) {
            navigator.share({
                title,
                text,
                url: window.location.href,
            })
            .catch((error) => {
                 if (error.name !== 'AbortError') {
                    console.error("Error sharing:", error);
                    toast({
                        variant: "destructive",
                        title: "Sharing Failed",
                        description: "Something went wrong while trying to share."
                    });
                }
            });
        } else {
            toast({
                variant: "destructive",
                title: "Sharing Not Supported",
                description: "Your browser does not support the Web Share API."
            });
        }
    };

  return (
    <ClientOnly>
        <div className="flex flex-col gap-8">
        <PageHeader
            title={`Welcome, ${userName}!`}
            subtitle="Here is a summary of your achievements and journey so far."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 font-headline text-2xl'>
                        <Flower2 className='w-6 h-6 text-primary' />
                        Meditation Mastery
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 text-center flex-1">
                    <Medal className={`w-24 h-24 ${meditationMedal.color}`} />
                    <p className='text-2xl font-bold'>{meditationMedal.name}</p>
                    <p className='text-muted-foreground'>
                        {meditationCompletions} sessions completed
                    </p>
                </CardContent>
                <CardFooter className='justify-center'>
                    <Button 
                        variant="outline"
                        disabled={meditationMedal.level === 0}
                        onClick={() => handleShare(
                            'My Meditation Achievement!',
                            `I've unlocked the ${meditationMedal.name} medal for Meditation Mastery in LifeBoost with ${meditationCompletions} sessions completed!`
                        )}
                    >
                        <Share2 className='mr-2' />
                        Share
                    </Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 font-headline text-2xl'>
                        <Droplet className='w-6 h-6 text-primary' />
                        Hydration Hero
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 text-center flex-1">
                    <Medal className={`w-24 h-24 ${hydrationMedal.color}`} />
                    <p className='text-2xl font-bold'>{hydrationMedal.name}</p>
                     <p className='text-muted-foreground'>
                        {hydrationStreak} day streak
                    </p>
                </CardContent>
                <CardFooter className='justify-center'>
                    <Button 
                        variant="outline"
                        disabled={hydrationMedal.level === 0}
                        onClick={() => handleShare(
                            'My Hydration Achievement!',
                            `I've earned the ${hydrationMedal.name} medal for being a Hydration Hero in LifeBoost with a ${hydrationStreak}-day streak!`
                        )}
                    >
                        <Share2 className='mr-2' />
                        Share
                    </Button>
                </CardFooter>
            </Card>
            <Card className="flex flex-col">
                <CardHeader>
                    <CardTitle className='flex items-center gap-2 font-headline text-2xl'>
                        <Dumbbell className='w-6 h-6 text-primary' />
                        Workout Warrior
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center gap-4 text-center flex-1">
                    <Medal className={`w-24 h-24 ${workoutMedal.color}`} />
                    <p className='text-2xl font-bold'>{workoutMedal.name}</p>
                     <p className='text-muted-foreground'>
                        {workoutCompletions} workouts completed
                    </p>
                </CardContent>
                <CardFooter className='justify-center'>
                     <Button 
                        variant="outline"
                        disabled={workoutMedal.level === 0}
                        onClick={() => handleShare(
                            'My Workout Achievement!',
                            `I'm a Workout Warrior in LifeBoost! I've crushed ${workoutCompletions} workouts and earned the ${workoutMedal.name} medal.`
                        )}
                    >
                        <Share2 className='mr-2' />
                        Share
                    </Button>
                </CardFooter>
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
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                            <span><span className="font-bold">{medal.name}:</span> Reach goal for {medal.level} day{medal.level > 1 ? 's' : ''} in a row</span>
                        </li>
                       ))}
                    </ul>
                </div>
                <div>
                    <h3 className="font-semibold text-lg flex items-center gap-2 mb-2">
                        <Dumbbell className="w-5 h-5"/>
                        Workout Warrior
                    </h3>
                    <ul className="space-y-2 text-muted-foreground">
                       {medalGuide.map(medal => (
                         <li key={`workout-${medal.level}`} className="flex items-center gap-2">
                            <Medal className={`w-5 h-5 ${medal.color}`} />
                            <span><span className="font-bold">{medal.name}:</span> Complete {medal.level} workout{medal.level > 1 ? 's' : ''}</span>
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
