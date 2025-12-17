
import React from 'react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Paperclip, FileText, Camera, BarChart3, Calendar, AudioLines } from "lucide-react";

interface AttachmentDropdownProps {
  onAttachmentSelect: (type: string) => void;
  admin?: boolean
}

export function AttachmentDropdown({ onAttachmentSelect, admin = false }: AttachmentDropdownProps) {
  const attachmentTypes = [
    { label: 'File', icon: FileText, type: 'file' },
    { label: 'Photos & videos', icon: Camera, type: 'media' },
    { label: 'Audio', icon: AudioLines, type: 'audio' },
    { label: 'Poll', icon: BarChart3, type: 'poll' },
    // { label: 'Event', icon: Calendar, type: 'event' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={admin}>
        <Button size="icon" variant="ghost">
          <Paperclip className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48 bg-background border shadow-md z-50">
        {attachmentTypes.map((type) => (
          <DropdownMenuItem
            key={type.type}
            onClick={() => onAttachmentSelect(type.type)}
            className="flex items-center gap-2 cursor-pointer hover:bg-muted"
          >
            <type.icon className="w-4 h-4" />
            {type.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
