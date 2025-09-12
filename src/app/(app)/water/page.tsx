import PageHeader from "@/components/page-header";
import WaterReminder from "@/components/water-reminder";

export default function WaterPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Water Reminder"
        subtitle="Stay hydrated throughout the day by setting personalized water reminders."
      />
      <WaterReminder />
    </div>
  );
}
