export const runtime = 'edge';

import DriverBlock from "@/components/DriverBlock";
import ResultsBlock from "@/components/ResultsBlock";

export default async function Driver({ params }: { params: { driver: string, track: string } }) {
    return <>
        <DriverBlock slug={params.driver} />
        <ResultsBlock slug={params.driver} track={params.track} />
    </>
}
