
'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import PageHeader from '@/components/page-header';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { Appointment } from '../book-appointment/[doctor]/page';
import { Stethoscope, Video, MapPin } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DoctorDashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    try {
      const savedAppointments = localStorage.getItem('appointments');
      if (savedAppointments) {
        const parsedAppointments: Appointment[] = JSON.parse(savedAppointments);
        // Deserialize date strings back to Date objects
        const appointmentsWithDates = parsedAppointments.map(appt => ({
            ...appt,
            appointmentDate: new Date(appt.appointmentDate)
        }));
        // Sort by upcoming appointments first
        appointmentsWithDates.sort((a, b) => {
            if (!a.appointmentTime || !b.appointmentTime) {
                return 0;
            }
            const dateA = new Date(a.appointmentDate);
            dateA.setHours(parseInt(a.appointmentTime.split(':')[0]), parseInt(a.appointmentTime.split(':')[1]));
            const dateB = new Date(b.appointmentDate);
            dateB.setHours(parseInt(b.appointmentTime.split(':')[0]), parseInt(b.appointmentTime.split(':')[1]));
            return dateA.getTime() - dateB.getTime();
        });
        setAppointments(appointmentsWithDates);
      }
    } catch (error) {
      console.error('Failed to load appointments from localStorage', error);
    }
  }, []);

  if (!isMounted) {
    return (
        <div className="flex flex-col gap-8">
            <PageHeader
                title="Doctor's Dashboard"
                subtitle="Loading appointments..."
            />
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="h-4 bg-muted rounded w-full animate-pulse mb-4"></div>
                    <div className="h-4 bg-muted rounded w-full animate-pulse mb-4"></div>
                    <div className="h-4 bg-muted rounded w-3/4 animate-pulse"></div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Doctor's Dashboard"
        subtitle="Here are all the upcoming patient appointments."
      />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Stethoscope className="w-6 h-6 text-primary" />
            Upcoming Appointments
          </CardTitle>
           <CardDescription>
                A list of all scheduled patient appointments.
            </CardDescription>
        </CardHeader>
        <CardContent>
          {appointments.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient</TableHead>
                  <TableHead>Doctor</TableHead>
                  <TableHead>Date & Time</TableHead>
                  <TableHead>Medium</TableHead>
                  <TableHead>Reason</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appt, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{appt.patientName}</TableCell>
                    <TableCell>
                        <Badge variant="outline">{appt.doctorName}</Badge>
                    </TableCell>
                    <TableCell>{format(appt.appointmentDate, 'PPP')} at {appt.appointmentTime}</TableCell>
                    <TableCell>
                        {appt.medium === 'Online' && appt.googleMeet ? (
                            <Link href={appt.googleMeet} target="_blank" rel="noopener noreferrer">
                                <Badge variant='default' className="flex items-center gap-1.5 w-fit hover:bg-primary/80">
                                    <Video className="w-3.5 h-3.5"/>
                                    {appt.medium}
                                </Badge>
                            </Link>
                        ) : (
                             <Badge variant={'secondary'} className="flex items-center gap-1.5 w-fit">
                                <MapPin className="w-3.5 h-3.5"/>
                                {appt.medium}
                            </Badge>
                        )}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{appt.reason}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>There are no appointments scheduled.</p>
              <Button asChild variant="link">
                <Link href="/book-appointment">Book one now</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
