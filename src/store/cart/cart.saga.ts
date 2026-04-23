import { all } from "typed-redux-saga";

// Cart operations are synchronous — reducers handle them directly via
// extraReducers. Add watcher sagas here if async side-effects are needed
// in the future (e.g., persisting cart to a remote backend).

export function* cartSagas() {
  yield* all([]);
}
