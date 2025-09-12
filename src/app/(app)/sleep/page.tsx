import PageHeader from "@/components/page-header";
import SleepSchedule from "@/components/sleep-schedule";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Moon } from "lucide-react";

export default function SleepPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Sleep Schedule"
        subtitle="Set a consistent bedtime to improve your sleep quality and overall health."
      />
      <SleepSchedule />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Moon className="w-6 h-6 text-primary" />
            Building a Healthy Sleep Routine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">Be Consistent</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>Go to bed and wake up at the same time every day, even on weekends. This helps regulate your body's internal clock and can improve the quality of your sleep.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">Create a Relaxing Routine</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>Ease into sleep with a calming pre-bed ritual. This could be reading a book, listening to soothing music, taking a warm bath, or practicing gentle stretches. Signal to your brain that it's time to wind down.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">Optimize Your Environment</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>Your bedroom should be a sanctuary for sleep. Keep it dark, quiet, and cool. Consider using blackout curtains, earplugs, or a white noise machine if needed.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg">Limit Screen Time</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>The blue light emitted by phones, tablets, and computers can interfere with your body's production of melatonin, the sleep hormone. Try to disconnect from screens at least an hour before bed.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg">Watch What You Consume</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>Avoid large meals, caffeine, and alcohol close to bedtime. Caffeine can stay in your system for hours, and while alcohol might make you feel drowsy initially, it can disrupt sleep later in the night.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
