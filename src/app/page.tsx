import Image from "next/image";
import SeasonBlock from "@/components/SeasonBlock";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-between">
      <SeasonBlock />
    </main>
  );
}
