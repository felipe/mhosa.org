import { Button } from "@/components/ui/button"

export default function MembershipSection() {
  return (
    <section id="membership" className="mb-12">
      <h2 className="text-3xl font-bold mb-6">Join Our Association</h2>
      <div className="space-y-6">
        <p>
          Becoming a member of our Racing Association opens up a world of opportunities for racing enthusiasts. Here's how you can join:
        </p>
        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>Fill out our online application form</li>
          <li>Pay the annual membership fee</li>
          <li>Attend a new member orientation session</li>
          <li>Get your racing license (if you plan to compete)</li>
        </ol>
        <p>
          As a member, you'll enjoy benefits such as access to exclusive events, discounted race entry fees, and networking opportunities with fellow racers and industry professionals.
        </p>
        <div className="mt-8">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg">
            Apply for Membership
          </Button>
        </div>
      </div>
    </section>
  )
}

