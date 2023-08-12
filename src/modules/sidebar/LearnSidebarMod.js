import React, { useEffect, useState } from "react";
import { CollapseAntCom } from "../../components/ant";
import { useDispatch, useSelector } from "react-redux";
import { onGetLearning } from "../../store/course/courseSlice";
import { useParams } from "react-router-dom";
import {
  selectAllCourseState,
  selectEnrollIdAndCourseId,
  selectLearningAndTracking,
} from "../../store/course/courseSelector";

// const sectionItems = [
//   {
//     id: 1,
//     name: "Introduce",
//   },
//   {
//     id: 2,
//     name: "How to install PHP",
//   },
// ];

// const lessionItems = [
//   {
//     id: 1,
//     name: "What is PHP",
//     duration: "02:58",
//     section_id: 1,
//   },
//   {
//     id: 2,
//     name: "What is Laravel",
//     duration: "05:58",
//     section_id: 1,
//   },
//   {
//     id: 3,
//     name: "Install XamPP",
//     duration: "02:18",
//     section_id: 2,
//   },
//   {
//     id: 4,
//     name: "Install phpMyAdmin",
//     duration: "06:18",
//     section_id: 2,
//   },
// ];

// const sessionIds = sectionItems.map((item) => String(item.id));
// const totalLession = 2;

const LearnSidebarMod = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  // const { selectedCourse, learning, tracking } = useSelector(
  //   (state) => state.course
  // );

  const { courseId, learning, sectionId } = useSelector(selectAllCourseState);
  // const { courseId } = useSelector(selectEnrollIdAndCourseId);

  const [isOpen, setIsOpen] = useState(false);

  const [openKeys, setOpenKeys] = useState(
    String(learning.sectionDto.length > 0 ? learning.sectionDto[0].id : 0)
  );

  useEffect(() => {
    if (sectionId) {
      setOpenKeys(sectionId);
    }
  }, [sectionId]);

  // useEffect(() => {
  //   if (courseId) dispatch(onGetLearning(courseId));
  // }, [dispatch, courseId]);

  const handleChangeCollapse = (keys) => {
    console.log(keys);
    setOpenKeys(keys);
    setIsOpen(false);
    if (keys.length === learning.sectionDto.length) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };
  //   Open All
  const handleToggleOpen = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setOpenKeys([]);
    }
  };

  return (
    <div className="sidebar w-[400px]">
      <CollapseAntCom
        type="learn"
        isOpen={isOpen}
        onChange={handleChangeCollapse}
        openKeys={openKeys}
        parentItems={learning.sectionDto}
        childItems={learning.lessonDto}
        slug={slug}
        isLearning={true}
      ></CollapseAntCom>
    </div>
  );
};

export default LearnSidebarMod;
