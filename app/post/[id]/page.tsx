import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import VoteButtons from '@/components/VoteButtons'
import CommentSection from '@/components/CommentSection'
import PostActions from '@/components/PostActions'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  // 게시글 조회
  const { data: post } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (id, username, avatar_url),
      post_votes (vote_type)
    `)
    .eq('id', id)
    .single()

  if (!post) {
    notFound()
  }

  // 투표 수 계산
  const voteCount = post.post_votes?.reduce((sum: number, vote: { vote_type: number }) => sum + vote.vote_type, 0) || 0

  // 현재 사용자 정보
  const { data: { user } } = await supabase.auth.getUser()
  let userVote = null
  if (user) {
    const { data } = await supabase
      .from('post_votes')
      .select('vote_type')
      .eq('post_id', id)
      .eq('user_id', user.id)
      .single()
    userVote = data?.vote_type
  }

  const isAuthor = user?.id === post.user_id

  return (
    <div className="max-w-3xl mx-auto">
      {/* 게시글 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
        <div className="flex">
          {/* 투표 버튼 */}
          <div className="bg-gray-50 p-4 flex flex-col items-center">
            <VoteButtons postId={post.id} initialVoteCount={voteCount} userVote={userVote || undefined} />
          </div>

          {/* 게시글 내용 */}
          <div className="flex-1 p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {post.title}
                </h1>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="font-medium text-gray-700">
                    {post.profiles?.username || '알 수 없음'}
                  </span>
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { 
                      addSuffix: true, 
                      locale: ko 
                    })}
                  </span>
                </div>
              </div>
              
              {isAuthor && <PostActions postId={post.id} />}
            </div>

            <div className="prose max-w-none">
              <p className="text-gray-800 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <CommentSection postId={id} />
    </div>
  )
}

