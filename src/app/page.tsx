import { redirect } from 'next/navigation'
import Page from '@/app/page.client'
import { getSession } from '@/server/auth'

const Home = async () => {
  const session = await getSession()

  if (!session) {
    return redirect('/api/auth/guest')
  }

  return <Page />
}

export default Home
