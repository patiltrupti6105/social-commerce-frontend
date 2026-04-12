import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Spinner } from '@/components/ui/spinner'
import { Camera, Save, ArrowLeft } from 'lucide-react'

export default function EditProfile() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    website: user?.website || '',
    avatarUrl: user?.avatar || '',
    storeName: user?.storeName || '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const isSeller = user?.role === 'SELLER'

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    updateUser({
      name: formData.name,
      bio: formData.bio,
      website: formData.website,
      avatar: formData.avatarUrl,
      ...(isSeller && { storeName: formData.storeName }),
    })

    setIsLoading(false)
    setSuccess(true)
    
    // Reset success message after 3 seconds
    setTimeout(() => setSuccess(false), 3000)
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">Edit Profile</h1>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Avatar Section */}
        <Card className="mb-6 border-purple/20">
          <CardHeader>
            <CardTitle className="text-lg">Profile Photo</CardTitle>
            <CardDescription>Update your profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 border-4 border-purple/20">
                  <AvatarImage src={formData.avatarUrl} alt={formData.name} />
                  <AvatarFallback className="bg-purple text-purple-foreground text-2xl">
                    {formData.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 h-8 w-8 rounded-full bg-purple text-purple-foreground flex items-center justify-center cursor-pointer">
                  <Camera className="h-4 w-4" />
                </div>
              </div>
              <div className="flex-1">
                <Label htmlFor="avatarUrl">Avatar URL</Label>
                <Input
                  id="avatarUrl"
                  name="avatarUrl"
                  value={formData.avatarUrl}
                  onChange={handleChange}
                  placeholder="https://example.com/avatar.jpg"
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Basic Info */}
        <Card className="mb-6 border-purple/20">
          <CardHeader>
            <CardTitle className="text-lg">Basic Information</CardTitle>
            <CardDescription>Update your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your display name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                placeholder="Tell us about yourself..."
                rows={4}
              />
              <p className="text-xs text-muted-foreground">
                {formData.bio.length}/150 characters
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
          </CardContent>
        </Card>

        {/* Seller Info */}
        {isSeller && (
          <Card className="mb-6 border-purple/20">
            <CardHeader>
              <CardTitle className="text-lg">Seller Information</CardTitle>
              <CardDescription>Manage your store details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="storeName">Store Name</Label>
                <Input
                  id="storeName"
                  name="storeName"
                  value={formData.storeName}
                  onChange={handleChange}
                  placeholder="Your store name"
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Account Info (Read-only) */}
        <Card className="mb-6 border-muted">
          <CardHeader>
            <CardTitle className="text-lg">Account Information</CardTitle>
            <CardDescription>Your account details (read-only)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="text-sm font-medium">{user?.email}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Role</span>
              <span className="text-sm font-medium capitalize">{user?.role?.toLowerCase()}</span>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">User ID</span>
              <span className="text-sm font-mono text-muted-foreground">{user?.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button 
            type="submit" 
            className="bg-purple hover:bg-purple/90 text-purple-foreground"
            disabled={isLoading}
          >
            {isLoading ? (
              <Spinner className="mr-2" />
            ) : (
              <Save className="h-4 w-4 mr-2" />
            )}
            Save Changes
          </Button>
          {success && (
            <span className="text-sm text-green">Profile updated successfully!</span>
          )}
        </div>
      </form>
    </div>
  )
}
