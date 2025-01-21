"use client"

import { useState, useEffect } from "react"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Database } from "@/database.types"

type RaceResult = Database['public']['Tables']['race_results']['Row'] & {
  race: Database['public']['Tables']['races']['Row']
  driver: Database['public']['Tables']['drivers']['Row']
}

export default function ResultsContent() {
  const [seasons, setSeasons] = useState<string[]>([])
  const [events, setEvents] = useState<Database['public']['Tables']['races']['Row'][]>([])
  const [divisions, setDivisions] = useState<Database['public']['Tables']['divisions']['Row'][]>([])
  const [results, setResults] = useState<RaceResult[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedSeason, setSelectedSeason] = useState<string>("")
  const [selectedEvent, setSelectedEvent] = useState<string>("")
  const [selectedDivision, setSelectedDivision] = useState<string>("")

  const supabase = createClientComponentClient<Database>()

  useEffect(() => {
    const fetchInitialData = async () => {
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

      if (races) {
        const uniqueSeasons = [...new Set(races.map(race =>
          new Date(race.date).getFullYear().toString()
        ))].sort().reverse()

        setSeasons(uniqueSeasons)
        if (uniqueSeasons.length > 0) {
          setSelectedSeason(uniqueSeasons[0])
        }
      }
    }

    fetchInitialData()
  }, [supabase])

  // Fetch divisions when season changes
  useEffect(() => {
    if (selectedSeason) {
      const fetchDivisions = async () => {
        const startDate = `${selectedSeason}-01-01`;
        const endDate = `${selectedSeason}-12-31`;

        const { data: seasonDivisions } = await supabase
          .from('race_results')
          .select('division_id(id, name)')
          .gte('race:race_id(date)', startDate)
          .lte('race:race_id(date)', endDate)
          .distinct();

        if (seasonDivisions) {
          const uniqueDivisions = seasonDivisions
            .map((d: any) => d.division_id)
            .filter((d: any): d is NonNullable<typeof d> => d !== null);

          setDivisions(uniqueDivisions);
          if (uniqueDivisions.length > 0) {
            setSelectedDivision(uniqueDivisions[0].id.toString());
          } else {
            setSelectedDivision("");
          }
        }
      };

      fetchDivisions();
    }
  }, [selectedSeason, supabase]);

  useEffect(() => {
    if (selectedSeason) {
      const fetchEvents = async () => {
        const startDate = `${selectedSeason}-01-01`;
        const endDate = `${selectedSeason}-12-31`;

        const { data: races } = await supabase
          .from('races')
          .select('*')
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
      const fetchResults = async () => {
        setLoading(true)
        const { data: results, error } = await supabase
          .from('race_results')
          .select(`
            *,
            race:race_id(*),
            driver:driver_id(*)
          `)
          .eq('race_id', Number(selectedEvent))
          .eq('division_id', Number(selectedDivision))
          .order('position', { ascending: true })

        if (results) {
          setResults(results as RaceResult[])
        }
        setLoading(false)
      }

      fetchResults()
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
                  {event.name} - {new Date(event.date).toLocaleDateString()}
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
                  <TableHead>Position</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id}>
                    <TableCell>{result.position}</TableCell>
                    <TableCell>{result.driver.name}</TableCell>
                    <TableCell>{result.time}</TableCell>
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
