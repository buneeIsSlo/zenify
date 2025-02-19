import Link from "next/link";

export default function Home() {
  return (
    <div className="p-5">
      <h1 className="text-3xl text-green-500 font-bold">Zenify</h1>
      <Link href={"/signin"}>Sigin In</Link>
    </div>
  );
}
