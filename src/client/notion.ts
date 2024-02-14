import "server-only";

import { Client } from "@notionhq/client";
import React from "react";
import {
    BlockObjectResponse,
    PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const DriversTable = ``
const TracksTable = `🎢 Tracks`
const SeasonsTable = `☑️ Season`
const DivisionsTable = `⏫ Divisions`

export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const colorMatcher = (color: string) => {
    switch (color) {
        case 'blue':
            return 'bg-blue-900'
        case 'red':
            return 'bg-red-900'
        case 'green':
            return 'bg-green-900'
        case 'yellow':
            return 'bg-yellow-900'
        case 'tiedye':
            return 'tie-dye'
        default:
            return 'bg-gray-500'
    }
}

type Driver = {
    name: string,
    color: string,
    nickname: string,
    location: string,
    division: string,
    results: any[],
    tracks: string[]
}

const cleanRaceResults = async (races: any) => {
    return await Promise.all(races.results.map(async (race: any) => {
        const division = await fetchDivisionById(race.properties[DivisionsTable].relation[0].id) as any;
        const track = await fetchTrackById(race.properties[TracksTable].relation[0].id) as any;
        const season = await fetchSeasonById(race.properties[SeasonsTable].relation[0].id) as any;

        return {
            ...race.properties,
            division: division.properties.Name.title[0].plain_text,
            season: season.properties.Name.title[0].plain_text,
            track:  track.properties.Name.title[0].plain_text,
            track_slug: track.properties.Name.title[0].plain_text.toLowerCase().replaceAll(' ', '-'),
            heat: race.properties.Heat.select.name,
        }
    }))
}

const fetchDivisionById = async (id: string) => {
    return await (await notion.databases.query({
        database_id: process.env.NOTION_DIVISION_DATABASE!
    })).results.find((division: any) => division.id === id)
}

const fetchTrackById = async (id: string) => {
    return await (await notion.databases.query({
        database_id: process.env.NOTION_TRACKS_DATABASE!
    })).results.find((track: any) => track.id === id)
}

const fetchSeasonById = async (id: string) => {
    return await (await notion.databases.query({
        database_id: process.env.NOTION_SEASON_DATABASE!
    })).results.find((season: any) => season.id === id)
}

export const fetchDrivers = React.cache(() => {
    return notion.databases.query({
        database_id: process.env.NOTION_DRIVER_DATABASE!,
        // filter: {
        //   property: "Status",
        //   select: {
        //     equals: "Published",
        //   },
        // },
    }) as Promise<{ results: any[] }>;
});

export const fetchDriver = async (slug: string) => {
    const driver = (await notion.databases.query({
        database_id: process.env.NOTION_DRIVER_DATABASE!, filter: {
            property: "slug",
            rich_text: {
                equals: slug,
            },
        }
    })).results[0]
    // console.log(driver)

    const raceResults = await notion.databases.query({
        database_id: process.env.NOTION_RESULTS_DATABASE!, filter: {
            property: "🎮 Drivers",
            relation: {
                contains: driver.id,
            },
        }, sorts: [{ timestamp: 'created_time', direction: 'descending' }]
    })

    const results = await cleanRaceResults(raceResults)

    // console.log(results)

    const tracks = Array.from(new Set(results.map(race => race.track)))

    // const division = (await notion.databases.query({
    //     database_id: process.env.NOTION_DIVISION_DATABASE!
    // })).results.find((division: any) => division.id === (results[0] as any).properties[DivisionsTable].relation[0].id)
    // console.log(division)

    // const season = (await notion.databases.query({
    //     database_id: process.env.NOTION_SEASON_DATABASE!
    // })).results.find((season: any) => season.id === (results[0] as any).properties[SeasonsTable].relation[0].id)
    // console.log(season)

    // const track = (await notion.databases.query({
    //     database_id: process.env.NOTION_TRACKS_DATABASE!
    // })).results.find((track: any) => track.id === (results[0] as any).properties[TracksTable].relation[0].id)
    // console.log(track)

    return driver ? {
        name: (driver as any).properties.Name.title[0].plain_text,
        color: colorMatcher((driver as any).properties.color.select?.name || 'green'),
        nickname: (driver as any).properties.Nickname.rich_text[0].text.content,
        location: '', //(driver as any).properties.Location.rich_text[0].text.content,
        division: results[0].division,
        results,
        tracks
    } as Driver : null
};

export const fetchCurrentStandings = async () => {
    let seasonId = ''
    const seasons = await notion.databases.query({ database_id: process.env.NOTION_SEASON_DATABASE! })
    seasons.results.map((season: any) => {
        if (new Date(season.properties.Start.date.start) < new Date() && new Date(season.properties.End.date.start) > new Date()) {
            seasonId = season.id
        }
    })
    // console.log(seasonId)
    // console.log((season.results[0] as any).properties.Start.date.start)
    // console.log((season.results[0] as any).properties.End.date.start)

    const results = await notion.databases.query({ database_id: process.env.NOTION_RESULTS_DATABASE! })
    // console.log((results.results[0] as any).properties['☑️ Season'].relation[0].id)

    // const seasons = await notion.databases.query({database_id: process.env.NOTION_RESULTS_DATABASE!, filter: {
    //     property: "Season",
    //     select: {
    //       equals: "2021",
    //     },
    // }})
    // console.log(seasons)
    // const driver = await notion.databases.query({database_id: process.env.NOTION_DRIVER_DATABASE!, filter: {
    //     property: "slug",
    //     rich_text: {
    //       equals: slug,
    //     },
    //   }})

    // const result = driver.results[0]

    return {}
    // return result ? {
    //     name: (result as any).properties.Name.title[0].plain_text,
    //     color: colorMatcher((result as any).properties.color.select.name),
    //     nickname: (result as any).properties.Nickname.rich_text[0].text.content,
    //     location: '',
    //     division: '',
    //     results: []
    // } as Driver : null
};

export const fetchPageBySlug = React.cache((slug: string) => {
    return notion.databases
        .query({
            database_id: process.env.NOTION_DRIVER_DATABASE!,
            filter: {
                property: "Slug",
                rich_text: {
                    equals: slug,
                },
            },
        })
        .then((res) => res.results[0] as PageObjectResponse | undefined);
});

export const fetchPageBlocks = React.cache((pageId: string) => {
    return notion.blocks.children
        .list({ block_id: pageId })
        .then((res) => res.results as BlockObjectResponse[]);
});