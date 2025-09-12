import PageHeader from "@/components/page-header";
import MeditationTimer from "@/components/meditation-timer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function MeditationPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Meditation Timer"
        subtitle="Take a 2-minute break to calm your mind and find your center."
      />
      <MeditationTimer />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Lightbulb className="w-6 h-6 text-primary" />
            Meditation Guide
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg">Find a Quiet Space</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>Choose a location where you won't be disturbed for a few minutes. It doesn't have to be perfectly silent, but it should be a place where you feel calm and can minimize distractions.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg">Get Comfortable</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>Sit or lie down in a comfortable position. You can sit on a chair with your feet on the floor, cross-legged on a cushion, or lie on your back. Keep your back straight, but not stiff.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-lg">Focus on Your Breath</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>Gently close your eyes and bring your attention to your breath. Notice the sensation of the air entering your nostrils, filling your lungs, and leaving your body. Don't try to change your breathing; just observe it.</p>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger className="text-lg">Handle Wandering Thoughts</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>Your mind will naturally wander. That's completely normal. When you notice your thoughts drifting, gently acknowledge them without judgment and then guide your focus back to your breath. Think of it as training a puppy—just be patient and kind to yourself.</p>
              </AccordionContent>
            </AccordionItem>
             <AccordionItem value="item-5">
              <AccordionTrigger className="text-lg">Start Small</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <p>You don't need to meditate for hours. Starting with just 2-5 minutes a day is a great way to build a consistent habit. The goal is consistency, not duration. Over time, you can gradually increase the length of your sessions if you wish.</p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
