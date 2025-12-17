
import React from 'react';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Smile } from "lucide-react";

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
}

const emojis = [
  '😀', '😃', '😄', '😁', '😊', '😉', '😍', '🥰', '😘', '😗',
  '😙', '😚', '🙂', '🤗', '🤩', '🤔', '🤨', '😐', '😑', '😶',
  '🙄', '😏', '😣', '😥', '😮', '🤐', '😯', '😪', '😫', '🥱',
  '😴', '😌', '😛', '😜', '😝', '🤤', '😒', '😓', '😔', '😕',
  '🙃', '🤑', '😲', '🙁', '😖', '😞', '😟', '😤', '😢', '😭',
  '🥺', '😩', '😨', '😰', '😥', '😪', '🤯', '😱', '🥵', '🥶',
  '😳', '🤪', '😵', '🥴', '😷', '🤒', '🤕', '🤢', '🤮', '🤧',
  '😇', '🥳', '🥸', '😎', '🤓', '🧐', '😈', '👿', '👹', '👺',
  '💀', '☠️', '👻', '👽', '🤖', '🎃', '😺', '😸', '😹', '😻',
  '😼', '😽', '🙀', '😿', '😾', '👋', '🤚', '🖐️', '✋', '🖖',
  '👌', '🤌', '🤏', '✌️', '🤞', '🤟', '🤘', '🤙', '👈', '👉',
  '👆', '🖕', '👇', '☝️', '👍', '👎', '👊', '✊', '🤛', '🤜',
  '👏', '🙌', '👐', '🤲', '🤝', '🙏', '✍️', '💅', '🤳', '💪',
  '🦾', '🦿', '🦵', '🦶', '👂', '🦻', '👃', '🧠', '🫀', '🫁',
  '🦷', '🦴', '👀', '👁️', '👅', '👄', '💋', '🩸', '❤️', '🧡',
  '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💔', '❣️', '💕'
];

export function EmojiPicker({ onEmojiSelect }: EmojiPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <Smile className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-2" align="end">
        <div className="grid grid-cols-10 gap-1 max-h-48 overflow-y-auto">
          {emojis.map((emoji, index) => (
            <button
              key={index}
              onClick={() => onEmojiSelect(emoji)}
              className="w-7 h-7 text-lg hover:bg-muted rounded flex items-center justify-center transition-colors"
            >
              {emoji}
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
