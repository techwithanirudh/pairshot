import { redirect } from 'next/navigation'
import Chat from '@/components/chat'
import { getSession } from '@/server/auth'

const Home = async () => {
  let session = null
  try {
    session = await getSession()
  } catch (error) {
    // Fail gracefully and redirect to sign-in when session check fails
    // Logging on the server to aid debugging without throwing
    // eslint-disable-next-line no-console
    console.error('Failed to retrieve session in /src/app/page.tsx:', error)
    return redirect('/auth/sign-in')
  }

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
