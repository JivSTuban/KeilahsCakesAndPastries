"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { PostsManagement } from "@/components/admin/posts-management"
import { FeedbackManagement } from "@/components/admin/feedback-management"
import { MenuManagement } from "@/components/admin/menu-management"
import { FeaturedManagement } from "@/components/admin/featured-management"

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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [stats, setStats] = useState<AdminStats>({
    pageViews: 0,
    orderClicks: 0,
    totalFeedback: 0,
    approvedFeedback: 0
  })

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
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
          toast.error("Unauthorized access")
        }
      }
    } catch (error) {
      console.error("Auth check error:", error)
      toast.error("Error checking authentication")
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) throw error

      if (data.session) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", data.session.user.id)
          .single()

        if (profileData?.role === "admin") {
          setIsAuthenticated(true)
          fetchStats()
          toast.success("Successfully logged in")
        } else {
          toast.error("Unauthorized access")
          await supabase.auth.signOut()
        }
      }
    } catch (error) {
      console.error("Login error:", error)
      toast.error("Error during login")
    } finally {
      setIsLoading(false)
    }
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

      const { count: approvedFeedback } = await supabase
        .from("feedback")
        .select("*", { count: "exact" })
        .eq("status", "approved")

      setStats({
        pageViews: pageViews || 0,
        orderClicks: orderClicks || 0,
        totalFeedback: totalFeedback || 0,
        approvedFeedback: approvedFeedback || 0
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
      toast.error("Error fetching dashboard stats")
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-[350px] p-6">
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Loading..." : "Login"}
            </Button>
          </form>
        </Card>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button
          variant="outline"
          onClick={() => supabase.auth.signOut()}
        >
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Page Views</h3>
          <p className="text-2xl font-bold">{stats.pageViews}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Order Clicks</h3>
          <p className="text-2xl font-bold">{stats.orderClicks}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Total Feedback</h3>
          <p className="text-2xl font-bold">{stats.totalFeedback}</p>
        </Card>
        <Card className="p-4">
          <h3 className="font-medium text-muted-foreground">Approved Feedback</h3>
          <p className="text-2xl font-bold">{stats.approvedFeedback}</p>
        </Card>
      </div>

      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts">Posts</TabsTrigger>
          <TabsTrigger value="feedback">Feedback</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="featured">Featured Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="posts">
          <Card className="p-4">
            <PostsManagement />
          </Card>
        </TabsContent>

        <TabsContent value="feedback">
          <Card className="p-4">
            <FeedbackManagement />
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <Card className="p-4">
            <MenuManagement />
          </Card>
        </TabsContent>

        <TabsContent value="featured">
          <Card className="p-4">
            <FeaturedManagement />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
