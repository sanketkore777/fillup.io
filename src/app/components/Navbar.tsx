"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from "@nextui-org/react";
import { SignInButton, SignedOut, SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const menuItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "AI", href: "/ai" },
  ];

  return (
    <Navbar onMenuOpenChange={setIsMenuOpen} className="h-[8vh] text-large">
      {/* Mobile Menu Toggle */}
      <NavbarContent>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          className="sm:hidden"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        />
        <NavbarBrand>
          <Link color="foreground" href="./">
            <Image src={"/LOGO.PNG"} alt="LOGO" width={80} height={40} />
          </Link>
        </NavbarBrand>
      </NavbarContent>

      {/* Signed In Content (Desktop) */}
      <SignedIn>
        <NavbarContent className="hidden sm:flex gap-6" justify="center">
          <NavbarItem>
            <Link color="foreground" href="/dashboard">
              Dashboard
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link color="primary" href="/ai">
              <i className="scale-110 flex">AI</i>
            </Link>
          </NavbarItem>
        </NavbarContent>
      </SignedIn>

      {/* Signed Out Content (Desktop) */}
      <SignedOut>
        <NavbarContent className="hidden sm:flex gap-7 " justify="center">
          <NavbarItem>
            <Link href="#home" color="foreground">
              Home
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#features" color="foreground">
              Features
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#developers" color="foreground">
              About Us
            </Link>
          </NavbarItem>
          <NavbarItem>
            <Link href="#footer" color="foreground">
              Contact
            </Link>
          </NavbarItem>
        </NavbarContent>
      </SignedOut>

      <NavbarContent justify="end">
        <NavbarItem className="p-2 lg:flex">
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <SignInButton />
          </SignedOut>
        </NavbarItem>
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu>
        {menuItems.map((item, index) => (
          <NavbarMenuItem key={index}>
            <Link
              color={
                index === 2
                  ? "primary"
                  : index === menuItems.length - 1
                  ? "danger"
                  : "foreground"
              }
              className="w-full"
              href={item.href}
              size="lg"
            >
              {item.label}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
