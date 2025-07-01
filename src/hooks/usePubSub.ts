"use client";
import { useContext, useEffect } from "react";
import { PubSubContext } from "../context/PubSubContext";

//-------------------------------------------------------------------
export const usePubSub = () => {
  const context = useContext(PubSubContext);
  if (!context) {
    throw new Error("usePubSub must be used within a PubSubProvider");
  }
  return context;
};
