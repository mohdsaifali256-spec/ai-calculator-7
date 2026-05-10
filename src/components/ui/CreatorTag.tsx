import { Instagram } from "lucide-react";
import { useInteractions } from "../../lib/hooks";

interface CreatorTagProps {
  className?: string;
}

export function CreatorTag({ className }: CreatorTagProps) {
  const { playInteraction } = useInteractions();

  const handleClick = () => {
    playInteraction('tap');
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  return (
    <a
      href="https://www.instagram.com/saif_ali_official_07"
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`creator-tag flex items-center gap-2 transition-all hover:scale-105 hover:shadow-[0_0_15px_#00f0ff,0_0_35px_#8a2eff] group ${className}`}
    >
      <Instagram className="w-4 h-4 text-[#8a2eff] group-hover:text-white transition-colors" />
      <span>@saif_ali_official_07</span>
    </a>
  );
}
