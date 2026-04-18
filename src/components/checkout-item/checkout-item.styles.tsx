import styled from "styled-components";

export const CheckoutItemContainer = styled.div`
  width: 100%;
  display: flex;
  min-height: 100px;
  border-bottom: 1px solid darkgrey;
  padding: 15px 0;
  font-size: 20px;
  align-items: center;
`;
export const ImageContainer = styled.div`
  width: 23%;
  padding-right: 15px;
`;
export const Img = styled.img`
  width: 100%;
  height: 100%;
`;

export const RemoveButton = styled.button.attrs({ type: "button" })`
  padding-left: 12px;
  cursor: pointer;
  background: none;
  border: none;
  font: inherit;
`;
export const ItemInfo = styled.span`
  width: 23%;
`;
export const Quantity = styled(ItemInfo)`
  display: flex;
`;
export const QuantityArrow = styled.button.attrs({ type: "button" })`
  cursor: pointer;
  background: none;
  border: none;
  font: inherit;
  padding: 0;
`;
export const QuantityValue = styled.span`
  margin: 0 10px;
`;
