import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Save, ArrowLeft } from 'lucide-react'
import { userApi } from '@/api/userApi'

export default function EditProfile() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: '', bio: '', website: '', avatarUrl: '', storeName: '' })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const isSeller = user?.role === 'SELLER'

  useEffect(() => {
    userApi.getMe().then(r => {
      const p = r.data.data
      setFormData({
        name: p.name || '',
        bio: p.bio || '',
        website: p.website || '',
        avatarUrl: p.avatarUrl || p.avatar || '',
        storeName: p.storeName || '',
      })
    }).catch(() => {
      setFormData({
        name: user?.name || '',
        bio: user?.bio || '',
        website: user?.website || '',
        avatarUrl: user?.avatar || '',
        storeName: user?.storeName || '',
      })
    }).finally(() => setIsLoading(false))
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setSuccess(false)
    try {
      const res = await userApi.updateMe(formData)
      updateUser(res.data.data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save changes')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><Spinner className="h-8 w-8" /></div>

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6 max-w-2xl">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate(-1)}><ArrowLeft className="h-5 w-5" /></Button>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader><CardTitle>Profile Information</CardTitle></CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={formData.avatarUrl} />
                  <AvatarFallback className="bg-purple text-purple-foreground text-xl">{formData.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Label htmlFor="avatarUrl">Avatar URL</Label>
                  <Input id="avatarUrl" name="avatarUrl" value={formData.avatarUrl} onChange={handleChange} placeholder="https://..." />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" name="bio" value={formData.bio} onChange={handleChange} rows={3} placeholder="Tell people about yourself..." />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" name="website" value={formData.website} onChange={handleChange} placeholder="https://yourwebsite.com" />
              </div>

              {isSeller && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Store Name</Label>
                    <Input id="storeName" name="storeName" value={formData.storeName} onChange={handleChange} placeholder="Your store name" />
                  </div>
                </>
              )}

              {success && <Alert><AlertDescription>Profile updated successfully!</AlertDescription></Alert>}
              {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

              <Button type="submit" disabled={isSaving} className="w-full bg-purple hover:bg-purple/90 text-purple-foreground">
                {isSaving ? <><Spinner className="mr-2" />Saving...</> : <><Save className="h-4 w-4 mr-2" />Save Changes</>}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </div>
  )
}
