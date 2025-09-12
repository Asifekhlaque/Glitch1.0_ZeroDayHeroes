import PageHeader from "@/components/page-header";
import WorkoutForm from "@/components/workout-form";

export default function WorkoutPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Workout Planner"
        subtitle="Fill in your fitness details to generate a custom workout plan using AI."
      />
      <WorkoutForm />
    </div>
  );
}
