import React from "react";
import { Outlet } from "react-router-dom";
import { FooterMod } from "../modules/footer";
import { HomeTopbarMod, LearnSidebarMod } from "../modules/sidebar";

const LayoutLearning = () => {
  return (
    <>
      {/* <div className="px-10 py-6 bg-tw-light text-black">
        <LearnTopbarMod></LearnTopbarMod>
        <div className="flex gap-x-10 items-start">
          <LearnSidebarMod></LearnSidebarMod>
          <div className="flex-1">
            <Outlet></Outlet>
          </div>
        </div>
        <GapYCom></GapYCom>
      </div> */}
      <div className="px-10 py-6 bg-tw-light text-black min-h-screen">
        <HomeTopbarMod></HomeTopbarMod>
        <div className="flex gap-x-10 items-start">
          <LearnSidebarMod></LearnSidebarMod>
          <div className="flex-1">
            <Outlet></Outlet>
          </div>
        </div>
      </div>
      <FooterMod />
    </>
  );
};

export default LayoutLearning;
