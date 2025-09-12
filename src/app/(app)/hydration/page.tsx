import PageHeader from "@/components/page-header";
import WaterReminder from "@/components/water-reminder";

export default function HydrationPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Hydration Reminder"
        subtitle="Stay hydrated throughout the day by setting personalized water reminders."
      />
      <WaterReminder />
    </div>
  );
}
