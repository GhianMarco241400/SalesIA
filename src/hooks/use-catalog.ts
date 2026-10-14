import { useQuery } from "@tanstack/react-query";

import { getAwsCatalog, getAwsRegions, getAwsServices, getExtras, getPlans } from "@/services/api";

const CATALOG_STALE_TIME = 5 * 60 * 1000;
const AWS_STALE_TIME = 30 * 60 * 1000;

export function usePlans() {
  return useQuery({
    queryKey: ["plans"],
    queryFn: getPlans,
    staleTime: CATALOG_STALE_TIME,
  });
}

export function useExtras() {
  return useQuery({
    queryKey: ["extras"],
    queryFn: getExtras,
    staleTime: CATALOG_STALE_TIME,
  });
}

export function useAwsCatalog() {
  return useQuery({
    queryKey: ["aws-catalog"],
    queryFn: getAwsCatalog,
    staleTime: AWS_STALE_TIME,
  });
}

export function useAwsRegions() {
  return useQuery({
    queryKey: ["aws-regions"],
    queryFn: getAwsRegions,
    staleTime: AWS_STALE_TIME,
  });
}

export function useAwsServices() {
  return useQuery({
    queryKey: ["aws-services"],
    queryFn: getAwsServices,
    staleTime: AWS_STALE_TIME,
  });
}
