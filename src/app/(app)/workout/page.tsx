import PageHeader from "@/components/page-header";
import WorkoutForm from "@/components/workout-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import { Dumbbell } from "lucide-react";

const commonExercises = [
    {
      name: "Push-ups",
      sets: "3 sets",
      reps: "10-15 reps",
      image: PlaceHolderImages.find(p => p.id === 'pushups'),
    },
    {
      name: "Squats",
      sets: "3 sets",
      reps: "12-15 reps",
      image: PlaceHolderImages.find(p => p.id === 'squats'),
    },
    {
      name: "Plank",
      sets: "3 sets",
      reps: "30-60 seconds",
      image: PlaceHolderImages.find(p => p.id === 'plank'),
    },
    {
      name: "Jumping Jacks",
      sets: "3 sets",
      reps: "30-60 seconds",
      image: PlaceHolderImages.find(p => p.id === 'jumping-jacks'),
    },
    {
      name: "Lunges",
      sets: "3 sets",
      reps: "10-12 reps per leg",
      image: PlaceHolderImages.find(p => p.id === 'lunges'),
    },
    {
        name: "Bicep Curls",
        sets: "3 sets",
        reps: "10-12 reps per arm",
        image: PlaceHolderImages.find(p => p.id === 'bicep-curls'),
    }
];

export default function WorkoutPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Workout Planner"
        subtitle="Fill in your fitness details to generate a custom workout plan using AI."
      />
      <WorkoutForm />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Dumbbell className="w-6 h-6 text-primary" />
            Common Fitness Exercises
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {commonExercises.map((exercise) => (
            exercise.image && (
              <Card key={exercise.name} className="overflow-hidden">
                <div className="relative w-full h-48">
                    <Image
                    src={exercise.image.imageUrl}
                    alt={exercise.image.description}
                    data-ai-hint={exercise.image.imageHint}
                    fill
                    className="object-cover"
                    />
                </div>
                <CardHeader>
                  <CardTitle>{exercise.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between text-muted-foreground">
                    <span>{exercise.sets}</span>
                    <span>{exercise.reps}</span>
                  </div>
                </CardContent>
              </Card>
            )
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
