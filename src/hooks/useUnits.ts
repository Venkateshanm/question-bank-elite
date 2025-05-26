
import { useQuery } from '@tanstack/react-query';
import { unitAPI } from '@/services/api';

export const useUnits = () => {
  return useQuery({
    queryKey: ['units'],
    queryFn: () => unitAPI.getUnits(),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};

export const useTopicsByUnit = (unitId: number) => {
  return useQuery({
    queryKey: ['topics', unitId],
    queryFn: () => unitAPI.getTopicsByUnit(unitId),
    enabled: !!unitId,
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
};
