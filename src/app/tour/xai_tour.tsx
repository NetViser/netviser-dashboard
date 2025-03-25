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
    id: 'attack-description',
    text: 'This section provides a description of the attack type.',
    attachTo: { element: '#attack-description', on: "bottom" },
    arrow: true,
    buttons: [{ text: 'Next', action: tour.next }],
  });

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

  tour.addStep({
    id: "bar-summary-chart",
    text: "Visualization of the feature importance by mean of the attack.",
    attachTo: { element: "#bar-summary-chart", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Feature Importance Plot?")?.click();
          tour.next();
        }
      },
    ],
  });

  tour.addStep({
    id: "bar-description",
    text: "This helps to explain to simplier term to the feature importance plot.",
    attachTo: { element: "#bar-description", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Feature Importance Plot?")?.click();
          tour.next();
        }
      },
    ],
  });

  tour.addStep({
    id: "bar-summary-expand",
    text: "expand",
    attachTo: { element: "#bar-summary-expand", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("bar-summary-expand")?.click();
          tour.next();
        }
      },
    ],
  });

  tour.addStep({
    id: "bar-summary-focus",
    text: "",
    attachTo: { element: "#bar-summary-focus", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: "explanation-button",
    text: "",
    attachTo: { element: "#explanation-button-gemini", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("explanation-button-gemini")?.click();
          tour.next();
        }
      },
    ],
  });

  tour.addStep({
    id: "close-button",
    text: "",
    attachTo: { element: "#close-button", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("close-button")?.click();
          tour.next();
        }
      },
    ],
  });

  //////

  tour.addStep({
    id: "beeswarm-summary-chart",
    text: "Visualization of the feature importance by SHAP beeswarm plot.",
    attachTo: { element: "#beeswarm-summary", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Beeswarm Plot?")?.click();
          tour.next();
        }
      },
    ],
  });

  tour.addStep({
    id: "beeswarm-description",
    text: "This helps to explain to simplier term to the SHAP beeswarm plot.",
    attachTo: { element: "#beeswarm-description", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Beeswarm Plot?")?.click();
          tour.next();
        }
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
