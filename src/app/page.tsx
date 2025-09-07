import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import Chat from '@/components/chat'
import { auth } from '@/server/auth'

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect('/auth/sign-in')
  }

  return (
    <div className='relative mx-auto size-full h-[calc(100svh_-_theme(spacing.16))] max-w-4xl p-6'>
      <Chat />
    </div>
  )
}

export default Home
