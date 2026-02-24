import { paginate } from "../paginate";

describe("paginate", () => {
  const items = Array.from({ length: 50 }, (_, i) => ({ id: i + 1 }));

  it("returns undefined when items is undefined", () => {
    expect(paginate(undefined, 1, 20)).toBeUndefined();
  });

  it("returns empty array when items is empty", () => {
    expect(paginate([], 1, 20)).toEqual([]);
  });

  it("returns first page slice", () => {
    const result = paginate(items, 1, 20);
    expect(result).toHaveLength(20);
    expect(result![0]).toEqual({ id: 1 });
    expect(result![19]).toEqual({ id: 20 });
  });

  it("returns second page slice", () => {
    const result = paginate(items, 2, 20);
    expect(result).toHaveLength(20);
    expect(result![0]).toEqual({ id: 21 });
    expect(result![19]).toEqual({ id: 40 });
  });

  it("returns partial last page when items do not fill page", () => {
    const result = paginate(items, 3, 20);
    expect(result).toHaveLength(10);
    expect(result![0]).toEqual({ id: 41 });
    expect(result![9]).toEqual({ id: 50 });
  });

  it("returns empty array when page is beyond range", () => {
    const result = paginate(items, 10, 20);
    expect(result).toEqual([]);
  });

  it("handles single page", () => {
    const few = items.slice(0, 5);
    const result = paginate(few, 1, 20);
    expect(result).toHaveLength(5);
    expect(result).toEqual(few);
  });
});
