export function helperChangeStatusCourse(
  isActive,
  courseId,
  courses,
  isSwitch = false
) {
  //update new status of Course
  const newCourses = courses.map((course) =>
    course.id === courseId
      ? {
          ...course,
          status: isSwitch ? (isActive ? 1 : 0) : isActive ? 0 : 1,
        }
      : course
  );

  const dataBody = newCourses.find((course) => course.id === courseId);

  const {
    id,
    name,
    status,
    level,
    image,
    category_id,
    author_id,
    price,
    net_price,
    duration,
    enrollmentCount,
    description,
    tags,
    achievements,
  } = dataBody;

  const fd = new FormData();
  fd.append(
    "courseJson",
    JSON.stringify({
      id,
      name,
      status,
      level,
      image,
      category_id,
      author_id,
      price,
      net_price,
      duration,
      enrollmentCount,
      description,
      tags: tags
        .split(",")
        .map((tag) => tag.trim())
        .join(","),
      achievements:
        achievements !== null
          ? achievements
              .split(",")
              .map((achievement) => achievement.trim())
              .join(",")
          : "",
    })
  );

  return fd;
}
