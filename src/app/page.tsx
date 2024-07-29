import Link from "next/link";

import { Button } from "@/components/ui/button";
import { getReports } from "@/lib/api/reports";

import { MapView } from "./map-view";

export default async function Home() {
  const locations = await getReports();


  return (
    <>
      <MapView className="w-full h-full" locations={locations.data} />
      <Button variant='secondary' className='fixed bottom-6 left-1/2 -translate-x-1/2 z-40 text-xl px-6 py-2 h-auto border-2 border-white'>
        <Link href="/reports/new">
          Пријави
        </Link>
      </Button>
    </>
  );
}
