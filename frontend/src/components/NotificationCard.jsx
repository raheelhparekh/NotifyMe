"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export function NotificationCard({ notification, onMarkAsRead }) {
  const timeAgo = formatDistanceToNow(new Date(notification.createdAt), {
    addSuffix: true,
  });

  return (
    <Card
      className={`mb-2 ${
        notification.read ? "bg-gray-100 text-gray-500" : "bg-white"
      }`}
    >
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-lg">{notification.message}</CardTitle>
        <CardDescription className="text-sm">
          {notification.sender
            ? `From: ${notification.sender.username}`
            : "System"}
          {notification.relatedContent &&
            ` | Related: ${
              notification.relatedContent.title ||
              notification.relatedContent.type
            }`}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex justify-between items-center">
        <span className="text-xs text-gray-400">{timeAgo}</span>
        {!notification.read && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => onMarkAsRead(notification._id)}
          >
            Mark as Read
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
