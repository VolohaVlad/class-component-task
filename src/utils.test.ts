import type { ServiceError } from './models/ServiceError';
import { isServiceError } from './utils';

describe('isServiceError', () => {
  it('returns true for an object with "message" property', () => {
    const error: ServiceError = { message: 'Something went wrong' };
    expect(isServiceError(error)).toBe(true);
  });

  it('returns false for object without "message"', () => {
    expect(isServiceError({ code: 123 })).toBe(false);
  });

  it('returns false for null', () => {
    expect(isServiceError(null)).toBe(false);
  });

  it('returns false for undefined', () => {
    expect(isServiceError(undefined)).toBe(false);
  });

  it('returns false for non-object types', () => {
    expect(isServiceError('abc')).toBe(false);
    expect(isServiceError(123)).toBe(false);
    expect(isServiceError(true)).toBe(false);
  });

  it('returns true for subclass with message', () => {
    class SubErr {
      message = 'err';
    }
    expect(isServiceError(new SubErr())).toBe(true);
  });

  it('returns false if object has message property explicitly undefined', () => {
    expect(isServiceError({ message: undefined })).toBe(false);
  });
});
