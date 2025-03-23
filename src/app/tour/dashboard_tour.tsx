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

const DashBoardTour = () => {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        modalOverlayOpeningRadius: 10,
        modalOverlayOpeningPadding: 10,
        classes: 'shepherd-theme-dark',
        scrollTo: true,
        scrollToHandler: (element) => scrollToHandler(element),
      },
      useModalOverlay: true,
    });

    tour.addStep({
        id: 'summary-cards',
        text: 'These cards summarize the network data file you uploaded.',
        attachTo: {element:'#summary-cards', on:"bottom"},
        arrow: true,
        buttons: [
          {
            text: 'Next',
            action: tour.next,
          },
        ],
      });


    tour.addStep({
        id: 'protocol-distribution',
        text: 'This chart shows the distribution of protocols in the network data file.',
        attachTo: {element:'#protocol-distribution', on:"left"},
        arrow: true,
        buttons: [
          {
            text: 'Next',
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "src-ip-distribution",
        text: "This chart shows the distribution of source IP addresses.",
        attachTo: { element: "#src-ip-distribution", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });
    
      tour.addStep({
        id: "dst-port-distribution",
        text: "This chart displays the distribution of destination ports.",
        attachTo: { element: "#dst-port-distribution", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });
    
      tour.addStep({
        id: "attack-class-distribution",
        text: "Here, you can see the classification of detected network attacks.",
        attachTo: { element: "#attack-class-distribution", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });
    
      tour.addStep({
        id: "packets-per-second",
        text: "This section represents the number of packets per second over time.",
        attachTo: { element: "#packets-per-second", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Finish",
            action: tour.complete,
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

export default DashBoardTour;
