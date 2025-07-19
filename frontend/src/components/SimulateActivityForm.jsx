"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { simulateActivity, createTestUser, createTestContent } from "@/lib/api";

export function SimulateActivityForm() {
  const [activityType, setActivityType] = useState("");
  const [actorId, setActorId] = useState("");
  const [targetId, setTargetId] = useState("");
  const [contentId, setContentId] = useState("");
  const [loading, setLoading] = useState(false);

  // State for temporary user/content creation
  const [newUsername, setNewUsername] = useState("");
  const [newContentAuthorId, setNewContentAuthorId] = useState("");
  const [newContentType, setNewContentType] = useState("");
  const [newContentTitle, setNewContentTitle] = useState("");

  const handleSimulate = async () => {
    setLoading(true);
    try {
      if (!activityType || !actorId) {
        toast.error("Activity Type and Actor ID are required for simulation.");
        return;
      }

      await simulateActivity({ activityType, actorId, targetId, contentId });
      toast.success("Simulation successful!");
    } catch (error) {
      toast.error("Simulation failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    setLoading(true);
    try {
      if (!newUsername) {
        toast.error("username is required for user creation.");
        return;
      }
      const response = await createTestUser(newUsername);
      toast.success("User Created!");
      setNewUsername("");
    } catch (error) {
      toast.error("User Creation Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateContent = async () => {
    setLoading(true);
    try {
      if (!newContentAuthorId || !newContentType) {
        toast.error("author id and content type are requried");
        return;
      }
      const response = await createTestContent(newContentAuthorId, newContentType, newContentTitle);
      toast.success("Content Created");
      setNewContentAuthorId("");
      setNewContentType("");
      setNewContentTitle("");
    } catch (error) {
      toast.error("Content Creation Failed");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 border rounded-lg shadow-sm bg-gray-50">
      {/* Section to create test users and content */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">1. Create Test User</h2>

        <div className="border p-4 rounded-md bg-white">
          <h3 className="text-lg font-medium mb-2">Create User</h3>
          <div className="grid gap-2">
            <Label htmlFor="newUsername">Username</Label>
            <Input
              id="newUsername"
              placeholder="Enter here"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
            />
            <Button onClick={handleCreateUser} disabled={loading}>
              {loading ? "Creating..." : "Create User"}
            </Button>
          </div>
        </div>

        <div className="border p-4 rounded-md bg-white">
          <h3 className="text-lg font-medium mb-2">Create Test Content</h3>
          <div className="grid gap-2">
            <Label htmlFor="newContentAuthorId">Author ID</Label>
            <Input
              id="newContentAuthorId"
              placeholder="Paste User ID here"
              value={newContentAuthorId}
              onChange={(e) => setNewContentAuthorId(e.target.value)}
            />
            <Label htmlFor="newContentType">Content Type</Label>
            <Select value={newContentType} onValueChange={setNewContentType}>
              <SelectTrigger id="newContentType">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="blog">Blog</SelectItem>
                <SelectItem value="chat">Chat</SelectItem>
                <SelectItem value="job">Job</SelectItem>
              </SelectContent>
            </Select>
            <Label htmlFor="newContentTitle">Title (Optional)</Label>
            <Input
              id="newContentTitle"
              placeholder="Enter here"
              value={newContentTitle}
              onChange={(e) => setNewContentTitle(e.target.value)}
            />
            <Button onClick={handleCreateContent} disabled={loading}>
              {loading ? "Creating..." : "Create Content"}
            </Button>
          </div>
        </div>
      </div>

      {/* Section to simulate activities */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">2. Simulate Activity</h2>
  
        <div className="grid gap-4 border p-4 rounded-md bg-white">
          <div className="grid gap-2">
            <Label htmlFor="activityType">Activity Type</Label>
            <Select value={activityType} onValueChange={setActivityType}>
              <SelectTrigger id="activityType">
                <SelectValue placeholder="Select activity type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new_post">New Post</SelectItem>
                <SelectItem value="new_follower">New Follower</SelectItem>
                <SelectItem value="content_liked">Content Liked</SelectItem>
                {/* Add more activity types as defined in your backend */}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="actorId">Actor ID (Performer)</Label>
            <Input
              id="actorId"
              placeholder="e.g., User ID who posted/followed/liked"
              value={actorId}
              onChange={(e) => setActorId(e.target.value)}
            />
          </div>

          {activityType === "new_follower" && (
            <div className="grid gap-2">
              <Label htmlFor="targetId">Target ID (Followed User)</Label>
              <Input
                id="targetId"
                placeholder="e.g., User ID being followed"
                value={targetId}
                onChange={(e) => setTargetId(e.target.value)}
              />
            </div>
          )}

          {(activityType === "new_post" || activityType === "content_liked") && (
            <div className="grid gap-2">
              <Label htmlFor="contentId">Content ID</Label>
              <Input
                id="contentId"
                placeholder="e.g., ID of the post/content"
                value={contentId}
                onChange={(e) => setContentId(e.target.value)}
              />
            </div>
          )}

          <Button onClick={handleSimulate} disabled={loading}>
            {loading ? "Simulating..." : "Simulate Activity"}
          </Button>
        </div>
      </div>
    </div>
  );
}