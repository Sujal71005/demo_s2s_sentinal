import { responseActions } from '@/data/responseActions';
import type { ResponseAction } from '@/types/response';

export async function getResponseActions(): Promise<ResponseAction[]> {
  return responseActions;
}

export async function getResponseActionById(
  id: string
): Promise<ResponseAction | undefined> {
  return responseActions.find((a) => a.id === id);
}
