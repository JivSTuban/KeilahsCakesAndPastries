"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { PostsManagement } from "@/components/admin/posts-management"
import { FeedbackManagement } from "@/components/admin/feedback-management"
import { MenuManagement } from "@/components/admin/menu-management"
import { CategoryManagement } from "@/components/admin/category-management"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Eye, EyeOff, Lock, User, BarChart3, Users, MessageSquare, ShoppingCart, LogOut, KeyRound } from "lucide-react"
import { motion } from "framer-motion"

interface Profile {
  role: string
}

interface AdminStats {
  pageViews: number
  orderClicks: number
  totalFeedback: number
  approvedFeedback: number
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [stats, setStats] = useState<AdminStats>({
    pageViews: 0,
    orderClicks: 0,
    totalFeedback: 0,
    approvedFeedback: 0
  })

  const [resetDialogOpen, setResetDialogOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [resetLoading, setResetLoading] = useState(false)
  const [resetError, setResetError] = useState("")
  const [resetSuccess, setResetSuccess] = useState("")

  useEffect(() => {
    checkAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setIsAuthenticated(false)
        setUsername("")
        setPassword("")
        setError("")
        setSuccess("")
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const checkAuth = async () => {
    try {
      setError("")
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single()

        if (data?.role === "admin") {
          setIsAuthenticated(true)
          fetchStats()
        } else {
          setError("Unauthorized access. Admin privileges required.")
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
      setError("Error checking authentication. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const MAX_RETRIES = 3
    const email = `${username}@admin.keilahscakes.local`

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        })

        if (error) {
          if (attempt < MAX_RETRIES) {
            console.warn(`Login attempt ${attempt} failed, retrying...`, error.message)
            await new Promise(r => setTimeout(r, 500 * attempt))
            continue
          }
          throw error
        }

        if (data.session) {
          const { data: profileData } = await supabase
            .from("profiles")
            .select("role")
            .eq("id", data.session.user.id)
            .single()

          if (profileData?.role === "admin") {
            setIsAuthenticated(true)
            setSuccess("Successfully logged in!")
            fetchStats()
          } else {
            setError("Unauthorized access. Admin privileges required.")
            await supabase.auth.signOut()
          }
        }
        break
      } catch (error: any) {
        if (attempt === MAX_RETRIES) {
          console.error("Login error after all retries:", error)
          setError(error.message || "Error during login. Please check your credentials.")
        }
      }
    }

    setIsLoading(false)
  }

  const fetchStats = async () => {
    try {
      // Fetch page views
      const { count: pageViews } = await supabase
        .from("events")
        .select("*", { count: "exact" })
        .eq("event_type", "page_view")

      // Fetch order clicks
      const { count: orderClicks } = await supabase
        .from("events")
        .select("*", { count: "exact" })
        .eq("event_type", "order_clicked")

      // Fetch feedback stats
      const { count: totalFeedback } = await supabase
        .from("feedback")
        .select("*", { count: "exact" })
        .neq("status", "rejected") // Count all feedback except rejected

      const { count: liveFeedback } = await supabase
        .from("feedback")
        .select("*", { count: "exact" })
        .neq("status", "rejected") // Same as total since we auto-approve

      setStats({
        pageViews: pageViews || 0,
        orderClicks: orderClicks || 0,
        totalFeedback: totalFeedback || 0,
        approvedFeedback: liveFeedback || 0
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      setError("Error fetching dashboard stats. Please refresh the page.")
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setResetError("")
    setResetSuccess("")

    if (newPassword.length < 6) {
      setResetError("New password must be at least 6 characters.")
      return
    }

    if (newPassword !== confirmPassword) {
      setResetError("New passwords do not match.")
      return
    }

    setResetLoading(true)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        setResetError("Session expired. Please sign in again.")
        return
      }

      const email = session.user.email!
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password: currentPassword,
      })

      if (signInError) {
        setResetError("Current password is incorrect.")
        return
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (updateError) throw updateError

      setResetSuccess("Password updated successfully!")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
      setTimeout(() => {
        setResetDialogOpen(false)
        setResetSuccess("")
      }, 1500)
    } catch (error: any) {
      console.error("Password reset error:", error)
      setResetError(error.message || "Failed to update password. Please try again.")
    } finally {
      setResetLoading(false)
    }
  }

  const closeResetDialog = () => {
    setResetDialogOpen(false)
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setResetError("")
    setResetSuccess("")
    setShowCurrentPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Admin Dashboard</h2>
          <p className="text-gray-600">Verifying your credentials...</p>
        </motion.div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="p-8 shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
              <p className="text-gray-600">Access the Keilah's admin dashboard</p>
            </div>

            {error && (
              <Alert className="mb-6 border-red-200 bg-red-50">
                <AlertDescription className="text-red-800">{error}</AlertDescription>
              </Alert>
            )}

            {success && (
              <Alert className="mb-6 border-green-200 bg-green-50">
                <AlertDescription className="text-green-800">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                  Username
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="pl-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-gray-200 focus:border-primary focus:ring-primary"
                    required
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 border border-gray-400 text-black font-medium hover:bg-gray-100"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                    Signing In...
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Secure admin access for Keilah's Cakes & Pastries
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage Keilah's Cakes & Pastries</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setResetDialogOpen(true)}
              className="flex items-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              Reset Password
            </Button>
            <Button
              variant="outline"
              onClick={async () => {
                await supabase.auth.signOut()
                setIsAuthenticated(false)
                setUsername("")
                setPassword("")
                setError("")
                setSuccess("")
              }}
              className="flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card className="p-6 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Page Views</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.pageViews.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <ShoppingCart className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Order Clicks</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.orderClicks.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <MessageSquare className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Total Feedback</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.totalFeedback.toLocaleString()}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm border-0 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Users className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-600">Live Feedback</h3>
                <p className="text-2xl font-bold text-gray-900">{stats.approvedFeedback.toLocaleString()}</p>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800">{error}</AlertDescription>
          </Alert>
        )}

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs defaultValue="posts" className="w-full">
            <TabsList className="flex w-full overflow-x-auto no-scrollbar lg:w-fit">
              <TabsTrigger value="posts" className="text-sm flex-shrink-0">Posts</TabsTrigger>
              <TabsTrigger value="feedback" className="text-sm flex-shrink-0">Feedback</TabsTrigger>
              <TabsTrigger value="menu" className="text-sm flex-shrink-0">Menu</TabsTrigger>
              <TabsTrigger value="categories" className="text-sm flex-shrink-0">Categories</TabsTrigger>
            </TabsList>

            <TabsContent value="posts" className="mt-6">
              <Card className="p-6 bg-white shadow-sm border-0">
                <PostsManagement />
              </Card>
            </TabsContent>

            <TabsContent value="feedback" className="mt-6">
              <Card className="p-6 bg-white shadow-sm border-0">
                <FeedbackManagement />
              </Card>
            </TabsContent>

            <TabsContent value="menu" className="mt-6">
              <Card className="p-6 bg-white shadow-sm border-0">
                <MenuManagement />
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="mt-6">
              <Card className="p-6 bg-white shadow-sm border-0">
                <CategoryManagement />
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Reset Password Dialog */}
        <Dialog open={resetDialogOpen} onOpenChange={(open) => { if (!open) closeResetDialog() }}>
          <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh] overflow-hidden gap-4">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-primary" />
                Reset Password
              </DialogTitle>
              <DialogDescription>
                Enter your current password and choose a new one.
              </DialogDescription>
            </DialogHeader>

            {resetError && (
              <Alert className="border-red-200 bg-red-50 flex-shrink-0">
                <AlertDescription className="text-red-800">{resetError}</AlertDescription>
              </Alert>
            )}

            {resetSuccess && (
              <Alert className="border-green-200 bg-green-50 flex-shrink-0">
                <AlertDescription className="text-green-800">{resetSuccess}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleResetPassword} className="flex flex-col flex-1 min-h-0">
              <div className="space-y-4 overflow-y-auto flex-1 pr-2">
              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm font-medium text-gray-700">
                  Current Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="current-password"
                    type={showCurrentPassword ? "text" : "password"}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                    required
                    disabled={resetLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={resetLoading}
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm font-medium text-gray-700">
                  New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="new-password"
                    type={showNewPassword ? "text" : "password"}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                    required
                    disabled={resetLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={resetLoading}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirm-password" className="text-sm font-medium text-gray-700">
                  Confirm New Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="confirm-password"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-primary focus:ring-primary"
                    required
                    disabled={resetLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={resetLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              </div>

              <div className="flex flex-row justify-end gap-2 pt-4 flex-shrink-0 mt-4 border-t border-gray-200">
                <Button
                  type="button"
                  variant="outline"
                  onClick={closeResetDialog}
                  disabled={resetLoading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="border border-gray-400 text-black hover:bg-gray-100"
                  disabled={resetLoading}
                >
                  {resetLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                      Updating...
                    </div>
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
