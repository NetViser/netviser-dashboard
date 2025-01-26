import { RingLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-gray-100 via-gray-200 to-gray-300">
      <RingLoader
        color="#FF5722"
        size={100} // Adjust the size here
        speedMultiplier={1.5} // Faster animation
        cssOverride={{
          display: "block",
          margin: "0 auto",
          borderWidth: "4px", // Thicker ring
        }}
      />
    </div>
  );
}
