'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import type { Comment } from '@/lib/types/database.types'

interface CommentItemProps {
  comment: Comment
  currentUserId?: string
}

export default function CommentItem({ comment, currentUserId }: CommentItemProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editContent, setEditContent] = useState(comment.content)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const isAuthor = currentUserId === comment.user_id

  const handleUpdate = async () => {
    setLoading(true)
    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editContent })
        .eq('id', comment.id)

      if (error) throw error

      setIsEditing(false)
      router.refresh()
    } catch (error) {
      console.error('댓글 수정 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('댓글을 삭제하시겠습니까?')) return

    setLoading(true)
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', comment.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error('댓글 삭제 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-l-2 border-gray-200 pl-4 py-2">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="font-medium text-gray-900">
              {comment.profiles?.username || '알 수 없음'}
            </span>
            <span className="text-sm text-gray-500">
              {formatDistanceToNow(new Date(comment.created_at), { 
                addSuffix: true, 
                locale: ko 
              })}
            </span>
          </div>

          {isEditing ? (
            <div className="space-y-2">
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleUpdate}
                  disabled={loading || !editContent.trim()}
                  className="px-4 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700 disabled:opacity-50"
                >
                  {loading ? '수정 중...' : '수정'}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditContent(comment.content)
                  }}
                  className="px-4 py-1 border border-gray-300 text-sm rounded hover:bg-gray-50"
                >
                  취소
                </button>
              </div>
            </div>
          ) : (
            <p className="text-gray-800 whitespace-pre-wrap">
              {comment.content}
            </p>
          )}
        </div>

        {isAuthor && !isEditing && (
          <div className="flex gap-2 ml-4">
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-gray-600 hover:text-gray-900"
            >
              수정
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
            >
              삭제
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

