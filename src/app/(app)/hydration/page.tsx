import PageHeader from "@/components/page-header";
import WaterReminder from "@/components/water-reminder";
import WaterTracker from "@/components/water-tracker";
import { Separator } from "@/components/ui/separator";

export default function HydrationPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Hydration Hub"
        subtitle="Set reminders, track your daily goal, and log your progress."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <WaterReminder />
        <WaterTracker />
      </div>
    </div>
  );
}
