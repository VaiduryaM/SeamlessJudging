import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Form, Row, Col, Button, Divider, Card, Space } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { NotificationHandler } from "../Common/Notifications/NotificationHandler";
import { getAPIResponse } from "../Common/Services/Projects/ProjectServices";
import { getRoutes } from "../Common/Services/Projects/routes";
import { GetTitle } from "../Common/Utils/GetTitle";
import InsModalComp from "./InsModalComp";

function AddNote({ setNote }) {
  const [noteText, setNoteText] = useState("");
  const [client, setClient] = useState({});

  const navigate = useNavigate();
  const location = useLocation();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    setClient({
      id: location.state.clientId,
      name: location.state.clientName,
    });

    getNotes(location.state.clientId);
  }, []);

  const handleChange = (e) => {
    setNoteText(e.target.value);
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!noteText.length) {
      NotificationHandler("info", "Note Empty", "Please add a note");
      return;
    }
    const url = getRoutes("addNote", { userId: userId });
    const body = {
      clientId: client.id,
      instructorId: userId,
      text: noteText,
    };

    const data = await getAPIResponse(url, "POST", body);
    if (data.status === 200) {
      NotificationHandler("success", "Success", data.message);
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } else {
      NotificationHandler("failed", "Failed", data.message);
    }
  };

  const getNotes = async (clientId) => {
    const url = getRoutes("getNote", { userId: userId });
    const body = {
      clientId: clientId,
      instructorId: userId,
    };
    const res = await getAPIResponse(url, "POST", body);
    if (res.data) {
      setNote(res.data.response);
    }
  };

  return (
    <Card
      className="Border-Style"
      hoverable={true}
      title={<GetTitle title={"Add a Note"} onClick={navigate} />}
    >
      <Row align="middle" justify="center">
        <Col span={20}>
          <p>
            <span className="fw-600">Client: </span>
            {client.name}
          </p>
          <Form>
            <Form.Item name="addNote">
              <TextArea
                rows={4}
                className="Border-Style"
                placeholder="Add a Note"
                onChange={handleChange}
                style={{ backgroundColor: "#F0F2F5" }}
              />
            </Form.Item>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col span={24} offset={20}>
          <Button
            className="Border-Style"
            type="primary"
            // disabled={noteText.length == 0}
            onClick={handleAdd}
          >
            Add a Note
          </Button>
        </Col>
      </Row>
    </Card>
  );
}

const ProjectNotes = () => {
  const [notes, setNotes] = useState([]);
  const [noteText, setNoteText] = useState("");
  const [toggleEdit, setToggleEdit] = useState(false);
  const [selectedId, setSelectedId] = useState(0);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setNoteText(e.target.value);
  };

  const updateNote = async (noteId) => {
    const userId = localStorage.getItem("userId");
    const url = getRoutes("updateNote", { userId: userId });
    const body = {
      noteId: noteId,
      text: noteText,
    };

    const data = await getAPIResponse(url, "PUT", body);
    if (data.status === 200) {
      NotificationHandler("success", "Success", data.message);
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } else {
      NotificationHandler("failed", "Failed", data.message);
    }
  };

  const deleteNote = async (noteId) => {
    const userId = localStorage.getItem("userId");
    const url = getRoutes("deleteNote", { userId: userId });
    const body = {
      noteId: noteId,
    };

    const data = await getAPIResponse(url, "DELETE", body);
    if (data.status === 200) {
      NotificationHandler("success", "Success", data.message);
      setTimeout(() => {
        navigate(0);
      }, 2000);
    } else {
      NotificationHandler("failed", "Failed", data.message);
    }
  };

  return (
    <>
      <AddNote setNote={setNotes} />
      <Divider />
      <Row justify="center">
        <Col span={20}>
          <div>
            {!notes.length && <p>No notes available</p>}
            {notes.map((note) => {
              return (
                <>
                  {
                    <Card
                      className="Border-Style"
                      key={note.noteId}
                      hoverable={true}
                      style={{ margin: "10px" }}
                    >
                      {
                        <Row>
                          <Col span={12}>
                            <p>
                              <span className="fw-600">Date: </span>
                              {new Date(note.updatedAt).toDateString()}
                            </p>
                          </Col>
                          <Col span={2} offset={10}>
                            <Space>
                              <InsModalComp
                                buttonShape={"circle"}
                                buttonIcon={<DeleteOutlined />}
                                isDanger={true}
                                modalText="Are you sure you want to delete?"
                                onOkFunc={() => deleteNote(note.noteId)}
                              />
                              <Button
                                icon={<EditOutlined />}
                                shape="circle"
                                onClick={() => {
                                  setSelectedId(note.noteId);
                                  setToggleEdit(!toggleEdit);
                                }}
                              />
                            </Space>
                          </Col>
                        </Row>
                      }
                      <Row>
                        <Col span={24}>
                          <p className="mt-1">{note.text}</p>
                        </Col>
                      </Row>
                      {toggleEdit && note.noteId == selectedId && (
                        <Row>
                          <p>Edit Note</p>
                          <Col span={24}>
                            <Form>
                              <Form.Item name="editNote">
                                <TextArea
                                  rows={4}
                                  defaultValue={note.text}
                                  className="Border-Style"
                                  style={{ backgroundColor: "#F0F2F5" }}
                                  onChange={handleChange}
                                />
                              </Form.Item>
                            </Form>
                            <Col offset={20}>
                              <Space>
                                <Button
                                  className="Border-Style"
                                  type="primary"
                                  onClick={() => setToggleEdit(!toggleEdit)}
                                >
                                  Cancel
                                </Button>
                                <Button
                                  className="Border-Style"
                                  type="primary"
                                  onClick={() => updateNote(note.noteId)}
                                >
                                  Save
                                </Button>
                              </Space>
                            </Col>
                          </Col>
                        </Row>
                      )}
                    </Card>
                  }
                </>
              );
            })}
          </div>
        </Col>
      </Row>
    </>
  );
};

export default ProjectNotes;
