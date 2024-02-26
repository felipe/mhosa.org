import { getSeason } from "@/client/notion";
import Link from "next/link";

export default async function SeasonBlock() {
    const season = await getSeason()

    // console.log(season)

    return <>
        <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
            <div className="flex w-full max-w-5xl items-center justify-between bg-orange-200 p-6">
                <h2 className="text-red-900">{!season ? null : season.name} Season</h2>
            </div>
        </div>
        <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
            <div className="flex w-full max-w-5xl items-center flex-col lg:flex-row">
                {!season ? null : season.divisions.map((d: any, i: any) => {
                    const position = new Set();

                    return <div key={i} className={`basis-full md:basis-1/3 self-stretch justify-between items-center p-3 bg-orange-${d.weight} text-yellow-700`}>
                        <h2 className="text-red-900 p-3"><strong>{d.name}</strong></h2>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <span>Driver</span>
                                <span>Points</span>
                            </div>
                            {d.standings.map((s: any, i: any) => {
                                position.add(s.points);
                                return <div key={i} className="flex flex-row justify-between">
                                    <span><strong>{Array.from(position).indexOf(s.points) + 1}.</strong> <Link href={s.slug ? `/driver/` + s.slug : `#`}>{s.driver}</Link></span>
                                    <span>{s.points}</span>
                                </div>
                            })}
                        </div>
                    </div>
                })}
            </div>
        </div>
        <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
            <div className="flex w-full max-w-5xl flex-wrap items-center">
                {season.schedule.map((s, i) => {
                    return <div key={i} className={`basis-1/2 md:basis-1/4 self-stretch justify-between items-center p-3 bg-indigo-${i}00`}>
                        <h2 className={`text-zinc-${8 - i}00 p-3`}><Link href={`/${season.name}/${s.race}`}>{(s as any).race}. {(s as any).track}</Link></h2>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                            </div>
                        </div>
                    </div>
                })}
            </div>
        </div>
    </>
}