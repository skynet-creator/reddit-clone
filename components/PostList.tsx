import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ko } from 'date-fns/locale'
import VoteButtons from './VoteButtons'
import type { Post } from '@/lib/types/database.types'

interface PostListProps {
  posts: Post[]
}

export default function PostList({ posts }: PostListProps) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-xl">아직 게시글이 없습니다.</p>
        <p className="mt-2">첫 번째 게시글을 작성해보세요!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:border-gray-300 transition-colors">
          <div className="flex">
            {/* 투표 버튼 */}
            <div className="bg-gray-50 p-4 flex flex-col items-center">
              <VoteButtons postId={post.id} initialVoteCount={post.vote_count || 0} userVote={post.user_vote} />
            </div>

            {/* 게시글 내용 */}
            <div className="flex-1 p-4">
              <Link href={`/post/${post.id}`}>
                <h2 className="text-xl font-semibold text-gray-900 hover:text-orange-600 mb-2">
                  {post.title}
                </h2>
              </Link>
              
              <p className="text-gray-600 line-clamp-2 mb-3">
                {post.content}
              </p>

              <div className="flex items-center gap-4 text-sm text-gray-500">
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
          </div>
        </div>
      ))}
    </div>
  )
}

