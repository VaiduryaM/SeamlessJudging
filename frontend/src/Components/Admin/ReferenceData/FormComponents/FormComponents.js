/* eslint-disable */
import React from "react";
import { Button, Form, Input, InputNumber, Select, Space } from "antd";
const { Option } = Select;
export const sponsersFormCompoenent = (
  sponsorForm,
  initialVal,
  onFinish,
  formAction
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
        label="Sponsor"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your Sponsor name!",
          },
        ]}
      >
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <InputNumber min={1} allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
        <Input allowClear />
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
