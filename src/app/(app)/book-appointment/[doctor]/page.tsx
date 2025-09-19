'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2, Video, MapPin, Link as LinkIcon, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { doctors } from '../page';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const formSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters.'),
  appointmentDate: z.date({ required_error: 'An appointment date is required.' }),
  appointmentTime: z.string({ required_error: 'An appointment time is required.' }),
  medium: z.enum(['Online', 'Offline'], { required_error: 'Please select an appointment medium.' }),
  reason: z.string().min(10, 'Please provide a reason for your visit (min. 10 characters).'),
});

export type Appointment = z.infer<typeof formSchema> & { doctor: string, doctorName: string, location?: string, googleMeet?: string };

export default function BookDoctorAppointmentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const doctorId = params.doctor as string;

  const doctor = doctors.find(d => d.id === doctorId);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      medium: 'Online',
      reason: '',
      appointmentTime: "09:00",
    },
  });

  useEffect(() => {
    try {
        const name = localStorage.getItem('userName');
        if (name) {
            form.setValue('patientName', name);
        }
    } catch (error) {
        console.error("Failed to get user name from localStorage", error);
    }
  }, [form]);

  if (!doctor) {
    return (
        <div className="flex flex-col gap-8 items-center justify-center h-full">
            <PageHeader title="Doctor Not Found" subtitle="Please select a doctor from the list." />
            <Button asChild>
                <Link href="/book-appointment">See Doctors</Link>
            </Button>
        </div>
    );
  }

  const { medium } = form.watch();

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    setTimeout(() => {
      try {
        const existingAppointmentsRaw = localStorage.getItem('appointments');
        const existingAppointments: Appointment[] = existingAppointmentsRaw ? JSON.parse(existingAppointmentsRaw) : [];
        
        const newAppointment: Appointment = {
            ...values,
            doctor: doctor!.id,
            doctorName: doctor!.name,
            ...(values.medium === 'Offline' && { location: doctor!.location }),
            ...(values.medium === 'Online' && { googleMeet: doctor!.googleMeet }),
        };

        const newAppointments = [...existingAppointments, newAppointment];
        localStorage.setItem('appointments', JSON.stringify(newAppointments));

        toast({
          title: 'Appointment Booked!',
          description: `Your appointment with ${doctor!.name} on ${format(values.appointmentDate, 'PPP')} at ${values.appointmentTime} has been successfully scheduled.`,
        });
        
        router.push('/doctor-dashboard');

      } catch (error) {
        console.error("Failed to save appointment to localStorage", error);
        toast({
          variant: 'destructive',
          title: 'Booking Failed',
          description: 'There was an issue booking your appointment. Please try again.',
        });
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title={`Book Appointment with ${doctor.name}`}
        subtitle={`Fill out your details to schedule a session for ${doctor.specialty}.`}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader className="flex flex-col items-center text-center">
                <Image src={doctor.image} alt={doctor.name} width={90} height={90} className="rounded-full border-4 border-muted" data-ai-hint="doctor portrait" />
                <CardTitle className="font-headline text-2xl mt-2">Appointment Details</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField control={form.control} name="patientName" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl><Input placeholder="John Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
              )} />
              <div />
              <FormField control={form.control} name="appointmentDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={'outline'} className={cn('w-full pl-3 text-left font-normal', !field.value && 'text-muted-foreground')}>
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < new Date() || date < new Date('1900-01-01')} initialFocus />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
              )} />

              <FormField control={form.control} name="appointmentTime" render={({ field }) => (
                <FormItem>
                    <FormLabel>Appointment Time</FormLabel>
                    <FormControl><Input type="time" {...field} /></FormControl>
                    <FormMessage />
                </FormItem>
              )} />
              
              <div className="md:col-span-2">
                <FormField control={form.control} name="medium" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel>Medium of Appointment</FormLabel>
                        <FormControl>
                            <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex flex-col md:flex-row gap-4">
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <RadioGroupItem value="Online" className="sr-only" id="online"/>
                                    </FormControl>
                                    <FormLabel htmlFor="online" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", field.value === 'Online' && "border-primary")}>
                                        <Video className="mb-3 h-6 w-6" />
                                        Online
                                    </FormLabel>
                                </FormItem>
                                <FormItem className="flex-1">
                                    <FormControl>
                                        <RadioGroupItem value="Offline" className="sr-only" id="offline"/>
                                    </FormControl>
                                     <FormLabel htmlFor="offline" className={cn("flex flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground", field.value === 'Offline' && "border-primary")}>
                                        <MapPin className="mb-3 h-6 w-6" />
                                        Offline
                                    </FormLabel>
                                </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </div>

               {medium === 'Online' && (
                 <Alert className="md:col-span-2 bg-blue-50 border-blue-200">
                    <LinkIcon className="h-4 w-4 text-blue-600" />
                    <AlertTitle className="text-blue-800">Online Consultation</AlertTitle>
                    <AlertDescription className="text-blue-700">
                        A Google Meet link will be sent to your registered email before the appointment.
                    </AlertDescription>
                </Alert>
               )}
               {medium === 'Offline' && (
                 <Alert className="md:col-span-2 bg-green-50 border-green-200">
                    <MapPin className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">In-Person Appointment</AlertTitle>
                    <AlertDescription className="text-green-700">
                        The clinic is located at: <strong>{doctor.location}</strong>. 
                        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(doctor.location)}`} target="_blank" rel="noopener noreferrer" className="ml-1 font-semibold underline">View on Map</a>
                    </AlertDescription>
                </Alert>
               )}
              
              <div className="md:col-span-2">
                <FormField control={form.control} name="reason" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Appointment</FormLabel>
                      <FormControl><Textarea placeholder="e.g., Annual check-up, feeling unwell, etc." {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                )} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirm Appointment
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
