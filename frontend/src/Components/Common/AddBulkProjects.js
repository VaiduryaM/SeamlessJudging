import {
    Card,
    Form,
    Input,
    Select,
    Button,
  } from "antd";
  import Papa from "papaparse";
  import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
  import ReactFileReader from "react-file-reader";
  import React, { useState, useEffect } from "react";
  import { useNavigate, useLocation } from "react-router-dom";
  import { getCoursesService } from "../Students/Services/StudentServices";
  import { GetCurrSem } from "./GetCurrSem";
  import moment from "moment";
  const { Option } = Select;
  
  const AddBulkProjects = () => {
    const [modal, setModal] = useState(false);
  const [bulkUsers, setBulkUsers] = useState({
    loading: true,
    data: [],
    message: "",
  });

  const [userData, setUserData] = useState({
    newUsers: [],
    addUsers: [],
    remUsers: [],
  });
    const [tags, setTags] = useState([]);
    const [projectTypes, setProjectTypes] = useState([]);
    const [courses, setCourses] = useState([]);
    const [sem, setSem] = useState(
      GetCurrSem(new Date().getDate(), new Date().getMonth())
    );
    const [parsedData, setParsedData] = useState([]);
    const [projectFields, setProjectFields] = useState([{name:"courseCodeId",label:"Course Name"},{name:"name",label:"Project Name"},{name:"description",label:"Description"},{name:"projectType",label:"Project Types"},{name:"clients",label:"Client Email IDs"},{name:"link1",label:"Project Link 1"},{name:"link2",label:"Project Link 2"}, {name:"link3",label:"Project Link 3"} ]);
    const [fileCols, setFileCols] = useState([]);
    const [colFieldMap, setColFieldMap] = useState({});
    const [year, setYear] = useState(new Date().getFullYear());
    const [form] = Form.useForm();
    const navigate = useNavigate();
    let location = useLocation();
    let courseCodeId = location.state && location.state.courseCode;
    let courseName = location.state && location.state.courseName;
  
    const props = {
        name: "file",
        maxCount: 1,
        beforeUpload: (file) => {
          return false;
        },
      };

    useEffect(() => {
      getCourses(year, sem);
    }, []);
  

    const handleFiles = async(files) => {
        console.log(" files = ", files[0]);
        var reader = new FileReader();
        reader.onload = e => {
          console.log("reader.result = ", reader.result[0]);
          const csv = Papa.parse(reader.result, { header: true });
            const parsedData = csv?csv.data:[];
            setParsedData(parsedData);
            const columns = Object.keys(parsedData[0]);
            setFileCols(columns);
            console.log(" columsn = ", columns);
        //   setFileCols
        //   this.setState({
        //     csvData: reader.result
        //   });
        };
        reader.readAsText(files[0]);
      };

    const handleSubmit = async (values) => {
        let statusCode = null;
        let msg = null;
        let result = null;
        console.log("values = ", values);
        await fetch(
          process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/project/addbulk",
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Access-Control-Allow-Origin": "*",
              "Content-Type": "application/json",
              "access-token": localStorage.getItem("access_token"),
            },
            body: JSON.stringify({
                parsedData: parsedData,
                colFieldMap: values
            }),
          }
        )
          .then((response) => response.json())
          .then((data) => {
            console.log("data = ", data);
            if (data.hasOwnProperty("responseData")) {
                statusCode = 200;
                msg = data.responseStr;
                result = data.responseData;
                NotificationHandler("success", "Success!", msg);
              } else {
                statusCode = data.status;
                msg = data.message;
                result = data;
              }
          })
          .catch((err) => {
            console.log(err);
          });
          return { status: statusCode, data: result, message: msg };
      };

    const getCourses = async (year, sem) => {
      const result = await getCoursesService(year, sem);
      if (result.status === 200) {
        setCourses(result.data);
      } else {
        setCourses([]);
      }
    };

  
    return (
      <div>
        <Card
        title="Bulk Uploads"
        className="Border-Style"
        style={{ marginTop: "5px" }}
      >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          labelAlign="left"
          onFinish={handleSubmit}
        >
          <Form.Item label="Upload file" name="csvfile">
          <div>

            <ReactFileReader
                        multipleFiles={false}
                        fileTypes={[".csv"]}
                        handleFiles={handleFiles}
                    >
                        <Button className="btn" id="btt">
                        Import File
                        </Button>
                    </ReactFileReader>
            </div>
            {/* <Upload {...props}>
              <Button icon={<UploadOutlined />} block>
                Upload
              </Button>
            </Upload> */}
          </Form.Item>
        </Form>
      </Card>
      {fileCols.length>0 &&
       <Card
       title="Column Field Mapping:"
       className="Border-Style"
       style={{ marginTop: "5px" }}
        >
        <Form
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 8 }}
          labelAlign="left"
          onFinish={handleSubmit}
        >
            {projectFields.map((projectField) => (
                <span>
            <Form.Item label={projectField.label} name={projectField.name} >
            <Select popup className="Border-Style">
              {fileCols.length &&
                fileCols.map((col) => (
                  <Option value={col} key={col}>
                    {col}
                  </Option>
                ))}
            </Select>
          </Form.Item>
          {projectField.name=="courseCodeId" && 
          <Form.Item label="Default Course" name="defaultcourse" >
          <Select popup className="Border-Style" placeholder="Select Course">
            {courses.length &&
              courses.map((course) => (
                <Option value={course.course_code_id} key={course.key}>
                  {course.name}
                </Option>
              ))}
          </Select></Form.Item>}</span>
          
           ))}
           <Form.Item>
            <Button type="primary" htmlType="submit">
              Parse
            </Button>
          </Form.Item>
        </Form>
        </Card>}
        </div>
    );
  };
  
  export default AddBulkProjects;
  