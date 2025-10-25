export type Profile = {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export type Post = {
  id: string
  user_id: string
  title: string
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
  vote_count?: number
  user_vote?: number
}

export type Comment = {
  id: string
  post_id: string
  user_id: string
  content: string
  created_at: string
  updated_at: string
  profiles?: Profile
}

export type PostVote = {
  id: string
  post_id: string
  user_id: string
  vote_type: number
  created_at: string
}

