import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

type SectionProps = {
  children: ReactNode;
  className?: string;
  id?: string;
};

export function Section({ children, className, id }: SectionProps) {
  return (
    <section id={id} className={cn("container py-16 md:py-24", className)}>
      {children}
    </section>
  );
}

type SectionHeaderProps = {
  title: string;
  description?: string;
  className?: string;
};

export function SectionHeader({ title, description, className }: SectionHeaderProps) {
  return (
    <div className={cn("text-center max-w-3xl mx-auto", className)}>
      <h2 className="font-headline text-3xl md:text-4xl font-bold text-balance">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-lg text-muted-foreground text-balance">
          {description}
        </p>
      )}
    </div>
  );
}
