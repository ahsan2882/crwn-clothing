import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router";
import Spinner from "./components/spinner/spinner.component";
import { GlobalStyle } from "./global.styles";
import { useAppDispatch } from "./store/hooks";
import { checkUserSession } from "./store/user/user.actions";

const Navigation = lazy(
  () => import("./routes/navigation/navigation.component"),
);
const Home = lazy(() => import("./routes/home/home.component"));
const Shop = lazy(() => import("./routes/shop/shop.component"));
const Authentication = lazy(
  () => import("./routes/authentication/authentication.component"),
);
const Checkout = lazy(() => import("./routes/checkout/checkout.component"));

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(checkUserSession());
  }, [dispatch]);
  return (
    <Suspense fallback={<Spinner />}>
      <GlobalStyle />
      <Routes>
        <Route path="/" element={<Navigation />}>
          <Route index element={<Home />} />
          <Route path="shop/*" element={<Shop />} />
          <Route path="auth" element={<Authentication />} />
          <Route path="checkout" element={<Checkout />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
