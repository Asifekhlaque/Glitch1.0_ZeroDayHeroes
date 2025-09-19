
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Flame } from 'lucide-react';
import Image from 'next/image';

const challenges = [
  {
    id: 'burpees',
    name: '3-Minute Burpee Challenge',
    description: 'See how many burpees you can do in 3 minutes. Focus on maintaining good form.',
  },
  {
    id: 'mountain-climbers',
    name: 'Mountain Climber Tabata',
    description: 'Alternate between 20 seconds of intense mountain climbers and 10 seconds of rest for 4 minutes (8 rounds).',
  },
];

export default function BonusChallenges() {
  const getImageForChallenge = (id: string) => {
    return PlaceHolderImages.find((img) => img.id === id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-2xl">
          <Flame className="w-6 h-6 text-primary" />
          Bonus Challenges
        </CardTitle>
        <CardDescription>
          Feeling motivated? Add one of these high-intensity challenges to your workout.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {challenges.map((challenge) => {
          const image = getImageForChallenge(challenge.id);
          return (
            <Card key={challenge.id}>
              {image && (
                <Image
                  src={image.imageUrl}
                  alt={image.description}
                  width={600}
                  height={400}
                  className="rounded-t-lg object-cover aspect-[3/2]"
                  data-ai-hint={image.imageHint}
                />
              )}
              <CardHeader>
                <CardTitle>{challenge.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{challenge.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </CardContent>
    </Card>
  );
}
