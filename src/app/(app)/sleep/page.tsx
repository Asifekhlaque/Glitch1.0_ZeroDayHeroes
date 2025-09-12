import PageHeader from "@/components/page-header";
import SleepSchedule from "@/components/sleep-schedule";

export default function SleepPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Sleep Schedule"
        subtitle="Set a consistent bedtime to improve your sleep quality and overall health."
      />
      <SleepSchedule />
    </div>
  );
}
