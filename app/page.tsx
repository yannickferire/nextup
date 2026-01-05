import { PreLaunchHeader } from "@/components/pre-launch/header";
import { PreLaunchFooter } from "@/components/pre-launch/footer";
import { Hero } from "@/components/pre-launch/hero";

export default function Home() {
  return (
    <main className="flex flex-col md:h-screen">
      <PreLaunchHeader />
      <Hero />
      <PreLaunchFooter />
    </main>
  );
}
