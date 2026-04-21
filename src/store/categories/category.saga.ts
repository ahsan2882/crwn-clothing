import { all, call, put, takeLatest } from "redux-saga/effects";
import { getCategoriesAndDocuments } from "../../utils/firebase/firebase.utils";
import { ProductCollection } from "../../models/product.model";
import {
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
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
