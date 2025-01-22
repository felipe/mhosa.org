const upcomingRaces = [
  { id: 1, name: "Spring Sprint", date: "April 15, 2025", location: "Speedway Park" },
  { id: 2, name: "Summer Classic", date: "June 20, 2025", location: "Coastal Raceway" },
  { id: 3, name: "Fall Championship", date: "September 5, 2025", location: "Mountain Circuit" },
  { id: 4, name: "Winter Challenge", date: "December 5, 2025", location: "Alpine Speedway" },
]

export default function RacesSection() {
  return (
    <section id="races">
      <h2 className="text-3xl font-bold mb-6">Upcoming Races</h2>
      <div className="space-y-6">
        {upcomingRaces.map((race) => (
          <div key={race.id} className="border-b border-gray-200 pb-4 last:border-b-0">
            <h3 className="text-xl font-semibold mb-2">{race.name}</h3>
            <p className="text-gray-600">Date: {race.date}</p>
            <p className="text-gray-600">Location: {race.location}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

