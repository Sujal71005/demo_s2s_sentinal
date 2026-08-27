import { routes } from '@/data/routes';
import type { Route } from '@/types/response';

export async function getSaferRoutes(): Promise<Route[]> {
  return routes;
}

export async function getRouteById(id: string): Promise<Route | undefined> {
  return routes.find((r) => r.id === id);
}
