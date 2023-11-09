import { Modal,Form, Select} from "antd";
import React, { useState } from "react";
import ViewEventById from "./ViewEventById";
const { Option } = Select;

const AdminUpdateWinner = (props) =>{
    const handleOk = () => {
        props.setShowWinner(false);
      };
    
      const handleCancel = () => {
        props.setShowWinner(false);
      };
    return (
        <Modal visible={props.showWinner} onOk={handleOk} onCancel={handleCancel}>   
            <Form.Item
                label="Winner"
                name="name"
                rules={[
                {
                    required: false,
                },
                ]}
            >
                <Select
                    showSearch
                    size="medium"
                    style={{ width: "90%",}}
                    placeholder="Select Winner"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                        option.children.toLowerCase().includes(input.toLowerCase())
                    }
                >
                    <Option value="1">Winner Category 1</Option>
                    <Option value="2">Winner Category 2</Option>
                    <Option value="3">Winner Category 3</Option>
                    <Option value="3">Winner Category 3</Option>
                </Select>
          </Form.Item>
        </Modal>
      );

}

export default AdminUpdateWinner;