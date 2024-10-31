'use client'

import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'
import Link from 'next/link'
import { ThemeToggle } from './layout/ThemeToggle'
import { UserMenu } from './layout/UserMenu'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">TaskMaster</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/tasks" className="transition-colors hover:text-foreground/80">
              My Tasks
            </Link>
            <Link href="/projects" className="transition-colors hover:text-foreground/80">
              Projects
            </Link>
            <Link href="/calendar" className="transition-colors hover:text-foreground/80">
              Calendar
            </Link>
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button variant="outline" className="relative h-8 w-full justify-start text-sm font-normal md:w-40">
              <Search className="mr-2 h-4 w-4" />
              <span>Search tasks...</span>
            </Button>
          </div>
          <ThemeToggle />
          <UserMenu />
        </div>
      </div>
    </header>
  )
}
