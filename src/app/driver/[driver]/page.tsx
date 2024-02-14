import { fetchCurrentStandings } from "@/client/notion";
import DriverBlock from "@/components/DriverBlock";

export default async function Driver({ params }: { params: { driver: string} }) {
    const standings = fetchCurrentStandings();
    return <DriverBlock slug={params.driver} />
}
