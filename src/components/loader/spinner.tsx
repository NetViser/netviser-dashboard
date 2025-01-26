import { GridLoader, RingLoader } from "react-spinners";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <GridLoader
        color="#ff7300"
        cssOverride={{}}
        loading
        size={20}
        speedMultiplier={2}
      />
    </div>
  );
}
