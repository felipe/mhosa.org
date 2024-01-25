import Image from "next/image";

import controller from "@/public/controller@2x.png";

const driver = {
    name: `Felipe Oduardo`,
    location: `🇵🇷`,
    division: `Lite`,
    results: [
        {
            week: 1,
            track: 'Passkey Speedway',
            times: [
                {
                    season: 'Winter 2024',
                    races: {
                        1: {
                            yellow: 28,
                            blue: 31,
                            white: 33,
                            red: 35,
                            total: 127.47,
                        },
                        2: {
                            yellow: 23,
                            blue: 26,
                            white: 24,
                            red: 35,
                            total: 108.53,
                        },
                    }
                }, {
                    season: 'Winter 2023',
                    red: 0,
                    blue: 0,
                    yellow: 0,
                    white: 0,
                },
            ]
        },
        {
            week: 2,
            track: 'Radon Seal Raceway'
        },
        {
            week: 3,
            track: 'The Ring'
        },
        {
            week: 4,
            track: 'The Ring'
        },
        {
            week: 5,
            track: 'The Ring'
        },
        {
            week: 6,
            track: 'The Ring'
        },
        {
            week: 7,
            track: 'The Ring'
        },
        {
            week: 8,
            track: 'The Ring'
        }
    ]
}

export default function Driver() {
    return (
        <main className="flex flex-col items-center justify-between">
            <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
                <div className="flex w-full max-w-5xl items-center flex-col lg:flex-row">
                    <div className={`flex basis-full md:basis-1/4 aspect-square items-center bg-blue-900`}>
                        <Image src={controller} className={`flex`} alt={`Controller`} />
                    </div>
                    <div className="flex flex-col w-full lg:w-1/2 self-stretch grid content-between bg-lime-700 p-5">
                        <h1 className="self-stretch self-start" style={{ fontSize: `2.5rem`, lineHeight: `2.5rem` }}>
                            {driver.name}
                        </h1>
                        <p className="self-stretch self-start text-lg">{driver.location} {driver.division} Division</p>
                    </div>
                    <div className={`basis-full md:basis-1/4 self-stretch justify-between items-center bg-lime-600`}>

                    </div>
                </div>
            </div>
            <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
                <div className="flex w-full max-w-5xl flex-wrap items-center">
                    {driver.results.map((s, i) => {
                        return <div key={i} className={`basis-1/2 md:basis-1/4 self-stretch justify-between items-center p-3 bg-indigo-${i}00`}>
                            <h2 className={`text-zinc-${8 - i}00 p-3`}><strong>{s.track}</strong></h2>
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
