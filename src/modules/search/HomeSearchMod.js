import { Skeleton } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import axiosInstance from "../../api/axiosInstance";
import EmptyDataCom from "../../components/common/EmptyDataCom";
import GapYCom from "../../components/common/GapYCom";
import OverlayCom from "../../components/common/OverlayCom";
import { HeadingH4Com, HeadingH5Com } from "../../components/heading";
import { IconRemoveCom, IconSearchCom } from "../../components/icon";
import { LIMIT_SEARCH_ITEM } from "../../constants/config";
import useDebounceOnChange from "../../hooks/useDebounceOnChange";
import { onGetBlogs } from "../../store/admin/blog/blogSlice";
import { onGetAuthors } from "../../store/author/authorSlice";
import { onCourseLoading } from "../../store/course/courseSlice";
import { getSearchHistory, setSearchHistory } from "../../utils/helper";
import SearchItemMod from "./SearchItemMod";

const HomeSearchMod = () => {
  const dispatch = useDispatch();
  const { data: courses } = useSelector((state) => state.course);
  const { authors } = useSelector((state) => state.author);
  const { blogs } = useSelector((state) => state.adminBlog);

  const [isSearch, setIsSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [search, setSearch] = useState("");
  const searchDebounce = useDebounceOnChange(search);
  const [dataSearch, setDataSearch] = useState([]);
  const [historyKeyword, setHistoryKeyword] = useState([]);

  const inputRef = useRef(null);

  const handleChangeSearch = (e) => {
    setIsLoading(true);
    setIsSearch(true);
    setSearch(e.target.value);
  };

  useEffect(() => {
    if (searchDebounce) {
      dispatch(onGetAuthors());
      dispatch(onCourseLoading());
      dispatch(onGetBlogs());

      getSearchData(searchDebounce);
      setSearchHistory(searchDebounce);
      setHistoryKeyword(getSearchHistory());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDebounce]);

  useEffect(() => {
    setHistoryKeyword(getSearchHistory());
  }, []);

  useEffect(() => {
    if (search) setIsSearch(true);
  }, [search]);

  const handleShowSearch = () => {
    setIsSearch(!isSearch);
    if (isSearch) {
      setSearch("");
      setDataSearch([]);
      if (inputRef.current) inputRef.current.value = "";
    } else {
      inputRef.current.focus();
    }
  };

  const getSearchData = async (searchDebounce) => {
    try {
      const res = await axiosInstance.post(
        `/home/search?name=${searchDebounce}`
      );
      if (res.status === 200) setDataSearch(res.data);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Related Search Data
  let courseInSearch = null;
  if (dataSearch.length > 0) {
    for (let i = 0; i < dataSearch.length; i++) {
      if (dataSearch[i].type === "COURSE") {
        courseInSearch = courses.find((item) => item.id === dataSearch[i].id);
      }
    }
  }
  let relatedCourses = [];
  if (courseInSearch) {
    const searchTags = courseInSearch?.tags?.split(",");

    relatedCourses = courses
      .filter((item) => {
        const courseTags = item?.tags?.split(",");
        return (
          item.id !== courseInSearch.id &&
          searchTags?.some((tag) => courseTags?.includes(tag))
        );
      })
      .slice(0, 3);
  }

  return (
    <>
      <OverlayCom isShow={isSearch} onClick={handleShowSearch} />
      <div className="c-search relative z-50" onClick={handleShowSearch}>
        <div className="bg-tw-light rounded-full shadow-primary p-2 w-full flex items-center">
          <div className="flex-1 px-2">
            <input
              ref={inputRef}
              type="text"
              name="keyword"
              placeholder="Search course, author, blog..."
              className="bg-transparent text-sm placeholder:text-gray-400 text-black w-full pl-3 py-2 rounded-full outline-none appearance-none"
              onChange={handleChangeSearch}
              autoComplete="off"
              list="search-history-list"
            />
            {historyKeyword.length > 0 && (
              <datalist id="search-history-list">
                {historyKeyword.slice(0, 4).map((keyword) => (
                  <option value={keyword} key={keyword} />
                ))}
              </datalist>
            )}
          </div>
          <button
            className={`w-[42px] h-10 rounded-full text-tw-light tw-transition-all flex items-center justify-center flex-shrink-0 hover:opacity-60 ${
              isSearch ? "bg-tw-light-pink" : "bg-primary"
            }`}
            onClick={handleShowSearch}
          >
            {/* Xứ lý nếu có search thì hiện Icon Remove + style text-tw-danger hoặc bg-tw-orange */}
            {isSearch ? (
              <IconRemoveCom></IconRemoveCom>
            ) : (
              <IconSearchCom></IconSearchCom>
            )}
          </button>
        </div>
        {isSearch && (
          <div className="c-search-result w-full sm:w-[600px] bg-white absolute top-full left-0  lg:left-[-15%] translate-y-5 z-50 rounded-lg">
            {isLoading ? (
              <div className="p-4">
                <Skeleton avatar paragraph={{ rows: 4 }} active />
              </div>
            ) : dataSearch.length > 0 ? (
              <>
                <Link to={`/search?keyword=${searchDebounce}`}>
                  <div className="flex items-center justify-between px-6 py-3 bg-gray-200 tw-transition-all hover:bg-tw-dark rounded-lg rounded-b-none">
                    <HeadingH4Com>
                      See all {dataSearch.length}{" "}
                      {dataSearch.length > 1 ? "results" : "result"}
                    </HeadingH4Com>
                  </div>
                </Link>

                <div className="p-6">
                  <div className="flex flex-col gap-y-5 mb-6">
                    {dataSearch.map((item, index) => {
                      if (
                        item?.type !== dataSearch[index - 1]?.type ||
                        index < LIMIT_SEARCH_ITEM ||
                        item.type !==
                          dataSearch[index - LIMIT_SEARCH_ITEM]?.type
                      ) {
                        return (
                          <div key={v4()}>
                            {item?.type !== dataSearch[index - 1]?.type && (
                              <HeadingH5Com>{item.type}</HeadingH5Com>
                            )}
                            <SearchItemMod
                              key={v4()}
                              item={item}
                              type={item.type}
                              objectOriginal={
                                item.type === "COURSE"
                                  ? courses
                                  : item.type === "AUTHOR"
                                  ? authors
                                  : blogs
                              }
                            />
                          </div>
                        );
                      }
                      return null;
                    })}
                  </div>
                  {relatedCourses.length > 0 && (
                    <>
                      <hr />
                      <GapYCom className="mb-3" />
                      <div className="text-tw-light-gray">
                        <h3 className="text-sm font-semibold mb-[0.5rem] text-black">
                          Related courses
                        </h3>
                        {relatedCourses.map((item) => (
                          <Link
                            to={`/courses/${item.slug}`}
                            key={v4()}
                            className="tw-transition-all"
                          >
                            <div className="flex flex-col gap-y-3">
                              <p>
                                <strong>{item.category_name}</strong>{" "}
                                {item.name}
                              </p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <EmptyDataCom text="No result" />
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default HomeSearchMod;
