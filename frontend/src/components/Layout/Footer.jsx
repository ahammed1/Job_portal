import { useContext } from "react";
import { Context } from "../../main";

const Footer = () => {
  const { isAuthorized } = useContext(Context);
  if (!isAuthorized) return null;
  return (
    <footer className="bg-dark text-light text-center py-3 mt-5">
      <div>&copy; All Rights Reserved By Talviro Job Portal.</div>
    </footer>
  );
};

export default Footer;
