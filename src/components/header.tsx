import { UserButton } from '@daveyplate/better-auth-ui'
import Link from 'next/link'

import { ModeToggle } from './mode-toggle'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-12 justify-between border-b bg-background/60 px-safe-or-4 backdrop-blur md:h-14 md:px-safe-or-6">
      <Link href="/" className="flex items-center gap-2 font-bold">
        Add Me
      </Link>

      <div className="flex items-center gap-2">
        <ModeToggle />
        <UserButton size="icon" align="end" />
      </div>
    </header>
  )
}
