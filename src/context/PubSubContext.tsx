"use client";
import React, { createContext, useMemo } from "react";

//-------------------------------------------------------------------
type SubscriptionCallback = (data: any) => void;

//-------------------------------------------------------------------
interface PubSubContextType {
  publish: (event: string, data?: any) => void;
  subscribe: (event: string, callback: SubscriptionCallback) => () => void;
  unsubscribe: (event: string, callback: SubscriptionCallback) => void;
}

//-------------------------------------------------------------------
export const PubSubContext = createContext<PubSubContextType | undefined>(undefined);

/*-------------------------------------------------------------------
	Why using useMemo + Map instead of for example useState + array:
	- O(1) Lookups: Map provides constant-time complexity for get/set operations vs. O(n) with arrays
	- useMemo prevents recalculations on every render
	- Unlike useState, changes to the Map won't trigger re-renders unless you explicitly set state	
	- Map stores direct references vs. arrays that may need duplication for immutability
-------------------------------------------------------------------*/
export const PubSubProvider = ({ children }: { children: React.ReactNode }) => {
  const subscribers = useMemo(() => new Map(), []);

  const subscribe = (event: string, callback: SubscriptionCallback) => {
    if (!subscribers.has(event)) {
      subscribers.set(event, new Set());
    }
    subscribers.get(event).add(callback);

    // Return unsubscribe function
    return () => unsubscribe(event, callback);
  };

  const unsubscribe = (event: string, callback: SubscriptionCallback) => {
    if (subscribers.has(event)) {
      subscribers.get(event).delete(callback);
      if (subscribers.get(event).size === 0) {
        subscribers.delete(event);
      }
    }
  };

  const publish = (event: string, data?: any) => {
    if (subscribers.has(event)) {
      subscribers.get(event).forEach((callback: SubscriptionCallback) => {
        try {
          callback(data);
        } catch (error) {
          console.error(`Error in ${event} subscriber:`, error);
        }
      });
    } else {
      console.log("no-subs", event, subscribers.keys);
    }
  };

  const value = useMemo(
    () => ({
      subscribe,
      unsubscribe,
      publish,
    }),
    []
  );

  return <PubSubContext.Provider value={value}>{children}</PubSubContext.Provider>;
};
