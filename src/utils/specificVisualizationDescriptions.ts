export type FeatureDescription = {
    title: string;
    description: string;
  };
  
  export const FeatureDescriptionMap: Record<string, FeatureDescription> = {
    uniqueSrcIps: {
      title: "Number of Unique Source IPs Comparison Bar Plot",
      description:
        "Imagine a crowd of people trying to enter a building—'Unique Source IPs' is like counting " +
        "how many different people (IPs) are sending data. In a DDoS attack, you might see a lot more " +
        "people (IPs) trying to flood the network, which can be a sign of trouble!",
    },
    uniqueDstPorts: {
      title: "Number of Unique Dst Port Comparison Bar Plot",
      description:
        "Imagine a building with many doors—'Unique Dst Port Count' is like counting how many " +
        "different doors are being targeted. In a port scan attack, attackers often target multiple " +
        "doors (ports) to find open ones, so this metric can help detect suspicious activity.",
    },
    uniqueSrcPorts: {
      title: "Number of Unique Src Port Comparison Bar Plot",
      description:
        "Think of ports as doors on a building—'Unique Src Port Count' is like counting how many " +
        "different doors are being used to send data. In a port scan attack, attackers might use " +
        "many different doors (ports) to probe for vulnerabilities, so this helps spot unusual patterns.",
    },
    packetlengthmean: {
      title: "Mean Packet Length Comparison Bar Plot",
      description:
        "Think of packets as envelopes carrying data—'Average Packet Length' is like measuring " +
        "the average size of these envelopes. In an attack, attackers might send unusually " +
        "large or small envelopes to overwhelm the network, so this helps spot suspicious patterns.",
    },
    bwdpacketlengthstd: {
      title: "Mean Backward Packet Length Std Comparison Bar Plot",
      description:
        "Imagine the sizes of envelopes coming back to you—'Backward Packet Length Std' measures how " +
        "much these sizes vary. In an attack, the variation might be unusually high or low, " +
        "helping us detect if something’s off with the incoming data.",
    },
    sankeyData: {
      title: "Network Flow Sankey Diagram",
      description:
        "Think of a Sankey diagram like a map of a river system! The 'rivers' (lines) show how " +
        "data flows from one place to another—like from a Source IP to a Source Port, then to a " +
        "Destination Port. The thicker the river, the more data is flowing. The boxes (nodes) are " +
        "like stops along the way, labeled with roles (e.g., 'Source IP'). Hover over them to see " +
        "details! Here, it helps us track how normal or attack traffic moves through the network.",
    },
    fwdPacketLengthMax: {
      title: "Mean Forward Packet Length Max Comparison Bar Plot",
      description:
        "Imagine sending a package through the mail—'Mean Fwd Packet Length Max' is like measuring " +
        "the average size of the largest package you sent in each conversation. In network terms, it’s " +
        "the average of the biggest chunk of data sent from your side. If this size changes a lot, " +
        "it might mean something unusual, like an attack, is happening!",
    },
    totalTCPFlowTime: {
      title: "Mean Total TCP Flow Time Comparison Bar Plot",
      description:
        "Picture a phone call with a friend—'Total TCP Flow Time' is like measuring " +
        "how long the entire conversation lasts from start to finish. In network terms, " +
        "it’s the total time data takes to travel back and forth between two points. If " +
        "this time suddenly gets way longer or shorter, it might mean something sneaky, " +
        "like an attack, is happening!",
    },
    fwdPSHFlags: {
      title: "Mean Forward PSH Flags Count Comparison Bar Plot",
      description:
        "Imagine sending a letter with an 'urgent' stamp—'Forward PSH Flags' is like counting how " +
        "often you use that stamp in your messages. In network terms, it’s a signal that the data " +
        "should be pushed immediately. If this happens a lot more or less than usual, it might " +
        "indicate an attack trying to keep connections open.",
    },
    bwdIATMean: {
      title: "Mean Backward IAT Comparison Bar Plot",
      description:
        "Think of 'Mean Backward Inter-Arrival Time' as a way to measure the average waiting time " +
        "between messages arriving back to you in a conversation. In the world of " +
        "networks, it shows how quickly data packets come from the other side. Big " +
        "changes in this time can hint at something odd, like a cyber attack, " +
        "messing with the usual flow!",
    },
    flowBytesPerSecond: {
      title: "Mean Flow Bytes Per Second Comparison Bar Plot",
      description:
        "Imagine you're sending messages back and forth with a friend. " +
        "'Mean Flow Bytes Per Second' measures the average amount of data " +
        "moving each second. In network terms, it shows how much data is flowing " +
        "between two points, helping us spot unusual patterns, like an attack " +
        "flooding the system with data!",
    },
    totalLengthOfFwdPacket: {
      title: "Mean Total Length of Forward Packet Comparison Bar Plot",
      description:
        "Imagine sending a package through the mail—'Total Length of Forward Packet' is like measuring " +
        "the total size of all the packages you sent in a conversation. In network terms, it’s the sum of " +
        "the sizes of all data packets sent from your side. Unusual patterns in this size might indicate " +
        "a port scan attack.",
    },
    bwdInitWinBytes: {
      title: "Mean Backward Init Win Bytes Comparison Bar Plot",
      description:
        "Imagine a window that controls how much data can be sent at once—'Backward Init Win Bytes' " +
        "is like the starting size of that window for data coming back to you. In network terms, " +
        "it’s the initial amount of data the other side can send without waiting for confirmation. " +
        "Unusual changes in this size might signal something fishy, like an attack!",
    },
  };