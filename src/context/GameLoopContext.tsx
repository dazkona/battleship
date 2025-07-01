"use client";
import { createContext, ReactNode, useContext, useMemo, useState, useRef } from "react";

//-------------------------------------------------------------------
interface GameLoopContextType {
  elapsedTimeMs: number;
  deltaTimeMs: number;

  start: () => void;
  stop: () => void;
}

//-------------------------------------------------------------------
export const GameLoopContext = createContext<GameLoopContextType | undefined>(undefined);

//-------------------------------------------------------------------
interface GameLoopProviderProps {
  children: ReactNode;
}

//-------------------------------------------------------------------
export function GameLoopProvider({ children }: GameLoopProviderProps) {
  const [elapsedTimeMs, setElapsedTime] = useState<number>(0.0);
  const [deltaTimeMs, setDeltaTime] = useState<number>(0.0);
  const [paused, setPaused] = useState<boolean>(false);
  const interval = useRef<any | null>(null);

  //-------------------------------------------------------
  const start = () => {
    interval.current = requestInterval(tick, 50);
  };

  //---------------------------------------------------------------
  const requestInterval = (fn: (delta: number, elapsed: number) => void, delay: number) => {
    var requestAnimFrame = (cb: any) => {
        if (window.requestAnimationFrame) return window.requestAnimationFrame(cb);
        else return (cb: () => number) => window.setTimeout(cb, 1000 / 60);
      },
      start = new Date().getTime(),
      totalStart = start,
      handle: any = {};

    function loop(callback: FrameRequestCallback) {
      handle.value = requestAnimFrame(loop);
      var current = new Date().getTime(),
        delta = current - start;
      if (delta >= delay) {
        start = new Date().getTime();
        fn(delta, current - totalStart);
      }
    }

    handle.value = requestAnimFrame(loop);
    return handle;
  };

  //-------------------------------------------------------
  const tick = (delta: number, elapsed: number) => {
    setDeltaTime(delta);
    setElapsedTime(elapsed);
  };

  //-------------------------------------------------------
  const pause = () => {
    setPaused(true);
  };

  //-------------------------------------------------------
  const restart = () => {
    setPaused(false);
  };

  //---------------------------------------------------------------
  const clearRequestTimeout = (handle: any) => {
    window.cancelAnimationFrame
      ? window.cancelAnimationFrame(handle.value)
      : // @ts-ignore
      window.webkitCancelAnimationFrame
      ? // @ts-ignore
        window.webkitCancelAnimationFrame(handle.value)
      : // @ts-ignore
      window.webkitCancelRequestAnimationFrame
      ? // @ts-ignore
        window.webkitCancelRequestAnimationFrame(handle.value)
      : // @ts-ignore
      window.mozCancelRequestAnimationFrame
      ? // @ts-ignore
        window.mozCancelRequestAnimationFrame(handle.value)
      : // @ts-ignore
      window.oCancelRequestAnimationFrame
      ? // @ts-ignore
        window.oCancelRequestAnimationFrame(handle.value)
      : // @ts-ignore
      window.msCancelRequestAnimationFrame
      ? // @ts-ignore
        window.msCancelRequestAnimationFrame(handle.value)
      : clearTimeout(handle);
  };

  //-------------------------------------------------------
  const stop = () => {
    if (interval.current) {
      clearRequestTimeout(interval.current);
      interval.current = null;
    }
  };

  //-------------------------------------------------------
  const value = useMemo(
    () => ({
      elapsedTimeMs,
      deltaTimeMs,
      start,
      stop,
    }),
    [elapsedTimeMs, deltaTimeMs]
  );

  return <GameLoopContext.Provider value={value}>{children}</GameLoopContext.Provider>;
}
