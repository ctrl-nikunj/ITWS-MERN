import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Loader2,
  Loader2Icon,
  LoaderCircleIcon,
  LoaderIcon,
} from "lucide-react";

export default function ImageProcessor() {
  const [images, setImages] = useState([null, null]);
  const [output, setOutput] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isExtract, setIsExtract] = useState("embed");

  const handleFileChange = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImgs = [...images];
    newImgs[index] = file;
    setImages(newImgs);
  };

  const handleSubmit = async () => {
    if (!images[0] || !images[1]) {
      alert("Please upload two images!");
      return;
    }
    setLoading(true);
    const formData = new FormData();

    if (isExtract === "embed") {
      formData.append("cover", images[0]); // cover image
      formData.append("secret", images[1]); // secret image
    } else {
      formData.append("stego", images[0]); // stego image
      formData.append("cover", images[1]); // original cover
    }
    const res = await fetch(
      isExtract === "embed"
        ? "http://localhost:5000/api/stego/embed"
        : "http://localhost:5000/api/stego/extract",
      { method: "POST", body: formData }
    );

    // backend sends JSON with base64, not blob
    const data = await res.json();
    if (data) {
      setOutput(data.stego || data.secret);
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <Card className="w-full max-w-xl shadow-lg bg-zinc-50">
        <CardTitle>
          <h2 className="text-2xl font-semibold text-center text-zinc-800">
            Image Processor
          </h2>
        </CardTitle>
        <CardContent className="flex flex-col gap-6">
          <Tabs
            value={isExtract}
            onValueChange={(val) => setIsExtract(val)}
          >
            <TabsList className="bg-zinc-200 gap-2">
              <TabsTrigger value="embed">Embed</TabsTrigger>
              <TabsTrigger value="extract">Extract</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex gap-4">
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 0)}
            />
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileChange(e, 1)}
            />
          </div>

          <Button
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Processing..." : "Upload & Process"}
          </Button>

          {output && (
            <div className="mt-6 flex flex-col items-center gap-2">
              {loading ? (
                <div className="animate-pulse h-10 w-10 text-zinc-600">
                  <LoaderIcon />
                </div>
              ) : (
                <>
                  <h3 className="text-lg font-medium text-zinc-800">
                    Processed Output:
                  </h3>
                  <img
                    src={output}
                    alt="Processed result"
                    className="rounded-lg border shadow-md max-h-96"
                  />
                </>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
