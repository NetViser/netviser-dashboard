"use client";

import React from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css"; // Base Shepherd styles
import "../../styles/shepherd-custom.css"; // Same custom styles as XAITour

const UploadPageTour = () => {
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      modalOverlayOpeningRadius: 10,
      modalOverlayOpeningPadding: 10,
      scrollTo: { behavior: "smooth", block: "center" }, // Smooth scrolling for better UX
    },
    useModalOverlay: true,
  });

  // Step 1: Welcome to NetViser (Updated)
  tour.addStep({
    id: "welcome",
    text: "Welcome to NetViser! This tool is perfect for beginners like you to visualize network traffic data and explore explainable AI insights. It even shows how machine learning models detect patterns—like network attacks—in a way that’s easy to understand. Let’s get started with a quick tour!",
    attachTo: { element: "#app-title", on: "bottom" }, // Attach to the "NetViser" title
    arrow: true,
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  // Step 2: Upload Your Data
  tour.addStep({
    id: "drag-drop-box",
    text: "Start by uploading your network data here. Just drag a CSV file (up to 1GB) into this box, or click it to browse your computer. This is where your network analysis journey begins!",
    attachTo: { element: "#drag-drop-box", on: "bottom" },
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

  // Step 3: Supported Formats
  tour.addStep({
    id: "supported-formats",
    text: "NetViser works with CSV files. These are simple tables of network data—like logs of connections or attacks. Don’t worry if you’re new; we’ll guide you every step of the way!",
    attachTo: { element: "#supported-formats", on: "top" }, // Attach to the "Supported formats" text
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

  // Step 4: Try a Sample File
  tour.addStep({
    id: "sample-file",
    text: "Not sure where to start? Try one of our sample files! Click any card here to upload a pre-made dataset and see NetViser in action—no file prep needed.",
    attachTo: { element: "#sample-file", on: "left" },
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

  // Step 5: Explore Network Attacks
  tour.addStep({
    id: "disclaimer-section",
    text: "Curious about network attacks? NetViser can detect and explain attacks like DDoS or Portscans. Check this section to see what’s supported—perfect for learning about cybersecurity!",
    attachTo: { element: ".bg-orange-50\\/80", on: "right" }, // Attach to DisclaimerSection
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

  // Step 6: What Happens Next
  tour.addStep({
    id: "next-steps",
    text: "After uploading, you’ll go to the dashboard. There, you’ll see cool visualizations and insights about your network data. Ready to explore? Let’s go!",
    attachTo: { element: "#drag-drop-box", on: "top" },
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
      className="px-4 py-2 mt-6 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-200"
    >
      Start Tour
    </button>
  );
};

export default UploadPageTour;