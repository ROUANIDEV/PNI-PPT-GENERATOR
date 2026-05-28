import { HomeFeatureGrid } from "./home-feature-grid";
import { HomeHeader } from "./home-header";
import { HomeHero } from "./home-hero";
import { HomeWorkflowCard } from "./home-workflow-card";

export function HomePage() {
  return (
    <main className="min-h-svh bg-background text-foreground">
      <div className="mx-auto flex min-h-svh w-full max-w-7xl flex-col px-6 py-8">
        <HomeHeader />

        <div className="grid flex-1 items-center gap-10 py-10 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-8">
            <HomeHero />
            <HomeFeatureGrid />
          </section>

          <HomeWorkflowCard />
        </div>
      </div>
    </main>
  );
}