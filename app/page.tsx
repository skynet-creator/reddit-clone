import { createClient } from '@/lib/supabase/server'
import PostList from '@/components/PostList'

export default async function HomePage() {
  const supabase = await createClient()
  
  const { data: posts } = await supabase
    .from('posts')
    .select(`
      *,
      profiles:user_id (username, avatar_url),
      post_votes (vote_type)
    `)
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
      <div className="mb-8 flex justify-between items-center">
        <h1 className="text-3xl font-bold">게시판</h1>
      </div>
      
      <PostList posts={postsWithVotes} />
    </div>
  )
}
