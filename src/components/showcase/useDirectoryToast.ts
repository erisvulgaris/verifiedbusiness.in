"use client";

import { useToast } from "@/hooks/use-toast";
import { Check, Heart, GitCompare, Copy, Info, AlertTriangle } from "lucide-react";
import { createElement } from "react";

/**
 * Directory-styled toast helper.
 * Wraps shadcn useToast with our design tokens and Indian-context copy.
 *
 * Premium differentiator #6: micro-interactions that confirm actions.
 * Phone copy → "Copied!" tooltip 1.5s. Favorite add → "Saved to favorites".
 * Compare add → "Added to comparison". Etc.
 */
export function useDirectoryToast() {
  const { toast, dismiss } = useToast();

  return {
    dismiss,
    copied: (label?: string) =>
      toast({
        title: "Copied!",
        description: label ?? "Phone number copied to clipboard.",
      }),
    favoriteAdded: (businessName: string) =>
      toast({
        title: "Saved to favorites",
        description: `${businessName} added to your favorites.`,
      }),
    favoriteRemoved: (businessName: string) =>
      toast({
        title: "Removed from favorites",
        description: `${businessName} removed from your favorites.`,
      }),
    compareAdded: (businessName: string, count: number, max: number) =>
      toast({
        title: "Added to comparison",
        description: `${businessName} added. ${count}/${max} slots used.`,
      }),
    compareRemoved: (businessName: string) =>
      toast({
        title: "Removed from comparison",
        description: `${businessName} removed from comparison.`,
      }),
    compareFull: (max: number) =>
      toast({
        title: "Comparison full",
        description: `You can compare up to ${max} businesses at a time. Remove one to add another.`,
        variant: "destructive",
      }),
    reviewSubmitted: () =>
      toast({
        title: "Review submitted",
        description: "Thank you! Your review will appear within 24 hours.",
      }),
    listingSubmitted: (businessName: string) =>
      toast({
        title: "Listing submitted",
        description: `${businessName} will be reviewed in 3–5 working days.`,
      }),
    info: (title: string, description?: string) =>
      toast({ title, description }),
  };
}
