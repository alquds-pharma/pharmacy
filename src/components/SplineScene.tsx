"use client";

import Spline from "@splinetool/react-spline";
import { Suspense, useState } from "react";
import { Loader2, ShoppingBag } from "lucide-react";

export default function SplineScene() {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="flex items-center justify-center w-full h-full text-white/50">
        <ShoppingBag className="w-10 h-10 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-24 h-24 relative flex items-center justify-center">
      <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin text-primary" />}>
        <Spline 
          scene="https://prod.spline.design/ATD9vG5eT9L3D9E9/scene.splinecode" 
          onLoad={() => console.log("Spline loaded successfully")}
          onError={() => {
            console.error("Spline failed to load, switching to fallback icon");
            setHasError(true);
          }}
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}
