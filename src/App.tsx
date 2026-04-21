// import { User } from "firebase/auth";
import { useEffect } from "react";
// import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router";
import "./App.css";
import Authentication from "./routes/authentication/authentication.component";
import Checkout from "./routes/checkout/checkout.component";
import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";
import Shop from "./routes/shop/shop.component";
// import { USER_ACTION_TYPES } from "./store/user/user.types";
// import {
//   createUserDocumentFromAuth,
//   getCurrentUser,
//   onAuthStateChangedListener,
// } from "./utils/firebase/firebase.utils";
import { checkUserSession } from "./store/user/user.actions";
import { useAppDispatch } from "./store/hooks";

function App() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    // const unsubscribe = onAuthStateChangedListener((user: User | null) => {
    //   if (user) {
    //     createUserDocumentFromAuth(user).catch((error) => {
    //       console.error("Failed to create/sync user document", error);
    //     });
    //   }
    //   dispatch(
    //     setCurrentUser({
    //       type: USER_ACTION_TYPES.SET_CURRENT_USER,
    //       user,
    //     }),
    //   );
    // });
    // return unsubscribe;
    // getCurrentUser().then((user) => console.log(user));
    dispatch(checkUserSession());
  }, [dispatch]);
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path="shop/*" element={<Shop />} />
        <Route path="auth" element={<Authentication />} />
        <Route path="checkout" element={<Checkout />} />
      </Route>
    </Routes>
  );
}

export default App;
