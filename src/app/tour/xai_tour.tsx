'use client';

import React from "react";
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const scrollToHandler = (element: HTMLElement | null) => {
    if (element) {
        const offset = 100;
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: "smooth", // Enables smooth scrolling
      });
    }
  };

const XAITour = () => {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        classes: 'shepherd-theme-dark',
        scrollTo: true,
        scrollToHandler: (element) => scrollToHandler(element),
      },
      useModalOverlay: true,
    });

    tour.addStep({
        id: 'attack-records',
        text: 'This part show each attack point in the data.',
        attachTo: {element:'#attack-records', on:"bottom"},
        arrow: true,
        buttons: [
          {
            text: 'Next',
            action: tour.next,
          },
        ],
      });


    tour.addStep({
        id: 'explainability-selector',
        text: 'This part control whether to show the explainability section or Explanable AI part.',
        attachTo: {element:'#explainability-selector', on:"left"},
        arrow: true,
        buttons: [
          {
            text: 'Next',
            action: tour.next,
          },
        ],
      });
    
      tour.addStep({
        id: "attack-xai",
        text: "This explain the overall feature importance of the attack.",
        attachTo: { element: "#attackxai", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      

  return <button
    onClick={() => tour?.start()}
    className="px-4 py-2 ml-6 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition " 
  >
    Start Tour
  </button>;
};

export default XAITour;
