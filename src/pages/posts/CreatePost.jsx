import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ArrowLeft } from 'lucide-react'
import { socialApi } from '@/api/socialApi'

export default function CreatePost() {
  const { user } = useAuth()
  const navigate = useNavigate()
  // Backend Post document only has: authorId, content, createdAt
  // No mediaUrls, no taggedProducts — keep it simple and match the backend model
  const [content, setContent] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async () => {
    if (!content.trim()) { setError('Post content is required'); return }
    setIsSubmitting(true)
    setError('')
    try {
      // Backend PostController sets authorId from SecurityContext — just send content
      await socialApi.createPost({ content })
      navigate('/feed')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create post')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-2xl font-bold">Create Post</h1>
        </div>

        <Card className="border-green/20">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user?.avatarUrl || user?.avatar} />
                <AvatarFallback className="bg-green text-green-foreground">{user?.name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{user?.name}</p>
                <p className="text-xs text-muted-foreground">Creating a post</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>What are you shopping for? *</Label>
              <Textarea
                placeholder="Share something with your followers..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
              />
              <p className="text-xs text-muted-foreground">{content.length} characters</p>
            </div>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <div className="flex gap-3 pt-2">
              <Button onClick={handleSubmit} disabled={isSubmitting || !content.trim()}
                className="flex-1 bg-green hover:bg-green/90 text-green-foreground">
                {isSubmitting ? <><Spinner className="mr-2" />Posting...</> : 'Share Post'}
              </Button>
              <Button variant="outline" onClick={() => navigate(-1)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
