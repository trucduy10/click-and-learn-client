import React from "react";
import { Link } from "react-router-dom";
import { BreadcrumbCom } from "../../components/breadcrumb";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com, HeadingH2Com } from "../../components/heading";

const PaymentErrorPage = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com>Payment</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Home",
              slug: "/",
            },
            {
              title: "Course",
              slug: "/courses",
            },
            {
              title: "Payment",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <div className="row">
        <div className="col-sm-12">
          <div className="card">
            <div className="card-header py-3">
              <HeadingH2Com className="text-tw-light-pink text-center">
                Payment Error
              </HeadingH2Com>
            </div>
            <div className="card-body gap-x-4">
              <div className="text-center mx-auto">
                <div>
                  <img
                    src="https://static.vecteezy.com/system/resources/thumbnails/017/178/563/small/cross-check-icon-symbol-on-transparent-background-free-png.png"
                    alt="Payment error"
                    className="object-cover w-20 mx-auto"
                  />
                </div>
                <HeadingH2Com className="text-tw-danger">Error!</HeadingH2Com>
                <p className="text-xl">
                  Your Payment Is Error{" "}
                  <Link to="/" className="text-tw-success">
                    Back to home Page
                  </Link>
                </p>
                <p>Something was wrong! Please checkout again</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentErrorPage;
