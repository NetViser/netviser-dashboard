"use client";

import { useLoadingStore } from "@/store/loadingStore";
import React, { useEffect, useRef } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css"; // Base Shepherd styles
import "../../styles/shepherd-custom.css"; // Same custom styles as other tours

const scrollToHandler = (element: HTMLElement | null) => {
  if (element) {
    const offset = 100;
    window.scrollTo({
      top: element.offsetTop - offset,
      behavior: "smooth",
    });
  }
};

// Define Props Interface
interface AttackTourProps {
  tourType: "overall" | "timeseries";
}

const AttackTour = ({ tourType }: AttackTourProps) => {
  const { isLoading } = useLoadingStore();
  const isLoadingRef = useRef(isLoading); // Use a ref to track isLoading

  // Update the ref whenever isLoading changes
  useEffect(() => {
    isLoadingRef.current = isLoading;
    console.log("isLoading updated:", isLoading);
  }, [isLoading]);

  const tour = new Shepherd.Tour({
    defaultStepOptions: {
      modalOverlayOpeningRadius: 10,
      modalOverlayOpeningPadding: 10,
      scrollTo: true,
      scrollToHandler: (element) => scrollToHandler(element),
    },
    useModalOverlay: true,
  });

  // Step 1: Welcome to the Attack Page
  tour.addStep({
    id: "welcome",
    text: "Hey there! This page digs into one attack type like DDoS your network file. We’ll show you its story, details, and cool visuals. Ready to explore?",
    attachTo: { element: "#specific-attack-detection-title", on: "bottom" },
    arrow: true,
    buttons: [{ text: "Next", action: tour.next }],
  });

  // Step 2: Attack Description
  tour.addStep({
    id: "attack-description",
    text: "This box gives you the scoop on the attack—like what it is and how it works. It’s your quick guide to understanding the troublemaker!",
    attachTo: { element: "#attack-description", on: "bottom" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      { text: "Next", action: tour.next },
    ],
  });

  // Step 3: Attack Records
  tour.addStep({
    id: "attack-records",
    text: "This table lists every time the attack showed up—like a logbook with timestamps and addresses (like who sent it and where it went).",
    attachTo: { element: "#attack-records", on: "bottom" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      { text: "Next", action: tour.next },
    ],
  });

  // Step 4: Explainability Selector
  tour.addStep({
    id: "explainability-selector",
    text: "This dropdown lets you pick how to explore: ‘Visualization’ for charts or ‘XAI’ for AI explanations. Try Visualization first to see the attack in pictures!",
    attachTo: { element: "#explainability-selector", on: "left" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      { text: "Next", action: tour.next },
    ],
  });

  // Step 5: Attack Visualizations Tabs
  tour.addStep({
    id: "attack-visualizations-tabs-button",
    text: "These tabs let you flip between two views: ‘Overall’ shows the attack’s big picture—like its main tricks—and ‘Time Series’ tracks how it unfolded over time. Pick one to check it out!",
    attachTo: { element: "#attack-visualizations-tabs-buttons", on: "right" },
    arrow: true,
    buttons: [
      { text: "Back", action: tour.back },
      { text: "Next", action: tour.next },
    ],
  });

  if (tourType === "overall") {
    // Step 6: Overall Tab
    tour.addStep({
      id: "Overall",
      text: "The ‘Overall’ tab shows what makes this attack stand out—like its special moves—compared to normal network stuff. It’s like spotting the bad guy in a crowd!",
      attachTo: { element: "#overall", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        { text: "Next", action: tour.next },
      ],
    });

    // Step 7: Attack Visualizations (Overall)
    tour.addStep({
      id: "attack-visualizations",
      text: "These charts reveal the attack’s unique patterns—like clues that set it apart. Think of it as a sketch of what the attack looks like!",
      attachTo: { element: "#attack-visualizations", on: "right" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        {
          text: "Next",
          action() {
            document.getElementById("timeseries")?.click();
            tour.next();
          },
        },
      ],
    });

    // Step 8: Time Series Tab
    tour.addStep({
      id: "Time Series",
      text: "The ‘Time Series’ tab tracks the attack over time—like a movie showing when it started, got busy, and calmed down!",
      attachTo: { element: "#timeseries", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        {
          text: "Next",
          action() {
            if (isLoadingRef.current) {
              console.log("Waiting for loading to complete...");
              return; // Wait if loading
            }
            tour.next();
          },
        },
      ],
    });

    // Step 9: Partition Select
    tour.addStep({
      id: "partition-select",
      text: "This dropdown lets you pick a time chunk—like a short scene from the attack—to zoom in on. Cool, right?",
      attachTo: { element: "#partition-select", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        { text: "Next", action: tour.next },
      ],
    });

    // Step 10: Feature Select
    tour.addStep({
      id: "feature-select",
      text: "Here, you choose what detail—like speed or size—to show in the chart. It’s like picking which part of the attack to spotlight!",
      attachTo: { element: "#feature-select", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        { text: "Next", action: tour.next },
      ],
    });

    // Step 11: Attack Visualizations (Time Series)
    tour.addStep({
      id: "attack-visualizations",
      text: "This chart shows how the attack moved over time—like a timeline with ups and downs. It’s your window into the action!",
      attachTo: { element: "#attack-visualizations", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        { text: "Finish", action: tour.complete },
      ],
    });
  } else if (tourType === "timeseries") {
    // Step 6: Partition Select
    tour.addStep({
      id: "partition-select",
      text: "This dropdown picks a time slice—like a moment in the attack—to focus on. It’s like zooming into one part of the story!",
      attachTo: { element: "#partition-select", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        { text: "Next", action: tour.next },
      ],
    });

    // Step 7: Feature Select
    tour.addStep({
      id: "feature-select",
      text: "Choose a detail—like how fast data moved—to see in the chart. It’s like picking what clue to check out!",
      attachTo: { element: "#feature-select", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        { text: "Next", action: tour.next },
      ],
    });
    // Step 8: Attack Visualizations (Time Series)
    tour.addStep({
      id: "attack-visualizations",
      text: "This chart tracks the attack over time—like a graph showing when it got busy or quiet. It’s like watching it unfold!",
      attachTo: { element: "#attack-visualizations", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        {
          text: "Next",
          action() {
            document.getElementById("overall")?.click();
            tour.next();
          },
        },
      ],
    });

    // Step 9: Overall Tab
    tour.addStep({
      id: "Overall",
      text: "The ‘Overall’ tab gives you a big-picture look—like the attack’s special traits compared to normal traffic. It’s a snapshot of its behavior!",
      attachTo: { element: "#overall", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        {
          text: "Next",
          action() {
            document.getElementById("overall")?.click();
            tour.next();
          },
        },
      ],
    });
    // Step 10: Attack Visualizations (Overall)
    tour.addStep({
      id: "attack-visualizations",
      text: "These charts highlight what makes the attack unique—like its patterns compared to regular data. It’s like a peek at its tricks!",
      attachTo: { element: "#attack-visualizations", on: "left" },
      arrow: true,
      buttons: [
        { text: "Back", action: tour.back },
        {
          text: "Finish",
          action() {
            if (isLoadingRef.current) {
              console.log("Waiting for loading to complete...");
              return; // Wait if loading
            }
            tour.complete();
          },
        },
      ],
    });
  }

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

export default AttackTour;
