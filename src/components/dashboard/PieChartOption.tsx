// chartOptions.js
const pieoptions = {
    chart: {
      type: "pie",
      borderRadius: 10, // Rounded edges
      shadow: {
        color: "rgba(0, 0, 0, 0.2)", // Drop shadow color
        offsetX: 2, // Horizontal offset
        offsetY: 2, // Vertical offset
        opacity: 0.5,
        width: 5 // Shadow spread
      }
    },
    title: {
      text: "Distribution of Detected Attacks"
    },
    credits: {
      enabled: false
    },
    plotOptions: {
      pie: {
        allowPointSelect: true,
        cursor: "pointer",
        dataLabels: {
          enabled: true,
          format: "{point.name}: {point.percentage:.1f} %"
        },
        showInLegend: true
      }
    },
    series: [
      {
        name: "Attack Type",
        colorByPoint: true,
        data: [
          {
            name: "DDoS",
            y: 35,
          },
          {
            name: "DoS Hulk",
            y: 25
          },
          {
            name: "PortScan",
            y: 20
          },
          {
            name: "FTP-Patator",
            y: 10
          },
          {
            name: "SSH-Patator",
            y: 10
          }
        ]
      }
    ]
  };
  
  export default pieoptions;
  