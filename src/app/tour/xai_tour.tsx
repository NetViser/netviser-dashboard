"use client";

import React from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import { useLoadingStore } from "@/store/loadingStore";

const scrollToHandler = (element: HTMLElement | null) => {
  if (element) {
    const offset = 100;
    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: "smooth",
    });
  }
};

const XAITour = () => {
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      modalOverlayOpeningRadius: 10,
      modalOverlayOpeningPadding: 10,
      classes: "shepherd-theme-dark",
      scrollTo: true,
      scrollToHandler: (element) => scrollToHandler(element),
    },
    useModalOverlay: true,
  });

  // Get the global loading state from Zustand
  const { isLoading } = useLoadingStore();

  tour.addStep({
    id: "attack-records",
    text: "This part shows each attack point in the data.",
    attachTo: { element: "#attack-records", on: "bottom" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: "explainability-selector",
    text: "This part controls whether to show the explainability section or Explanable AI part.",
    attachTo: { element: "#explainability-selector", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: "attack-xai",
    text: "This explains the overall feature importance of the attack.",
    attachTo: { element: "#attackxai", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  return (
    <button
      onClick={() => tour.start()}
      disabled={isLoading}
      className="px-4 py-2 ml-6 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? "Loading..." : "Start Tour"}
    </button>
  );
};

export default XAITour;
