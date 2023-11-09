import { CaretRightOutlined } from '@ant-design/icons';
import { Button, Space, List, Collapse, Modal,Form, Popover} from "antd";
import React, { useState } from "react";
import ViewEventById from "./ViewEventById";

const { Panel } = Collapse;

const AdminViewScores = (props) => {
    
  const handleOk = () => {
    props.setShowScore(false);
  };

  const handleCancel = () => {
    props.setShowScore(false);
  };
    const judges = [
      [
        {
          name: "sa",
          title: "Catergory 1",
          score: "Score 1",
          key: 21,
        },
        {
          name: "sa",
          title: "Catergory 2",
          score: "Score 2",
          key: 22,
        },
        {
          name: "sa",
          title: "Catergory 3",
          score: "Score 3",
          key: 33,
        },
        {
          name: "sa",
          title: "Catergory 4",
          score: "Score 4",
          key: 44,
        }
      ],
      [
        {
          name: "sa2",
          title: "Catergory 1",
          score: "Score 1",
          key: 21,
        },
        {
          name: "sa2",
          title: "Catergory 2",
          score: "Score 2",
          key: 22,
        },
        {
          name: "sa2",
          title: "Catergory 3",
          score: "Score 3",
          key: 33,
        },
        {
          name: "sa2",
          title: "Catergory 4",
          score: "Score 4",
          key: 44,
        }
      ]
    ];

    return (
        <Modal visible={props.showScore} onOk={handleOk} onCancel={handleCancel}>   
            <List 
              itemLayout="horizontal"
              dataSource={judges}
              renderItem={(judge) => (
                <Collapse
                  bordered={false}
                  expandIcon={({ isActive }) => (
                    <CaretRightOutlined rotate={isActive ? 90 : 0} />
                  )}
                >
                  <Panel header={judge[0].name}>
                    <List
                      itemLayout='horizontal'
                      dataSource={Object.values(judge)}
                      renderItem={(item) => (
                        <List.Item>
                          <List.Item.Meta
                            title={item.title}
                            description={item.score}
                          />
                        </List.Item>
                      )}
                    />
                  </Panel>
                </Collapse>
              )}
            />
        </Modal>
      );
    
};

export default AdminViewScores;

