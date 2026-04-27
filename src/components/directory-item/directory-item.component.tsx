import { memo, useCallback, type KeyboardEvent } from "react";
import { useNavigate } from "react-router";
import { CategoryType } from "../../models/category.model";
import {
  BackgroundImage,
  Body,
  DirectoryItemContainer,
} from "./directory-item.styles";

export default memo(function DirectoryItem({
  category,
}: {
  category: CategoryType;
}) {
  const { imageUrl, title, route } = category;

  const navigate = useNavigate();
  const onNavigateHandler = useCallback(() => {
    navigate(route);
  }, [navigate, route]);
  const onKeyHandler = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        onNavigateHandler();
      }
    },
    [onNavigateHandler],
  );
  return (
    <DirectoryItemContainer
      role="button"
      tabIndex={0}
      onClick={onNavigateHandler}
      onKeyDown={onKeyHandler}
    >
      <BackgroundImage $imageUrl={imageUrl} />
      <Body>
        <h2>{title}</h2>
        <p>Shop now!</p>
      </Body>
    </DirectoryItemContainer>
  );
});
