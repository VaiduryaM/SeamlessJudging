import { Card, Form, Input, Select, Button, Image, Col, Row, Tag, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
// import TextField from '@mui/material/TextField';
// import Chip from '@mui/material/Chip';
// import Autocomplete from '@mui/material/Autocomplete';
import React, { useState, useEffect } from "react";
import DynamicTags from "../../Common/DynamicTags";
import { getRoutes } from "../../Common/Services/Projects/routes";
import { getAPIResponse } from "../../Common/Services/Projects/ProjectServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const { Option } = Select;
const NewEmailForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState([]);
  const [recipients, setRecipients1] = useState([]);
  const [tags, setTags] = useState([]);
  const [templates, setEmailTemplates] = useState();
  const [templateDetails, setTemplateDetails] = useState();
  const [selectedKeyword, setSelectedKeyword] = useState();

  const setRecipients = async (values, newvalue,reason) => {
    let recipients = [];
    if (reason =="createOption"){
      setRecipients1(recipients.concat(newvalue.option.split(",")));
    }else{
      setRecipients1(values);
    }
    // console.log(recipients);
    // console.log(reason);
    // console.log(values[values.length-1]);
    // recipients = 
  }

  // const paste = async () => {
  //    await navigator.clipboard.readText().then((readText)=>{
  //         let toemails = recipients;
  //         let emails = readText.split(",");
  //         for(let i = 0; i<emails.length; i++){
  //           if(!toemails.includes(emails[i])){
  //             toemails.push(emails[i]);
  //           }
  //         }
  //         setRecipients1(toemails);
  //       });
  //   console.log("recipients = ", recipients);
  // }

  // const handleInputKeyDown = (event,a,b,c) =>{
  //   console.log("event = ", event);
  //   console.log("a = ", a);
  //   console.log("b = ", b);
  //   console.log("c = ", c);
  // };

  const onFinish = async (values) => {
    let url = getRoutes("sendNewEmail");
    let body = values;
    body.emailIds = recipients;
    let res = await getAPIResponse(url, "POST", body);
    if (res.status == 200) {
      NotificationHandler("success", "Success!", res.message);
      form.resetFields();
      setTags([]);
      navigate("/ins/emailLogs");
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  // const setRecipientTags = async (value) => {

  // };

  const getEmailTemplates = async () => {
    let url = getRoutes("getEmailTemplates");
    let res = await getAPIResponse(url, "GET");
    if (res.status == 200) {
      let responseData = res.data.response;
      let temp = [];
      responseData.forEach((data) => {
        temp.push(data.title);
      });
      setEmailTemplates(temp);
      setTemplateDetails(responseData);
    } else {
      NotificationHandler("failure", "Failed!", res.message);
    }
  };

  const showTemplateDetails = (e) => {
    for (let i = 0; i < templateDetails.length; i++) {
      if (templateDetails[i].title == e) {
        form.setFieldsValue({
          emailSubject: templateDetails[i].emailSubject,
          emailBody: templateDetails[i].emailBody,
        });
        break;
      }
    }
  };

  const getUsers = () => {
    axios
      .get(
        process.env.REACT_APP_LOCAL_DB_URL + `/api/v1/instructor/users`,
        {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Token": localStorage.getItem("access_token"),
          },
        }
      )
      .then((res) => {
        console.log("res. = ", res);
        setUserData(
          res.data.data.map((obj, index) => {
            return {
              key: index,
              userName:
                obj.PrefferedName == null ? (
                  <Tag color="gray"></Tag>
                ) : (
                  obj.PrefferedName
                ),
              roles: obj.role,
              email: obj.email,
              userId: obj.userId,
            };
          })
        );
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        NotificationHandler("failure", err.message, "Please try again");
      });
  };

  const keyPress = (e) =>{
    if(e.keyCode == 13){
       console.log('value', e.target.value);
       // put the login here
    }
  };

  const alternateCopy = (text) => {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand("copy");
    } catch (err) {
      console.log(err);
    }
    document.body.removeChild(textArea);
  };

  const copy = () => {
    if (selectedKeyword !== "" && window.isSecureContext) {
      navigator.clipboard.writeText(String(selectedKeyword));
    } else {
      alternateCopy(selectedKeyword);
    }
  };

  useEffect(() => {
    getEmailTemplates();
    getUsers();
  }, []);

  return (
    <div>
      <Card title="New Email" className="Border-Style" hoverable={true}>
        <Col>
          <Form
            name="new-email-form"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 12 }}
            labelAlign="left"
            autoComplete="off"
            onFinish={onFinish}
            form={form}
          >
            <Row>
              <Col span={8}>
                <Form.Item
                  label={<label style={{ fontWeight: 400 }}>Keyword</label>}
                  name="keyword"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  rules={[
                    {
                      message: "Please select the keyword",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select keyword"
                    onChange={(e) => setSelectedKeyword(e)}
                    popupClassName="Border-Style"
                  >
                    <Option value="{~User Name~}">User Name</Option>
                    <Option value="{~User Details~}">User Details</Option>
                    <Option value="{~Token~}">Token</Option>
                    <Option value="{~User Roles~}">User Roles</Option>
                    <Option value="{~Student Projects~}">
                      Student Projects
                    </Option>
                    <Option value="{~Client Projects~}">Client Projects</Option>
                    <Option value="{~Events~}">Events</Option>
                    <Option value="{~Judge Events~}">Judge Events</Option>
                    <Option value="{~Judge Projects~}">Judge Projects</Option>
                    <Option value="{~Instructor Details~}">
                      Instructor Details
                    </Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Button onClick={copy}>Copy to clipboard</Button>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Form.Item
                  label={<label style={{ fontWeight: 400 }}>Template</label>}
                  name="template"
                  labelCol={{ span: 6 }}
                  wrapperCol={{ span: 16 }}
                  rules={[
                    {
                      message: "Please select the template",
                    },
                  ]}
                >
                  <Select
                    placeholder="Select template"
                    onChange={showTemplateDetails}
                    popupClassName="Border-Style"
                  >
                    {templates &&
                      templates.map((template) => {
                        return <Option value={template}> {template} </Option>;
                      })}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<label style={{ fontWeight: 4000 }}>To</label>}
                  className="fw-600"
                  rules={[
                    {
                      required: true,
                      message: "Please enter recipients",
                    },
                  ]}
                >
                  {recipients.length > -1 && 
                  <Space style={{ width: '100%' }} direction="vertical">
                    <Select
                      id="recipientselect"
                      mode="tags"
                      tokenSeparators={[',']}
                      allowClear
                      name="emailIds"
                      style={{ width: '100%' }}
                      placeholder="Select recipients"
                      onChange={setRecipients}
                      optionLabelProp="label"
                      value={recipients}
                      // onInputKeyDown={handleInputKeyDown}
                      dropdownMatchSelectWidth={false}
                      showSearch
                      filterOption={(inputValue, option) =>
                        (typeof option.children == 'string' ? option.value : (option.children[0].props["children"] + " " + option.children[2])).toLowerCase().includes(inputValue.toLowerCase())
                      }
                    >
                      {userData.map((user) => ( !recipients.includes(user.email) && 
                        <Option key={user.email} value={user.email} label={user.userName}><a href="javascript:void(0)">{user.userName+" "}</a>({user.email})</Option>
                          
                      ))}
                    </Select>
                  </Space>
                  }
                </Form.Item>
              </Col>
              {/* <div><Button onClick={paste}>Paste from clipboard</Button></div> */}
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<label style={{ fontWeight: 400 }}>Subject</label>}
                  name="emailSubject"
                  wrapperCol={{ span: 20 }}
                >
                  <Input className="Border-Style" />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<label style={{ fontWeight: 400 }}>Body</label>}
                  style={{ color: "red" }}
                  name="emailBody"
                  wrapperCol={{ span: 20 }}
                >
                  <TextArea className="Border-Style" rows={6} />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label=" "
                  colon={false}
                  name="send"
                  wrapperCol={{ span: 20 }}
                >
                  <Button htmlType="submit" type="primary">
                    {" "}
                    Send{" "}
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
      </Card>
    </div>
  );
};

export default NewEmailForm;
