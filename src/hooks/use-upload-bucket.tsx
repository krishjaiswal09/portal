import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";

interface UploadParams {
  path: string;
  file: File;
  prevFileLink?: string;
}

interface UploadResponse {
  url: string;
  message?: string;
}

export function useUploadBucket() {
  const { toast } = useToast();

  const mutation = useMutation<UploadResponse, Error, UploadParams>({
    mutationFn: async ({ path, file, prevFileLink }) => {
      toast({
        title: "Uploading file...",
        duration: Infinity
      });

      const formData = new FormData();
      formData.append("file", file);

      return fetchApi<UploadResponse>({
        path: "utility/upload-to-digital-ocean",
        method: "POST",
        params: { path, prevFileLink },
        data: formData,
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Upload successful",
        description: data.message || "File uploaded successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message || "Something went wrong while uploading.",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
