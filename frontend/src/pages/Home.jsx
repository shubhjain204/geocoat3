import { SmoothScroll } from "@/components/SmoothScroll";
import { Navigation } from "@/components/Navigation";
import { HomeHero } from "@/components/HomeHero";
import { TwoSystems } from "@/components/TwoSystems";
import { KeywordMarquee } from "@/components/KeywordMarquee";
import { Footer } from "@/components/Footer";

export default function Home() {
    return (
        <SmoothScroll>
            <main data-testid="home-page" className="relative bg-[#F5F5F0] text-[#1A1A1A]">
                <Navigation variant="home" />
                <HomeHero />
                <KeywordMarquee />
                <TwoSystems />
                <Footer />
            </main>
        </SmoothScroll>
    );
}
