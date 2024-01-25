import Image from "next/image";
import SeasonBlock from "@/components/SeasonBlock";

import r18 from "@/public/afx-audi.jpg";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
        <div className="flex w-full max-w-5xl items-center flex-col lg:flex-row">
          <div className="flex flex-col w-full lg:w-1/3 self-stretch grid content-between bg-pink-950 p-5">
            <h1 className="self-stretch self-start" style={{ fontSize: `2.5rem`, lineHeight: `2.5rem` }}>
              <strong className="text-red-600">M</strong>ilehigh<br />
              <strong className="text-slate-300">HO</strong> scale<br />
              <strong className="text-blue-600">S</strong>lotcar<br />
              <strong className="text-yellow-500">A</strong>ssociation
            </h1>
            <p className="self-stretch self-start text-lg">HO Slot Car Racing in the Denver Metro area</p>
          </div>
          <div className={`basis-full md:basis-2/3 self-stretch justify-between items-center`}>
            <Image src={r18} alt={`Audi R18 slotcar`} width={1920} height={1080} />
          </div>
        </div>
      </div>
    </main>
  );
}
