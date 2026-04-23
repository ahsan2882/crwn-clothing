import { memo } from "react";
import { SpinnerContainer, SpinnerOverlay } from "./spinner.styles";

export default memo(function Spinner() {
  return (
    <SpinnerOverlay>
      <SpinnerContainer />
    </SpinnerOverlay>
  );
});
