import { useNavigate } from "react-router";
import { CategoryType } from "../../models/category.model";
import {
  BackgroundImage,
  Body,
  DirectoryItemContainer,
} from "./directory-item.styles";

export default function DirectoryItem({
  category,
}: {
  category: CategoryType;
}) {
  const { imageUrl, title, route } = category;
  const navigate = useNavigate();
  const onNavigateHandler = () => {
    navigate(route);
  };
  return (
    <DirectoryItemContainer role="button" onClick={onNavigateHandler}>
      <BackgroundImage $imageurl={imageUrl} />
      <Body>
        <h2>{title}</h2>
        <p>Shop now!</p>
      </Body>
    </DirectoryItemContainer>
  );
}
