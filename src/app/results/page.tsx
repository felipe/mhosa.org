import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ResultsContent from "@/components/ResultsContent"

export default function ResultsPage() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-grow">
                <ResultsContent />
            </main>
            <Footer />
        </div>
    )
}

