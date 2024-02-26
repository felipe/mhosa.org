import "server-only";

import { Client } from "@notionhq/client";
import React from "react";
import {
  BlockObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

const DriversTable = "🎮 Drivers";
const TracksTable = `🎢 Tracks`;
const SeasonsTable = `☑️ Season`;
const ScheduleTable = `🗓️ Schedule`;
const DivisionsTable = `⏫ Divisions`;

const proDivisions = ["a94d52c3-1e9d-4007-9fd4-7ed2d5b660f5"];

const intermediateDivisions = ["c12bb65c-9359-43c0-ba48-869b52d50431"];

const beginnerDivisions = ["f2c8e096-8531-452e-841a-f8cea9c453da"];

const padNumber = (num: number) => {
  return String(0).repeat(3 - String(num).length) + num;
};

export const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

const colorMatcher = (color: string) => {
  switch (color) {
    case "blue":
      return "bg-blue-900";
    case "red":
      return "bg-red-900";
    case "green":
      return "bg-green-900";
    case "yellow":
      return "bg-yellow-900";
    case "tiedye":
      return "tie-dye";
    default:
      return "bg-gray-500";
  }
};

type Driver = {
  name: string;
  slug: string;
  color: string;
  nickname: string;
  location: string;
  division: string;
  results: any[];
  tracks: string[];
};

const cleanResults = async (results: any) => {

  let ret = {
    track: '',
    races: {},
    // races: {
    //   // 0: {
    //   //   season: "Season Name",
    //   //   race: "Race Number",
    //   //   results: {
    //   //     0: {
    //   //       heat: "Heat 1",
    //   //     },
    //   //     1: {
    //   //       heat: "Heat 2",
    //   //     },
    //   //   },
    //   // },
    // },
  };

  let track_id = ``;
  let track_name = ``;

  const season_ids = new Set();
  const seasons: Record<string, string>[] = [];

  const race_ids = new Set();
  const races: any = {}

  await Promise.all(
    results.map(async (result: any) => {
      // console.log(">>>>>>");
      // console.log(result);
      // console.log("<<<<<<");

      track_id = result.properties[TracksTable].relation[0].id;

      if (result.properties[SeasonsTable].relation.length) {
        season_ids.add(result.properties[SeasonsTable].relation[0].id);
      }

      if (result.properties[ScheduleTable].relation.length) {
        race_ids.add(result.properties[ScheduleTable].relation[0].id);
      }
    })
  );

  // 🎢 Tracks
  const track = (await fetchTrackById(track_id)) as any;
  track_name = track.properties.Name.title[0].plain_text

  // if (result.properties[TracksTable].relation.length) {
  //   track_id = result.properties[TracksTable].relation[0].id;
  //   ret.track = (await fetchTrackById(track_id)).properties.Name.title[0]
  //     .plain_text;
  // }

  // ☑️ Season
  await Promise.all(Array.from(season_ids).map(async (season_id: any) => {
    const season = (await fetchSeasonById(season_id)) as any;
    let season_info: any = {};
    season_info[season_id] = season.properties.Name.title[0].plain_text
    seasons.push(season_info);
  }))

  // 🗓️ Schedule
  await Promise.all(Array.from(race_ids).map(async (race_id: any) => {
    // console.log("xxyy")
    // console.log(race_id)
    const race = (await fetchScheduleById(race_id)) as any;
    // console.log(race.properties.Name.title[0].plain_text)
    // let season_info: any = {};
    // season_info[season_id] = season.properties.Name.title[0].plain_text
    // seasons.push(season_info);

    // let race_info: any = {};
    races[race_id] = race.properties.Name.title[0].plain_text
    // races.push(race_info);
  }));

  //console.log(seasons)
  // console.log(races)

  seasons.forEach(async (season: any) => {
    const season_id = Object.keys(season)[0]
    const season_name = season[season_id]
    ret.track = track_name as string

    const heats = results.filter((result: any) => result.properties[SeasonsTable].relation[0].id === season_id);
    (ret.races as any)[season_name as string] = heats.map((heat: any) => {
      const race_id = (heat.properties[ScheduleTable].relation.length ? heat.properties[ScheduleTable].relation[0].id : null)

      return {
        race: race_id ? races[race_id] : '',
        heat: heat.properties.Heat.select.name,
        red_laps: heat.properties['Red Laps'].number,
        red_hot_lap: heat.properties['Red Hot Lap'].number,
        white_laps: heat.properties['White Laps'].number,
        white_hot_lap: heat.properties['White Hot Lap'].number,
        blue_laps: heat.properties['Blue Laps'].number,
        blue_hot_lap: heat.properties['Blue Hot Lap'].number,
        yellow_laps: heat.properties['Yellow Laps'].number,
        yellow_hot_lap: heat.properties['Yellow Hot Lap'].number,
        green_laps: heat.properties['Green Laps'].number,
        green_hot_lap: heat.properties['Green Hot Lap'].number,
        purple_laps: heat.properties['Purple Laps'].number,
        purple_hot_lap: heat.properties['Purple Hot Lap'].number,
        orange_laps: heat.properties['Orange Laps'].number,
        orange_hot_lap: heat.properties['Orange Hot Lap'].number,
        total_laps: heat.properties['Total Laps'].number,
        final_sections: heat.properties['Final Sections'].number,
      }
    })

    // console.log(ret);
  })

  return ret
}

const cleanRaceResults = async (results: any) => {
  return await Promise.all(
    results.results.map(async (result: any) => {
      const division = (await fetchDivisionById(
        result.properties[DivisionsTable].relation[0].id
      )) as any;
      const track = (await fetchTrackById(
        result.properties[TracksTable].relation[0].id
      )) as any;
      const season = (await fetchSeasonById(
        result.properties[SeasonsTable].relation[0].id
      )) as any;

      return {
        ...result.properties,
        division: division.properties.Name.title[0].plain_text,
        season: season.properties.Name.title[0].plain_text,
        track: track.properties.Name.title[0].plain_text,
        track_slug: track.properties.Name.title[0].plain_text
          .toLowerCase()
          .replaceAll(" ", "-"),
        heat: result.properties.Heat.select.name,
      };
    })
  );
};

const fetchDivisionById = async (id: string) => {
  return await (
    await notion.databases.query({
      database_id: process.env.NOTION_DIVISION_DATABASE!,
    })
  ).results.find((division: any) => division.id === id);
};

const fetchTrackById = async (id: string) => {
  return await (
    await notion.databases.query({
      database_id: process.env.NOTION_TRACK_DATABASE!,
    })
  ).results.find((track: any) => track.id === id);
};

const fetchSeasonById = async (id: string) => {
  return await (
    await notion.databases.query({
      database_id: process.env.NOTION_SEASON_DATABASE!,
    })
  ).results.find((season: any) => season.id === id);
};

const fetchScheduleById = async (id: string) => {
  return await (
    await notion.databases.query({
      database_id: process.env.NOTION_SCHEDULE_DATABASE!,
    })
  ).results.find((race: any) => race.id === id);
};

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

export const fetchDriverResults = async (
  driver_slug: string,
  track_slug: string
) => {
  const driver = (
    await notion.databases.query({
      database_id: process.env.NOTION_DRIVER_DATABASE!,
      filter: {
        property: "slug",
        rich_text: {
          equals: driver_slug,
        },
      },
    })
  ).results[0];

  const track = (
    await notion.databases.query({
      database_id: process.env.NOTION_TRACK_DATABASE!,
      filter: {
        property: "Slug",
        rich_text: {
          equals: track_slug,
        },
      },
    })
  ).results[0];

  const raceResults = driver
    ? await notion.databases.query({
      database_id: process.env.NOTION_RESULTS_DATABASE!,
      filter: {
        property: DriversTable,
        relation: {
          contains: driver.id,
        },
        //   and: [
        //     {
        //       property: TracksTable,
        //       relation: {
        //         contains: track.id,
        //       },
        //       and: [
        //         {
        //           property: "Not For Points",
        //           checkbox: {
        //             equals: false,
        //           },
        //         },
        //       ],
        //     },
        //   ],
      },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    })
    : { results: [] };

  const results  = await cleanResults(
    (await raceResults.results.filter(
      (result: any) =>
        track.id === result.properties[TracksTable].relation[0].id
    )).sort().reverse()
  );

  // const results = await cleanRaceResults(raceResults);

  // console.log(results)

  // const tracks =  [track]// Array.from(new Set(results.map((race) => race.track)));

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

return driver ? results : null;

  // return driver
  //   ? ({
  //     name: (driver as any).properties.Name.title[0].plain_text,
  //     slug: (driver as any).properties.Name.title[0].plain_text
  //       .toLowerCase()
  //       .replaceAll(" ", "-"),
  //     color: colorMatcher(
  //       (driver as any).properties.color.select?.name || "green"
  //     ),
  //     nickname: (driver as any).properties.Nickname.rich_text[0]
  //       ? (driver as any).properties.Nickname.rich_text[0].text.content
  //       : "",
  //     location: "", //(driver as any).properties.Location.rich_text[0].text.content,
  //     division: results[0].division,
  //     results,
  //     tracks,
  //   } as Driver)
  //   : null;
};

export const fetchDriver = async (slug: string) => {
  const driver = (
    await notion.databases.query({
      database_id: process.env.NOTION_DRIVER_DATABASE!,
      filter: {
        property: "slug",
        rich_text: {
          equals: slug,
        },
      },
    })
  ).results[0];

  const raceResults = driver
    ? await notion.databases.query({
      database_id: process.env.NOTION_RESULTS_DATABASE!,
      filter: {
        property: "🎮 Drivers",
        relation: {
          contains: driver.id,
        },
      },
      sorts: [{ timestamp: "created_time", direction: "descending" }],
    })
    : { results: [] };

  const results = await cleanRaceResults(raceResults);

  // console.log(results)

  const tracks = Array.from(new Set(results.map((race) => race.track)));

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

  return driver
    ? ({
      name: (driver as any).properties.Name.title[0].plain_text,
      slug: (driver as any).properties.Name.title[0].plain_text
        .toLowerCase()
        .replaceAll(" ", "-"),
      color: colorMatcher(
        (driver as any).properties.color.select?.name || "green"
      ),
      nickname: (driver as any).properties.Nickname.rich_text[0]
        ? (driver as any).properties.Nickname.rich_text[0].text.content
        : "",
      location: "", //(driver as any).properties.Location.rich_text[0].text.content,
      division: results[0].division,
      results,
      tracks,
    } as Driver)
    : null;
};

export const fetchDriverById = async (driverId: string) => {
  const driver = await (
    await notion.databases.query({
      database_id: process.env.NOTION_DRIVER_DATABASE!,
    })
  ).results.find((driver: any) => driver.id === driverId);

  return driver
    ? ({
      name: (driver as any).properties.Name.title[0].plain_text,
      slug: (driver as any).properties.Name.title[0].plain_text
        .toLowerCase()
        .replaceAll(" ", "-"),
      color: colorMatcher(
        (driver as any).properties.color.select?.name || "green"
      ),
      nickname: (driver as any).properties.Nickname.rich_text[0]
        ? (driver as any).properties.Nickname.rich_text[0].text.content
        : "",
      location: "", //(driver as any).properties.Location.rich_text[0].text.content,
    } as Driver)
    : null;
};

export const fetchCurrentStandings = async () => {
  let seasonId = "";
  const seasons = await notion.databases.query({
    database_id: process.env.NOTION_SEASON_DATABASE!,
  });
  seasons.results.map((season: any) => {
    if (
      new Date(season.properties.Start.date.start) < new Date() &&
      new Date(season.properties.End.date.start) > new Date()
    ) {
      seasonId = season.id;
    }
  });
  // console.log(seasonId)
  // console.log((season.results[0] as any).properties.Start.date.start)
  // console.log((season.results[0] as any).properties.End.date.start)

  const results = await notion.databases.query({
    database_id: process.env.NOTION_RESULTS_DATABASE!,
  });
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

  return {};
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

const calculateStandings = async (division: any, results: any) => {
  const rawDrivers = results.filter((result: any) =>
    division.includes(result.properties[DivisionsTable].relation[0].id)
  );
  // const intermediate = rawResults.filter((result: any) => result.properties[DivisionsTable].relation[0].id === 'intermediate')

  const drivers = new Set();

  rawDrivers.forEach((result: any) => {
    drivers.add(result.properties[DriversTable].relation[0].id);
    // console.log(result.properties[DriversTable].relation[0].id, `${result.properties['Total Laps'].number}.${padNumber(result.properties['Final Sections'].number)}`)
  });

  // console.log(drivers)

  const standings = await Promise.all(
    Array.from(drivers).map(async (driverId: any) => {
      const driver = (await fetchDriverById(driverId)) as Driver;

      return {
        driver: driver.name,
        slug: driver.slug,
        points: 0,
      };
    })
  );

  return standings;
};

export const fetchPageBlocks = React.cache((pageId: string) => {
  return notion.blocks.children
    .list({ block_id: pageId })
    .then((res) => res.results as BlockObjectResponse[]);
});

export const getSeason = async () => {
  const season = await (
    await notion.databases.query({
      database_id: process.env.NOTION_SEASON_DATABASE!,
    })
  ).results
    .sort()
    .reverse();

  const rawSchedule = await (
    await notion.databases.query({
      database_id: process.env.NOTION_SCHEDULE_DATABASE!,
      filter: {
        property: SeasonsTable,
        relation: {
          contains: season[0].id,
        },
      },
      sorts: [{ property: "Date", direction: "ascending" }],
    })
  ).results;

  // console.log((schedule[0] as any).properties.Date.date.start)
  // console.log((await fetchTrackById((schedule[0] as any).properties[TracksTable].relation[0].id) as any).properties.Name.title[0].plain_text)
  // const seasons = await notion.databases.query({ database_id: process.env.NOTION_SEASON_DATABASE! })
  // const x = seasons.results.find((season: any) => new Date(season.properties.Start.date.start) < new Date() && new Date(season.properties.End.date.start) > new Date())
  // console.log(schedule)

  //                 {
  //                     driverId: null,
  //                     points: 18,
  //                     driver: `John Peterson`
  //                 }

  const rawResults = await (
    await notion.databases.query({
      database_id: process.env.NOTION_RESULTS_DATABASE!,
      filter: {
        property: SeasonsTable,
        relation: {
          contains: season[0].id,
        },
      },
    })
  ).results;

  // console.log(rawResults.map((res: any) => console.log(res.properties[DivisionsTable].relation[0].id)))

  // const rawProDrivers = rawResults.filter((result: any) => proDivisions.includes(result.properties[DivisionsTable].relation[0].id))
  // // const intermediate = rawResults.filter((result: any) => result.properties[DivisionsTable].relation[0].id === 'intermediate')

  // // console.log(proDrivers)

  // const proDrivers = new Set()

  // rawProDrivers.forEach((result: any) => {
  //     proDrivers.add(result.properties[DriversTable].relation[0].id)
  //     // console.log(result.properties[DriversTable].relation[0].id, `${result.properties['Total Laps'].number}.${padNumber(result.properties['Final Sections'].number)}`)
  // })

  // const proStandings = await Promise.all(Array.from(proDrivers).map(async (driverId: any) => {
  //     const driver = await fetchDriverById(driverId) as Driver
  //     return {
  //         driver: driver.name,
  //         slug: driver.slug,
  //         points: 0
  //     }
  // }))

  const proStandings = calculateStandings(proDivisions, rawResults);
  const intermediateStandings = calculateStandings(
    intermediateDivisions,
    rawResults
  );
  const beginnerStandings = calculateStandings(beginnerDivisions, rawResults);

  const pro = {
    name: "Premier",
    weight: 300,
    standings: await proStandings,
  };

  const intermediate = {
    name: "Lite",
    weight: 100,
    standings: await intermediateStandings,
  };

  const beginner = {
    name: "Newcomers",
    weight: 50,
    standings: await beginnerStandings,
  };

  const divisions = [pro, intermediate, beginner];

  const schedule = await Promise.all(
    rawSchedule.map(async (s: any, i: number) => ({
      race: i + 1,
      date: (s as any).properties.Date.date.start,
      track: (
        (await fetchTrackById(
          (s as any).properties[TracksTable].relation[0].id
        )) as any
      ).properties.Name.title[0].plain_text,
    }))
  );

  return {
    name: (season[0] as any).properties.Name.title[0].plain_text || "",
    divisions,
    schedule,
  };
};
