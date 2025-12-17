import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { fetchApi } from "@/services/api/fetchApi";
import { useToast } from "@/hooks/use-toast";

interface UploadParams {
  prevFileLink?: string;
}

interface UploadResponse {
  message?: string;
}

export function useUnlinkBucket() {
  const { toast } = useToast();

  const mutation = useMutation<UploadResponse, Error, UploadParams>({
    mutationFn: async ({ prevFileLink }) => {
      toast({
        title: "Deleting file...",
        duration: Infinity
      });

      return fetchApi<UploadResponse>({
        path: "utility/unlink-file-to-digital-ocean",
        method: "POST",
        params: { prevFileLink }
      });
    },
    onSuccess: (data) => {
      toast({
        title: "Delete successful",
        description: data.message || "File deleted successfully!"
      });
    },
    onError: (error) => {
      toast({
        title: "Delete failed",
        description: error.message || "Something went wrong while deleting.",
        variant: "destructive",
      });
    },
  });

  return mutation;
}
