import React from "react";
import { Link } from "react-router-dom";
import { ImageCom } from "../../components/image";

const CategoryItemMod = ({ item = {} }) => {
  return (
    <div className="c-card category-item">
      <Link
        to={`/categories/${item.slug}`}
        className="tw-transition-all hover:opacity-80"
      >
        <div className="c-card-header h-[158px]">
          <ImageCom srcSet={item.image} alt={item.slug}></ImageCom>
        </div>
        <div className="c-card-body py-[1rem]">
          <h3 className="font-semibold text-black mb-1 text-lg">
            {item.label}
          </h3>
          <p className="mb-4 text-sm text-gray-400">{item.description}</p>
        </div>
      </Link>
    </div>
  );
};

export default CategoryItemMod;
