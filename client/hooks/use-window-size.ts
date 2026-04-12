"use client";
import { useState, useEffect } from "react";

interface WindowSize {
  width: number;
  height: number;
}

const useWindowSize = () => {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0 });
  const isClient = typeof window === "object";

  useEffect(() => {
    if (!isClient) return;

    const getSize = (): WindowSize => ({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    setSize(getSize());

    const onHandleResize = () => setSize(getSize());
    window.addEventListener("resize", onHandleResize);
    return () => window.removeEventListener("resize", onHandleResize);
  }, [isClient]);

  return size;
};

export default useWindowSize;
