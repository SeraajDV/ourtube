import { PauseIcon } from "lucide-react";
import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/">
      <div className="flex items-center">
        <div className="bg-primary px-2.5 py-1 rounded-sm mr-1">
          <PauseIcon size={12} />
        </div>
        <h1 className="font-bold text-lg leading-tight tracking-tight">
          OurTube
        </h1>
      </div>
    </Link>
  );
}
