import Image from "next/image";
import controller from "@/public/controller@2x.png";
import { fetchDriver } from "@/client/notion";
import { notFound } from "next/navigation";
import Link from "next/dist/client/link";

export default async function DriverBlock({ slug }: { slug: string }) {
    const driver = (await fetchDriver(slug))
    if (!driver) notFound();

    return (
        <main className="flex flex-col items-center justify-between">
            <div className="z-10 w-full flex-row font-mono text-sm sm:flex justify-center">
                <div className="flex w-full max-w-5xl items-center flex-col lg:flex-row">
                    <div style={{ position: 'relative' }} className={`flex basis-full md:basis-1/4 aspect-square items-center ${driver.color || `bg-red-900`}`}>
                        <Image src={controller} className={`flex`} alt={`Controller`} />
                    </div>
                    <div className="flex flex-col w-full lg:w-1/2 self-stretch grid content-between bg-lime-700 p-5">
                        {driver.nickname ? <div className="self-start">
                            <h1 className="self-start" style={{ fontSize: `2.5rem`, lineHeight: `2.5rem` }}>{driver.nickname}</h1>
                            <h2 className="self-stretch self-start italic" >
                                {driver.name}
                            </h2>
                        </div> : <h1 className="self-stretch self-start" style={{ fontSize: `2.5rem`, lineHeight: `2.5rem` }}>
                            {driver.name}
                        </h1>
                        }
                        <p className="self-stretch self-start text-lg">{driver.location} {driver.division} Division</p>
                    </div>
                    <div className={`basis-full md:basis-1/4 self-stretch justify-between items-center bg-lime-600`}>

                    </div>
                </div>
            </div>
            <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
                <div className="flex w-full max-w-5xl flex-wrap items-center">
                    {driver.tracks.map((s: string, i: any) => {
                        return <div key={i} className={`basis-1/2 md:basis-1/4 self-stretch justify-between items-center p-3 bg-indigo-${i}00`}>
                            <h2 className={`text-zinc-${8 - i}00 p-3`}><strong><Link href={`/driver/${slug}/${s.toLowerCase().replaceAll(' ', '-')}`}>{s}</Link></strong></h2>
                            <div className="flex flex-col">
                                <div className="flex flex-row justify-between">
                                </div>
                            </div>
                        </div>
                    })}
                </div>
            </div>
        </main>
    );
}
