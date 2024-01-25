
const season = {
    name: 'Winter 2024',
    divisions: [
        {
            name: 'Premier',
            weight: 300,
            standings: [
                {
                    points: 19,
                    driver: `Mike Stewart`
                },
                {
                    points: 16,
                    driver: `Scott Johnson`
                },
                {
                    points: 16,
                    driver: `Graham Dillon`
                },
                {
                    points: 11,
                    driver: `Don Reimer`
                },
                {
                    points: 11,
                    driver: `John Redfern`
                },
                {
                    points: 10,
                    driver: `Nathaniel McInturff`
                },
                {
                    points: 9,
                    driver: `Dan Pierce`
                },
                {
                    points: 6,
                    driver: `Brett Ginsberg​`
                },
                {
                    points: 0,
                    driver: `Alan Wolcott*`
                },
            ]
        },
        {
            name: 'Lite',
            weight: 100,
            standings: [
                {
                    points: 19,
                    driver: `Rick Dillon`
                },
                {
                    points: 19,
                    driver: `Dave Alexander`
                },
                {
                    points: 15,
                    driver: `Matt Kabeiseman`
                },
                {
                    points: 13,
                    driver: `Dave Lombardi`
                },
                {
                    points: 11,
                    driver: `Feli.pe Oduardo`
                },
                {
                    points: 8,
                    driver: `Bob Maddox`
                },
            ]
        },
        {
            name: 'Newcomers',
            weight: '50',
            standings: [
                {
                    points: 18,
                    driver: `John Peterson`
                },
                {
                    points: 17,
                    driver: `DJ Reimer`
                },
                {
                    points: 14,
                    driver: `Patrick Smith`
                },
                {
                    points: 10,
                    driver: `Skylar Robinson`
                },
                {
                    points: 7,
                    driver: `Dan Reynolds`
                },
                {
                    points: 7,
                    driver: `Eric Lorenz`
                },
                {
                    points: 6,
                    driver: `Justin Robinson`
                },
                {
                    points: 6,
                    driver: `Kyle Root`
                },
                {
                    points: 5,
                    driver: `Dave Hadley`
                },
            ]
        },
    ],
    schedule: [
        {
            week: 1,
            date: '2024-01-01',
            track: 'The Ring'
        },
        {
            week: 2,
            date: '2024-01-01',
            track: 'The Ring'
        },
        {
            week: 3,
            date: '2024-01-01',
            track: 'The Ring'
        },
        {
            week: 4,
            date: '2024-01-01',
            track: 'The Ring'
        },
        {
            week: 5,
            date: '2024-01-01',
            track: 'The Ring'
        },
        {
            week: 6,
            date: '2024-01-01',
            track: 'The Ring'
        },
        {
            week: 7,
            date: '2024-01-01',
            track: 'The Ring'
        },
        {
            week: 8,
            date: '2024-01-01',
            track: 'The Ring'
        }
    ]
}

export default function SeasonBlock() {
    return <>
        <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
            <div className="flex w-full max-w-5xl items-center justify-between bg-orange-200 p-6">
                <h2 className="text-red-900">{season.name} Season</h2>
            </div>
        </div>
        <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
            <div className="flex w-full max-w-5xl items-center">
                {season.divisions.map((d, i) => {
                    const position = new Set();

                    return <div key={i} className={`flex-1 self-stretch justify-between items-center p-3 bg-orange-${d.weight} text-yellow-700`}>
                        <h2 className="text-red-900 p-3"><strong>{d.name}</strong></h2>
                        <div className="flex flex-col">
                            <div className="flex flex-row justify-between">
                                <span>Driver</span>
                                <span>Points</span>
                            </div>
                            {d.standings.map((s, i) => {
                                position.add(s.points);
                                return <div key={i} className="flex flex-row justify-between">
                                    <span><strong>{Array.from(position).indexOf(s.points) + 1}.</strong> {s.driver}</span>
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
                    return <div key={i} className={`basis-1/4 self-stretch justify-between items-center p-3 bg-indigo-${i}00`}>
                        <h2 className={`text-zinc-${8-i}00 p-3`}><strong>{s.week}</strong></h2>
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