import { useAppStore } from '@/store/useAppStore'

export default function HomePage() {
  const { theme, toggleTheme } = useAppStore()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-white text-gray-900 dark:bg-gray-950 dark:text-white">
      <h1 className="text-4xl font-bold tracking-tight">Vedagya</h1>
      <p className="text-gray-500 dark:text-gray-400">Production-ready React + Vite</p>
      <button
        onClick={toggleTheme}
        className="rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-200"
      >
        Theme: {theme}
      </button>
    </main>
  )
}
