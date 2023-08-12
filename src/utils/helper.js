import { toast } from "react-toastify";
import { APP_KEY_NAME, MESSAGE_GENERAL_FAILED } from "../constants/config";

// Input: 123456 - Output: 123.456 using For Count items
export function formatNumber(number) {
  if (number === null || isNaN(number)) number = 0;
  const formattedNumber = number
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return formattedNumber;
}

// priceStr: 1,000,000 - Output: 1000000
export function convertStrMoneyToInt(strMoney) {
  if (strMoney === 0) return strMoney;
  const numberString = strMoney.replace(/,/g, "");
  const intValue = parseInt(numberString, 10);
  if (Number.isNaN(intValue)) return 0;

  return intValue;
}

// number: 1000000 - Output: 1,000,000
export function convertIntToStrMoney(number) {
  if (number === null || typeof number === "undefined") number = 0;
  const numberString = number.toString();
  const numberWithoutCommas = numberString.replace(/,/g, "");
  const formatter = new Intl.NumberFormat("en-US");
  return formatter.format(numberWithoutCommas);
}

// Using in Catch message, Input an error is required
export function showMessageError(error) {
  if (error.response && error.response.data) {
    toast.error(error.response.data.message);
  } else {
    toast.error(MESSAGE_GENERAL_FAILED);
  }
}

// Get Duration for Video
export function getDurationFromVideo(
  file,
  setValue = () => {},
  name = "duration"
) {
  const video = document.createElement("video");

  video.preload = "metadata";
  video.onloadedmetadata = function () {
    setValue(name, Math.round(video.duration));
  };

  if (!file) return null;
  video.src = URL.createObjectURL(file);
}

// Convert second to DiffForHumans Timming, Input: 96, output: 1 min 36 seconds
export function convertSecondToDiffForHumans(seconds = 3600) {
  // >= 1 year
  if (seconds >= 31536000) {
    const years = Math.floor(seconds / 31536000);
    return `${years} ${years >= 1 ? "years" : "year"}`;
  } else if (seconds >= 2592000) {
    // >= 1 month
    const months = Math.floor(seconds / 2592000);
    return `${months} ${months >= 1 ? "months" : "month"}`;
  } else if (seconds >= 604800) {
    // >= 1 week
    const weeks = Math.floor(seconds / 604800);
    return `${weeks} ${weeks >= 1 ? "weeks" : "week"}`;
  } else if (seconds >= 86400) {
    // >= 1 day
    const days = Math.floor(seconds / 86400);
    return `${days} ${days >= 1 ? "days" : "day"}`;
  } else if (seconds >= 3600) {
    // >= 1 hour
    const hours = Math.floor(seconds / 3600);
    const remainingSeconds = seconds % 3600;
    const minutes = Math.floor(remainingSeconds / 60);

    let formattedDuration = `${hours} ${hours >= 1 ? "hours" : "hour"}`;

    if (minutes >= 1) {
      formattedDuration += ` ${minutes} ${minutes >= 1 ? "mins" : "min"}`;
    }

    return formattedDuration;
  } else if (seconds >= 60) {
    // >= 1 min
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    let formattedDuration = `${minutes} ${minutes >= 1 ? "mins" : "min"}`;

    if (remainingSeconds >= 1) {
      formattedDuration += ` ${Math.round(Math.floor(remainingSeconds))} ${
        remainingSeconds >= 1 ? "seconds" : "second"
      }`;
    }

    return formattedDuration;
  } else {
    // Less than 1 minute
    return `${Math.round(Math.floor(seconds))} ${
      seconds >= 1 ? "seconds" : "second"
    }`;
  }
}

// Convert second to Time, Input: 96, output: 1:36
export function convertSecondToTime(seconds) {
  let minutes = Math.floor(seconds / 60);
  seconds = seconds % 60;
  let hours = Math.floor(minutes / 60);
  minutes = minutes % 60;

  if (hours > 0) {
    return `${hours}:${padZero(minutes)}:${padZero(seconds)}`;
  } else {
    return `${minutes}:${padZero(seconds)}`;
  }

  function padZero(num) {
    return num.toString().padStart(2, "0");
  }
}

// Input: 2023-06-20T16:21:34.017435Z, Output: June 20, 2023
export function convertDateTime(dateTimeString, isShowYear = true) {
  if (dateTimeString === null) return;
  const dateTime = new Date(dateTimeString);
  const options = { month: "long", day: "numeric" };
  if (isShowYear) options.year = "numeric";

  const newDateTime = new Intl.DateTimeFormat("en-US", options).format(
    dateTime
  );

  return newDateTime;
}

// Input: 2023-06-20T16:21:34.017435Z, Output: 1 min ago, 1 year ago ...
export function convertDateTimeToDiffForHumans(timestamp) {
  const now = new Date();
  const date = new Date(timestamp);
  if (isNaN(date.getTime())) return timestamp;

  const diffInMilliseconds = now - date;

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;
  const week = 7 * day;
  const month = 30 * day;
  const year = 365 * day;

  if (diffInMilliseconds < minute) {
    return "Just now";
  } else if (diffInMilliseconds < hour) {
    const minutesAgo = Math.floor(diffInMilliseconds / minute);
    return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
  } else if (diffInMilliseconds < day) {
    const hoursAgo = Math.floor(diffInMilliseconds / hour);
    return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
  } else if (diffInMilliseconds < week) {
    const daysAgo = Math.floor(diffInMilliseconds / day);
    return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
  } else if (diffInMilliseconds < month) {
    const weeksAgo = Math.floor(diffInMilliseconds / week);
    return `${weeksAgo} week${weeksAgo === 1 ? "" : "s"} ago`;
  } else if (diffInMilliseconds < year) {
    const monthsAgo = Math.floor(diffInMilliseconds / month);
    return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
  } else {
    const yearsAgo = Math.floor(diffInMilliseconds / year);
    return `${yearsAgo} year${yearsAgo === 1 ? "" : "s"} ago`;
  }
}

// Input: 2023-06-20T16:21:34.017435Z, Output: 10 Total date
export function countDateTime(createdAt) {
  const createdDate = new Date(createdAt);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - createdDate.getTime();
  const daysDiff = Math.ceil(Math.abs(timeDiff / (1000 * 3600 * 24)));
  return daysDiff;
}

// return "YYYY-MM-DD"
export function getCurrentDate() {
  // Get the current date
  const currentDate = new Date();
  return currentDate.toISOString().split("T")[0];
}

// If text > maxLength, will slice
export function sliceText(text = "", maxLength = 50, loadMore = "...") {
  if (!text) return "";
  const newText = text.replace(/(&nbsp;)/gi, " ").replace(/(<([^>]+)>)/gi, "");
  if (newText.length > maxLength)
    return `${newText.slice(0, maxLength)}${loadMore}`;

  return newText;
}

// str = "Graphic Design" - Output = "graphic-design"
export function convertStrToSlug(str) {
  if (typeof str === "undefined") return str;
  str = str.trim();
  str = str.toLowerCase();
  str = str.replace(/\s+/g, "-");
  // Remove non-alphanumeric characters and hyphens
  str = str.replace(/[^a-z0-9-]/g, "");
  // Remove consecutive hyphens
  str = str.replace(/-{2,}/g, "-");
  // Remove leading and trailing hyphens
  str = str.replace(/^-+|-+$/g, "");

  return str;
}

// title = "Part", and number = "1"
export function fakeName(title, number, divider = "#") {
  return `${title}${divider}${number}`;
}

// Convert seconds to only hour, minute, second (approximately). Ex: 65 = "1 minute", 3665 = "1 hour"...
export function convertToHumanTime(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""}`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""}`;
  } else {
    return `${remainingSeconds} second${remainingSeconds > 1 ? "s" : ""}`;
  }
}
// Input email and return userName
export function getUserNameByEmail(email) {
  return email ? email.split("@")[0] : email;
}

// Set keyword when User input search something
export function setSearchHistory(keyword) {
  const history =
    JSON.parse(localStorage.getItem(`${APP_KEY_NAME}_searchHistory`)) || [];

  // Remove the keyword if it already exists in the history
  const filteredHistory = history.filter((item) => item !== keyword);
  const updatedHistory = [keyword, ...filteredHistory].slice(0, 100);

  localStorage.setItem(
    `${APP_KEY_NAME}_searchHistory`,
    JSON.stringify(updatedHistory)
  );
}

// get search history
export function getSearchHistory() {
  return (
    JSON.parse(localStorage.getItem(`${APP_KEY_NAME}_searchHistory`)) || []
  );
}

// item will include id of originalObj,  originalObj is store in redux: courses, blogs, authors obj
export function convertCoreObjectItems(
  item,
  type,
  originalObj,
  limitText = 115
) {
  let newItems = [];
  let slug = "/";
  let description = "";
  let countText = "";
  let createdBy = "";
  switch (type) {
    case "COURSE":
      newItems = originalObj.find((o) => o.id === item.id);
      slug = `/courses/${newItems?.slug}`;
      description = sliceText(newItems?.description, limitText);
      countText = `Enrolled: <span class="text-tw-light-pink">${newItems?.enrollmentCount}</span>`;
      createdBy = `Author: <span class="text-tw-light-pink">${
        newItems?.author_name
      }</span>, Category: <span class="text-tw-light-pink">${
        newItems?.category_name || "N/A"
      }</span>`;
      break;
    case "BLOG":
      newItems = originalObj.find((o) => o.id === item.id);
      slug = `/blogs/${newItems?.slug}`;
      description = sliceText(newItems?.description, limitText);

      countText = `View: <span class="text-tw-light-pink">${
        newItems?.view_count ?? 0
      }</span>`;

      createdBy = `Author: <span class="text-tw-light-pink">${
        newItems?.createdBy || "N/A"
      }</span>, Category: <span class="text-tw-light-pink">${
        newItems?.category_name || "N/A"
      }`;
      break;
    case "AUTHOR":
      newItems = originalObj.find((o) => o.id === item.id);
      const totalSubcribes =
        item?.userSubcribes.find((s) => s.authorId === item.id)
          ?.totalSubcribes || 0;
      slug = `/authors/${newItems?.id}`;
      description = sliceText(newItems?.information, limitText);
      countText = `Subcribe: <span class="text-tw-light-pink">${totalSubcribes}</span>`;

      createdBy = `Title: <span class="text-tw-light-pink">${
        newItems?.title || "N/A"
      }</span>`;
      break;
    default:
      break;
  }

  return {
    ...newItems,
    slug,
    description,
    countText,
    createdBy,
  };
}

// Input user store, and get the output ['BLOG','COURSE', 'EXAM']
export function getEmployeePermission(user) {
  if (user && user.permissions && Array.isArray(user.permissions)) {
    return user.permissions
      .filter((permission) => permission.includes("_"))
      .map((permission) => permission.split("_")[1]);
  }
  return null;
}
