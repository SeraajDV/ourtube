import { Menu } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { Button } from "../ui/button";
import AppAvatar from "./app-avatar";
import Logo from "./logo";
import SearchBar from "./search-bar";

function Navbar() {
  return (
    <Sheet>
      <nav className="flex items-center px-6 py-4 justify-between">
        <div className="flex items-center gap-6">
          <SheetTrigger>
            <Menu size={22} />
          </SheetTrigger>
          <Logo />
        </div>
        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AppAvatar />
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
