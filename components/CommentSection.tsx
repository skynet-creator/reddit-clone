import { createClient } from '@/lib/supabase/server'
import CommentForm from './CommentForm'
import CommentItem from './CommentItem'

interface CommentSectionProps {
  postId: string
}

export default async function CommentSection({ postId }: CommentSectionProps) {
  const supabase = await createClient()

  const { data: comments } = await supabase
    .from('comments')
    .select(`
      *,
      profiles:user_id (username, avatar_url)
    `)
    .eq('post_id', postId)
    .order('created_at', { ascending: true })

  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold mb-6">
        댓글 {comments?.length || 0}개
      </h2>

      {user && <CommentForm postId={postId} />}

      <div className="space-y-4 mt-6">
        {comments && comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              currentUserId={user?.id}
            />
          ))
        ) : (
          <p className="text-gray-500 text-center py-8">
            아직 댓글이 없습니다. 첫 번째 댓글을 작성해보세요!
          </p>
        )}
      </div>
    </div>
  )
}

