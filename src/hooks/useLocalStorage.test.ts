import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from './useLocalStorage';

const LS_KEY = 'my-test-key';
type workObj = { a: number; b?: number };

describe('useLocalStorage', () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it('should initialize with initial value', () => {
    const { result } = renderHook(() => useLocalStorage(LS_KEY, 'init-value'));
    expect(result.current[0]()).toBe('init-value');
  });

  it('should read existing value from localStorage', () => {
    window.localStorage.setItem(LS_KEY, JSON.stringify('from LS'));
    const { result } = renderHook(() => useLocalStorage(LS_KEY, 'init-value'));
    expect(result.current[0]()).toBe('from LS');
  });

  it('should update value in state and localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(LS_KEY, 'init-value'));

    act(() => {
      result.current[1]('new-value');
    });

    expect(result.current[0]()).toBe('new-value');
    expect(window.localStorage.getItem(LS_KEY)).toBe(
      JSON.stringify('new-value')
    );
  });

  it('should work with objects', () => {
    const { result } = renderHook(() =>
      useLocalStorage<workObj>(LS_KEY, { a: 1 })
    );

    act(() => {
      result.current[1]({ a: 2, b: 3 });
    });

    expect(result.current[0]()).toEqual({ a: 2, b: 3 });
    expect(JSON.parse(window.localStorage.getItem(LS_KEY) ?? '')).toEqual({
      a: 2,
      b: 3,
    });
  });

  it('should work with setter as function', () => {
    const { result } = renderHook(() => useLocalStorage(LS_KEY, 10));

    act(() => {
      result.current[1]((prev: number) => prev + 5);
    });

    expect(result.current[0]()).toBe(15);
    expect(window.localStorage.getItem(LS_KEY)).toBe('15');
  });
});
