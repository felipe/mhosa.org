import { fetchDriverResults } from "@/client/notion";
import { notFound } from "next/navigation";
import { useState } from "react";

const buildTrackHeaders = (result: any): Set<string> => {
    // const headers = Object.keys(result)
    const response = new Set<string>()

    // // headers.map(() => {
    // // response.add('Season')
    response.add('Heat')
    response.add('Red')
    response.add('White')
    response.add('Blue')
    response.add('Yellow')
    if (result.purple_laps !== null) response.add('Purple')
    if (result.orange_laps !== null) response.add('Orange')
    if (result.green_laps !== null) response.add('Green')
    response.add('Total')
    // // });

    return response
}

export default async function ResultsBlock({ slug, track }: { slug: string, track: string }) {
    const [filter, setFilter] = useState('filter')

    const raceResults = (await fetchDriverResults(slug, track))
    if (!raceResults) notFound();

    // const trackResults = driver.results.filter((r: any) => r.track_slug === track).sort((a: any, b: any) => Number(a.heat.replace('Heat ', '')) - Number(b.heat.replace('Heat ', '')))
    // const trackHeaders: Set<string> = buildTrackHeaders(trackResults[0]);

    // .map((r: any, i: any) => {
    //     console.log(r);
    // })

    // console.log(Object.keys((raceResults as any).races))

    return (<div className="flex flex-col items-center justify-between">
        <div className="flex w-full max-w-5xl flex-wrap items-center justify-between bg-white">
            <h2 className={`text-zinc-800 p-3`}><strong>{raceResults.track}</strong></h2>
        </div>
        { // Seasons
            Object.keys((raceResults as any).races).map((season: any, i: any) => {
                const current_season = (raceResults as any).races[season];
                const trackHeaders: Set<string> = buildTrackHeaders(current_season[0])
                return <>
                    <div key={i} className="flex w-full max-w-5xl flex-wrap items-center justify-between bg-gray-200">
                        <h2 className={`text-zinc-800 p-3`}><strong>{season}</strong> &bull; <strong>{current_season[0]['race']}</strong></h2>
                        <h2 className={`text-zinc-800 p-3`}>Laps / Fastest Laps</h2>
                    </div>
                    <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
                        <div className="flex w-full max-w-5xl flex-wrap items-center">
                            {Array.from(trackHeaders).map((s: any, i: any) => {
                                return <div key={i} className={/*${i === 0 ? `basis-1/6` : `flex-1`}*/` flex-1 flex-grow self-stretch justify-between items-center bg-white text-black`}>
                                    <div className={`p-3 bg-${s.toLowerCase()}-400 ${s === 'Total' || s === 'Heat' ? 'bg-gray-200' : ''}`}>
                                        <div className="flex flex-col text-center items-center">
                                            <div className="flex flex-row justify-between">
                                                <h2 className={`text-zinc-500 p-1`}><strong>{s/* === 'Heat' ? '' : s  trackResults[i].season : s === 'Total' ? '' : ''*/}</strong></h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            })}
                        </div>
                    </div>
                    <div className="z-10 w-full max-w-5xl font-mono text-sm flex justify-center flex-col">
                        {Object.keys(current_season).map((r: any, x: any) => {
                            return <div key={x} className="flex w-full  flex-wrap items-center flex-row">
                                {Array.from(trackHeaders).map((s: any, k: any) => {
                                    return <div key={`${x}${k}`} className={/*${i === 0 ? `basis-1/6` : `flex-1`}*/` flex-1 flex-grow self-stretch justify-between items-center bg-white text-center`}>
                                        <div className={`p-3 bg-${s.toLowerCase()}-400`}>
                                            <h2 className={`text-zinc-500 p-1`}><strong>&nbsp;{s === `Heat` ? current_season[r].heat : current_season[r][s.toLowerCase() + '_laps']}&nbsp;</strong></h2>
                                        </div>
                                    </div>
                                })}
                            </div>
                        })}
                    </div>
                </>
            })
        }
    </div>
    )
}
