import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-4">
      under maintanance!
      <Button>
        <Link className="" href="/showcases">
          showcases
        </Link>
      </Button>
    </main>
  );
}
