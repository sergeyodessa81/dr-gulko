"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, Database, FolderOpen, CheckCircle } from "lucide-react"
import { toast } from "sonner"

interface SyncResult {
  id: string
  action: "created" | "updated"
  title: string
}

export function SyncManager() {
  const [notionId, setNotionId] = useState("")
  const [driveId, setDriveId] = useState("")
  const [isNotionSyncing, setIsNotionSyncing] = useState(false)
  const [isDriveSyncing, setIsDriveSyncing] = useState(false)
  const [lastSync, setLastSync] = useState<Date | null>(null)
  const [syncResults, setSyncResults] = useState<SyncResult[]>([])

  const handleNotionSync = async () => {
    if (!notionId.trim()) {
      toast.error("Please enter a Notion database ID")
      return
    }

    setIsNotionSyncing(true)
    try {
      const response = await fetch("/api/sync/notion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ databaseId: notionId }),
      })

      const result = await response.json()

      if (result.success) {
        setSyncResults(result.results || [])
        setLastSync(new Date())
        toast.success(`Synced ${result.results?.length || 0} items from Notion`)
      } else {
        toast.error(result.error || "Sync failed")
      }
    } catch (error) {
      toast.error("Failed to sync with Notion")
    } finally {
      setIsNotionSyncing(false)
    }
  }

  const handleDriveSync = async () => {
    if (!driveId.trim()) {
      toast.error("Please enter a Google Drive folder ID")
      return
    }

    setIsDriveSyncing(true)
    try {
      const response = await fetch("/api/sync/drive", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ folderId: driveId }),
      })

      const result = await response.json()

      if (result.success) {
        setSyncResults(result.results || [])
        setLastSync(new Date())
        toast.success(`Synced ${result.results?.length || 0} items from Google Drive`)
      } else {
        toast.error(result.error || "Sync failed")
      }
    } catch (error) {
      toast.error("Failed to sync with Google Drive")
    } finally {
      setIsDriveSyncing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Content Sync</h2>
          <p className="text-muted-foreground">Sync content from external sources</p>
        </div>
        {lastSync && <div className="text-sm text-muted-foreground">Last sync: {lastSync.toLocaleString()}</div>}
      </div>

      <Tabs defaultValue="notion" className="space-y-4">
        <TabsList>
          <TabsTrigger value="notion" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            Notion
          </TabsTrigger>
          <TabsTrigger value="drive" className="flex items-center gap-2">
            <FolderOpen className="h-4 w-4" />
            Google Drive
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notion">
          <Card>
            <CardHeader>
              <CardTitle>Notion Database Sync</CardTitle>
              <CardDescription>Sync published posts from your Notion database</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="notion-id">Database ID</Label>
                <Input
                  id="notion-id"
                  placeholder="Enter Notion database ID"
                  value={notionId}
                  onChange={(e) => setNotionId(e.target.value)}
                />
              </div>
              <Button onClick={handleNotionSync} disabled={isNotionSyncing} className="w-full">
                {isNotionSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync from Notion
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="drive">
          <Card>
            <CardHeader>
              <CardTitle>Google Drive Sync</CardTitle>
              <CardDescription>Sync markdown files from your Google Drive folder</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="drive-id">Folder ID</Label>
                <Input
                  id="drive-id"
                  placeholder="Enter Google Drive folder ID"
                  value={driveId}
                  onChange={(e) => setDriveId(e.target.value)}
                />
              </div>
              <Button onClick={handleDriveSync} disabled={isDriveSyncing} className="w-full">
                {isDriveSyncing ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Sync from Google Drive
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {syncResults.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sync Results</CardTitle>
            <CardDescription>Recent sync activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {syncResults.map((result) => (
                <div key={result.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-2">
                    {result.action === "created" ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <RefreshCw className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="font-medium">{result.title}</span>
                  </div>
                  <Badge variant={result.action === "created" ? "default" : "secondary"}>{result.action}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
