'use client';

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ImageUpload } from "./ImageUpload";
import { ArrowRight, Download } from "lucide-react";
import { toast } from "sonner";

type Mode = "embed" | "extract";

export const StegoProcessor = () => {
  const [mode, setMode] = useState<Mode>("embed");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [secretImage, setSecretImage] = useState<string | null>(null);
  const [stegoImage, setStegoImage] = useState<string | null>(null);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (mode === "embed" && (!coverImage || !secretImage)) {
      toast.error("Please upload both cover and secret images");
      return;
    }
    if (mode === "extract" && (!stegoImage || !coverImage)) {
      toast.error("Please upload both stego and cover images");
      return;
    }

    setIsProcessing(true);
    setResultImage(null);

    try {
      const formData = new FormData();

      if (mode === "embed") {
        const coverBlob = await (await fetch(coverImage!)).blob();
        const secretBlob = await (await fetch(secretImage!)).blob();
        formData.append("cover", coverBlob);
        formData.append("secret", secretBlob);

        const response = await fetch("/api/stego/embed", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Embedding failed");
        }

        const data = await response.json();
        setResultImage(data.stego);
        toast.success("Secret image embedded successfully!");
      } else {
        const stegoBlob = await (await fetch(stegoImage!)).blob();
        const coverBlob = await (await fetch(coverImage!)).blob();
        formData.append("stego", stegoBlob);
        formData.append("cover", coverBlob);

        const response = await fetch("/api/stego/extract", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Extraction failed");
        }

        const data = await response.json();
        setResultImage(data.secret);
        toast.success("Secret image extracted successfully!");
      }
    } catch (error: any) {
      console.error("Processing error:", error);
      toast.error(error.message || "An error occurred during processing");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!resultImage) return;
    const link = document.createElement("a");
    link.href = resultImage;
    link.download = mode === "embed" ? "stego-image.png" : "extracted-secret.png";
    link.click();
    toast.success("Image downloaded!");
  };

  const handleReset = () => {
    setCoverImage(null);
    setSecretImage(null);
    setStegoImage(null);
    setResultImage(null);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <Tabs value={mode} onValueChange={(v) => { setMode(v as Mode); handleReset(); }}>
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
          <TabsTrigger value="embed">Embed Mode</TabsTrigger>
          <TabsTrigger value="extract">Extract Mode</TabsTrigger>
        </TabsList>

        <TabsContent value="embed" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              label="Cover Image"
              image={coverImage}
              onImageChange={setCoverImage}
            />
            <ImageUpload
              label="Secret Image"
              image={secretImage}
              onImageChange={setSecretImage}
            />
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleProcess}
              disabled={isProcessing || !coverImage || !secretImage}
              className="gap-2"
            >
              {isProcessing ? "Processing..." : "Embed Secret"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {resultImage && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Result: Stego Image</h3>
                <Button onClick={handleDownload} variant="secondary" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
              <div className="aspect-auto border rounded-sm overflow-hidden bg-accent">
                <img src={resultImage} alt="Stego result" className="w-full h-[300px] aspect-auto object-contain" />
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="extract" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <ImageUpload
              label="Stego Image"
              image={stegoImage}
              onImageChange={setStegoImage}
            />
            <ImageUpload
              label="Cover Image"
              image={coverImage}
              onImageChange={setCoverImage}
            />
          </div>

          <div className="flex justify-center">
            <Button
              size="lg"
              onClick={handleProcess}
              disabled={isProcessing || !stegoImage || !coverImage}
              className="gap-2"
            >
              {isProcessing ? "Processing..." : "Extract Secret"}
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>

          {resultImage && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Result: Extracted Secret</h3>
                <Button onClick={handleDownload} variant="secondary" size="sm" className="gap-2">
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </div>
              <div className="aspect-video border rounded-sm overflow-hidden bg-accent">
                <img src={resultImage} alt="Extracted secret" className="w-full h-full object-contain" />
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
      <p className="text-zinc-400 text-center pt-2">* Results may vary due to application of a MATLAB project on Javascript</p>
    </div>
  );
};
