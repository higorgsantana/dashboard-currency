import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const dark = storedTheme === 'dark' || (!storedTheme && prefersDark)

    setIsDark(dark)
    document.documentElement.classList.toggle('dark', dark)
  }, [])

  const toggleTheme = () => {
    const newTheme = isDark ? 'light' : 'dark'
    localStorage.setItem('theme', newTheme)
    document.documentElement.classList.toggle('dark', newTheme === 'dark')
    setIsDark(!isDark)
  }

  return (
    <button
      onClick={toggleTheme}
      className="text-sm px-4 py-2 rounded border border-gray-300 dark:border-gray-600
                 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
    >
      {isDark ? '🌙 Escuro' : '☀️ Claro'}
    </button>
  )
}
