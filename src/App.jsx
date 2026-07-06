import { useEffect, useState } from 'react'
import EntryGate from './components/EntryGate.jsx'
import ListView from './components/ListView.jsx'

export default function App() {
  const [session, setSession] = useState(null) // { listId, name }

  useEffect(() => {
    const saved = localStorage.getItem('bucketlist-session')
    if (saved) setSession(JSON.parse(saved))
  }, [])

  function handleEnter(listId, name) {
    const s = { listId, name }
    localStorage.setItem('bucketlist-session', JSON.stringify(s))
    setSession(s)
  }

  function handleSwitch() {
    localStorage.removeItem('bucketlist-session')
    setSession(null)
  }

  if (!session) return <EntryGate onEnter={handleEnter} />
  return <ListView listId={session.listId} name={session.name} onSwitch={handleSwitch} />
}
