"use client";

import dynamic from "next/dynamic";

const NavbarAuthClient = dynamic(() => import("./NavbarAuthClient"), { ssr: false });

export default function NavbarAuthWrapper() {
  return <NavbarAuthClient />;
}