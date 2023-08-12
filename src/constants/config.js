export const APP_NAME = "Click & Learn";
export const APP_KEY_NAME = "click_and_learn";
export const BASE_DOMAIN_URL =
  process.env.REACT_APP_DOMAIN_URL ?? "http://localhost:3000";
export const BASE_API_URL =
  process.env.REACT_APP_API_URL ?? "http://localhost:8080";

export const NOT_FOUND_URL = "/not-found";

export const COOKIE_ACCESS_TOKEN_KEY = `${APP_KEY_NAME}_access_token`;
export const COOKIE_REFRESH_TOKEN_KEY = `${APP_KEY_NAME}_refresh_token`;
export const COOKIE_EXPIRED_DAYS = 30;
export const COOKIE_VIEW_COUNT_KEY = `${APP_KEY_NAME}_view_count`;

export const COOKIE_EXPIRED_BLOG_DAYS = 1 / 24 / 60; // 1min

export const MIN_LENGTH_NAME = 3;
export const MAX_LENGTH_NAME = 100;
export const MAX_LENGTH_VARCHAR = 255;
export const MAX_LENGTH_PASSWORD = 20;

// LIMIT PAGINATION
export const LIMIT_PAGE = 12;
export const LIMIT_HOME_PAGE = 4;

// LIMIT SHOW MORE
export const LIMIT_SHOW_MORE = 5;

// LIMIT SEARCH
export const LIMIT_SEARCH_ITEM = 3;

export const VIDEO_EXT_VALID = "mp4, avi, mov, wmv, flv, mkv, webm, mpeg, mpg";
export const CAPTION_EXT_VALID = "en.vtt, vi.vtt, jp.vtt";
export const CAPTION_EXT_REGEX = /\.(en|vi|jp)\.vtt$/;

export const MESSAGE_GENERAL_FAILED = "Something was wrong!";
export const MESSAGE_FIELD_REQUIRED = "This field is required";
export const MESSAGE_FIELD_MIN_LENGTH_NAME = `This field at least ${MIN_LENGTH_NAME} characters`;
export const MESSAGE_FIELD_MAX_LENGTH_NAME = `This field only accept ${MAX_LENGTH_NAME} characters`;
export const MESSAGE_FIELD_MAX_LENGTH_VARCHAR = `This field only accept ${MAX_LENGTH_VARCHAR} characters`;
export const MESSAGE_UPLOAD_REQUIRED = "This field requires uploading a file";
export const MESSAGE_POLICY_REQUIRED =
  "Please review and accept our Policy before register";
export const MESSAGE_NUMBER_REQUIRED = "This field must be a number";
export const MESSAGE_LOGIN_REQUIRED =
  "Please log in before proceeding further !";

export const MESSAGE_REGEX_NAME = "Only letters are allowed";

export const MESSAGE_FIELD_INVALID = "This field is invalid";
export const MESSAGE_EMAIL_INVALID =
  "Invalid email! Correct: example@domain.com";
export const MESSAGE_CONFIRM_PASSWORD_INVALID =
  "Confirm password does not match with password";

export const MESSAGE_READONLY = "This field is Read Only";

export const MESSAGE_ITEM_NOT_FOUND =
  "Oops! This item not exited ,please reload or try again !";

export const MESSAGE_VIDEO_FILE_INVALID = `Invalid video format file! Only accept extension: ${VIDEO_EXT_VALID}`;
export const MESSAGE_CAPTION_FILE_INVALID = `Invalid caption format file! Only accept extension: ${CAPTION_EXT_VALID}`;

export const MESSAGE_UPLOAD_IMAGE_FAILED = "Upload image error!";
export const MESSAGE_NUMBER_POSITIVE =
  "This field must be greater than or equal to 0";
export const MESSAGE_REGISTER_FAILED = "Register new account failed !";
export const MESSAGE_LOGIN_FAILED =
  "Login failed !Incorrect email or password!";

export const MESSAGE_REGISTER_SUCCESS =
  "You have registered new account successfully !";
export const MESSAGE_LOGIN_SUCCESS = "You have logged successfully !";
export const MESSAGE_LOGOUT_SUCCESS = "You have logged out successfully !";
export const MESSAGE_VERIFY_SUCCESS =
  "Your email has been verified! You can login now";
export const MESSAGE_FORGET_PASSWORD_SUCCESS =
  "We has successfully sent an email to reset your password. Please check your inbox or trash and follow the instructions provided.";
export const MESSAGE_UPDATE_STATUS_SUCCESS = "Update status success !";
export const MESSAGE_CHANGE_PASSWORD_SUCCESS =
  "Your password have been changed successfull !";

export const MESSAGE_EMAIL_ACTIVED = "Your email has already been activated !";

// MESSAGE API
export const MESSAGE_UNAUTHORIZE = "Please login first then access this page";
export const MESSAGE_FORBIDDEN = "You dont have permission to access this page";
export const MESSAGE_NOT_FOUND = "Oops! You've accessed the wrong URL.";
export const MESSAGE_BAD_REQUEST = "Oops! Your request have problem";

export const MESSAGE_NO_ITEM_SELECTED = "No items selected";
export const MESSAGE_NET_PRICE_HIGHER_PRICE =
  "The sale price is not allowed to be higher than the original price";
export const MESSAGE_POINT_EXCEED_MAX =
  "The question point cannot exceed the max point";

export const MESSAGE_MAINTENANCE =
  "Sorry, This function is currently under maintenance !";

export const MESSAGE_THIRD_PARTY_WARNING =
  "Your account belongs to a third-party provider, so we cannot accept use this function within our application.";

// Data Static List
export const categoryItems = [
  {
    value: 1,
    label: "Programming",
    slug: "programming",
    image:
      "https://www.theschoolrun.com/sites/theschoolrun.com/files/article_images/what_is_a_programming_language.jpg",
    coverImage:
      "https://images.unsplash.com/photo-1619410283995-43d9134e7656?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTZ8fHByb2dyYW1taW5nfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description:
      "Explore the world of programming and learn how to create software, websites, and applications. Gain hands-on experience with popular programming languages and tools, and build a foundation for a successful career in technology.",
  },
  {
    value: 2,
    label: "Graphic Design",
    slug: "graphic-design",
    image:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8R3JhcGhpYyUyMERlc2lnbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    coverImage:
      "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8R3JhcGhpYyUyMGRlc2lnbnxlbnwwfHwwfHx8MA%3D%3D&auto=format&fit=crop&w=500&q=60",
    description:
      "Unleash your creativity with graphic design. Learn how to create visually appealing designs, manipulate images, and develop skills using popular design software. Discover the art of communication through visual elements.",
  },
  {
    value: 3,
    label: "Artificial Intelligence",
    slug: "artificial-intelligence",
    image:
      "https://media.istockphoto.com/id/1440356809/photo/artificial-intelligence-technology-robot-futuristic-data-science-data-analytics-quantum.webp?b=1&s=170667a&w=0&k=20&c=wXYn8o0Y5OYTZbRFTeXvyQ2V4dt8HMHPLgFSJxjqWcg=",
    coverImage:
      "https://media.istockphoto.com/id/1364859722/photo/artificial-intelligence-concept.webp?b=1&s=170667a&w=0&k=20&c=eHRkMLmlR79tWkAuR0_eJCerG4xNP7iPMgjqE3mzbZU=",
    description:
      "Dive into the fascinating field of Artificial Intelligence (AI). Learn about machine learning, neural networks, and data analysis algorithms. Explore how AI is transforming various industries and gain insights into the future of intelligent systems.",
  },
  {
    value: 4,
    label: "Data Science",
    slug: "data-science",
    image:
      "https://media.istockphoto.com/id/1405263192/vi/anh/kh%C3%A1i-ni%E1%BB%87m-khoa-h%E1%BB%8Dc-d%E1%BB%AF-li%E1%BB%87u.jpg?s=2048x2048&w=is&k=20&c=U5JcK90r1rbbLMuQm9G8e3BvFerS4fSLbS4BRyQYZd4=",
    coverImage:
      "https://media.istockphoto.com/id/1395356010/photo/finance-forecast-graph-chart-data-financial-planning-marketing-business-man-working-on-stock.webp?b=1&s=170667a&w=0&k=20&c=AwNh0Z_COCW7c_TpO__DX-8Bhkn2ff_BkcUe_8i_M4w=",
    description:
      "Unlock the power of data through data science. Discover techniques for analyzing and interpreting data, and gain insights to drive informed decision-making. Learn how to extract meaningful information from complex datasets and solve real-world problems.",
  },
];

export const statusItems = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 0,
    label: "InActive",
  },
];

export const levelItems = [
  {
    value: 0,
    label: "Basic",
  },
  {
    value: 1,
    label: "Advance",
  },
];

export const sortItems = [
  {
    value: "DESC",
    label: "Sort by Newest",
  },
  {
    value: "ASC",
    label: "Sort by Oldest",
  },
];

export const statusBlogItems = [
  {
    value: 1,
    label: "Active",
  },
  {
    value: 0,
    label: "InActive",
  },
  {
    value: 2,
    label: "Proccessing",
  },
];

export const sortSearchItems = [
  {
    value: "COURSE",
    label: "Sort By Course",
  },
  {
    value: "BLOG",
    label: "Sort By Blog",
  },
  {
    value: "AUTHOR",
    label: "Sort By Author",
  },
];

// Data Static Variable
export const IMAGE_DEFAULT =
  "https://upload.wikimedia.org/wikipedia/commons/1/14/No_Image_Available.jpg?20200913095930";

export const AVATAR_DEFAULT =
  "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg";
