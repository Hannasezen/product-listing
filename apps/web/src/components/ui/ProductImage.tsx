"use client";

import Image from "next/image";
import { useState } from "react";

type ProductImageProps = {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
};

export function ProductImage({ src, alt, sizes, priority }: ProductImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <>
      <div
        aria-hidden="true"
        className={`absolute inset-0 animate-pulse bg-slate-200 transition-opacity duration-300 ${
          isLoaded ? "opacity-0" : "opacity-100"
        }`}
      />
      <Image
        src={src}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setIsLoaded(true)}
        className={`object-cover transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />
    </>
  );
}
