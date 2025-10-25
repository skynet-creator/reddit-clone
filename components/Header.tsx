import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import LogoutButton from './LogoutButton'
import SearchBar from './SearchBar'

export default async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let profile = null
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    profile = data
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-5xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-orange-600 hover:text-orange-700">
              커뮤니티
            </Link>
            <SearchBar />
          </div>

          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link
                  href="/post/create"
                  className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 font-medium"
                >
                  글쓰기
                </Link>
                <Link
                  href="/profile"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  {profile?.username || '내 정보'}
                </Link>
                <LogoutButton />
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-gray-900 font-medium"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-orange-600 text-white rounded-full hover:bg-orange-700 font-medium"
                >
                  회원가입
                </Link>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  )
}

