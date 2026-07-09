// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\layout\index.js
import React, { Fragment, createContext } from "react";
import { Navber, Footer, CartModal } from "../partials";
import LoginSignup from "../auth/LoginSignup";

export const LayoutContext = createContext();

const Layout = ({ children }) => {
  return (
    <Fragment>
      <div className="flex flex-col min-h-screen">
        <Navber />
        <LoginSignup />
        <CartModal />
        {/* All Children pass from here */}
        <div className="flex-grow">{children}</div>
        <Footer />
      </div>
    </Fragment>
  );
};

export default Layout;