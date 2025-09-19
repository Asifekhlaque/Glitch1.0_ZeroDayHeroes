'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';

import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  patientName: z.string().min(2, 'Name must be at least 2 characters.'),
  doctor: z.enum(['Dr. Smith (Cardiology)', 'Dr. Jones (Neurology)', 'Dr. Taylor (Pediatrics)']),
  appointmentDate: z.date({
    required_error: 'An appointment date is required.',
  }),
  reason: z.string().min(10, 'Please provide a reason for your visit (min. 10 characters).'),
});

export type Appointment = z.infer<typeof formSchema>;

export default function BookAppointmentPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      patientName: '',
      doctor: 'Dr. Smith (Cardiology)',
      reason: '',
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    setTimeout(() => {
      try {
        const existingAppointmentsRaw = localStorage.getItem('appointments');
        const existingAppointments: Appointment[] = existingAppointmentsRaw ? JSON.parse(existingAppointmentsRaw) : [];
        
        const newAppointments = [...existingAppointments, values];
        localStorage.setItem('appointments', JSON.stringify(newAppointments));

        toast({
          title: 'Appointment Booked!',
          description: `Your appointment with ${values.doctor} on ${format(values.appointmentDate, 'PPP')} has been successfully scheduled.`,
        });
        form.reset();
        const name = localStorage.getItem('userName');
        if (name) {
            form.setValue('patientName', name);
        }

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
        title="Book an Appointment"
        subtitle="Schedule your visit with one of our doctors."
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <CardTitle className="font-headline text-2xl">Appointment Details</CardTitle>
              <CardDescription>
                Fill out the form below to book your appointment.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="patientName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Patient Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="doctor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Doctor</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a doctor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Dr. Smith (Cardiology)">Dr. Smith (Cardiology)</SelectItem>
                        <SelectItem value="Dr. Jones (Neurology)">Dr. Jones (Neurology)</SelectItem>
                        <SelectItem value="Dr. Taylor (Pediatrics)">Dr. Taylor (Pediatrics)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="appointmentDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Appointment Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date() || date < new Date('1900-01-01')}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reason for Appointment</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Annual check-up, feeling unwell, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Book Appointment
              </Button>
            </CardFooter>
          </Card>
        </form>
      </Form>
    </div>
  );
}
