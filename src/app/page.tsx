import { Send } from "lucide-react";
import Link from "next/link";

import LogoIcon from "@/components/icons/logo";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="relative w-full h-full py-12 flex items-center justify-center">
      <div className="absolute top-0 left-0 -z-20 w-full h-full bg-hero bg-hero-pos bg-cover brightness-[.60] "></div>
      <div className="relative flex flex-col gap-4 items-center p-3 rounded-lg">
        <div className="absolute top-0 left-0 -z-10 w-full h-full blur-xl bg-background/60"></div>
        <div className='flex flex-row flex-nowrap gap-3 items-center'>
          <LogoIcon className='size-12 sm:size-14 lg:size-20' withBackground />
          <span className='text-3xl sm:text-4xl lg:text-5xl font-bold'>Без Азбест</span>
        </div>
        <p className="w-[clamp(20ch,75vw,30ch)] text-center text-lg lg:text-xl">Пријавете азбест во вашите опкружувања и помогнете ни да најдеме решение.</p>
        <Button className="h-auto text-lg sm:text-xl px-5 py-2 flex flex-row items-center justify-center gap-2" asChild>
          <Link href="/reports/new">
            <Send className="size-6" /> Пријави
          </Link>
        </Button>
      </div>
    </main>
  );
}