"use client";

import React from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css"; // Base Shepherd styles
import "../../styles/shepherd-custom.css"; // Same custom styles as XAITour

const DragDropBoxTour = () => {
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      modalOverlayOpeningRadius: 10,
      modalOverlayOpeningPadding: 10,
      scrollTo: false, // Kept as per your original
    },
    useModalOverlay: true,
  });

  tour.addStep({
    id: "drag-drop-box",
    text: "Drag and drop your network data file here or click to browse.",
    attachTo: { element: "#drag-drop-box", on: "bottom" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  tour.addStep({
    id: "sample-file",
    text: "Click the upload button to use our sample network data file.",
    attachTo: { element: "#sample-file", on: "left" },
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
      onClick={() => tour?.start()}
      className="px-4 py-2 mt-6 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-200"
    >
      Start Tour
    </button>
  );
};

export default DragDropBoxTour;