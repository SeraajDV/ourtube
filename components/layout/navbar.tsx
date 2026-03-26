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
import { Button } from "../ui/button";
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
        <SheetHeader>
          <SheetTitle asChild>
            <Link href="/">
              <div className="flex items-center">
                <div className="bg-primary px-2.5 py-1 rounded-sm mr-1 text-white">
                  <PauseIcon size={12} />
                </div>
                <span className="font-bold text-lg leading-tight tracking-tight">
                  OurTube
                </span>
              </div>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-1 px-2 mt-2">
          <Link
            href="/downloads"
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative overflow-hidden before:absolute before:inset-0 before:rounded-md before:bg-accent before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-200"
          >
            <Download
              size={16}
              className="relative z-10 group-hover:text-primary transition-colors duration-200"
            />
            <span className="relative z-10">Downloads</span>
          </Link>
          <Link
            href="/history"
            className="group flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative overflow-hidden before:absolute before:inset-0 before:rounded-md before:bg-accent before:scale-x-0 before:origin-left hover:before:scale-x-100 before:transition-transform before:duration-200"
          >
            <History
              size={16}
              className="relative z-10 group-hover:text-primary transition-colors duration-200"
            />
            <span className="relative z-10">History</span>
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

export default Navbar;
