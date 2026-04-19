import SignInForm from "../../components/sign-in-form/sign-in-form.component";
import SignUpForm from "../../components/sign-up-form/sign-up-form.component";
import { AuthenticationContainer } from "./authentication.styles";
// import {
// auth,
// signInWithGooglePopup,
// createUserDocumentFromAuth,
// signInWithGoogleRedirect,
// } from "../../utils/firebase/firebase.utils";
// import { useEffect } from "react";
// import { getRedirectResult } from "firebase/auth";

export default function Authentication() {
  // trying out google redirect
  // useEffect(() => {
  //   const checkRedirectResult = async () => {
  //     const response = await getRedirectResult(auth);
  //     if (response) {
  //       const userDocRef = await createUserDocumentFromAuth(response.user);
  //       console.log(userDocRef);
  //     }
  //   };
  //   checkRedirectResult();
  // }, []);

  return (
    <AuthenticationContainer>
      <SignInForm />
      {/* <button onClick={signInWithGoogleRedirect}>
        Log in with Google (Redirect)
      </button> */}
      <SignUpForm />
    </AuthenticationContainer>
  );
}
