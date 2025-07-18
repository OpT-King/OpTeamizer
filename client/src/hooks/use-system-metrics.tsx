import { useQuery } from "@tanstack/react-query";
import { optimizerApi } from "@/lib/api";

export function useSystemMetrics() {
  return useQuery({
    queryKey: ["/api/system/metrics"],
    queryFn: () => optimizerApi.getSystemMetrics(),
    refetchInterval: 5000, // Update every 5 seconds
  });
}

export function useRecentActivity() {
  return useQuery({
    queryKey: ["/api/logs/recent"],
    queryFn: () => optimizerApi.getRecentActivity(),
    refetchInterval: 10000, // Update every 10 seconds
  });
}
