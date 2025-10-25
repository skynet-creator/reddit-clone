import { createClient } from '@/lib/supabase/server'
import PostList from '@/components/PostList'
import { redirect } from 'next/navigation'

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const { q } = await searchParams
  
  if (!q) {
    redirect('/')
  }

  const supabase = await createClient()

  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (username, avatar_url),
      post_votes (vote_type)
    `)
    .or(`title.ilike.%${q}%,content.ilike.%${q}%`)
    .order('created_at', { ascending: false })

  // 각 게시글의 투표 수 계산
  const postsWithVotes = posts?.map(post => {
    const voteCount = post.post_votes?.reduce((sum: number, vote: { vote_type: number }) => sum + vote.vote_type, 0) || 0
    return {
      ...post,
      vote_count: voteCount,
    }
  }) || []

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">검색 결과</h1>
        <p className="text-gray-600">
          &quot;{q}&quot; 검색 결과 {postsWithVotes.length}개
        </p>
      </div>

      {postsWithVotes.length > 0 ? (
        <PostList posts={postsWithVotes} />
      ) : (
        <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
          <p className="text-xl text-gray-500">검색 결과가 없습니다.</p>
          <p className="mt-2 text-gray-400">다른 검색어를 시도해보세요.</p>
        </div>
      )}
    </div>
  )
}

