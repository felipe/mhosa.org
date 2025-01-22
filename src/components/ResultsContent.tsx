"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Database } from "@/database.types"

type RaceSplit = Database['public']['Tables']['race_splits']['Row'] & {
  race: Database['public']['Tables']['races']['Row']
  driver: Database['public']['Tables']['drivers']['Row']
}

export default function ResultsContent() {
  const [seasons, setSeasons] = useState<string[]>([])
  const [events, setEvents] = useState<Database['public']['Tables']['races']['Row'][]>([])
  const [divisions, setDivisions] = useState<Database['public']['Tables']['divisions']['Row'][]>([])
  const [results, setResults] = useState<RaceSplit[]>([])
  const [loading, setLoading] = useState(true)

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
            setSelectedDivision(uniqueDivisions[0].id.toString());
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
                  {event.track.name} - {event.name} - {new Date(event.date).toLocaleDateString()}
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

        <div className="mb-8">
          {results.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Driver</TableHead>
                  <TableHead>Split Time</TableHead>
                  <TableHead>Split Number</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results
                  .filter(result => result.division_id === Number(selectedDivision))
                  .map((result) => (
                    <TableRow key={result.id}>
                      <TableCell>{result.driver.name}</TableCell>
                      <TableCell>{result.split_time}</TableCell>
                      <TableCell>{result.split_number}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <p>No results available for this event.</p>
          )}
        </div>
      </div>
    </section>
  )
}
