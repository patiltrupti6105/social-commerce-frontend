import { useState } from 'react'
import { Link } from 'react-router-dom'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Spinner } from '@/components/ui/spinner'
import { Mail, ArrowLeft } from 'lucide-react'
import api from '@/api/axiosConfig'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [resetToken, setResetToken] = useState('')   // returned by API for dev/demo
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const res = await api.post('/auth/forgot-password', { email })
      // In production the token would be emailed; here the API returns it directly for testing
      const token = res.data.data
      setResetToken(token)
      setSent(true)
      toast.success('Reset token generated')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple/5 via-background to-purple/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple to-purple/70 flex items-center justify-center">
              <span className="text-white font-bold text-xl">SS</span>
            </div>
            <span className="font-bold text-2xl">SocialShop</span>
          </Link>
        </div>

        <Card className="border-purple/20 shadow-xl">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">Forgot password?</CardTitle>
            <CardDescription className="text-center">
              Enter your email and we'll send you a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!sent ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-purple hover:bg-purple/90 text-purple-foreground"
                  disabled={isLoading}
                >
                  {isLoading ? <Spinner className="mr-2" /> : null}
                  Send reset link
                </Button>
              </form>
            ) : (
              <div className="space-y-4">
                <Alert>
                  <AlertDescription>
                    Reset token generated. In production this would be emailed to you.
                    For this demo, copy the token below and use it on the reset page.
                  </AlertDescription>
                </Alert>
                {resetToken && (
                  <div className="bg-muted rounded-lg p-3 break-all">
                    <p className="text-xs text-muted-foreground mb-1">Your reset token:</p>
                    <code className="text-sm font-mono">{resetToken}</code>
                  </div>
                )}
                <Link to={`/reset-password?token=${resetToken}`}>
                  <Button className="w-full bg-purple hover:bg-purple/90 text-purple-foreground">
                    Go to reset password page
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center mt-4">
          <Link
            to="/login"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
