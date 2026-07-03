'use client'
import { useEffect, useState } from 'react'

export type LarkUserInfo = {
  openId?: string
  name?: string
  email?: string
  avatar?: string
}

let cachedUser: LarkUserInfo | null = null
let pending: Promise<LarkUserInfo | null> | null = null

const fetchUser = () => {
  if (cachedUser)
    return Promise.resolve(cachedUser)
  if (!pending) {
    pending = fetch('/api/auth/me')
      .then(res => (res.ok ? res.json() : null))
      .then((data) => {
        cachedUser = data?.authenticated ? data.user : null
        return cachedUser
      })
      .catch(() => null)
  }
  return pending
}

const useLarkUser = () => {
  const [user, setUser] = useState<LarkUserInfo | null>(cachedUser)

  useEffect(() => {
    let mounted = true
    fetchUser().then((u) => {
      if (mounted)
        setUser(u)
    })
    return () => {
      mounted = false
    }
  }, [])

  return user
}

export default useLarkUser
