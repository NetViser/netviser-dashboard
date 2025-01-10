import { Blocks } from "react-loader-spinner";

export default function Spinner() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Blocks
        height="100"
        width="100"
        color="#4fa94d"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        visible={true}
      />
    </div>
  );
}
