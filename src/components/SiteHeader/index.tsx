import Image from "next/image";
import Link from "next/link";

const headerMenu = [
    // { text: "Tracks", link: "/tracks" },
    { text: "Standings", link: "/standings" },
    // { text: "Rules", link: "/rules" },
    // { text: "Associates", link: "/cart" },
    // { text: "About Us", link: "/cart" }
]

export default function SiteHeader() {
    return <>
        <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
            <div className="w-full max-w-5xl p-6 text-center"></div>
        </div>
        <div className="z-10 w-full flex-row font-mono text-sm lg:flex justify-center">
            <div className="flex w-full max-w-5xl items-center justify-between bg-sky-500 p-6">
                <div>
                    <span><strong><Link href="/">MHOSA</Link></strong></span>
                    <ul className="inline is-lined">{headerMenu.map((item, i) => <li key={i}><a href={item.link}>{item.text}</a></li>)}</ul>
                </div>
                <div className="fixed bottom-0 left-0 flex w-full justify-center lg:static lg:h-auto lg:w-auto lg:bg-none">
                </div>
            </div>
        </div>
    </>
}