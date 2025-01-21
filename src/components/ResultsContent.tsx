"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Sample data structure
const resultsData = {
    "2025": {
        "Spring Championship": {
            "Stock Car": [
                {
                    date: "2025-04-15",
                    heats: [
                        {
                            heatNumber: 1,
                            results: [
                                { position: 1, driver: "John Doe", time: "1:23.456" },
                                { position: 2, driver: "Jane Smith", time: "1:23.789" },
                                { position: 3, driver: "Bob Johnson", time: "1:24.012" },
                            ],
                        },
                        {
                            heatNumber: 2,
                            results: [
                                { position: 1, driver: "Alice Brown", time: "1:23.234" },
                                { position: 2, driver: "Charlie Davis", time: "1:23.567" },
                                { position: 3, driver: "Eva White", time: "1:23.890" },
                            ],
                        },
                    ],
                },
            ],
            "Formula X": [
                {
                    date: "2025-04-16",
                    heats: [
                        {
                            heatNumber: 1,
                            results: [
                                { position: 1, driver: "Frank Miller", time: "1:15.123" },
                                { position: 2, driver: "Grace Lee", time: "1:15.456" },
                                { position: 3, driver: "Henry Wilson", time: "1:15.789" },
                            ],
                        },
                    ],
                },
            ],
        },
    },
    "2024": {
        "Fall Classic": {
            "Stock Car": [
                {
                    date: "2024-09-20",
                    heats: [
                        {
                            heatNumber: 1,
                            results: [
                                { position: 1, driver: "Olivia Taylor", time: "1:24.321" },
                                { position: 2, driver: "Peter Anderson", time: "1:24.654" },
                                { position: 3, driver: "Quinn Roberts", time: "1:24.987" },
                            ],
                        },
                    ],
                },
            ],
        },
    },
}

export default function ResultsContent() {
    const [selectedSeason, setSelectedSeason] = useState("2025")
    const [selectedEvent, setSelectedEvent] = useState("Spring Championship")
    const [selectedDivision, setSelectedDivision] = useState("Stock Car")

    const seasons = Object.keys(resultsData)
    const events = Object.keys(resultsData[selectedSeason] || {})
    const divisions = Object.keys(resultsData[selectedSeason]?.[selectedEvent] || {})

    const results = resultsData[selectedSeason]?.[selectedEvent]?.[selectedDivision] || []

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
                                <SelectItem key={event} value={event}>
                                    {event}
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
                                <SelectItem key={division} value={division}>
                                    {division}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {results.map((raceDay, index) => (
                    <div key={index} className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">Race Day: {raceDay.date}</h2>
                        {raceDay.heats.map((heat) => (
                            <div key={heat.heatNumber} className="mb-6">
                                <h3 className="text-xl font-semibold mb-2">Heat {heat.heatNumber}</h3>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Position</TableHead>
                                            <TableHead>Driver</TableHead>
                                            <TableHead>Time</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {heat.results.map((result) => (
                                            <TableRow key={result.position}>
                                                <TableCell>{result.position}</TableCell>
                                                <TableCell>{result.driver}</TableCell>
                                                <TableCell>{result.time}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </section>
    )
}

