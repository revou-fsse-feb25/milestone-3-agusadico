import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "../../hooks/useDebounce";

jest.useFakeTimers();

describe("useDebounce", () => {
  afterEach(() => {
    jest.clearAllTimers();
  });

  it("should return the initial value immediately", () => {
    const { result } = renderHook(() => useDebounce("test", 500));
    expect(result.current).toBe("test");
  });

  it("should update value only after debounce delay", () => {
    let value = "first";
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 500), {
      initialProps: { val: value }
    });

    expect(result.current).toBe("first");

    // Change value
    value = "second";
    rerender({ val: value });

    // Should still be "first" (debouncing)
    expect(result.current).toBe("first");

    // Fast-forward timers by debounce delay
    act(() => {
      jest.advanceTimersByTime(500);
    });

    expect(result.current).toBe("second");
  });

  it("should reset debounce if value changes again before timeout", () => {
    let value = "one";
    const { result, rerender } = renderHook(({ val }) => useDebounce(val, 300), {
      initialProps: { val: value }
    });

    value = "two";
    rerender({ val: value });

    // Change again before timeout
    act(() => {
      jest.advanceTimersByTime(200);
    });
    value = "three";
    rerender({ val: value });

    // Not updated yet
    expect(result.current).toBe("one");

    // Now advance full debounce time for latest value
    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(result.current).toBe("three");
  });
});