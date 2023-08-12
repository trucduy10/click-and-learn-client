import { Pagination } from "antd";
import moment from "moment/moment";
import { useEffect, useState } from "react";
import { AiOutlineClockCircle, AiOutlineTags } from "react-icons/ai";
import { FaCog, FaEye } from "react-icons/fa";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axiosInstance, { axiosBearer } from "../../api/axiosInstance";
import Carousel_9 from "../../assets/blog_image/Carousel_9.jpg";
import SpinAntCom from "../../components/ant/SpinAntCom";
import { HeadingFormH1Com } from "../../components/heading";
import { IMAGE_DEFAULT, LIMIT_PAGE } from "../../constants/config";
import { API_BLOG_URL } from "../../constants/endpoint";
import usePagination from "../../hooks/usePagination";

const sliderData = [
  {
    url: Carousel_9,
  },
];

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const imageUrl = sliderData[0]?.url;
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { startIndex, endIndex, currentPage, handleChangePage } = usePagination(
    1,
    LIMIT_PAGE
  );
  // Fetching API
  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`${API_BLOG_URL}/blogs`);
      const formattedBlogs = response.data
        .filter((blog) => blog.status === 1)
        .map((blog) => ({
          ...blog,
          created_at: moment(blog.created_at).format("DD/MM/YYYY"), // Format the date
        }));
      setBlogs(formattedBlogs);

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="w-full h-full object-cover relative ">
        {/**** Image and Sidebar ****/}
        {imageUrl && (
          <img src={imageUrl} alt="/" className="w-full h-60 object-cover" />
        )}

        {user && user.role !== "ADMIN" && (
          <nav className="flex justify-end space-x-20 h-16 bg-tw-light">
            <Link
              to="/blogs/manage"
              className="flex items-center bg-tw-dark px-3 text-white hover:!text-tw-light-green text-xl tw-transition-all hover:opacity-80 hover:-translate-x-5"
            >
              <FaCog className="mr-1" />
              Management Blog
            </Link>
          </nav>
        )}
      </div>

      {/**** Body Blog ****/}
      <div className="max-w-[1240px] mx-auto py-6 px-4 text-center">
        <HeadingFormH1Com>LASTEST BLOG</HeadingFormH1Com>
        <h2 className="py-4">
          <div>
            We’ve got everything you need to deliver flexible and effective
            skills development for your entire workforce. <br />
            Teach what you know and help learners explore their interests, gain
            new skills, and advance their careers.
            <br />
            Publish the course you want, in the way you want, and always have
            control of your own content. <br />
            Expand your professional network, build your expertise, and earn
            money on each paid enrollment.
            <br />
          </div>
        </h2>
      </div>
      <section className="my-12">
        {isLoading ? (
          <SpinAntCom loadingText={"Loading ..."} />
        ) : (
          <>
            <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
              {blogs.map((blog, index) => {
                if (index >= startIndex && index < endIndex) {
                  return (
                    <Link key={blog.id} to={`/blogs/${blog.slug}`}>
                      <div
                        key={blog.id}
                        className="transition-all duration-[0.5s] border-solid border-[1px] border-[#e6e6e6] rounded-[12px] p-[20px] bg-white hover:shadow-[0_2px_4px_rgb(0_0_0_/_8%)] hover:cursor-pointer hover:translate-y-[-5px]"
                      >
                        <div id="img">
                          <img
                            src={blog.image || IMAGE_DEFAULT}
                            alt=""
                            className="w-full h-[250px] object-cover rounded-[10px] mb-[20px]"
                          />
                        </div>
                        <div className="flex items-center mb-3">
                          <AiOutlineTags className="mr-[10px] text-[25px]" />
                          <label className="block mr-[20px] mb-0 text-[#999] text-[15px]">
                            {blog.category_name}
                          </label>
                        </div>
                        <div id="details">
                          <div className="text-black border-none bg-none outline-none cursor-pointer no-underline list-none text-[17px]">
                            <h3 className="font-[500]">{blog.name}</h3>
                          </div>
                          {/* <p className="text-[#999] font-[400] my-[20px] text-[17px] leading-[25px]">
                      {ReactHtmlParser(blog.description.slice(0, 50))}
                    </p> */}
                          <p
                            className="text-[#999] font-[400] my-[20px] text-[17px] leading-[25px]"
                            dangerouslySetInnerHTML={{
                              __html: blog.description.slice(0, 50),
                            }}
                          ></p>

                          <div id="date" className="flex items-center mt-3">
                            <div className="flex items-center">
                              <AiOutlineClockCircle className="mr-[10px] text-[35px]" />
                              <label className="block mr-[20px] mb-0 text-[#999] text-[13px]">
                                {blog.created_at}
                              </label>
                            </div>
                            <div className="flex items-center ml-auto">
                              <FaEye className="mr-[10px] text-[35px]" />
                              <label className="block mr-[20px] mb-0 text-[#999] text-[13px]">
                                {blog.view_count}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                }
              })}
            </div>
          </>
        )}
      </section>
      {!isLoading && blogs?.length > LIMIT_PAGE && (
        <Pagination
          current={currentPage}
          onChange={handleChangePage}
          total={blogs.length}
          defaultPageSize={LIMIT_PAGE}
          className="mt-[1rem] text-center"
        />
      )}
    </>
  );
};

export default BlogPage;
