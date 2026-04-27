import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { memo, SubmitEvent, useCallback, useState } from "react";
import { useNavigate } from "react-router";
import { clearCart } from "../../store/cart/cart.actions";
import { selectCartItems } from "../../store/cart/cart.selector";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/user/user.selector";
import { BUTTON_TYPE_CLASSES } from "../button/button.component";
import {
  FormContainer,
  PaymentButton,
  PaymentFormContainer,
} from "./payment-form.styles";

export default memo(function PaymentForm() {
  const currentUser = useAppSelector(selectCurrentUser);
  const cartItems = useAppSelector(selectCartItems);
  const stripe = useStripe();
  const elements = useElements();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);
  const paymentHandler = useCallback(
    async (event: SubmitEvent<HTMLFormElement>) => {
      event.preventDefault();

      const cardElement = elements?.getElement(CardElement);
      if (stripe && elements && cardElement) {
        try {
          setIsProcessingPayment(true);
          const response = await fetch(
            "/.netlify/functions/create-payment-intent",
            {
              method: "post",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                cartItems: cartItems.map(({ id, quantity }) => ({
                  id,
                  quantity,
                })),
              }),
            },
          );

          if (!response.ok) {
            throw new Error("Unable to create payment intent");
          }
          const { paymentIntent } = await response.json();
          const clientSecret = paymentIntent.client_secret;
          const paymentResult = await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement,
              billing_details: {
                name: currentUser?.displayName ?? "Guest",
              },
            },
          });

          if (paymentResult.error) {
            alert(paymentResult.error.message);
            return;
          }
          if (paymentResult.paymentIntent.status === "succeeded") {
            alert("payment successful");
            dispatch(clearCart());
            navigate("/shop");
          }
        } catch (error) {
          alert(error instanceof Error ? error.message : "Payment failed");
        } finally {
          setIsProcessingPayment(false);
        }
      }
    },
    [cartItems, currentUser?.displayName, dispatch, elements, navigate, stripe],
  );
  return (
    <PaymentFormContainer>
      <FormContainer onSubmit={paymentHandler}>
        <h2>Credit card payment:</h2>
        <CardElement />
        <PaymentButton
          type="submit"
          buttonStyle={BUTTON_TYPE_CLASSES.inverted}
          isLoading={isProcessingPayment}
        >
          Pay now
        </PaymentButton>
      </FormContainer>
    </PaymentFormContainer>
  );
});
