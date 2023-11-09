/* eslint-disable */
// import React from "react";
import React, { useState, useEffect } from "react";
import {UploadOutlined} from "@ant-design/icons";
import { Button, Form, Input, InputNumber, Select, Space, Upload, message} from "antd";
const { Option } = Select;
const props = {
  headers: {
    authorization: 'authorization-text',
  },
  action: 'https://www.mocky.io/v2/',
  name: 'file',
};
export const sponsersFormCompoenent = (
  sponsorForm,
  initialVal,
  onFinish,
  formAction,
  onFileChange
) => {
  sponsorForm.resetFields();
  sponsorForm.setFieldsValue(initialVal);
  return (
    <Form
      name="sponsorForm"
      form={sponsorForm}
      initialValues={formAction != "ADD" ? initialVal : null}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item
        name="sponsor_id"
      >
      </Form.Item>
      <Form.Item
        label="Sponsor"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your Sponsor name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Logo"
        onChange={ e => {
        var file = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(file);
        document.querySelector('#upload-filename').innerHTML=e.target.files[0].name;
        }}
        >
          <label className="custom-file-upload">
                      <input
                        type="file"
                        id="file-upload"
                      />
                      <UploadOutlined />
                      Upload
                    </label>
                    <a rel="noopener noreferrer" href="" className="ant-upload-list-item-name" id="upload-filename">{(initialVal!=null && initialVal.logo)? (<div><img
                      src={initialVal.logo}
                      style={{ borderRadius: "5%" }}
                      width="80"
                      height="40"
                    /></div>) : ""}</a>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          {formAction === "ADD" ? (
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export const winnerCategoryFormComponent = (
  winnerForm,
  initialVal,
  onFinish,
  formAction
) => {
  winnerForm.resetFields();
  winnerForm.setFieldsValue(initialVal);
  return (
    <Form
      name="winnerform"
      form={winnerForm}
      initialValues={formAction != "ADD" ? initialVal : null}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item
        label="Winner Category"
        name="name"
        rules={[
          {
            required: true,
            message: "Please enter your Winner Category!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          {formAction === "ADD" ? (
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export const scoringCategoryFormComponent = (
  sForm,
  initialVal,
  onFinish,
  formAction
) => {
  sForm.resetFields();
  sForm.setFieldsValue(initialVal);
  return (
    <Form
      name="sForm"
      form={sForm}
      initialValues={formAction != "ADD" ? initialVal : null}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item
        label="Scoring Category"
        name="name"
        rules={[
          {
            required: true,
            message: "Please enter your Scoring Category!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Scale"
        name="scale"
        rules={[
          {
            required: true,
            message: "Please enter your Scale!",
          },
        ]}
      >
        <InputNumber className="Border-Style" min={1} allowClear />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          {formAction === "ADD" ? (
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export const judgeFormComponent = (jForm, initialVal, onFinish, formAction) => {
  jForm.resetFields();
  jForm.setFieldsValue(initialVal);
  return (
    <Form
      name="sForm"
      form={jForm}
      initialValues={formAction != "ADD" ? initialVal : null}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item
        label="First Name"
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please enter first name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Middle Name"
        name="middle_name"
        rules={[
          {
            required: false,
            message: "Please enter middle name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please enter last name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please enter email!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Company"
        name="company"
        rules={[
          {
            required: true,
            message: "Please enter company name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          {formAction === "ADD" ? (
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export const projectTypeFormComponent = (
  ptForm,
  initialVal,
  onFinish,
  formAction,
  refDataForForms
) => {
  ptForm.resetFields();
  ptForm.setFieldsValue(initialVal);
  return (
    <Form
      name="ptForm"
      form={ptForm}
      initialValues={formAction != "ADD" ? initialVal : null}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item
        label="Project Type"
        name="project_type"
        rules={[
          {
            required: true,
            message: "Please enter project type!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Scoring Categories"
        name="scoring_categories"
        rules={[
          {
            required: true,
            message: "Please select scoring categories!",
          },
        ]}
      >
        <Select
          mode="multiple"
          popupClassName="Border-Style"
          style={{
            width: "100%",
          }}
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
          placeholder="Please select"
          allowClear
          //onChange={onChangeFilterCourseCode}
        >
          {refDataForForms && refDataForForms.scoring_categories.length
            ? refDataForForms.scoring_categories.map((obj) => {
                return (
                  <Option
                    value={obj.score_category_id}
                    key={obj.score_category_id}
                  >
                    {obj.name}
                  </Option>
                );
              })
            : null}
        </Select>
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          {formAction === "ADD" ? (
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export const usersFormComponent = (
  userForm,
  initialVal,
  onFinish,
  formAction
) => {
  userForm.resetFields();
  userForm.setFieldsValue(initialVal);
  return (
    <Form
      name="userform"
      form={userForm}
      initialValues={formAction != "ADD" ? initialVal : null}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item
        label="First Name"
        name="first_name"
        rules={[
          {
            required: true,
            message: "Please enter First Name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Last Name"
        name="last_name"
        rules={[
          {
            required: true,
            message: "Please enter Last Name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Middle Name"
        name="middle_name"
        rules={[
          {
            required: false,
            message: "Please enter Middle Name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: "Please enter Email!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: "Please enter Role!",
          },
        ]}
      >
        <Select
          showSearch
          popupClassName="Border-Style"
          placeholder="Select the type of data"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          <Option value="PARTICIPANT">Participant</Option>
          <Option value="ADMIN">Admin</Option>
        </Select>
      </Form.Item>
      {formAction === "EDIT" ? (
        <Form.Item
          label="Status"
          name="status"
          rules={[
            {
              required: true,
              message: "Please enter Status!",
            },
          ]}
        >
          <Select
            showSearch
            popupClassName="Border-Style"
            placeholder="Select the type of data"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().includes(input.toLowerCase())
            }
          >
            <Option value="ACTIVE">Active</Option>
            <Option value="BLOCKED">Block</Option>
          </Select>
        </Form.Item>
      ) : null}

      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          {formAction === "ADD" ? (
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};

export const courseCodeFormComponent = (
  cCForm,
  initialVal,
  onFinish,
  formAction
) => {
  cCForm.resetFields();
  cCForm.setFieldsValue(initialVal);
  return (
    <Form
      name="cCForm"
      form={cCForm}
      initialValues={formAction != "ADD" ? initialVal : null}
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 12,
      }}
      autoComplete="off"
      onFinish={onFinish}
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please enter name!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        label="Course Code"
        name="code"
        rules={[
          {
            required: true,
            message: "Please enter code!",
          },
        ]}
      >
        <Input className="Border-Style" allowClear />
      </Form.Item>
      <Form.Item
        wrapperCol={{
          offset: 8,
          span: 8,
        }}
      >
        <Space>
          {formAction === "ADD" ? (
            <Button type="primary" htmlType="submit">
              Add
            </Button>
          ) : (
            <Button type="primary" htmlType="submit">
              Update
            </Button>
          )}
        </Space>
      </Form.Item>
    </Form>
  );
};
