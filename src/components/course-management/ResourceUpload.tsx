
import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TopicResource } from "@/types/course";
import { Upload, FileText, Video, Music, Image, X, Plus } from "lucide-react";
import { useUploadBucket } from '@/hooks/use-upload-bucket';
import { useUnlinkBucket } from '@/hooks/use-unlink-bucket';
import { InlineLoader } from "@/components/ui/loader";

interface ResourceUploadProps {
  resources: TopicResource[];
  onResourcesChange: (resources: TopicResource) => void;
  onResourcesRemove: (resources: TopicResource) => void;
  compact?: boolean;
  defaultName?: string; // New prop for subtopic name
}

export function ResourceUpload({
  resources,
  onResourcesChange,
  onResourcesRemove,
  compact = false,
}: ResourceUploadProps) {
  const uploadMutation = useUploadBucket();
  const deleteFileMutation = useUnlinkBucket();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="h-4 w-4" />;
      case 'audio': return <Music className="h-4 w-4" />;
      case 'image': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const getResourceTypeFromFile = (file: File): 'audio' | 'video' | 'image' | 'document' => {
    const type = file.type;
    if (type.startsWith('video/')) return 'video';
    if (type.startsWith('audio/')) return 'audio';
    if (type.startsWith('image/')) return 'image';
    return 'document';
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const resourceType = getResourceTypeFromFile(file);

    // Generate resource name using defaultName (subtopic title) + file extension
    const resourceName = file.name;

    try {
      const result = await uploadMutation.mutateAsync({
        path: 'courses/thumbnail',
        file: file
      });
      const resource: TopicResource = {
        title: resourceName,
        type: resourceType,
        url: result.url
      };

      onResourcesChange(resource);
    } catch (error) {
      console.error('Upload error:', error);
    }
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveResource = async (resource: TopicResource) => {
    await deleteFileMutation.mutateAsync({ prevFileLink: resource.url })
    onResourcesRemove(resource);
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label className="text-xs font-medium">Resources ({resources?.length})</Label>
          <Button
            variant="ghost"
            size="sm"
            onClick={triggerFileUpload}
            disabled={uploadMutation.isPending}
            className="h-6 px-2"
          >
            {uploadMutation.isPending ? <InlineLoader size="sm" /> : <Plus className="h-3 w-3" />} Add Resources
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.txt"
          />
        </div>

        {resources?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {resources.map((resource) => (
              <Badge key={resource.id} variant="outline" className="flex items-center gap-1 text-xs">
                {getResourceIcon(resource.type.toLowerCase())}
                <span>{resource.title}</span>
                <button
                  onClick={() => handleRemoveResource(resource)}
                  className="ml-1 hover:bg-destructive/20 rounded-full p-0.5"
                >
                  <X className="h-2 w-2" />
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label>Resources ({resources?.length})</Label>
        <Button
          variant="outline"
          size="sm"
          onClick={triggerFileUpload}
          disabled={uploadMutation.isPending}
        >
          {uploadMutation.isPending ? <InlineLoader size="sm" /> : <Upload className="h-4 w-4 mr-2" />}
          {uploadMutation.isPending ? 'Uploading...' : 'Upload File'}
        </Button>
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="video/*,audio/*,image/*,.pdf,.doc,.docx,.txt"
        />
      </div>

      {resources?.length > 0 && (
        <div className="space-y-2">
          {resources.map((resource) => (
            <div key={resource.id} className="flex items-center justify-between p-2 border rounded">
              <div className="flex items-center gap-2">
                {getResourceIcon(resource.type.toLowerCase())}
                <div>
                  <p className="font-medium text-sm">{resource.title}</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleRemoveResource(resource)}
                disabled={deleteFileMutation.isPending}
              >
                {deleteFileMutation.isPending ? <InlineLoader size="sm" /> : <X className="h-4 w-4" />}
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
