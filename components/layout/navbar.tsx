import { Menu, Pause, PauseIcon } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

function Navbar() {
  return (
    <Sheet>
      <nav className="flex items-center px-6 py-4 justify-between">
        <div className="flex items-center gap-6">
          <SheetTrigger>
            <Menu size={22} />
          </SheetTrigger>
          <div className="flex items-center">
            <div className="bg-primary px-2.5 py-1 rounded-sm mr-1">
              <PauseIcon size={12} />
            </div>
            <h1 className="font-bold text-lg leading-tight tracking-tight">OurTube</h1>
          </div>
        </div>
        <div className="flex-1 bg-amber-400">middle</div>
        <div>
          <p className="">lol</p>
        </div>
      </nav>
      <SheetContent side="left" showCloseButton={false}>
        <SheetHeader className="flex">
          <SheetTitle>OurTube</SheetTitle>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}

export default Navbar;
