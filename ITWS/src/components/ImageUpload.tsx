import { Upload } from "lucide-react";
import { useRef } from "react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  label: string;
  image: string | null;
  onImageChange: (image: string) => void;
  className?: string;
}

export const ImageUpload = ({ label, image, onImageChange, className }: ImageUploadProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageChange(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className={cn(
          "relative aspect-video border-2 border-dashed rounded-sm cursor-pointer transition-colors overflow-hidden",
          image ? "border-primary bg-card" : "border-border hover:border-primary bg-accent/50"
        )}
      >
        {image ? (
          <img src={image} alt={label} className="w-full h-full object-contain" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-muted-foreground">
            <Upload className="w-8 h-8" />
            <span className="text-sm">Drop image or click to upload</span>
          </div>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />
      </div>
    </div>
  );
};
