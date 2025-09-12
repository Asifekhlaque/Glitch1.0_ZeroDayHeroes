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
  HeartPulse,
  BrainCircuit,
  Vegan,
  Code,
} from 'lucide-react';
import PageHeader from '@/components/page-header';

const features = [
  {
    icon: <Droplets className="w-8 h-8 text-primary" />,
    title: 'Hydration Reminder',
    description: 'Stay hydrated with timely reminders.',
    href: '/hydration',
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

const awarenessTips = [
  {
    icon: <HeartPulse className="w-6 h-6 text-red-500" />,
    title: 'Mindful Eating',
    description:
      'Pay attention to your food. Eating slowly and without distraction helps you recognize hunger cues and enjoy your meals more.',
  },
  {
    icon: <BrainCircuit className="w-6 h-6 text-blue-500" />,
    title: 'Digital Detox',
    description:
      'Take regular breaks from screens. Unplugging for even a short period can reduce eye strain, improve sleep, and boost mental clarity.',
  },
  {
    icon: <Vegan className="w-6 h-6 text-green-500" />,
    title: 'Power of Plants',
    description:
      'Incorporate more plant-based foods into your diet. They are rich in vitamins, minerals, and fiber that fuel your body and mind.',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Welcome to LifeBoost"
        subtitle="Your personalized companion for a healthier and balanced lifestyle."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card
              className={`h-full transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 border-2 border-transparent ${feature.color}`}
            >
              <CardHeader className="flex flex-row items-center gap-4">
                {feature.icon}
                <div className="flex-1">
                  <CardTitle className="font-headline text-2xl">
                    {feature.title}
                  </CardTitle>
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

      <div>
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground mb-4">
          Lifestyle Awareness
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {awarenessTips.map((tip) => (
            <Card key={tip.title} className="bg-card">
              <CardHeader className="flex flex-row items-start gap-4">
                {tip.icon}
                <div className='flex-1'>
                  <CardTitle className="text-xl font-semibold">{tip.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{tip.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <Card className="bg-card">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl font-semibold">
                    <Code className="w-6 h-6 text-primary" />
                    Development Team
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center text-muted-foreground">
                <p className="font-medium">Asif Ekhlaque & Vishal Kumar</p>
                <p className="text-sm">MCA 1, Amity University Patna</p>
            </CardContent>
        </Card>
      </div>

    </div>
  );
}
