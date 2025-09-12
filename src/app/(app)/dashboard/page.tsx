import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Droplets,
  UtensilsCrossed,
  Dumbbell,
  Flower2,
  BedDouble,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: 'Water Reminder',
    description: 'Stay hydrated with timely reminders.',
    href: '/water',
    color: 'hover:border-blue-300',
  },
  {
    icon: <UtensilsCrossed className="w-8 h-8 text-primary" />,
    title: 'Diet Planner',
    description: 'Get AI-powered personalized diet plans.',
    href: '/diet',
    color: 'hover:border-green-300',
  },
  {
    icon: <Dumbbell className="w-8 h-8 text-primary" />,
    title: 'Workout Planner',
    description: 'Custom workouts designed just for you.',
    href: '/workout',
    color: 'hover:border-red-300',
  },
  {
    icon: <Flower2 className="w-8 h-8 text-primary" />,
    title: 'Meditation',
    description: 'Calm your mind with a guided timer.',
    href: '/meditation',
    color: 'hover:border-purple-300',
  },
  {
    icon: <BedDouble className="w-8 h-8 text-primary" />,
    title: 'Sleep Schedule',
    description: 'Set a healthy sleep routine.',
    href: '/sleep',
    color: 'hover:border-indigo-300',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold tracking-tight text-foreground">
          Welcome to LifeBoost
        </h1>
        <p className="text-muted-foreground mt-2 text-lg">
          Your personalized companion for a healthier and balanced lifestyle.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card className={`h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-2 border-transparent ${feature.color}`}>
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <div className="flex-1">
                  <CardTitle className="font-headline text-2xl">{feature.title}</CardTitle>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
