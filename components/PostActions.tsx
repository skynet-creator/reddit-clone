'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface PostActionsProps {
  postId: string
}

export default function PostActions({ postId }: PostActionsProps) {
  const [showMenu, setShowMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return

    setDeleting(true)
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId)

      if (error) throw error

      router.push('/')
      router.refresh()
    } catch (error) {
      console.error('삭제 오류:', error)
      alert('게시글 삭제에 실패했습니다.')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="p-2 hover:bg-gray-100 rounded-full"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
            <Link
              href={`/post/${postId}/edit`}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg"
            >
              수정
            </Link>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-b-lg disabled:opacity-50"
            >
              {deleting ? '삭제 중...' : '삭제'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

