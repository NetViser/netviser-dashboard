'use client';

import React, { useEffect } from "react";
import Shepherd from 'shepherd.js';
import 'shepherd.js/dist/css/shepherd.css';

const DragDropBoxTour = () => {
    const tour = new Shepherd.Tour({
      defaultStepOptions: {
        modalOverlayOpeningRadius: 10,
        modalOverlayOpeningPadding: 10,
        classes: 'shepherd-theme-dark',
        scrollTo: false,
      },
      useModalOverlay: true,
    });

    tour.addStep({
        id: 'drag-drop-box',
        text: 'Drag and drop your network data file here or click to browse.',
        attachTo: {element:'#drag-drop-box', on:"bottom"},
        arrow: true,
        buttons: [
          {
            text: 'Next',
            action: tour.next,
          },
        ],
      });


    tour.addStep({
        id: 'sample-file',
        text: 'Click the upload button to use our sample network data file.',
        attachTo: {element:'#sample-file', on:"left"},
        arrow: true,
        buttons: [
          {
            text: 'Next',
            action: tour.next,
          },
        ],
      });
      

  return <button
    onClick={() => tour?.start()}
    className="px-4 py-2 mt-6 bg-orange-500 text-white rounded-lg shadow hover:bg-orange-600 transition " 
  >
    Start Tour
  </button>;
};

export default DragDropBoxTour;
