import { useState, useRef, useEffect } from "react";
import EmojiPicker, {
  EmojiClickData,
  EmojiStyle,
  Theme
} from "emoji-picker-react";
import { FaRegFaceSmile } from "react-icons/fa6";

import { cn } from "@/lib/utils";

import { useTheme } from "@/providers/theme-provider";

interface EmojiSelectorProps {
  onEmojiClick: (emojiData: EmojiClickData) => void;
  emojiStyle?: EmojiStyle;
  verticalAlign?: "top" | "bottom";
  horizontalAlign?: "left" | "right";
}

const EmojiSelector = ({
  onEmojiClick,
  emojiStyle = EmojiStyle.TWITTER,
  horizontalAlign = "left",
  verticalAlign = "bottom"
}: EmojiSelectorProps) => {
  const { theme } = useTheme();

  const [open, setOpen] = useState<boolean>(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={pickerRef}>
      <FaRegFaceSmile
        className="w-5 h-5 cursor-pointer hover:text-muted-foreground"
        onClick={() => setOpen((prev) => !prev)}
      />

      {open && (
        <div
          className={cn(
            "absolute z-50",
            horizontalAlign === "right" ? "right-0" : "left-0",
            verticalAlign === "top" ? "top-6" : "bottom-6"
          )}
        >
          <EmojiPicker
            onEmojiClick={(emojiData) => {
              onEmojiClick(emojiData);
              setOpen(false);
            }}
            theme={theme === "light" ? Theme.LIGHT : Theme.DARK}
            emojiStyle={emojiStyle}
            height={400}
            width={300}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiSelector;
