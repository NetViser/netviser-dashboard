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
        name: "ddos_port_ftp.csv",
        featuredAttacks: ["DDoS", "Portscan", "FTP-Patator"],
      },
      {
        name: "dos_slow_hulk.csv",
        featuredAttacks: ["DoS Hulk", "DoS Slowloris"],
      },
      {
        name: "ssh_ftp_patator.csv",
        featuredAttacks: ["SSH-Patator", "FTP-Patator"],
      },
    ];
  } catch (error) {
    console.error("Error fetching sample network files:", error);
    throw new Error("Failed to fetch sample network files.");
  }
}
