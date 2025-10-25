'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { use } from 'react'

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/login')
          return
        }

        const { data: post, error } = await supabase
          .from('posts')
          .select('*')
          .eq('id', id)
          .single()

        if (error) throw error

        if (post.user_id !== user.id) {
          router.push('/')
          return
        }

        setTitle(post.title)
        setContent(post.content)
      } catch (error) {
        console.error('게시글 로드 오류:', error)
        router.push('/')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [id, router, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('posts')
        .update({ title, content })
        .eq('id', id)

      if (error) throw error

      router.push(`/post/${id}`)
      router.refresh()
    } catch (error: unknown) {
      if (error instanceof Error) {
        setError(error.message)
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="text-gray-500">로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">게시글 수정</h1>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            제목
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div>
          <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
            내용
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={15}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
          />
        </div>

        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? '수정 중...' : '수정 완료'}
          </button>
        </div>
      </form>
    </div>
  )
}

