/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import {
  Layout,
  Space,
  Avatar,
  Row,
  Col,
  Tooltip,
  Badge,
  Tag,
  Dropdown,
  Menu,
  Button,
  Affix,
  Select,
  DatePicker
} from "antd";
import {
  BellOutlined,
  GitlabOutlined,
  LogoutOutlined,
  RocketOutlined,
  UserOutlined,
  PlusOutlined
} from "@ant-design/icons";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import { authDetailsContext } from "../../../App";
import ParticipantProfile from "./ParticipantProfile";
import { getUserProfile } from "../../Participants/Services/PartcipantServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import { getRequestsByType } from "../../Admin/Services/AdminServices";
import { MainContext } from "../../../Context/MainContext";
import axios from "axios";
const { Header } = Layout;
//import { MainContext } from "../../Context/MainContext";
const Appbar = ({activeItem}) => {
  const [showProfile, setShowProfile] = useState(false);
  const authProps = useContext(authDetailsContext);
  const { setIsLoggedIn } = useContext(MainContext);
  const [imageSrc, setImageSrc] = useState("");
  const [nameLetters, setNameLetters] = useState("");
  const { currYear, year, sem, setYear, setSem } = useContext(MainContext);
  useEffect(() => {
    axios
      .get(process.env.REACT_APP_LOCAL_DB_URL + "/api/v1/user/profile", {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Token": localStorage.getItem("access_token"),
        },
      })
      .then((res) => {
        console.log("res.data.response_data.body = ", res.data.response_data.body);
        if(res.data.response_data.body.first_name.length>0 && res.data.response_data.body.last_name.length>0){
          setNameLetters(res.data.response_data.body.first_name[0]+res.data.response_data.body.last_name[0]);
        }
        setImageSrc(res.data.response_data.image);
      });
  }, []);

  const navigate = useNavigate();
  const logoutFun = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/", { replace: true });
    navigate(0);
  };

  const onClickLogo = () => {
    navigate("/home", { replace: true });
  };

  const menu = (
    <Menu
      className="Border-Style"
      items={[
        {
          key: "1",
          label: (
            <div
              onClick={() => navigate("/updateProfile")}
              style={{ fontSize: "22" }}
            >
              My Profile
            </div>
          ),
          icon: <UserOutlined style={{ fontSize: "18px" }} />,
        },
        {
          key: "2",
          label: (
            <div onClick={logoutFun} style={{ fontSize: "22" }}>
              Logout
            </div>
          ),
          icon: <LogoutOutlined style={{ fontSize: "18px" }} />,
        },
      ]}
      style={{ width: 200 }}
    />
  );
  return (
    <Affix>
      <Header>
        {!showProfile ? (
          <Row>
            <Col span={22}>
              <Button
                style={{
                  marginLeft: "-40px",
                  fontWeight: "bold",
                  cursor: "pointer",
                  marginTop: "15px",
                  verticalAlign: "top",
                }}
                onClick={onClickLogo}
                size="large"
              >
                Capstone Project Management
              </Button>
            </Col>
            <Col span={2} style={{position: "absolute", right: "240px"}}>
              {!((activeItem.name && activeItem.name=="manageUsers")||(activeItem && activeItem.name=="manageClients"))?(
              <Space>
                <Select
                  defaultValue={sem}
                  popupClassName="Border-Style"
                  style={{ width: "90px" }}
                onChange={(sem) => {
                  setSem(sem);
                }}
                >
                  <Option value="Fall"> Fall </Option>
                  <Option value="Winter"> Winter </Option>
                  <Option value="Spring"> Spring </Option>
                  <Option value="Summer"> Summer </Option>
                </Select>
                <DatePicker
                  defaultValue={moment(String(year), "YYYY")}//year
                  style={{ width: "90px" }}
                  picker="year"
                  className="Border-Style"
                onChange={(_, year) => {
                  setYear(year);
                }}
                />
              </Space>
              ):(<></>)
              }
            </Col>
            {localStorage.getItem("access_token") ? (
              <Col span={2}>
                <Space>
                  <Dropdown overlay={menu} placement="bottom" trigger={"click"}>
                  <div>
                    <img
                      class = {imageSrc==""? "defaultImg": ""}
                      title = {imageSrc==""? nameLetters: ""}
                      src={imageSrc}
                      style={{
                        borderRadius: "50%",
                        border: "1px solid",
                        cursor: "pointer",
                        fontSize: "30px",
                        lineHeight:"15px"
                      }}
                      width="50"
                      height="50"
                    />
                  </div>
                  </Dropdown>
                </Space>
              </Col>
            ) : (
              <> </>
            )}
          </Row>
        ) : (
          <ParticipantProfile
            showProfile={showProfile}
            setShowProfile={setShowProfile}
          />
        )}
      </Header>
    </Affix>
  );
};
export default Appbar;
