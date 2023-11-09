import React, { useEffect, useRef, useState } from "react";
import "antd/dist/antd.css";
import { PlusOutlined } from "@ant-design/icons";
import { Input, Tag, Tooltip } from "antd";

const DynamicTags = ({ tagText, tagFunc, tagCont }) => {
  // const [tags, setTags] = useState([]);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [editInputIndex, setEditInputIndex] = useState(-1);
  const [editInputValue, setEditInputValue] = useState("");
  const inputRef = useRef(null);
  const editInputRef = useRef(null);
  useEffect(() => {
    if (inputVisible) {
      if (inputRef.current) inputRef.current.focus();
    }
  }, [inputVisible]);
  useEffect(() => {
    if (editInputIndex.current) editInputRef.current.focus();
  }, [inputValue]);
  const handleClose = (removedTag) => {
    const newTags = tagCont.filter((tag) => tag !== removedTag);
    tagFunc(newTags);
  };
  const showInput = () => {
    setInputVisible(true);
  };
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };
  const handleInputConfirm = () => {
    var values = inputValue.split(",");
    for (let i = 0; i < values.length; i++) {
      if (values[i] && tagCont.indexOf(values[i]) === -1) {
        tagFunc([...tagCont, values[i]]);
        tagCont.push(values[i]);
      }
    }
    setInputVisible(false);
    setInputValue("");
  };
  const handleEditInputChange = (e) => {
    setEditInputValue(e.target.value);
  };
  const handleEditInputConfirm = () => {
    const newTags = [...tagCont];
    newTags[editInputIndex] = editInputValue;
    tagFunc(newTags);
    setEditInputIndex(-1);
    setInputValue("");
  };
  return (
    <>
      {tagCont && tagCont.map((tag, index) => {
        if (editInputIndex === index) {
          return (
            <Input
              ref={editInputRef}
              key={tag}
              size="small"
              className="Border-Style"
              value={editInputValue}
              onChange={handleEditInputChange}
              onBlur={handleEditInputConfirm}
              onPressEnter={handleEditInputConfirm}
            />
          );
        }
        // const isLongTag = tag.length > 20;
        const tagElem = (
          <Tag
            className="Border-Style cursor-pointer"
            style={{
              padding: "4px",
              // display: "flex",
              // width: "160px",
              // justifyContent: "space-evenly",
              // alignItems: "center",
            }}
            key={tag}
            closable={true}
            onClose={() => handleClose(tag)}
          >
            <span
              onDoubleClick={(e) => {
                if (index !== 0) {
                  setEditInputIndex(index);
                  setEditInputValue(tag);
                  e.preventDefault();
                }
              }}
            >
              {/* {isLongTag ? `${tag.slice(0, 20)}...` : tag} */}
              {tag}
            </span>
          </Tag>
        );
        return tagElem;
        // return isLongTag ? (
        //   <Tooltip title={tag} key={tag}>
        //     {tagElem}
        //   </Tooltip>
        // ) : (
        //   tagElem
        // );
      })}
      {inputVisible && (
        <Input
          ref={inputRef}
          type="text"
          size="small"
          className="Border-Style"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          style={{
            padding: "4px",
            // display: "flex",
            // width: "150px",
            // justifyContent: "space-evenly",
            // alignItems: "center",
          }}
        />
      )}
      {!inputVisible && (
        <Tag
          className="Border-Style"
          onClick={showInput}
          style={{
            padding: "4px",
            // display: "inline-flex",
            // width: "150px",
            // justifyContent: "space-evenly",
            // alignItems: "center",
          }}
        >
          <PlusOutlined />
          {tagText}
        </Tag>
      )}
    </>
  );
};
export default DynamicTags;
