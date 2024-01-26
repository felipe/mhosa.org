import DriverBlock from "@/components/DriverBlock";

const driver = {
    name: `John Redfern`,
    location: `🇺🇸`,
    division: `Premier`,
    color: `tie-dye`,
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
    return <DriverBlock driver={driver} />
}