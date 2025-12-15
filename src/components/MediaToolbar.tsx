import { EmojiPicker } from "./EmojiPicker";
import { GifPicker } from "./GifPicker";

interface MediaToolbarProps {
  onEmojiSelect: (emoji: string) => void;
  onGifSelect: (gifUrl: string) => void;
  className?: string;
}

/**
 * Toolbar with emoji and GIF pickers for rich content editing
 */
export function MediaToolbar({
  onEmojiSelect,
  onGifSelect,
  className = "",
}: MediaToolbarProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <EmojiPicker onSelect={onEmojiSelect} />
      <GifPicker onSelect={onGifSelect} />
    </div>
  );
}

export default MediaToolbar;
