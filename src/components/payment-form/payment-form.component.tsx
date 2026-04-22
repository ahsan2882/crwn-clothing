import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useState } from "react";
import { selectCartTotal } from "../../store/cart/cart.selector";
import { useAppSelector } from "../../store/hooks";
import { selectCurrentUser } from "../../store/user/user.selector";
import { BUTTON_TYPE_CLASSES } from "../button/button.component";
import {
  FormContainer,
  PaymentButton,
  PaymentFormContainer,
} from "./payment-form.styles";

export default function PaymentForm() {
  const cartTotal = useAppSelector(selectCartTotal);
  const currentUser = useAppSelector(selectCurrentUser);
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessingPayment, setIsProcessingPayment] =
    useState<boolean>(false);
  const paymentHandler = async (event: any) => {
    event.preventDefault();

    const cardElement = elements?.getElement(CardElement);
    if (stripe && elements && cardElement) {
      setIsProcessingPayment(true);
      const response = await fetch(
        "/.netlify/functions/create-payment-intent",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: cartTotal * 100 }),
        },
      ).then((res) => res.json());
      const clientSecret = response.paymentIntent.client_secret;
      const paymentResult = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: currentUser ? currentUser.displayName : "Guest",
          },
        },
      });
      setIsProcessingPayment(false);

      if (paymentResult.error) {
        alert(paymentResult.error);
      } else {
        if (paymentResult.paymentIntent.status === "succeeded") {
          alert("payment successful");
        }
      }
    }
  };
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
}
