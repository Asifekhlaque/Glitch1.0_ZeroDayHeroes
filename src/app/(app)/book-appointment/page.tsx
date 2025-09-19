'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { ArrowRight, UserMd } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export const doctors = [
  {
    id: 'dr-smith-cardiology',
    name: 'Dr. Evelyn Smith',
    specialty: 'Cardiology',
    description: 'Dr. Smith is a board-certified cardiologist with over 15 years of experience in treating heart conditions and promoting cardiovascular wellness. She is known for her compassionate patient care.',
    image: 'https://picsum.photos/seed/doc1/400/400',
    location: '123 Health St, Wellness City',
    googleMeet: 'https://meet.google.com/new',
  },
  {
    id: 'dr-jones-neurology',
    name: 'Dr. Benjamin Jones',
    specialty: 'Neurology',
    description: 'Dr. Jones specializes in diagnosing and treating disorders of the nervous system. He has a keen interest in migraine research and patient education.',
    image: 'https://picsum.photos/seed/doc2/400/400',
    location: '456 Brainy Ave, Mindville',
    googleMeet: 'https://meet.google.com/new',
  },
  {
    id: 'dr-taylor-pediatrics',
    name: 'Dr. Olivia Taylor',
    specialty: 'Pediatrics',
    description: 'With a friendly and gentle approach, Dr. Taylor provides comprehensive care for children from infancy through adolescence. She is dedicated to making every child\'s visit a positive experience.',
    image: 'https://picsum.photos/seed/doc3/400/400',
    location: '789 Child Way, Playfultown',
    googleMeet: 'https://meet.google.com/new',
  }
];


export default function BookAppointmentPage() {
    return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Meet Our Doctors"
        subtitle="Choose a specialist to schedule your appointment."
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {doctors.map((doctor) => (
            <Card key={doctor.id} className="flex flex-col">
                <CardHeader className="items-center">
                    <Image 
                        src={doctor.image}
                        alt={`Photo of ${doctor.name}`}
                        width={120}
                        height={120}
                        className="rounded-full border-4 border-primary/20"
                        data-ai-hint="doctor portrait"
                    />
                </CardHeader>
                <CardContent className="flex-1 text-center">
                    <CardTitle className="font-headline text-2xl">{doctor.name}</CardTitle>
                    <CardDescription className="text-primary font-medium">{doctor.specialty}</CardDescription>
                    <p className="mt-4 text-muted-foreground text-sm">{doctor.description}</p>
                </CardContent>
                <CardFooter>
                    <Button asChild className="w-full">
                        <Link href={`/book-appointment/${doctor.id}`}>
                            Book Now <ArrowRight className="ml-2" />
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        ))}
      </div>
    </div>
  );
}
