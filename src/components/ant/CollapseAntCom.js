import { Checkbox } from "@mui/material";
import { Collapse } from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { selectAllCourseState } from "../../store/course/courseSelector";
import {
  onManualSelectedLesson,
  onSaveTrackingLesson,
  onSelectedLesson,
} from "../../store/course/courseSlice";
import { convertSecondToDiffForHumans } from "../../utils/helper";
import SpinAntCom from "./SpinAntCom";
const { Panel } = Collapse;

const CollapseAntCom = ({
  type = "default",
  slug = "/",
  openKeys = ["1"],
  onChange = () => {},
  isOpen = false,
  parentItems = [],
  childItems = [],
  isLearning = false,
}) => {
  const navigate = useNavigate();

  const {
    enrollId,
    courseId,
    lessonId,
    tracking,
    isSelectLessonManual,
    isLoading,
  } = useSelector(selectAllCourseState);

  const [lessionId, setLessionId] = useState(0);
  const [manualSelectLesson, setManualSelectLesson] = useState(false);
  const dispatch = useDispatch();

  const ids = parentItems.map((item) => String(item.id));

  const handleClick = (child) => {
    setLessionId(child.id);
    dispatch(
      //onSelectedLesson({ sectionId: child.sectionId, lessonId: child.id })
      onManualSelectedLesson({
        enrollmentId: enrollId,
        courseId,
        sectionId: child.sectionId,
        lessonId: child.id,
      })
    );
  };

  useEffect(() => {
    if (isSelectLessonManual) {
      dispatch(
        onSaveTrackingLesson({
          id: tracking?.id,
          enrollmentId: enrollId,
          courseId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSelectLessonManual]);

  // Auto select lesson when load tracking success
  useEffect(() => {
    setLessionId(lessonId);

    if (isLearning && tracking && !manualSelectLesson) {
      navigate("/learn/" + slug + "?id=" + tracking?.lessonId);
      setManualSelectLesson(true);
      dispatch(
        onSelectedLesson({
          sectionId: tracking?.sectionId,
          lessonId: tracking?.lessonId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLearning, lessonId, tracking, manualSelectLesson]);

  return parentItems.length === 0 ? null : isLoading ? (
    <SpinAntCom />
  ) : (
    <Collapse
      // defaultActiveKey={["1"]}
      // activeKey={isOpen ? ["1", "2", "3"] : openKeys}
      // defaultActiveKey={String(parentItems[0]?.id)}
      defaultActiveKey={[String(Array(parentItems[0]?.id))]}
      activeKey={isOpen ? ids : openKeys}
      // activeKey={openKeys}
      onChange={onChange}
      size="large"
    >
      {parentItems &&
        parentItems.length > 0 &&
        parentItems.map((parent, index) => {
          let lessionNo = 1;
          return (
            <Panel header={parent.name} key={parent.id}>
              {childItems &&
                childItems.length > 0 &&
                // eslint-disable-next-line array-callback-return
                childItems.map((child, i) => {
                  if (child.sectionId === parent.id) {
                    if (type === "learn") {
                      return (
                        <Link
                          onClick={() => handleClick(child)}
                          to={`/learn/${slug}?id=${child.id}`}
                          key={child.id}
                          className={`flex justify-between items-center ${
                            parseInt(lessionId) === child.id
                              ? "text-tw-primary"
                              : false
                          }`}
                        >
                          <span>
                            <Checkbox
                              aria-label="Checkbox demo"
                              color="success"
                              checked={child.completed}
                            />{" "}
                            {child.name}
                          </span>
                          <span>
                            {convertSecondToDiffForHumans(child.duration)}
                          </span>
                        </Link>
                      );
                    } else {
                      return (
                        <div
                          key={child.id}
                          className="flex justify-between items-center"
                        >
                          <span>
                            {lessionNo++}. {child.name}
                          </span>
                          <span>
                            {convertSecondToDiffForHumans(child.duration)}
                          </span>
                        </div>
                      );
                    }
                  }
                })}
            </Panel>
          );
        })}
      {/* <Panel header="Introduce" key="1">
          <div className="flex justify-between items-center">
            <span>1.{text}</span>
            <span>03:58</span>
          </div>
        </Panel>
        <Panel header="How to install PHP" key="2">
          <p>{text}</p>
        </Panel>
        <Panel header="Learning PHP core" key="3">
          <p>{text}</p>
        </Panel> */}
    </Collapse>
  );
};
export default CollapseAntCom;
