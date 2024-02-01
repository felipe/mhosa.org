import "server-only";

import { Client } from "@notionhq/client";
import React from "react";
import {
    BlockObjectResponse,
    PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export const notion = new Client({
    auth: process.env.NOTION_TOKEN,
});

const colorMatcher = (color: string) => {
    switch (color) {
        case 'blue':
            return 'bg-blue-900'
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
    results: any[]
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
    const driver = await notion.databases.query({database_id: process.env.NOTION_DRIVER_DATABASE!, filter: {
        property: "slug",
        rich_text: {
          equals: slug,
        },
      }})
    
    const result = driver.results[0]

    return result ? {
        name: (result as any).properties.Name.title[0].plain_text,
        color: colorMatcher((result as any).properties.color.select.name),
        nickname: (result as any).properties.Nickname.rich_text[0].text.content,
        location: '',
        division: '',
        results: []
    } as Driver : null
};

export const fetchCurrentStandings = async () => {
    let seasonId = ''
    const seasons = await notion.databases.query({database_id: process.env.NOTION_SEASON_DATABASE!})
    seasons.results.map((season: any) => {
        // console.log(season)
        // console.log(new Date())
        // console.log(season.properties.Start.date.start)
        // console.log(new Date(season.properties.Start.date.start) < new Date())
        // console.log(season.properties.End.date.start)
        // console.log(season.properties.End.date.start > new Date())
        if(new Date(season.properties.Start.date.start) < new Date() && new Date(season.properties.End.date.start) > new Date()){
            seasonId = season.id
        }
    })
    console.log(seasonId)
    // console.log((season.results[0] as any).properties.Start.date.start)
    // console.log((season.results[0] as any).properties.End.date.start)

    const results = await notion.databases.query({database_id: process.env.NOTION_RESULTS_DATABASE!})
    console.log((results.results[0] as any).properties['☑️ Season'].relation[0].id)

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