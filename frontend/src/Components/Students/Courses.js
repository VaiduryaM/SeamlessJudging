import React, { useContext, useEffect, useState } from "react";
import { Row, Col, Card } from "antd";
import { getCoursesService } from "./Services/StudentServices";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { useNavigate } from "react-router-dom";
import { getUserActions } from "../Common/Utils/userFunctions";
import { MainContext } from "../../Context/MainContext";
import { GetCurrSem } from "../Common/GetCurrSem";

const Courses = ({ setCourse, loadView }) => {
  const { currYear, year, sem, setYear, setSem } = useContext(MainContext);
  const { studentActions } = getUserActions();
  const { setActions } = useContext(MainContext);

  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();
  const currDate = new Date().getDate();
  const currMonth = new Date().getMonth();

  studentActions[0].children.splice(1, 2);

  const getCourses = async () => {
    const result = await getCoursesService(year, sem);
    if (result.status === 200) {
      setCourses(result.data);
    } else {
      setCourses([])
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  useEffect(() => {
    setActions((prev) => [
      ...prev.filter((item) => item.key !== "studentActions"),
      ...studentActions,
    ]);
    getCourses();
  }, [year,sem]);

  return (
    <Card
      title="Courses"
      hoverable={true}
      bodyStyle={{
        overflowY: "scroll",
        height: "80vh",
      }}
      className="Border-Style"
    >
      <Row
        gutter={{
          md: 8,
          sm: 10,
        }}
      >
        {courses.map((course, index) => (
          <Col md={8} sm={12} key={"course" + index}>
            <Card
              title={course.code}
              hoverable={true}
              className="Border-Style ant-card-cursor"
              style={{ marginBottom: "6px" }}
              onClick={() => {
                navigate(`/student/projects/${course.course_code_id}`);
              }}
            >
              {course.name}
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
};

export default Courses;
