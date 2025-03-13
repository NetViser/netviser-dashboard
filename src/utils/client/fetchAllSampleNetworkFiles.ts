export interface SampleNetworkFile {
  name: string;
  featuredAttacks: string[];
}

export async function fetchAllSampleNetworkFiles(): Promise<
  SampleNetworkFile[]
> {
  try {
    // Simulate a 1-second delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
    // Return mock data
    return [
      {
        name: "ddos-ftp.csv",
        featuredAttacks: ["DDoS", "FTP-Patator"],
      },
      {
        name: "ssh-ftp.csv",
        featuredAttacks: ["SSH-Patator", "FTP-Patator"],
      },
      {
        name: "ftp_patator_occurence.csv",
        featuredAttacks: ["FTP-Patator"],
      },
      {
        name: "portscan_dos_hulk_slowloris.csv",
        featuredAttacks: ["DoS Hulk", "DoS Slowloris", "PortScan"],
      },
      {
        name: "portscan_dos_hulk.csv",
        featuredAttacks: ["DoS Hulk", "PortScan"],
      },
      {
        name: "portscan.csv",
        featuredAttacks: ["PortScan"],
      }
    ];
  } catch (error) {
    console.error("Error fetching sample network files:", error);
    throw new Error("Failed to fetch sample network files.");
  }
}
