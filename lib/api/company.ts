import { matchingService } from '@/lib/api/matching';
import { AppDispatch } from '@/lib/store';
import { toast } from 'sonner';

export const showInterestInDeveloper = (
  companyId: string,
  developerId: string,
  positionTitle: string,
  jobDescription: string,
  requirements: string[],
) => async () => {
  try {
    const matchId = await matchingService.createMatch({
      companyId,
      developerId,
      positionTitle,
      jobDescription,
      requirements,
      salaryMin: 0,
      salaryMax: 0,
      remoteAllowed: true,
      matchScore: 0,
      location: '',
    });
    toast.success('Developer notified!');
    return matchId;
  } catch (error) {
    toast.error('Failed to express interest');
    throw error;
  }
}; 