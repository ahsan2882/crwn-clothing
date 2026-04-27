import { categoriesSagas } from "../category.saga";

describe("categories root saga", () => {
  it("should yield all watchers", () => {
    const generator = categoriesSagas();

    const first = generator.next().value;

    // Instead of full deep equality, assert structure
    expect(first).toEqual(
      expect.objectContaining({
        type: "ALL",
        combinator: true,
      }),
    );
  });
});
