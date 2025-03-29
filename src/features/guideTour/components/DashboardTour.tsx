"use client";

import React from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css"; // Base Shepherd styles
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

const DashBoardTour = () => {
  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      modalOverlayOpeningRadius: 10,
      modalOverlayOpeningPadding: 10,
      scrollTo: true,
      scrollToHandler: (element) => scrollToHandler(element),
    },
    useModalOverlay: true,
  });

  // Step 1: Welcome to the Dashboard
  tour.addStep({
    id: "welcome",
    text: "Hey there! Welcome to the NetViser Dashboard! This page gives you a quick and easy overview of the network file you uploaded. You’ll see charts and numbers that show what’s going on in your data. Let’s check it out!",
    attachTo: { element: "#dashboard-title", on: "bottom" },
    arrow: true,
    buttons: [
      {
        text: "Next",
        action: tour.next,
      },
    ],
  });

  // Step 2: Summary Cards
  tour.addStep({
    id: "summary-cards",
    text: "These boxes sum up your network file at a glance—like how much data you uploaded and how many attacks were spotted. It’s a fast way to get the big picture!",
    attachTo: { element: "#summary-cards", on: "bottom" },
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

  // Step 3: Protocol Distribution
  tour.addStep({
    id: "protocol-distribution",
    text: "This pie chart shows the ‘languages’ your network uses—like TCP or UDP. It’s a simple way to see how your data is talking!",
    attachTo: { element: "#protocol-distribution", on: "left" },
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

  // Step 4: Source IP Distribution
  tour.addStep({
    id: "src-ip-distribution",
    text: "This bar chart shows where your network traffic comes from. Each bar is a different ‘address’ (called an IP)—like seeing who’s sending the most messages!",
    attachTo: { element: "#src-ip-distribution", on: "left" },
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

  // Step 5: Destination Port Distribution
  tour.addStep({
    id: "dst-port-distribution",
    text: "Here’s a chart of which ‘doors’ (called ports) your traffic is heading to. It shows what services—like web or email—are popular in your data!",
    attachTo: { element: "#dst-port-distribution", on: "left" },
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

  // Step 6: Attack Class Distribution
  tour.addStep({
    id: "attack-class-distribution",
    text: "This pie chart shows how network attacks are spread out in your file. Each slice represents a type of attack and its share of the total, giving you a clear view of your network’s security!",
    attachTo: { element: "#attack-class-distribution", on: "left" },
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

  // Step 7: Packets Per Second
  tour.addStep({
    id: "packets-per-second",
    text: "This graph tracks how busy your network is by counting ‘packets’—little bits of data—over time. Big jumps might show when things got hectic!",
    attachTo: { element: "#packets-per-second", on: "left" },
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
      className="px-4 py-2 ml-6 bg-orange-500 text-white rounded-lg shadow-md hover:bg-orange-600 hover:scale-105 transition-all duration-200"
    >
      Start Tour
    </button>
  );
};

export default DashBoardTour;
