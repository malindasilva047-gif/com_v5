// C:\lakmal_code\com_v5\com_v5\Hayroo-master\client\src\components\shop\order\CheckoutPage.js
import React, { Fragment } from "react";
import Layout from "../layout";
import { CheckoutComponent } from "./CheckoutProducts";

const CheckoutPage = () => {
  return (
    <Fragment>
      <Layout children={<CheckoutComponent />} />
    </Fragment>
  );
};

export default CheckoutPage;