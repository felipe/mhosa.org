"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Database } from "@/database.types"

type RaceSplit = Database['public']['Tables']['race_splits']['Row'] & {
  race: Database['public']['Tables']['races']['Row']
  driver: Database['public']['Tables']['drivers']['Row']
  division: Database['public']['Tables']['divisions']['Row']
}

export default function ResultsContent() {
  const [seasons, setSeasons] = useState<string[]>([])
  const [events, setEvents] = useState<Database['public']['Tables']['races']['Row'][]>([])
  const [divisions, setDivisions] = useState<Database['public']['Tables']['divisions']['Row'][]>([])
  const [results, setResults] = useState<RaceSplit[]>([])
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'total_laps',
    direction: 'desc'
  });

  const [selectedSeason, setSelectedSeason] = useState<string>("")
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [selectedDivision, setSelectedDivision] = useState<string>("")

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchSeasons = async () => {
      const { data: races } = await supabase
        .from('races')
        .select('date')
        .order('date', { ascending: false });

      if (races) {
        const uniqueSeasons = [...new Set(races.map(race =>
          new Date(race.date).getFullYear().toString()
        ))].sort().reverse();

        setSeasons(uniqueSeasons);
        if (uniqueSeasons.length > 0) {
          setSelectedSeason(uniqueSeasons[0]);
        }
      }
    }

    fetchSeasons()
  }, [supabase])

  useEffect(() => {
    if (selectedSeason) {
      const fetchEvents = async () => {
        const startDate = `${selectedSeason}-01-01`
        const endDate = `${selectedSeason}-12-31`

        const { data: races } = await supabase
          .from('races')
          .select(`*, track:track_id(*)`)
          .gte('date', startDate)
          .lte('date', endDate)
          .order('date', { ascending: false })

        if (races) {
          setEvents(races)
          if (races.length > 0) {
            setSelectedEvent(races[0].id.toString())
          }
        }
      }

      fetchEvents()
    }
  }, [selectedSeason, supabase])

  useEffect(() => {
    if (selectedEvent) {
      const fetchResultsAndDivisions = async () => {
        setLoading(true);

        // Fetch race splits
        const { data: results } = await supabase
          .from('race_splits')
          .select(`
            *,
            race:race_id(*),
            driver:driver_id(*),
            division:division_id(*)
          `)
          .eq('race_id', Number(selectedEvent))
        // .order('split_time', { ascending: true });

        if (results) {
          setResults(results as RaceSplit[]);

          // Get unique divisions from the results using a Map to deduplicate
          const divisionsMap = new Map();
          results.forEach(r => {
            if (r.division_id && r.division?.name) {
              divisionsMap.set(r.division_id, {
                id: r.division_id,
                name: r.division.name
              });
            }
          });

          const uniqueDivisions = Array.from(divisionsMap.values());
          setDivisions(uniqueDivisions);

          if (uniqueDivisions.length > 0) {
            // Find Premier division
            const premierDivision = uniqueDivisions.find(d =>
              d.name.toLowerCase().includes('premier') ||
              d.name.toLowerCase().includes('prem')
            );
            // Set Premier as default if it exists, otherwise use first division
            setSelectedDivision((premierDivision?.id || uniqueDivisions[0].id).toString());
          } else {
            setDivisions([]);
            setSelectedDivision("");
          }
        }

        setLoading(false);
      };

      fetchResultsAndDivisions();
    }
  }, [selectedEvent, supabase])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Race Results</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Select onValueChange={setSelectedSeason} value={selectedSeason}>
            <SelectTrigger>
              <SelectValue placeholder="Select Season" />
            </SelectTrigger>
            <SelectContent>
              {seasons.map((season) => (
                <SelectItem key={season} value={season}>
                  {season} Season
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedEvent} value={selectedEvent}>
            <SelectTrigger>
              <SelectValue placeholder="Select Event" />
            </SelectTrigger>
            <SelectContent>
              {events.map((event) => (
                <SelectItem key={event.id} value={event.id.toString()}>
                  {event.track_id} - {event.name} - {new Date(event.date).toLocaleDateString()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={setSelectedDivision} value={selectedDivision}>
            <SelectTrigger>
              <SelectValue placeholder="Select Division" />
            </SelectTrigger>
            <SelectContent>
              {divisions.map((division) => (
                <SelectItem key={division.id} value={division.id.toString()}>
                  {division.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="mb-12 space-y-12 mt-24">
          {results.length > 0 ? (
            <>
              {/* Calculate best results once */}
              {(() => {
                const bestResults = results
                  .filter(result => result.division_id === Number(selectedDivision))
                  .reduce((acc, curr) => {
                    const existing = acc.find(r => r.driver_id === curr.driver_id);
                    if (!existing) {
                      acc.push({ ...curr });
                    } else if (((curr.total_laps || 0) + (curr.final_sections || 0) / 100) >
                      ((existing.total_laps || 0) + (existing.final_sections || 0) / 100)) {
                      existing.total_laps = curr.total_laps;
                      existing.final_sections = curr.final_sections;
                      existing.driver = curr.driver;
                    }
                    return acc;
                  }, [] as typeof results)
                  .sort((a, b) =>
                    ((b.total_laps || 0) + (b.final_sections || 0) / 100) -
                    ((a.total_laps || 0) + (a.final_sections || 0) / 100)
                  );

                return (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:mt-12">
                    {/* Second Place */}
                    <div className="order-2 md:order-1 bg-gray-100 p-6 rounded-lg text-center shadow-lg transform scale-95">
                      <div className="text-xl font-semibold mb-2">2nd Place</div>
                      {bestResults[1] && (
                        <div>
                          <div className="font-medium">
                            {bestResults[1]?.driver.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {bestResults[1]?.total_laps}
                            {bestResults[1]?.final_sections !== undefined
                              ? `.${(bestResults[1].final_sections || 0).toString().padStart(3, '0')}`
                              : '.000'} laps
                          </div>
                        </div>
                      )}
                    </div>

                    {/* First Place */}
                    <div className="order-1 md:order-2 bg-yellow-100 p-8 rounded-lg text-center shadow-xl transform scale-115 md:-mt-10">
                      <div className="text-3xl font-bold mb-3">1st Place</div>
                      {bestResults[0] && (
                        <div>
                          <div className="font-medium">
                            {bestResults[0]?.driver.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {bestResults[0]?.total_laps}
                            {bestResults[0]?.final_sections !== undefined
                              ? `.${(bestResults[0].final_sections || 0).toString().padStart(3, '0')}`
                              : '.000'} laps
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Third Place */}
                    <div className="order-3 md:order-3 bg-orange-100 p-6 rounded-lg text-center shadow-lg transform scale-90">
                      <div className="text-xl font-semibold mb-2">3rd Place</div>
                      {bestResults[2] && (
                        <div>
                          <div className="font-medium">
                            {bestResults[2]?.driver.name}
                          </div>
                          <div className="text-sm text-gray-600">
                            {bestResults[2]?.total_laps}
                            {bestResults[2]?.final_sections !== undefined
                              ? `.${(bestResults[2].final_sections || 0).toString().padStart(3, '0')}`
                              : '.000'} laps
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })()}
              {[...new Set(results.map(r => r.heat))].sort().map((heat) => (
                <div key={heat} className="space-y-4">
                  <h3 className="text-2xl font-semibold">Heat {heat}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSortConfig({
                            key: 'driver',
                            direction: sortConfig.key === 'driver' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                          })}
                        >
                          Driver {sortConfig.key === 'driver' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSortConfig({
                            key: 'yellow_laps',
                            direction: sortConfig.key === 'yellow_laps' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                          })}
                        >
                          Yellow Laps {sortConfig.key === 'yellow_laps' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSortConfig({
                            key: 'red_laps',
                            direction: sortConfig.key === 'red_laps' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                          })}
                        >
                          Red Laps {sortConfig.key === 'red_laps' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSortConfig({
                            key: 'blue_laps',
                            direction: sortConfig.key === 'blue_laps' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                          })}
                        >
                          Blue Laps {sortConfig.key === 'blue_laps' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSortConfig({
                            key: 'white_laps',
                            direction: sortConfig.key === 'white_laps' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                          })}
                        >
                          White Laps {sortConfig.key === 'white_laps' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                        <TableHead
                          className="cursor-pointer hover:bg-muted/50"
                          onClick={() => setSortConfig({
                            key: 'total_laps',
                            direction: sortConfig.key === 'total_laps' && sortConfig.direction === 'asc' ? 'desc' : 'asc'
                          })}
                        >
                          Total Laps {sortConfig.key === 'total_laps' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results
                        .filter(result =>
                          result.division_id === Number(selectedDivision) &&
                          result.heat === heat
                        )
                        .sort((a, b) => {
                          const multiplier = sortConfig.direction === 'asc' ? 1 : -1;

                          if (sortConfig.key === 'driver') {
                            return multiplier * a.driver.name.localeCompare(b.driver.name);
                          }

                          if (sortConfig.key === 'total_laps') {
                            const aTotal = (a.total_laps || 0) + (a.final_sections || 0) / 100;
                            const bTotal = (b.total_laps || 0) + (b.final_sections || 0) / 100;
                            return multiplier * (aTotal - bTotal);
                          }

                          const aValue = a[sortConfig.key as keyof typeof a] || 0;
                          const bValue = b[sortConfig.key as keyof typeof b] || 0;
                          return multiplier * (Number(aValue) - Number(bValue));
                        })
                        .map((result) => (
                          <TableRow key={result.id}>
                            <TableCell>{result.driver.name}</TableCell>
                            <TableCell>{result.yellow_laps || '-'}</TableCell>
                            <TableCell>{result.red_laps || '-'}</TableCell>
                            <TableCell>{result.blue_laps || '-'}</TableCell>
                            <TableCell>{result.white_laps || '-'}</TableCell>
                            <TableCell>
                              {result.total_laps || 0}
                              {result.final_sections !== null && result.final_sections !== undefined
                                ? `.${result.final_sections.toString().padStart(3, '0')}`
                                : '.000'}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </>
          ) : (
            <p>No results available for this event.</p>
          )}
        </div>
      </div>
    </section>
  )
}
