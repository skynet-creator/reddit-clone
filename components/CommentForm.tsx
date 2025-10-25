'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface CommentFormProps {
  postId: string
}

export default function CommentForm({ postId }: CommentFormProps) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { error } = await supabase
        .from('comments')
        .insert({
          post_id: postId,
          user_id: user.id,
          content,
        })

      if (error) throw error

      setContent('')
      router.refresh()
    } catch (error) {
      console.error('댓글 작성 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        rows={3}
        placeholder="댓글을 입력하세요..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
      />
      <div className="flex justify-end mt-2">
        <button
          type="submit"
          disabled={loading || !content.trim()}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? '작성 중...' : '댓글 작성'}
        </button>
      </div>
    </form>
  )
}

