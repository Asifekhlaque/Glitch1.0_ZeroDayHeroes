import PageHeader from "@/components/page-header";
import MeditationTimer from "@/components/meditation-timer";
import SleepSchedule from "@/components/sleep-schedule";

export default function MeditationPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Mental Boost"
        subtitle="Take a moment to relax, meditate, and manage your sleep."
      />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <MeditationTimer />
        <SleepSchedule />
      </div>
    </div>
  );
}
