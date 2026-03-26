import { Menu, Search } from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import AppAvatar from "./app-avatar";
import Logo from "./logo";
import SearchBar from "./search-bar";

function Navbar() {
  return (
    <Sheet>
      <nav className="flex items-center px-4 md:px-6 py-4 justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6 shrink-0">
          <SheetTrigger>
            <Menu size={22} />
          </SheetTrigger>
          <Logo />
        </div>
        <div className="hidden md:flex flex-1 justify-center">
          <SearchBar />
        </div>
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          <Link
            href="/search"
            className="flex md:hidden items-center justify-center h-9 w-9 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground"
            aria-label="Search"
          >
            <Search size={20} />
          </Link>
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
