import Image from "next/image"
import Link from "next/link";
import localFont from "next/font/local";

import {cn} from "@/lib/utils";

const headingFont = localFont({
    src: "../public/fonts/Montserrat-Regular.woff2"
})

export const Logo = () => {
    return (
        <Link href="/">
            <div className="hover:opacity-75 transition items-center gap-x-2 hidden md:flex">
                <Image src="/logo.ico" alt="Logo" height={30} width={30}/>
                <p className={cn(
                    "text-lg text-neutral-700 font-bold uppercase pb-4 pt-4",
                    headingFont.className,
                    )}>
                    Research Dock
                </p>
            </div>
        </Link>
    )
}
