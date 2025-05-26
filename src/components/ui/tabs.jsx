"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Root                                                              */
/* ------------------------------------------------------------------ */
function Tabs({ className, ...props }) {
  return (
    <TabsPrimitive.Root
      data-slot="tabs"
      className={cn("flex flex-col gap-2", className)}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  List container (no background)                                    */
/* ------------------------------------------------------------------ */
function TabsList({ className, ...props }) {
  return (
    <TabsPrimitive.List
      data-slot="tabs-list"
      className={cn(
        "inline-flex h-10 w-fit items-center justify-center gap-1", // taller, no bg
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Trigger (pill)                                                    */
/* ------------------------------------------------------------------ */
function TabsTrigger({ className, ...props }) {
  return (
    <TabsPrimitive.Trigger
      data-slot="tabs-trigger"
      className={cn(
        `inline-flex items-center justify-center
         whitespace-nowrap rounded-full px-4 py-1.5
         text-base font-medium transition-colors
         border border-brand text-brand
         hover:bg-brand/10
         data-[state=active]:bg-[#FFFD91]
         data-[state=active]:text-[#131B0E]
         focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand
         disabled:pointer-events-none disabled:opacity-50`,
        className
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Content                                                           */
/* ------------------------------------------------------------------ */
function TabsContent({ className, ...props }) {
  return (
    <TabsPrimitive.Content
      data-slot="tabs-content"
      className={cn("flex-1 outline-none", className)}
      {...props}
    />
  );
}

export { Tabs, TabsList, TabsTrigger, TabsContent };