import { useEffect } from "react";
import { useToast } from "../ui/toast";

export function OfflineNotifier() {
  const { toast } = useToast();

  useEffect(() => {
    const handleOffline = () => {
      toast({
        title: "You are offline",
        description: "Cached pages and resources will continue to be available.",
        variant: "warning",
        duration: 5000,
      });
    };

    const handleOnline = () => {
      toast({
        title: "Connection restored",
        description: "You are back online. Live data is synchronized.",
        variant: "success",
        duration: 4000,
      });
    };

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [toast]);

  return null;
}
