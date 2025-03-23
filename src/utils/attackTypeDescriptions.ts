export const attackTypeDescription = [
  {
    attackType: "DoS Slowloris",
    description:
      "Slowloris targets web servers by establishing numerous TCP connections and sending incomplete HTTP headers, forcing the server to keep these sessions open. It exploits TCP connection management by leaving sessions in a half-open state, consuming the server's available connection slots and preventing new legitimate connections.",
  },
  {
    attackType: "DoS Hulk",
    description:
      "DoS Hulk overwhelms a server by rapidly sending a large volume of complete HTTP requests, saturating the network interface and server processing by flooding the target with packets, which effectively consumes available bandwidth and CPU resources.",
  },
  {
    attackType: "SSH-Patator",
    description:
      "SSH-Patator attempts to gain unauthorized access by brute-forcing SSH login credentials through repeated connection attempts. It repeatedly initiates TCP connections on port 22, exploiting the SSH handshake process and potentially triggering rate limits or exhausting connection resources.",
  },
  {
    attackType: "FTP-Patator",
    description:
      "FTP-Patator targets FTP services by automating numerous login attempts in a short period. It repeatedly opens TCP connections to the FTP control port (typically port 21), leveraging the low overhead of FTP handshakes to flood the server with authentication requests.",
  },
  {
    attackType: "Portscan",
    description:
      "PortScan probes a target system by sending TCP/UDP packets across a range of ports to identify which ones are open. It methodically scans ports using techniques like sending TCP SYN packets and analyzing responses (SYN-ACK or RST), allowing attackers to map network services without disrupting normal traffic.",
  },
  {
    attackType: "DDoS",
    description:
      "A Distributed Denial-of-Service (DDoS) attack uses multiple compromised systems to send overwhelming traffic to a target, rendering it inaccessible. It leverages a coordinated flood of packets from diverse sources to saturate the target’s network bandwidth and processing capacity, often using various protocols to maximize impact.",
  },
];
