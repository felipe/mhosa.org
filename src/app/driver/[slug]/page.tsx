import { fetchCurrentStandings } from "@/client/notion";
import DriverBlock from "@/components/DriverBlock";

export default async function Driver({ params }: { params: { slug: string } }) {
    const x = fetchCurrentStandings();
    // console.log(x);
    return <DriverBlock slug={params.slug} />
}
