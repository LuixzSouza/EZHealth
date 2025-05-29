"use client";
import Link from "next/link";
import { useRef } from "react";
import { gsap } from "gsap";

export function LinkMenu({ children, link = "/", onClick }) {
  const linkRef = useRef(null);

  const handleMouseEnter = () => {
    gsap.to(linkRef.current, {
      scale: 1.05,
      backgroundColor: "rgba(255,255,255,0.3)",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleMouseLeave = () => {
    gsap.to(linkRef.current, {
      scale: 1,
      backgroundColor: "transparent",
      duration: 0.3,
      ease: "power2.out",
    });
  };

  return (
    <Link
      href={link}
      onClick={onClick}
      ref={linkRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="block text-white text-3xl px-4 py-2 rounded-md transition-colors duration-300"
    >
      {children}
    </Link>
  );
}
