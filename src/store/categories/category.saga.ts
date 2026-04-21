import { all, call, put, takeLatest } from "redux-saga/effects";
import { ProductCollection } from "../../models/product.model";
import { getCategoriesAndDocuments } from "../../utils/firebase/firebase.utils";
import {
  fetchCategoriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
} from "./category.actions";

function* fetchCategories() {
  try {
    const categories: ProductCollection[] = yield call(
      getCategoriesAndDocuments,
      "categories",
    );
    yield put(fetchCategoriesSuccess(categories));
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch categories";
    yield put(fetchCategoriesFailure(message));
  }
}

export function* onFetchCategoriesStart() {
  yield takeLatest(fetchCategoriesStart, fetchCategories);
}

export function* categoriesSagas() {
  yield all([call(onFetchCategoriesStart)]);
}
