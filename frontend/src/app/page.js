"use client";

import { useState, useEffect } from "react";
import { getNotifications, markNotificationAsRead } from "@/lib/api";
import { NotificationList } from "@/components/NotificationList";
import { SimulateActivityForm } from "@/components/SimulateActivityForm";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function HomePage() {
  const [notifications, setNotifications] = useState([]);
  const [simulatedUserId, setSimulatedUserId] = useState("");
  const [loadingNotifications, setLoadingNotifications] = useState(false);
  const [isUserIdSet, setIsUserIdSet] = useState(false);

  // Function to fetch notifications
  const fetchNotifications = async (userId) => {
    if (!userId) return;
    setLoadingNotifications(true);
    try {
      const fetchedNotifications = await getNotifications(userId);
      setNotifications(fetchedNotifications);
      toast.success("Notifications fetched");
    } catch (error) {
      toast.error("Error loading notifications");
    } finally {
      setLoadingNotifications(false);
    }
  };

  // Handler to mark a notification as read
  const handleMarkAsRead = async (notificationId) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notif) =>
          notif._id === notificationId ? { ...notif, read: true } : notif,
        ),
      );
      toast.success("Marked notification as read");
    } catch (error) {
      toast.error("Error occured while marking notification as read");
    }
  };

  // Function to set the user ID and load notifications
  const handleSetUserId = async () => {
    if (simulatedUserId) {
      setIsUserIdSet(true);
      fetchNotifications(simulatedUserId);
    } else {
      toast.error("User ID is required.");
    }
  };

  // Initial fetch when component mounts or simulatedUserId changes
  useEffect(() => {
    if (isUserIdSet && simulatedUserId) {
      fetchNotifications(simulatedUserId);

      // refresh notifications every X seconds
      const interval = setInterval(() => {
        fetchNotifications(simulatedUserId);
      }, 50000); // Refresh every 50 seconds
      return () => clearInterval(interval); // Clean up interval on unmount
    }
  }, [simulatedUserId, isUserIdSet]);

  return (
    <div className="container mx-auto p-4 md:p-8 font-inter">
      <h1 className="text-4xl font-bold text-center mb-8">
        Insyd Notification
      </h1>

      {!isUserIdSet ? (
        <div className="max-w-md mx-auto p-6 border rounded-lg shadow-md bg-white space-y-4">
          <h2 className="text-2xl font-semibold text-center mb-4">
            Set Simulated User ID
          </h2>
          <p className="text-sm text-gray-600 text-center">
            Enter an existing User ID from your MongoDB
          </p>
          <div className="grid gap-2">
            <Label htmlFor="simulatedUserId">Simulated User ID</Label>
            <Input
              id="simulatedUserId"
              placeholder="Enter User ID here "
              value={simulatedUserId}
              onChange={(e) => setSimulatedUserId(e.target.value)}
            />
          </div>
          <Button onClick={handleSetUserId} className="w-full">
            View Notifications
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Simulate Activity */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">Simulate Activity</h2>
            <SimulateActivityForm />
          </div>

          {/* Right Column: Notifications Display */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex justify-between items-center">
              Your Notifications (User: {simulatedUserId})
              <Button
                variant="outline"
                onClick={() => fetchNotifications(simulatedUserId)}
                disabled={loadingNotifications}
              >
                {loadingNotifications ? "Refreshing..." : "Refresh"}
              </Button>
            </h2>
            <NotificationList
              notifications={notifications}
              onMarkAsRead={handleMarkAsRead}
            />
          </div>
        </div>
      )}
    </div>
  );
}
