"use client"

import Header from "@/components/versify/Header"
import PoemCard from "@/components/versify/PoemCard"
import { useLibrary } from "@/context/LibraryContext"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, Loader2, Hash, Menu } from "lucide-react"
import { useSupabaseUser } from "@/hooks/use-supabase-user"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import { useState } from "react"

export default function LibraryPage() {
  const { library, collections, loading } = useLibrary()
  const { user } = useSupabaseUser()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const poemsInCollection = (collection: string) => library.filter((p) => p.collection === collection)

  // Sidebar content component
  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border flex-shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <Hash className="h-4 w-4 text-muted-foreground" />
          <span className="font-semibold text-sm">library</span>
        </div>
        <p className="text-xs text-muted-foreground">Your saved poems</p>
      </div>
      
      <div className="flex-1 min-h-0 overflow-y-auto discord-scrollbar">
        <div className="p-4 space-y-2">
          <div className="discord-channel">
            <BookOpen className="h-4 w-4" />
            <span className="text-sm">All Poems ({library.length})</span>
          </div>
          {collections.map((collection) => (
            <div key={collection} className="discord-channel">
              <Hash className="h-4 w-4" />
              <span className="text-sm">{collection} ({poemsInCollection(collection).length})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 discord-sidebar">
          <SidebarContent />
        </div>
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center h-12 px-4 bg-card border-b border-border shadow-sm">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden mr-2">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <div className="flex items-center gap-2 flex-1">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">library</span>
              <div className="h-4 w-px bg-border mx-2 hidden sm:block" />
              <span className="text-sm text-muted-foreground hidden sm:block">Your saved poems</span>
            </div>
            <Header />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-8 h-8 mb-2 text-primary animate-spin mx-auto" />
              <p className="text-sm text-muted-foreground">Loading your library...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="flex h-screen bg-background">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 discord-sidebar">
          <SidebarContent />
        </div>
        {/* Mobile Sidebar */}
        <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
          <SheetContent side="left" className="w-80 p-0 discord-sidebar">
            <SidebarContent />
          </SheetContent>
        </Sheet>
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center h-12 px-4 bg-card border-b border-border shadow-sm">
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm" className="lg:hidden mr-2">
                  <Menu className="h-4 w-4" />
                </Button>
              </SheetTrigger>
            </Sheet>
            <div className="flex items-center gap-2 flex-1">
              <Hash className="h-5 w-5 text-muted-foreground" />
              <span className="font-semibold text-foreground">library</span>
              <div className="h-4 w-px bg-border mx-2 hidden sm:block" />
              <span className="text-sm text-muted-foreground hidden sm:block">Your saved poems</span>
            </div>
            <Header />
          </div>
          <div className="flex-1 flex items-center justify-center p-4 sm:p-6">
            <div className="discord-message max-w-md text-center">
              <BookOpen className="w-12 h-12 mb-4 text-primary/50 mx-auto" />
              <h2 className="text-lg font-semibold text-foreground mb-2">Sign in to see your Library</h2>
              <p className="text-sm text-muted-foreground mb-4">Your personal collection of AI-generated poems will be waiting for you.</p>
              <Button asChild>
                <Link href="/login">Sign In</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden lg:flex w-80 discord-sidebar">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-80 p-0 discord-sidebar">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center h-12 px-4 bg-card border-b border-border shadow-sm">
          <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="lg:hidden mr-2">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
          </Sheet>
          <div className="flex items-center gap-2 flex-1">
            <Hash className="h-5 w-5 text-muted-foreground" />
            <span className="font-semibold text-foreground">library</span>
            <div className="h-4 w-px bg-border mx-2 hidden sm:block" />
            <span className="text-sm text-muted-foreground hidden sm:block">Your saved poems</span>
          </div>
          <Header />
        </div>
        
        <div className="flex-1 p-4 sm:p-6 discord-scrollbar overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-6 w-full sm:w-auto">
                <TabsTrigger value="all" className="flex-1 sm:flex-none">All Poems</TabsTrigger>
                {collections.map((c) => (
                  <TabsTrigger key={c} value={c} className="flex-1 sm:flex-none">
                    {c}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="all">
                {library.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {library.map((item) => (
                      <PoemCard key={item.id} poem={item} />
                    ))}
                  </div>
                ) : (
                  <div className="discord-message max-w-md mx-auto text-center">
                    <BookOpen className="w-12 h-12 mb-4 text-primary/50 mx-auto" />
                    <h2 className="text-lg font-semibold text-foreground mb-2">Your Library is Empty</h2>
                    <p className="text-sm text-muted-foreground mb-4">
                      You haven't saved any poems yet. Start creating to build your personal collection!
                    </p>
                    <Button asChild>
                      <Link href="/">Create a Poem</Link>
                    </Button>
                  </div>
                )}
              </TabsContent>

              {collections.map((c) => (
                <TabsContent key={c} value={c}>
                  {poemsInCollection(c).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {poemsInCollection(c).map((item) => (
                        <PoemCard key={item.id} poem={item} />
                      ))}
                    </div>
                  ) : (
                    <div className="discord-message max-w-md mx-auto text-center">
                      <h2 className="text-lg font-semibold text-foreground mb-2">No poems in "{c}"</h2>
                      <p className="text-sm text-muted-foreground">
                        You can add poems to this collection from the main library view using the menu on each poem card.
                      </p>
                    </div>
                  )}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
