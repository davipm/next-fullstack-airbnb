import React from "react";

import Container from "@/components/Container";
import Categories from "@/components/navbar/Categories";
import Logo from "@/components/navbar/Logo";
import Search from "@/components/navbar/Search";
import UserMenu from "@/components/navbar/UserMenu";

export default function Navbar() {
  return (
    <nav className="fixed w-full bg-white z-10 shadow-sm">
      <header className="py-4 border-b-[1px]">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-0 items-center">
            <Logo />
            <Search />
            <UserMenu />
          </div>
        </Container>
      </header>
      <Categories />
    </nav>
  );
}
