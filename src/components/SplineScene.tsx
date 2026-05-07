"use client";

import Spline from "@splinetool/react-spline";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function SplineScene() {
  return (
    <div className="w-24 h-24 relative flex items-center justify-center">
      <Suspense fallback={<Loader2 className="w-6 h-6 animate-spin text-primary" />}>
        <Spline 
          scene="https://prod.spline.design/kZ6uSUIYyc4pZ4sh/scene.splinecode" 
          className="w-full h-full"
        />
      </Suspense>
    </div>
  );
}
