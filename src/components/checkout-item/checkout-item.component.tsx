import { CartContext } from "../../contexts/cart.context";
import { CartItemType } from "../../models/product.model";
import "./checkout-item.styles.scss";
import { useContext } from "react";

type CheckoutItemProps = {
  cartItem: CartItemType;
};

export default function CheckoutItem({ cartItem }: CheckoutItemProps) {
  const { name, imageUrl, price, quantity } = cartItem;

  const { clearItemFromCart, addItemToCart, removeItemFromCart } =
    useContext(CartContext);

  const clearItemHandler = () => clearItemFromCart(cartItem);
  const addItemHandler = () => addItemToCart(cartItem);
  const removeItemHandler = () => removeItemFromCart(cartItem);
  return (
    <div className="checkout-item-container">
      <div className="image-container">
        <img src={imageUrl} alt={`${name}`} />
      </div>
      <span className="name"> {name} </span>
      <span className="quantity">
        <div role="button" className="arrow" onClick={removeItemHandler}>
          &#10094;
        </div>
        <span className="value">{quantity}</span>
        <div role="button" className="arrow" onClick={addItemHandler}>
          &#10095;
        </div>
      </span>
      <span className="price"> {price}</span>
      <div role="button" className="remove-button" onClick={clearItemHandler}>
        &#10005;
      </div>
    </div>
  );
}
