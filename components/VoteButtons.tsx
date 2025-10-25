'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface VoteButtonsProps {
  postId: string
  initialVoteCount: number
  userVote?: number
}

export default function VoteButtons({ postId, initialVoteCount, userVote: initialUserVote }: VoteButtonsProps) {
  const [voteCount, setVoteCount] = useState(initialVoteCount)
  const [userVote, setUserVote] = useState<number | null>(initialUserVote || null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // 현재 사용자의 투표 상태 가져오기
    const fetchUserVote = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('post_votes')
        .select('vote_type')
        .eq('post_id', postId)
        .eq('user_id', user.id)
        .single()

      if (data) {
        setUserVote(data.vote_type)
      }
    }

    fetchUserVote()
  }, [postId])

  const handleVote = async (voteType: number) => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }

      // 같은 투표를 다시 클릭하면 투표 취소
      if (userVote === voteType) {
        await supabase
          .from('post_votes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', user.id)

        setVoteCount(voteCount - voteType)
        setUserVote(null)
      } else {
        // 새로운 투표 또는 투표 변경
        await supabase
          .from('post_votes')
          .upsert({
            post_id: postId,
            user_id: user.id,
            vote_type: voteType,
          })

        const diff = userVote ? voteType - userVote : voteType
        setVoteCount(voteCount + diff)
        setUserVote(voteType)
      }

      router.refresh()
    } catch (error) {
      console.error('투표 오류:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <button
        onClick={() => handleVote(1)}
        disabled={loading}
        className={`p-1 rounded hover:bg-gray-200 transition-colors ${
          userVote === 1 ? 'text-orange-600' : 'text-gray-400'
        }`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 3l6 7H4l6-7z" />
        </svg>
      </button>
      
      <span className={`font-bold text-lg ${
        voteCount > 0 ? 'text-orange-600' : voteCount < 0 ? 'text-blue-600' : 'text-gray-700'
      }`}>
        {voteCount}
      </span>
      
      <button
        onClick={() => handleVote(-1)}
        disabled={loading}
        className={`p-1 rounded hover:bg-gray-200 transition-colors ${
          userVote === -1 ? 'text-blue-600' : 'text-gray-400'
        }`}
      >
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 17l-6-7h12l-6 7z" />
        </svg>
      </button>
    </div>
  )
}

