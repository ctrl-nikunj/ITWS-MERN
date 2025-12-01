import { StegoProcessor } from "@/components/StegoProcessor";
import { TechniqueSection } from "@/components/TechniqueSection";
import { Shield } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative w-full min-h-[60vh] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 z-0 opacity-30"
          style={{
            backgroundImage: `url(/hero-stego.jpg)`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-linear-to-b from-background/50 via-background/80 to-background z-10" />

        <div className="relative z-20 container px-4 mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
            <Shield className="w-4 h-4" />
            <span className="text-sm font-medium">Advanced Steganography</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-foreground">
            Inverse-Transpose Wavelet Scrambling 
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Hide secret images within cover images using advanced pixel scrambling techniques.
            Invisible to the eye, undetectable by analysis.
          </p>
        </div>
      </section>

      {/* Processor Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <StegoProcessor />
        </div>
      </section>

      {/* Technique Section */}
      <TechniqueSection />

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-20">
        <div className="container px-4 mx-auto text-center">
          <p className="text-sm text-muted-foreground">
            © 2024 StegoScramble. Advanced steganography with pixel scrambling.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
