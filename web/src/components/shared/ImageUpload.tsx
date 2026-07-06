"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { UploadCloud, Loader2, X } from "lucide-react";

interface ImageUploadProps {
  onUploadSuccess: (url: string) => void;
  onUploadError?: (error: any) => void;
}

export function ImageUpload({ onUploadSuccess, onUploadError }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Client-side validation
    if (file.size > 5 * 1024 * 1024) {
      alert("ছবির সাইজ ৫MB এর বেশি হতে পারবে না।");
      e.target.value = "";
      return;
    }
    if (!file.type.startsWith("image/")) {
      alert("শুধুমাত্র ইমেজ ফাইল আপলোড করা যাবে।");
      e.target.value = "";
      return;
    }

    setIsUploading(true);
    setPreview(URL.createObjectURL(file));

    try {
      // Direct unsigned upload to Cloudinary
      // ⚠️ SECURITY NOTE: Switch to signed upload for production.
      // The unsigned preset "matir_rajjo_unsigned" should be restricted
      // in Cloudinary dashboard to accept only image types, max 5MB,
      // and auto-approve from allowed IPs. For full security, implement
      // a server-side signature endpoint.
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "matir_rajjo_unsigned");

      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!uploadRes.ok) throw new Error("Failed to upload image");
      const uploadData = await uploadRes.json();

      onUploadSuccess(uploadData.secure_url);
    } catch (error) {
      console.error(error);
      if (onUploadError) onUploadError(error);
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const removePreview = () => {
    setPreview(null);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-sm border-2 border-dashed border-gray-300 rounded-lg p-6 hover:bg-gray-50 transition-colors">
      {preview ? (
        <div className="relative w-full h-48">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover rounded-md"
          />
          {isUploading && (
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center rounded-md text-white">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <span>Uploading...</span>
            </div>
          )}
          {!isUploading && (
            <button
              onClick={removePreview}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition"
              title="Remove"
            >
              <X size={16} />
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-gray-500">
          <UploadCloud className="h-10 w-10 mb-2" />
          <p className="text-sm mb-4 text-center">Drag & drop or click to upload</p>
          <label htmlFor="file-upload">
            <span className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 font-medium text-sm">
              Select Image
            </span>
            <input
              id="file-upload"
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleUpload}
              disabled={isUploading}
            />
          </label>
        </div>
      )}
    </div>
  );
}
