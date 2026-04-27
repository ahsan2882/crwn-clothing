import { fetchCategoriesStart } from "../category.actions";
import { fetchCategories, onFetchCategoriesStart } from "../category.saga";

describe("onFetchCategoriesStart saga", () => {
  it("should watch fetchCategoriesStart and trigger fetchCategories", () => {
    const generator = onFetchCategoriesStart();

    const effect = generator.next().value as any;

    expect(effect.type).toBe("FORK");
    expect(effect.payload.args[0]).toBe(fetchCategoriesStart);
    expect(effect.payload.args[1]).toBe(fetchCategories);
  });
});
