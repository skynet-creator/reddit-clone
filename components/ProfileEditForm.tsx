'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface ProfileEditFormProps {
  userId: string
  currentUsername: string
}

export default function ProfileEditForm({ userId, currentUsername }: ProfileEditFormProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [username, setUsername] = useState(currentUsername)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!username.trim()) {
      setError('사용자명을 입력해주세요.')
      return
    }

    if (username === currentUsername) {
      setIsEditing(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      const supabase = createClient()
      
      // 사용자명 중복 체크
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

      if (existingProfile && existingProfile.id !== userId) {
        setError('이미 사용 중인 사용자명입니다.')
        setLoading(false)
        return
      }

      // 프로필 업데이트
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ username: username.trim() })
        .eq('id', userId)

      if (updateError) {
        throw updateError
      }

      setIsEditing(false)
      router.refresh()
    } catch (err) {
      console.error('닉네임 변경 오류:', err)
      setError('닉네임 변경에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setUsername(currentUsername)
    setError(null)
    setIsEditing(false)
  }

  if (!isEditing) {
    return (
      <div className="flex items-center gap-3">
        <div>
          <span className="text-gray-600">사용자명:</span>
          <span className="ml-3 font-medium text-gray-900">
            {currentUsername}
          </span>
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 text-sm bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
        >
          변경
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
          사용자명 변경
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="새로운 사용자명"
          disabled={loading}
          maxLength={50}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? '저장 중...' : '저장'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          취소
        </button>
      </div>
    </form>
  )
}

