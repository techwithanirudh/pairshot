import { GitHubIcon, UserButton } from '@daveyplate/better-auth-ui'
import Link from 'next/link'
import { APP_NAME } from '@/lib/constants'
import { ModeToggle } from './mode-toggle'
import { Button } from './ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 flex h-12 justify-between border-b bg-background/60 px-safe-or-4 backdrop-blur md:h-14 md:px-safe-or-6">
      <Link href="/" className="flex items-center gap-2 font-bold">
        {APP_NAME}
      </Link>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          asChild
        >
          <Link
            href="https://github.com/techwithanirudh/next-better-auth-starter"
            target="_blank"
          >
            <GitHubIcon />
          </Link>
        </Button>

        <ModeToggle />
        <UserButton size="icon" />
      </div>
    </header>
  )
}
