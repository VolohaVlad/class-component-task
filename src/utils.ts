import type { ServiceError } from './models/ServiceError';

export function isServiceError(some: unknown): some is ServiceError {
  return (some as ServiceError)?.message !== undefined;
}
