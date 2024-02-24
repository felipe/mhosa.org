import { fetchDriverResults } from "@/client/notion";
import { notFound } from "next/navigation";

const buildTrackHeaders = (result: any): Set<string> => {
    // const headers = Object.keys(result)
    const response = new Set<string>()

    // headers.map(() => {
    // response.add('Season')
    response.add('Heat')
    response.add('Red')
    response.add('White')
    response.add('Blue')
    response.add('Yellow')
    if (result['Purple Laps'].number !== null) response.add('Purple')
    if (result['Orange Laps'].number !== null) response.add('Orange')
    if (result['Green Laps'].number !== null) response.add('Green')
    response.add('Total')
    // });

    return response
}

export default async function DriverBlock({ slug, track }: { slug: string, track: string }) {
    const driver = (await fetchDriverResults(slug, track))
    if (!driver) notFound();

    // console.log(driver)

    const trackResults = driver.results.filter((r: any) => r.track_slug === track).sort((a: any, b: any) => Number(a.heat.replace('Heat ', '')) - Number(b.heat.replace('Heat ', '')))
    const trackHeaders: Set<string> = buildTrackHeaders(trackResults[0]);

    return (
        <div className="flex flex-col items-center justify-between">
            <div className="flex w-full max-w-5xl flex-wrap items-center justify-between bg-white">
                <h2 className={`text-zinc-800 p-3`}><strong>{trackResults[0].track}</strong></h2>
            </div>
            <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
                <div className="flex w-full max-w-5xl flex-wrap items-center">
                    {Array.from(trackHeaders).map((s: any, i: any) => {
                        return <div key={i} className={/*${i === 0 ? `basis-1/6` : `flex-1`}*/` flex-1 flex-grow self-stretch justify-between items-center bg-white`}>
                            <div className={`p-3 bg-${s.toLowerCase()}-400`}>
                                <div className="flex flex-col">
                                    <div className="flex flex-row justify-between">
                                        <h2 className={`text-zinc-500 p-1`}><strong>{s === 'Heat' ? trackResults[i].season : s === 'Total' ? '' : ''}</strong></h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
            <div className="z-10 w-full max-w-5xl font-mono text-sm flex justify-center flex-col">
                {trackResults.map((r: any, i: any) => {
                    return <div key={i} className="flex w-full  flex-wrap items-center flex-row">
                        {Array.from(trackHeaders).map((s: any, k: any) => {
                            return <div key={`${i}${k}`} className={/*${i === 0 ? `basis-1/6` : `flex-1`}*/` flex-1 flex-grow self-stretch justify-between items-center bg-white`}>
                                <div className={`p-3 bg-${s.toLowerCase()}-400`}>
                                    <h2 className={`text-zinc-500 p-1`}><strong>{s === 'Season' ? r[`season`] : s === 'Heat' ? r[`heat`] : r[`${s} Laps`].number}</strong></h2>
                                    <div className="flex flex-col">
                                        <div className="flex flex-row justify-between">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                })}
            </div>
        </div>
    );
}
