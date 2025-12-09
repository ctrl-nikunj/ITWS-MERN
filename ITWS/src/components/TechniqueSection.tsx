import { Card } from "@/components/ui/card";
import { Shield, Shuffle, Lock, Zap } from "lucide-react";

export const TechniqueSection = () => {
  const features = [
    {
      icon: Shuffle,
      title: "Pixel Scrambling",
      description: "Advanced scrambling algorithm randomizes pixel positions for enhanced security"
    },
    {
      icon: Lock,
      title: "Novel Scrambling Technique",
      description: "Developed using basic matrix operations: plane and simple"
    },
    {
      icon: Shield,
      title: "Adaptive Thresholding",
      description: "Dynamically adjust threshold values based on DWT converted frequency values"
    },
    {
      icon: Zap,
      title: "High Capacity",
      description: "Efficiently embeds large secret images with minimal quality loss"
    }
  ];

  return (
    <section className="w-full py-20 bg-card">
      <div className="container px-4 mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            The Novelty: Scrambling-Based Steganography
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Our technique combines traditional matrix operations such as inverse and transposition 
            after converting the image format by leveraging Discrete Wavelet Transform (DWT) and 
            Discrete Cosine Transform (DCT) and applying the novel scrambling technique accompanied
            with adaptive thresholding for embedding the secret image into the cover image.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-sm bg-primary text-primary-foreground">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-2 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-accent/30">
          <h3 className="text-xl font-semibold mb-4 text-foreground">How It Works</h3>
          <div className="space-y-4 text-foreground">
            <div className="flex gap-3">
              <span className="font-mono text-primary font-semibold">01</span>
              <div>
                <p className="font-medium">Scramble Phase</p>
                <p className="text-sm text-muted-foreground">
                  Secret image pixels are scrambled using a deterministic algorithm, creating a pseudo-random distribution
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-primary font-semibold">02</span>
              <div>
                <p className="font-medium">Embedding Phase</p>
                <p className="text-sm text-muted-foreground">
                  Scrambled pixels are embedded into the cover image using adaptive threshold masking.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-mono text-primary font-semibold">03</span>
              <div>
                <p className="font-medium">Extraction Phase</p>
                <p className="text-sm text-muted-foreground">
                  The whole embedding is porocess is executed in the exact same opposite order.
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};
