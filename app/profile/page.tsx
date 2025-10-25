import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import ProfileEditForm from '@/components/ProfileEditForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // 프로필 정보
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // 내가 작성한 게시글
  const { data: myPosts } = await supabase
    .from('posts')
    .select(`
      *,
      post_votes (vote_type)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  const postsWithVotes = myPosts?.map(post => {
    const voteCount = post.post_votes?.reduce((sum: number, vote: { vote_type: number }) => sum + vote.vote_type, 0) || 0
    return {
      ...post,
      vote_count: voteCount,
    }
  }) || []

  // 내가 작성한 댓글
  const { data: myComments } = await supabase
    .from('comments')
    .select(`
      *,
      posts (id, title)
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <div className="max-w-4xl mx-auto">
      {/* 프로필 정보 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h1 className="text-3xl font-bold mb-4">내 정보</h1>
        <div className="space-y-3">
          <ProfileEditForm 
            userId={user.id} 
            currentUsername={profile?.username || ''}
          />
          <div>
            <span className="text-gray-600">이메일:</span>
            <span className="ml-3 font-medium text-gray-900">
              {user.email}
            </span>
          </div>
          <div>
            <span className="text-gray-600">가입일:</span>
            <span className="ml-3 text-gray-900">
              {new Date(profile?.created_at || '').toLocaleDateString('ko-KR')}
            </span>
          </div>
        </div>
      </div>

      {/* 내가 작성한 게시글 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-2xl font-bold mb-4">
          내가 작성한 게시글 ({postsWithVotes.length})
        </h2>
        
        {postsWithVotes.length > 0 ? (
          <div className="space-y-3">
            {postsWithVotes.map((post) => (
              <div
                key={post.id}
                className="border-b border-gray-200 last:border-0 pb-3 last:pb-0"
              >
                <Link
                  href={`/post/${post.id}`}
                  className="text-lg font-medium text-gray-900 hover:text-orange-600"
                >
                  {post.title}
                </Link>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                  <span>
                    {formatDistanceToNow(new Date(post.created_at), { 
                      addSuffix: true, 
                      locale: ko 
                    })}
                  </span>
                  <span className="flex items-center gap-1">
                    ⬆ {post.vote_count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            작성한 게시글이 없습니다.
          </p>
        )}
      </div>

      {/* 내가 작성한 댓글 */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold mb-4">
          최근 작성한 댓글
        </h2>
        
        {myComments && myComments.length > 0 ? (
          <div className="space-y-3">
            {myComments.map((comment) => (
              <div
                key={comment.id}
                className="border-b border-gray-200 last:border-0 pb-3 last:pb-0"
              >
                <p className="text-gray-800 mb-2 line-clamp-2">
                  {comment.content}
                </p>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <Link
                    href={`/post/${comment.posts?.id}`}
                    className="hover:text-orange-600"
                  >
                    → {comment.posts?.title}
                  </Link>
                  <span>
                    {formatDistanceToNow(new Date(comment.created_at), { 
                      addSuffix: true, 
                      locale: ko 
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">
            작성한 댓글이 없습니다.
          </p>
        )}
      </div>
    </div>
  )
}

