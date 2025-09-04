import Image from "next/image";
import Timer from "./components/Timer";

export default function Home() {
  return (
    <div className="font-sans   items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
     <div className=" border-2 rounded-md ">
      <Timer/>
     </div>
    </div>
  );
}
