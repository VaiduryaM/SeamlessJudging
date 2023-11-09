/* eslint-disable */
import {
  CloudUploadOutlined,
  DownloadOutlined,
  FileSyncOutlined,
  InboxOutlined,
  SecurityScanOutlined,
  SmileOutlined,
  UploadOutlined,
  WalletOutlined,
} from "@ant-design/icons";
import {
  Button,
  Card,
  Col,
  message,
  Row,
  Space,
  Upload,
  PageHeader,
  Table,
  Result,
} from "antd";
import { Drawer, Form, Input, Select, DatePicker } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import React, { useEffect, useState } from "react";
import { uploadFileAdmin, getFilePath } from "../Services/AdminServices";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import { ResultColDefs } from "./ResultColDefs/ResultColDefs";
const { Dragger } = Upload;
const { Option } = Select;

const CSVUpload = () => {
  const [uploadForm] = Form.useForm();
  const [showTemplateButton, setShowTemplateButton] = useState(null);
  const [showUploadButton, setShowUploadButton] = useState(null);
  const [tableDetails, setTableDetails] = useState({ columns: [], data: [] });
  const [showResultTable, setShowResultTable] = useState(false);
  const [selectVal, setSelectVal] = useState("");
  const selectOnChange = async (value) => {
    if (typeof value === "string") {
      setSelectVal(value);
    }
    setShowResultTable(false);
    setTableDetails({
      ...tableDetails,
      columns: ResultColDefs(selectVal ? selectVal : value),
    });
    setShowTemplateButton(true);
  };

  const onClickTemplate = async () => {
    const result = await getFilePath(selectVal);
    if (result.status === 200) {
      const url =
        process.env.REACT_APP_LOCAL_DB_URL +
        `/api/v1/content/download?path=${result.data.file}`;
      window.open(url);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };

  const uploadFiles = (event) => {
    if (Array.isArray(event)) {
      return event;
    }
    if (event.fileList.length === 1) {
      setShowUploadButton(true);
    } else {
      setShowUploadButton(false);
      NotificationHandler("info", "Warning!", "Please upload at most one file");
    }
    return event && event.fileList;
  };
  const onClickUpload = async (values) => {
    const result = await uploadFileAdmin(values);
    if (result.status === 200) {
      setTableDetails({ ...tableDetails, data: result.data });
      setShowResultTable(true);
      NotificationHandler("success", "Success!", result.message);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    uploadForm.resetFields();
  };

  return (
    <>
      <PageHeader
        title="File upload"
        avatar={{ icon: <CloudUploadOutlined /> }}
        ghost={false}
        hoverable
      >
        <Form
          name="upload"
          form={uploadForm}
          labelCol={{
            span: 8,
          }}
          wrapperCol={{
            span: 12,
          }}
          autoComplete="off"
          onFinish={onClickUpload}
        >
          <Form.Item
            label={
              <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                Upload Type
              </div>
            }
            name="upload_type"
            rules={[
              {
                required: true,
                message: "Please select your data type!",
              },
            ]}
          >
            <Select
              showSearch
              placeholder="Select the type of data"
              optionFilterProp="children"
              filterOption={(input, option) =>
                option.children.toLowerCase().includes(input.toLowerCase())
              }
              onChange={selectOnChange}
            >
              <Option value="EVENT">Events</Option>
              <Option value="PROJECT">Projects</Option>
              <Option value="JUDGE">Judges</Option>
              <Option value="PARTICIPANT">Participants</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="file"
            label={
              <div style={{ fontWeight: "bold", color: "midnightblue" }}>
                File
              </div>
            }
            valuePropName="fileList"
            getValueFromEvent={uploadFiles}
          >
            <Upload
              beforeUpload={() => {
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>
                Click to upload your files
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 8,
            }}
          >
            {showTemplateButton ? (
              <Space>
                <Button
                  type="danger"
                  icon={<DownloadOutlined />}
                  onClick={onClickTemplate}
                >
                  Template
                </Button>
                {showUploadButton ? (
                  <Button htmlType="submit" type="primary">
                    Upload
                  </Button>
                ) : null}
              </Space>
            ) : null}
          </Form.Item>
        </Form>
        {showResultTable ? (
          <Table
            columns={tableDetails.columns}
            dataSource={tableDetails.data}
          />
        ) : (
          <div>
            <Result
              status="500"
              title="Upload a file to validate your results here."
            />
          </div>
        )}
      </PageHeader>
    </>
  );
};

export default CSVUpload;
