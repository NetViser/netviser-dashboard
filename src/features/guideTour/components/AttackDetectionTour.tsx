"use client";

import React from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import "../../../styles/shepherd-custom.css"; // Custom styles for Shepherd

const scrollToHandler = (element: HTMLElement | null) => {
  if (element) {
    const offset = 100;
    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: "smooth", // Enables smooth scrolling
    });
  }
};

const AttackDetectionTour = () => {
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      modalOverlayOpeningRadius: 10,
      modalOverlayOpeningPadding: 10,
      scrollTo: true,
      scrollToHandler: (element) => scrollToHandler(element),
    },
    useModalOverlay: true,
  });

  // Step 1: Welcome to Attack Detection
  tour.addStep({
    id: "welcome",
    text: "Hi there! Welcome to the Attack Detection page! Here, you’ll see all network attack types found in your network file. We’ll list them out and let you dig deeper. Ready to explore?",
    attachTo: { element: "#attack-detection-title", on: "bottom" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  // Step 2: Attacks Table Overview
  tour.addStep({
    id: "attacks-table",
    text: "This table is your attack summary! It lists every type of attack we found and how many times each one happened. It’s a quick way to see what’s threatening your network.",
    attachTo: { element: "#attacks-table", on: "bottom" },
    arrow: true,
    buttons: [
      {
        text: "Back",
        action: tour.back,
      },
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  // Step 3: Table Details
  tour.addStep({
    id: "attacks-table-content",
    text: "Each row here shows an attack type—like ‘DDoS’—and its count. The numbers tell you how often that attack appeared in your file. Simple, right?",
    attachTo: { element: "#attacks-table-content", on: "bottom" },
    arrow: true,
    buttons: [
      {
        text: "Back",
        action: tour.back,
      },
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });
  // Step 4: Analyze Button
  tour.addStep({
    id: "analyze-button",
    text: "Curious for more? Hit ‘Analyze’ on any row to explore that attack in detail—like special visuals and easy AI explanations (we call it XAI). It’s your key to unlocking what’s happening in your network!",
    attachTo: {
      element:
        "#attacks-table-content tbody tr:first-child td:last-child button",
      on: "right",
    },
    arrow: true,
    buttons: [
      {
        text: "Back",
        action: tour.back,
      },
      {
        text: "Finish",
        action: tour.complete,
      },
    ],
  });
  return (
    <button
      onClick={() => tour?.start()}
      className="px-4 py-2 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-200"
    >
      Start Tour
    </button>
  );
};

export default AttackDetectionTour;
