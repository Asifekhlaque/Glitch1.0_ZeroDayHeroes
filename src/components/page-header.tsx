interface PageHeaderProps {
  title: string;
  subtitle: string;
}

export default function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="space-y-1">
      <h1 className="font-headline text-3xl md:text-5xl font-bold tracking-tight text-foreground">
        {title}
      </h1>
      <p className="text-muted-foreground text-base md:text-lg">
        {subtitle}
      </p>
    </div>
  );
}
