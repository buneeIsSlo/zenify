interface HomePageProps {
  children: React.ReactNode;
}

export default function Home({ children }: HomePageProps) {
  return (
    <div className="h-full">
      <header className="bg-neutral-100 p-4">
        <h1 className="text-3xl font-bold text-green-500">Zenify</h1>
      </header>
      <main className="p-5">{children}</main>
    </div>
  );
}
