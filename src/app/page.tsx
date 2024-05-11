import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col items-center gap-4">
      under maintanance!
      <Link className="btn outline p-3" href="/showcases">
        showcases
      </Link>
    </main>
  );
}
