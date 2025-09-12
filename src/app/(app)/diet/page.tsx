import PageHeader from "@/components/page-header";
import DietForm from "@/components/diet-form";

export default function DietPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="AI Diet Planner"
        subtitle="Provide your details to generate a personalized diet plan powered by AI."
      />
      <DietForm />
    </div>
  );
}
