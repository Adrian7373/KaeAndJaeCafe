import TestimonialSlider from "@/components/TestimonialsSlider";
import Footer from "@/components/Footer";
import LandingNav from "@/components/landing/LandingNav";
import Hero from "@/components/landing/Hero";
import Marquee from "@/components/landing/Marquee";
import MenuRail from "@/components/landing/MenuRail";
import About from "@/components/landing/About";
import Gallery from "@/components/landing/Gallery";
import Reveal from "@/components/landing/Reveal";
import Visit from "@/components/landing/Visit";

export default function Home() {
  return (
    <div className="bg-paper text-ink transition-colors duration-500">
      <LandingNav />
      <Hero />
      <Marquee />
      <MenuRail />
      <About />
      <Gallery />

      <section id="testimonials" className="scroll-mt-20 bg-paper-alt px-4 py-24 text-ink md:px-10 md:py-32 2xl:px-30">
        <div className="mx-auto max-w-[1920px]">
          <Reveal>
            <p className="mb-4 font-label text-xs tracking-[0.2em] uppercase">Reviews</p>
            <h2 className="ed-display max-w-4xl text-5xl leading-[1.02] md:text-7xl">
              What the <span className="ed-italic text-accent">regulars</span> <span className="ed-caps">are</span> saying.
            </h2>
          </Reveal>
          <div className="mt-10">
            <TestimonialSlider />
          </div>
        </div>
      </section>

      <Visit />
      <Footer />
    </div>
  );
}
