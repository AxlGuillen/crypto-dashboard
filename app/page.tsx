import { ThemeToggle } from "@/components/theme-toggle"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <h1 className="text-xl font-bold">Crypto Dashboard</h1>
          <ThemeToggle />
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center gap-4 py-20">
          <h2 className="text-3xl font-bold">Setup Completado</h2>
          <p className="text-muted-foreground">
            El proyecto está configurado y listo para desarrollar.
          </p>
        </div>
      </main>
    </div>
  )
}
