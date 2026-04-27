import { call } from "typed-redux-saga";
import { rootSaga } from "../root.saga";

import { categoriesSagas } from "../categories/category.saga";
import { userSagas } from "../user/user.saga";

describe("root saga", () => {
  it("should initialize all feature sagas", () => {
    const generator = rootSaga();

    const effect = generator.next().value as any;

    expect(effect.type).toBe("ALL");

    expect(effect.payload).toEqual([call(categoriesSagas), call(userSagas)]);
  });
});
