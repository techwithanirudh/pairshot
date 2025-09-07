import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { App } from '@/components/camera'
import { auth } from '@/server/auth'

const Home = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    return redirect('/auth/sign-in')
  }

  return <App session={session} />
}

export default Home
