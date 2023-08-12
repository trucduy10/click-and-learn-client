import React from "react";
import { BreadcrumbCom } from "../../components/breadcrumb";
import GapYCom from "../../components/common/GapYCom";
import { HeadingH1Com } from "../../components/heading";
import { categoryItems } from "../../constants/config";
import { CategoryGridMod, CategoryItemMod } from "../../modules/category";
import { formatNumber } from "../../utils/helper";

const CategoryPage = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <HeadingH1Com number={formatNumber(4)}>All Categories</HeadingH1Com>
        <BreadcrumbCom
          items={[
            {
              title: "Home",
              slug: "/",
            },
            {
              title: "Category",
              isActive: true,
            },
          ]}
        />
      </div>
      <GapYCom></GapYCom>
      <CategoryGridMod>
        {categoryItems.map((item) => (
          <CategoryItemMod key={item.value} item={item}></CategoryItemMod>
        ))}
      </CategoryGridMod>
    </>
  );
};

export default CategoryPage;
