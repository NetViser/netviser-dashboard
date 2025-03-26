"use client";

import React from "react";
import Shepherd from "shepherd.js";
import "../../styles/shepherd-custom.css";
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
      scrollTo: true,
      scrollToHandler: (element) => scrollToHandler(element),
    },
    useModalOverlay: true,
  });

  const { isLoading } = useLoadingStore();

  tour.addStep({
    id: "attack-description",
    text: "This section provides a description of the attack type.",
    attachTo: { element: "#attack-description", on: "bottom" },
    arrow: true,
    buttons: [{ text: "Next", action: tour.next }],
  });

  tour.addStep({
    id: "attack-records",
    text: "This part shows each attack point in the data.",
    attachTo: { element: "#attack-records", on: "bottom" },
    arrow: true,
    buttons: [{ text: "Next", action: tour.next }],
  });

  tour.addStep({
    id: "explainability-selector",
    text: "This part controls whether to show the explainability section or Explainable AI part.",
    attachTo: { element: "#explainability-selector", on: "left" },
    arrow: true,
    buttons: [{ text: "Next", action: tour.next }],
  });

  tour.addStep({
    id: "attack-xai",
    text: "This explains the overall feature importance of the attack.",
    attachTo: { element: "#attackxai", on: "left" },
    arrow: true,
    buttons: [{ text: "Next", action: tour.next }],
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
        },
      },
    ],
  });

  tour.addStep({
    id: "description-What is SHAP Feature Importance Plot?",
    text: "This helps to explain in simpler terms the feature importance plot.",
    attachTo: { element: "#description-bar", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Feature Importance Plot?")?.click();
          tour.next();
        },
      },
    ],
  });

  tour.addStep({
    id: "explanation-step-bar",
    text: "",
    when: {
      show: () => {
        return new Promise((resolve) => {
          const checkElement = () => {
            const el =
              document.getElementById("explanation-button-gemini-bar") ||
              document.getElementById("explanation-bar");
            if (el) {
              const step = tour.getById("explanation-step-bar");
              if (el.id === "explanation-button-gemini-bar" && step) {
                step.updateStepOptions({
                  text: "Still confused? Click 'Ask Gemini?' to get a custom explanation powered by AI.",
                });
              } else if (el.id === "explanation-bar" && step) {
                step.updateStepOptions({
                  text: "Here’s the result! This box shows Gemini’s explanation tailored to this attack type.",
                });
              }
              resolve(el);
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      },
    },
    attachTo: {
      element: () => {
        const explanationElement =
          document.getElementById("explanation-button-gemini-bar") ||
          document.getElementById("explanation-bar");
        return explanationElement ? `#${explanationElement.id}` : null;
      },
      on: "left",
    },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          const explanationElement =
            document.getElementById("explanation-button-gemini-bar") ||
            document.getElementById("explanation-bar");
          if (explanationElement && explanationElement.id === "explanation-button-gemini-bar") {
            explanationElement.click();
          }
          tour.next();
        },
      },
    ],
  });

  tour.addStep({
    id: "beeswarm-summary-chart",
    text: "Visualization of the feature importance by SHAP beeswarm plot.",
    attachTo: { element: "#beeswarm-summary-chart", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Beeswarm Plot?")?.click();
          tour.next();
        },
      },
    ],
  });

  tour.addStep({
    id: "description-What is SHAP Beeswarm Plot?",
    text: "This helps to explain in simpler terms the SHAP beeswarm plot.",
    attachTo: { element: "#description-beeswarm", on: "left" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Beeswarm Plot?")?.click();
          tour.next();
        },
      },
    ],
  });

  tour.addStep({
    id: "explanation-step-beeswarm",
    text: "",
    when: {
      show: () => {
        return new Promise((resolve) => {
          const checkElement = () => {
            const el =
              document.getElementById("explanation-button-gemini-beeswarm") ||
              document.getElementById("explanation-beeswarm");
            if (el) {
              const step = tour.getById("explanation-step-beeswarm");
              if (el.id === "explanation-button-gemini-beeswarm" && step) {
                step.updateStepOptions({
                  text: "Still confused? Click 'Ask Gemini?' to get a custom explanation powered by AI.",
                });
              } else if (el.id === "explanation-beeswarm" && step) {
                step.updateStepOptions({
                  text: "Here’s the result! This box shows Gemini’s explanation for the beeswarm plot.",
                });
              }
              resolve(el);
            } else {
              setTimeout(checkElement, 100);
            }
          };
          checkElement();
        });
      },
    },
    attachTo: {
      element: () => {
        const explanationElement =
          document.getElementById("explanation-button-gemini-beeswarm") ||
          document.getElementById("explanation-beeswarm");
        return explanationElement ? `#${explanationElement.id}` : null;
      },
      on: "left",
    },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action() {
          const explanationElement =
            document.getElementById("explanation-button-gemini-beeswarm") ||
            document.getElementById("explanation-beeswarm");
          if (explanationElement && explanationElement.id === "explanation-button-gemini-beeswarm") {
            explanationElement.click();
          }
          tour.next();
        },
      },
    ],
  });

  return (
    <button
      onClick={() => tour.start()}
      disabled={isLoading}
      className="px-4 py-2 ml-6 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
    >
      {isLoading ? "Loading..." : "Start Tour"}
    </button>
  );
};

export default XAITour;