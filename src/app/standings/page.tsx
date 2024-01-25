import Image from "next/image";
import SeasonBlock from "@/components/SeasonBlock";

export default function Standings() {
    return (
        <main className="flex flex-col items-center justify-between">
            <SeasonBlock />
        </main>
    );
}