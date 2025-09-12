
import PageHeader from "@/components/page-header";
import DietForm from "@/components/diet-form";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Utensils } from "lucide-react";
import ReactMarkdown from "react-markdown";

const samplePlans = {
  gain: {
    nonVeg: `
- **Breakfast:** 4 scrambled eggs, 2 slices of whole-wheat toast with avocado, and a glass of milk.
- **Lunch:** 150g grilled chicken breast, 1 cup quinoa, and a large portion of steamed vegetables.
- **Snack:** Greek yogurt with a handful of almonds and honey.
- **Dinner:** 150g baked salmon, 1 cup brown rice, and a side salad with olive oil dressing.
- **Before Bed:** A scoop of casein protein shake.
    `,
    veg: `
- **Breakfast:** Oatmeal cooked with milk, topped with nuts, seeds, and a banana.
- **Lunch:** 1 cup of chickpeas, 1 cup of brown rice, and a large serving of mixed vegetable curry.
- **Snack:** A large apple with 2 tablespoons of peanut butter.
- **Dinner:** 150g tofu or paneer stir-fry with mixed vegetables and a side of whole-wheat noodles.
- **Before Bed:** A glass of warm milk with a pinch of turmeric.
    `,
  },
  lose: {
    nonVeg: `
- **Breakfast:** 2 boiled eggs with a side of spinach and a green tea.
- **Lunch:** Large salad with 100g grilled chicken, mixed greens, cucumber, tomatoes, and a light vinaigrette.
- **Snack:** A handful of berries.
- **Dinner:** 120g baked cod with a large serving of roasted broccoli and cauliflower.
- **Hydration:** Drink at least 8-10 glasses of water throughout the day.
    `,
    veg: `
- **Breakfast:** Smoothie with spinach, half a banana, a scoop of plant-based protein, and unsweetened almond milk.
- **Lunch:** Large lentil soup with a side of mixed greens salad.
- **Snack:** A small bowl of cucumber and carrot sticks with hummus.
- **Dinner:** 100g grilled tempeh with steamed asparagus and a small portion of quinoa.
- **Hydration:** Drink at least 8-10 glasses of water throughout the day.
    `,
  },
  maintain: {
    nonVeg: `
- **Breakfast:** 2-egg omelette with vegetables and one slice of whole-wheat toast.
- **Lunch:** 120g turkey breast slices with a whole-wheat wrap, lettuce, and tomato.
- **Snack:** An orange and a small handful of walnuts.
- **Dinner:** 120g grilled shrimp with a mixed-grain pilaf and green beans.
- **Balance:** Focus on portion control and listening to your body's hunger cues.
    `,
    veg: `
- **Breakfast:** Greek yogurt with granola and mixed berries.
- **Lunch:** Quinoa salad with black beans, corn, bell peppers, and a lime-cilantro dressing.
- **Snack:** A pear and a piece of dark chocolate.
- **Dinner:** Black bean burger on a whole-wheat bun with a side of sweet potato fries (baked, not fried).
- **Balance:** Focus on a variety of whole foods to ensure you get a wide range of nutrients.
    `,
  },
};

export default function DietPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Diet Planner"
        subtitle="Provide your details to generate a personalized diet plan powered by AI."
      />
      <DietForm />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-headline text-2xl">
            <Utensils className="w-6 h-6 text-primary" />
            Sample Diet Plans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl">Weight Gain</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                <Tabs defaultValue="non-veg" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="non-veg">Non-Vegetarian</TabsTrigger>
                    <TabsTrigger value="veg">Vegetarian</TabsTrigger>
                  </TabsList>
                  <TabsContent value="non-veg">
                    <div className="prose prose-stone dark:prose-invert max-w-none p-4 rounded-md bg-muted/50">
                      <ReactMarkdown>{samplePlans.gain.nonVeg}</ReactMarkdown>
                    </div>
                  </TabsContent>
                  <TabsContent value="veg">
                    <div className="prose prose-stone dark:prose-invert max-w-none p-4 rounded-md bg-muted/50">
                      <ReactMarkdown>{samplePlans.gain.veg}</ReactMarkdown>
                    </div>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-xl">Weight Loss</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                 <Tabs defaultValue="non-veg" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="non-veg">Non-Vegetarian</TabsTrigger>
                    <TabsTrigger value="veg">Vegetarian</TabsTrigger>
                  </TabsList>
                  <TabsContent value="non-veg">
                    <div className="prose prose-stone dark:prose-invert max-w-none p-4 rounded-md bg-muted/50">
                      <ReactMarkdown>{samplePlans.lose.nonVeg}</ReactMarkdown>
                    </div>
                  </TabsContent>
                  <TabsContent value="veg">
                    <div className="prose prose-stone dark:prose-invert max-w-none p-4 rounded-md bg-muted/50">
                      <ReactMarkdown>{samplePlans.lose.veg}</ReactMarkdown>
                    </div>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger className="text-xl">Weight Maintenance</AccordionTrigger>
              <AccordionContent className="text-base text-muted-foreground space-y-2">
                 <Tabs defaultValue="non-veg" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="non-veg">Non-Vegetarian</TabsTrigger>
                    <TabsTrigger value="veg">Vegetarian</TabsTrigger>
                  </TabsList>
                  <TabsContent value="non-veg">
                    <div className="prose prose-stone dark:prose-invert max-w-none p-4 rounded-md bg-muted/50">
                      <ReactMarkdown>{samplePlans.maintain.nonVeg}</ReactMarkdown>
                    </div>
                  </TabsContent>
                  <TabsContent value="veg">
                    <div className="prose prose-stone dark:prose-invert max-w-none p-4 rounded-md bg-muted/50">
                      <ReactMarkdown>{samplePlans.maintain.veg}</ReactMarkdown>
                    </div>
                  </TabsContent>
                </Tabs>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
