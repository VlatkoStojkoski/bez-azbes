import { getLocations } from "@/utils/api";
import { MapView } from "./map-view";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const locations = await getLocations();

  return (
    <>
      <MapView className="w-full h-full" locations={locations} />
      <Button variant='secondary' className='fixed bottom-6 left-1/2 -translate-x-1/2 z-40 text-xl px-6 py-2 h-auto border-2 border-white'>
        <Link href="/reports/new">
          Пријави
        </Link>
      </Button>
    </>
  );
}
