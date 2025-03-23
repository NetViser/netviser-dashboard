'use client';
import { useLoadingStore } from "@/store/loadingStore";
import React, { useEffect, useRef } from "react";
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const scrollToHandler = (element: HTMLElement | null) => {
    if (element) {
        const offset = 100;
        window.scrollTo({
            top: element.offsetTop - offset,
            behavior: "smooth",
        });
    }
};

// ✅ Define Props Interface
interface AttackTourProps {
    tourType: "overall" | "timeseries";
}

const AttackTour = ({ tourType }:AttackTourProps) => {
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
            classes: 'shepherd-theme-dark',
            scrollTo: true,
            scrollToHandler: (element) => scrollToHandler(element),
          },
          useModalOverlay: true,
        });

        tour.addStep({
            id: 'attack-description',
            text: 'This section provides a description of the attack type.',
            attachTo: { element: '#attack-description', on: "bottom" },
            arrow: true,
            buttons: [{ text: 'Next', action: tour.next }],
        });

        tour.addStep({
            id: 'attack-records',
            text: 'These cards summarize the network data file you uploaded.',
            attachTo: { element: '#attack-records', on: "bottom" },
            arrow: true,
            buttons: [{ text: 'Next', action: tour.next }],
        });

        tour.addStep({
            id: 'explainability-selector',
            text: 'This chart shows the distribution of protocols in the network data file.',
            attachTo: { element: '#explainability-selector', on: "left" },
            arrow: true,
            buttons: [{ text: 'Next', action: tour.next }],
        });

        if (tourType === "overall") {
            tour.addStep({
                id: "Overall",
                text: "This chart shows the distribution of protocols in the network data file.",
                attachTo: { element: "#overall", on: "left" },
                arrow: true,
                buttons: [{ text: "Next", action: tour.next }],
            });

            tour.addStep({
                id: "attack-visualizations",
                text: "These charts show attack-based characteristic visualization.",
                attachTo: { element: "#attack-visualizations", on: "left" },
                arrow: true,
                buttons: [{ text: "Next", action() {
                  document.getElementById('timeseries')?.click();
                  tour.next();
              }, }],
            });

            tour.addStep({
                id: "Time Series",
                text: "Click to view the time series visualization.",
                attachTo: { element: "#timeseries", on: "left" },
                arrow: true,
                buttons: [{
                    text: "Next",
                    action() {
                      if (isLoadingRef.current) {
                        console.log("Waiting for loading to complete...");
                        return; // Do nothing if still loading
                      }
                      tour.next(); // Proceed if not loading
                    },
                }],
            });

            tour.addStep({
                id: "partition-select",
                text: "This box allows you to select the partition index.",
                attachTo: { element: "#partition-select", on: "left" },
                arrow: true,
                buttons: [{ text: 'Next', action: tour.next }],
            });

            tour.addStep({
                id: "feature-select",
                text: "This box allows you to select the feature to be visualized.",
                attachTo: { element: "#feature-select", on: "left" },
                arrow: true,
                buttons: [{ text: 'Next', action: tour.next }],
            });

            tour.addStep({
                id: "attack-visualizations",
                text: "This chart shows the time series visualization.",
                attachTo: { element: "#attack-visualizations", on: "left" },
                arrow: true,
                buttons: [{ text: 'Next', action: tour.next }],
            });

        } else if (tourType === "timeseries") {
            tour.addStep({
                id: "partition-select",
                text: "This box allows you to select the partition index.",
                attachTo: { element: "#partition-select", on: "left" },
                arrow: true,
                buttons: [{ text: "Next", action: tour.next }],
            });

            tour.addStep({
                id: "feature-select",
                text: "This box allows you to select the feature to be visualized.",
                attachTo: { element: "#feature-select", on: "left" },
                arrow: true,
                buttons: [{ text: "Next", action: tour.next }],
            });

            tour.addStep({
                id: "attack-visualizations",
                text: "This chart shows the time series visualization.",
                attachTo: { element: "#attack-visualizations", on: "left" },
                arrow: true,
                buttons: [{
                    text: "Next",
                    action() {
                        document.getElementById('overall')?.click();
                        return this.next();
                    },
                }],
            });

            tour.addStep({
                id: "Overall",
                text: "This chart shows the distribution of protocols in the network data file.",
                attachTo: { element: "#overall", on: "left" },
                arrow: true,
                buttons: [{ text: "Next", action() {
                  document.getElementById('overall')?.click();
                  return this.next();
              }, }],
            });

            tour.addStep({
                id: "attack-visualizations",
                text: "These charts show the attack-based characteristic visualization.",
                attachTo: { element: "#attack-visualizations", on: "left" },
                arrow: true,
                buttons: [{
                    text: "Next",
                    action() {
                      if (isLoadingRef.current) {
                        console.log("Waiting for loading to complete...");
                        return; // Do nothing if still loading
                      }
                      return this.next(); // Proceed if not loading
                    },
                }],
            });
        }

    return <button
    onClick={() => tour.start()}
    disabled={isLoading}
    className="px-4 py-2 ml-6 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
  >
    {isLoading ? "Loading..." : "Start Tour"}
  </button>
};

export default AttackTour;
