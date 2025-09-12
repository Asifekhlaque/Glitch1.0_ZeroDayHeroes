import PageHeader from "@/components/page-header";
import MeditationTimer from "@/components/meditation-timer";

export default function MeditationPage() {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        title="Meditation Timer"
        subtitle="Take a 2-minute break to calm your mind and find your center."
      />
      <MeditationTimer />
    </div>
  );
}
