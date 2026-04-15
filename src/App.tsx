import { Route, Routes } from "react-router";
import "./App.css";
import Home from "./routes/home/home.component";
import Navigation from "./routes/navigation/navigation.component";

export const Shop = () => {
  return <div>Shop</div>;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigation />}>
        <Route index element={<Home />}></Route>
        <Route path="shop" element={<Shop />} />
      </Route>
    </Routes>
  );
}

export default App;
