import { runSaga } from "redux-saga";
import * as firebaseUtils from "../../../utils/firebase/firebase.utils";
import {
  fetchCategoriesFailure,
  fetchCategoriesSuccess,
} from "../category.actions";
import { fetchCategories } from "../category.saga";

describe("fetchCategories saga", () => {
  it("should dispatch success action when API call succeeds", async () => {
    const mockCategories = [
      {
        title: "Hats",
        items: [],
      },
    ];
    jest
      .spyOn(firebaseUtils, "getCategoriesAndDocuments")
      .mockResolvedValue(mockCategories as any);
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      fetchCategories,
    ).toPromise();
    expect(dispatched).toContainEqual(fetchCategoriesSuccess(mockCategories));
  });

  it("should dispatch failure action when API call fails", async () => {
    jest
      .spyOn(firebaseUtils, "getCategoriesAndDocuments")
      .mockRejectedValue(new Error("Firebase error"));
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      fetchCategories,
    ).toPromise();
    expect(dispatched).toContainEqual(fetchCategoriesFailure("Firebase error"));
  });

  it("dispatches fallback message when non-Error is thrown", async () => {
    jest
      .spyOn(firebaseUtils, "getCategoriesAndDocuments")
      .mockRejectedValue("SOMETHING_UNKNOWN");
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      fetchCategories,
    ).toPromise();
    expect(dispatched).toContainEqual(
      fetchCategoriesFailure("Failed to fetch categories"),
    );
  });
});

describe("fetchCategories saga - failure cases", () => {
  it("dispatches failure with error.message when Error instance is thrown", async () => {
    jest
      .spyOn(firebaseUtils, "getCategoriesAndDocuments")
      .mockRejectedValue(new Error("Firebase exploded"));
    const dispatched: any[] = [];
    await runSaga(
      {
        dispatch: (action) => dispatched.push(action),
      },
      fetchCategories,
    ).toPromise();
    expect(dispatched).toContainEqual(
      fetchCategoriesFailure("Firebase exploded"),
    );
  });
});
