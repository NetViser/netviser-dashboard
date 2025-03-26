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

  // Step 1: Attack Description
  tour.addStep({
    id: "attack-description",
    text: "Hey there! This box tells you about the attack—like what it is and how it sneaks around. It’s your quick guide to the bad guy we’re studying!",
    attachTo: { element: "#attack-description", on: "bottom" },
    arrow: true,
    buttons: [{ text: "Next", action: tour.next }],
  });

  // Step 2: Attack Records
  tour.addStep({
    id: "attack-records",
    text: "This table lists every time the attack popped up—like a log of when and where it hit. It’s your starting point for digging deeper!",
    attachTo: { element: "#attack-records", on: "bottom" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      { text: "Next", action: tour.next },
    ],
  });

  // Step 3: Explainability Selector
  tour.addStep({
    id: "explainability-selector",
    text: "This dropdown lets you switch views: ‘Visualization’ for charts or ‘XAI’ to see how our AI cracked the case. You’re in XAI mode now—let’s explore it!",
    attachTo: { element: "#explainability-selector", on: "left" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      { text: "Next", action: tour.next },
    ],
  });

  // Step 4: Attack XAI Section
  tour.addStep({
    id: "attack-xai",
    text: "Here’s where the magic happens! This section shows which clues—like speed or size—helped our AI spot the specific attack type. It’s like a behind-the-scenes look at the detective work!",
    attachTo: { element: "#attackxai", on: "left" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      { text: "Next", action: tour.next },
    ],
  });

  // Step 5: Bar Summary Chart
  tour.addStep({
    id: "bar-summary-chart",
    text: "This bar chart ranks the top clues—like how much they mattered to the AI in catching the attack type. Bigger bars mean bigger impact!",
    attachTo: { element: "#bar-summary-chart", on: "left" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Feature Importance Plot?")?.click();
          tour.next();
        },
      },
    ],
  });

  // Step 6: Description - What is SHAP Feature Importance Plot?
  tour.addStep({
    id: "description-What is SHAP Feature Importance Plot?",
    text: "This explanation breaks down the bar chart in simple words—like why those clues matter. It’s your cheat sheet to understanding the AI’s thinking!",
    attachTo: { element: "#description-bar", on: "left" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Feature Importance Plot?")?.click();
          tour.next();
        },
      },
    ],
  });

  // Step 7: Explanation Step (Bar - Gemini)
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
                  text: "Need more help? Click ‘Ask Gemini?’ for a custom explanation from our AI buddy—it’s like asking a friend to explain it!",
                });
              } else if (el.id === "explanation-bar" && step) {
                step.updateStepOptions({
                  text: "Check this out! Gemini’s answer explains the bar chart in a way that’s just for this attack—super handy!",
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
      { text: "Back", action: tour.back },
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

  // Step 8: Beeswarm Summary Chart
  tour.addStep({
    id: "beeswarm-summary-chart",
    text: "This ‘beeswarm’ chart shows how clues affect the attack—like a swarm of dots where each one tells a little story about the AI’s decision!",
    attachTo: { element: "#beeswarm-summary-chart", on: "left" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Beeswarm Plot?")?.click();
          tour.next();
        },
      },
    ],
  });

  // Step 9: Description - What is SHAP Beeswarm Plot?
  tour.addStep({
    id: "description-What is SHAP Beeswarm Plot?",
    text: "This box explains the beeswarm chart simply—like what those dots mean. It’s your guide to making sense of the swarm!",
    attachTo: { element: "#description-beeswarm", on: "left" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      {
        text: "Next",
        action() {
          document.getElementById("vis-description-What is SHAP Beeswarm Plot?")?.click();
          tour.next();
        },
      },
    ],
  });

  // Step 10: Explanation Step (Beeswarm - Gemini)
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
                  text: "Still puzzled? Hit ‘Ask Gemini?’ for a friendly AI explanation tailored just for this chart!",
                });
              } else if (el.id === "explanation-beeswarm" && step) {
                step.updateStepOptions({
                  text: "Here’s the scoop! Gemini explains the beeswarm chart in a way that fits this attack—pretty neat, huh?",
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
      { text: "Back", action: tour.back },
      {
        text: "Finish",
        action() {
          const explanationElement =
            document.getElementById("explanation-button-gemini-beeswarm") ||
            document.getElementById("explanation-beeswarm");
          if (explanationElement && explanationElement.id === "explanation-button-gemini-beeswarm") {
            explanationElement.click();
          }
          tour.complete();
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