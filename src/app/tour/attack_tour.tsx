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

const AttackTour = () => {
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
        id: 'attack-description',
        text: 'This section provides a description of the attack type.',
        attachTo: {element:'#attack-description', on:"bottom"},
        arrow: true,
        buttons: [
          {
            text: 'Next',
            action: tour.next,
          },
        ],
      });

    tour.addStep({
        id: 'attack-records',
        text: 'These cards summarize the network data file you uploaded.',
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
        text: 'This chart shows the distribution of protocols in the network data file.',
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
        id: "Overall",
        text: "This chart shows the distribution of protocols in the network data file.",
        attachTo: { element: "#overall", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "attack-visualizations",
        text: "These charts shows the attack based characteristic visualization of the network data file.",
        attachTo: { element: "#attack-visualizations", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "Time Series",
        text: "This button allows you to view the time series visualization of the network data file.",
        attachTo: { element: "#timeseries", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action () {
              const selector = document.getElementById('timeseries')
              selector.click()
              return this.next()
            },
          },
        ],
      });

      tour.addStep({
        id: "attack-visualizations",
        text: "This chart shows the time series visualization of the network data file.",
        attachTo: { element: "#attack-visualizations", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      /*tour.addStep({
        id: "partition-select",
        text: "This box allows you to select the partition index.",
        attachTo: { element: "#partition-select", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });

      tour.addStep({
        id: "feature-select",
        text: "This box allows you to select the feature to be visualize.",
        attachTo: { element: "#feature-select", on: "left" },
        arrow: true,
        buttons: [
          {
            text: "Next",
            action: tour.next,
          },
        ],
      });*/

  return <button
    onClick={() => tour?.start()}
    className="px-4 py-2 ml-6 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition " 
  >
    Start Tour
  </button>;
};

export default AttackTour;
