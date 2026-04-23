import { memo } from "react";
import { Outlet } from "react-router";
import Directory from "../../components/directory/directory.component";

export default memo(function Home() {
  return (
    <>
      <Directory />
      <Outlet />
    </>
  );
});
