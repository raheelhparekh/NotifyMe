"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { NotificationCard } from "./NotificationCard";

export function NotificationList({ notifications, onMarkAsRead }) {
  if (!notifications || notifications.length === 0) {
    return <p className="text-center text-gray-500 mt-8">No notifications yet.</p>;
  }

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border p-4">
      <div className="space-y-4">
        {notifications.map((notification) => (
          <NotificationCard
            key={notification._id}
            notification={notification}
            onMarkAsRead={onMarkAsRead}
          />
        ))}
      </div>
    </ScrollArea>
  );
}