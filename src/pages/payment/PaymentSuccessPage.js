import _ from "lodash";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { axiosBearer } from "../../api/axiosInstance";
import { BreadcrumbCom } from "../../components/breadcrumb";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com, HeadingH2Com } from "../../components/heading";
import { API_CHECKOUT_URL } from "../../constants/endpoint";

const PaymentSuccessPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const transactionId = searchParams.get("transactionId") ?? "";

  const [isLoading, setIsLoading] = useState(false);
  const [orderDetail, setOrderDetail] = useState({});

  useEffect(() => {
    getPaymentDetailByTransactionId();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getPaymentDetailByTransactionId = async () => {
    try {
      setIsLoading(!isLoading);
      const res = await axiosBearer.get(
        `${API_CHECKOUT_URL}/details/${transactionId}`
      );

      if (res.status === 200) setOrderDetail(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

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
                Payment Success
              </HeadingH2Com>
            </div>
            <div className="card-body gap-x-4">
              <div className="text-center mx-auto">
                <div>
                  <img
                    src="https://static.vecteezy.com/system/resources/previews/002/743/514/original/green-check-mark-icon-in-a-circle-free-vector.jpg"
                    alt="Payment success"
                    className="object-cover w-20 mx-auto"
                  />
                </div>
                <HeadingH2Com>Thank You</HeadingH2Com>
                <p className="text-xl">
                  Payment Is Successfully Processsed{" "}
                  <Link
                    to={`/learn/${orderDetail?.slug}`}
                    className="text-tw-success"
                  >
                    Click & Learn this course now
                  </Link>
                </p>
                <p>Your Transaction ID: {transactionId}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccessPage;
