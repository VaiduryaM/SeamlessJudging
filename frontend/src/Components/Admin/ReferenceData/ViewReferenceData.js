/* eslint-disable */
import {
  DatabaseOutlined,
  DeleteOutlined,
  EditOutlined,
  EditTwoTone,
  PlusOutlined,
  PlusSquareTwoTone,
  RocketOutlined,
} from "@ant-design/icons";
import { Button, PageHeader, Table, Form, Modal } from "antd";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ErrorPage from "../../Common/ErrorPage";
import { NotificationHandler } from "../../Common/Notifications/NotificationHandler";
import Spinner from "../../Common/Spinner";
import {
  getCourseCodeColumns,
  getCourseCodeFilters,
  getJudgesFilters,
  getProjectTypeFilters,
  getScoringCategoryFilter,
  getSponsorsFilters,
  getWinnerCategoryFilter,
  getUsersFilters,
} from "../Events/Utilities/CustomFilterSetup";
import {
  addRefDataByType,
  deleteReferencedataByType,
  getRefDataByType,
  updateJudgeAccessCode,
  updateRefDataByType,
} from "../Services/AdminServices";
import { RefDataColumnDefinitions } from "./ColumnDefinitions/RefDataColumnDefinitions";
import {
  courseCodeFormComponent,
  judgeFormComponent,
  projectTypeFormComponent,
  scoringCategoryFormComponent,
  sponsersFormCompoenent,
  winnerCategoryFormComponent,
  usersFormComponent,
} from "./FormComponents/FormComponents";

const ViewReferenceData = (props) => {
  const params = useParams();
  const [editForm] = Form.useForm();
  const [addForm] = Form.useForm();

  const [showModal, setshowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refersh, setRefresh] = useState(false);
  const [data, setData] = useState();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [refDataForForms, setRefDataForForms] = useState({
    scoring_categories: [],
  });
  const [localTableFilters, setLocalTableFilter] = useState({
    sponsors: { names: [] },
    judges: { first_names: [], last_names: [], emails: [], codes: [] },
    winner_categories: { names: [] },
    scoring_categories: { names: [], scores: [] },
    project_types: { project_types: [], team_sizes: [] },
    course_code: { codes: [], names: [] },
    users: {
      first_names: [],
      last_names: [],
      middle_names: [],
      emails: [],
      roles: [],
      statuss: [],
    },
  });
  const titleNameMaps = {
    sponsor: "Sponsor",
    winner_categories: "Winner Categories",
    scoring_categories: "Scoring Categories",
    judge: "Judge",
    project_types: "Project Type",
    course_code: "Course Codes",
    user: "Users",
  };
  const [regenerateCodeDetails, setRegenerateCodeDetails] = useState({
    judgeID: null,
    isButtonClicked: false,
    eventID: null,
  });
  const regenerateCode = async () => {
    const result = await updateJudgeAccessCode(
      regenerateCodeDetails.judgeID,
      regenerateCodeDetails.eventID
    );
    if (result.status === 200) {
      setRefresh(true);
      NotificationHandler("success", "Success!", result.message);
      //setRefresh(true);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
  };
  useEffect(() => {
    if (regenerateCodeDetails.isButtonClicked) {
      regenerateCode();
      setRegenerateCodeDetails({
        ...regenerateCodeDetails,
        isButtonClicked: false,
      });
    }
  }, [regenerateCodeDetails]);
  const formOnFinish = async (values) => {
    setLoading(true);
    var id = selectedRowsByType[params.type][0];
    if(values.sponsor_id){
      id = values.sponsor_id;
    }
    if (params.type === "project_types") {
      if (
        values["scoring_categories"].length > 0 &&
        typeof values["scoring_categories"][0] === "object"
      ) {
        let sc = [];
        values["scoring_categories"].map((obj) => {
          sc.push(obj.score_category_id);
        });
        values["scoring_categories"] = sc;
      }
    }
    const result = await updateRefDataByType(
      values,
      typeNameMaps[params.type],
      id
    );
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
      setShowEditModal(false);
      setRefresh(true);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };

  const addFormFinish = async (values) => {
    setLoading(true);
    const result = await addRefDataByType(
      values,
      typeNameMaps[params.type],
      selectedRowsByType[params.type][0]
    );
    if (result.status === 200) {
      NotificationHandler("success", "Success!", result.message);
      setShowAddModal(false);
      setRefresh(true);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };
  const [imageSrc, setImageSrc] = useState("");
  const onFileChange = (e) => {
    var file = e.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImageSrc(reader.result);
      return reader.result.fileList;
    };
    // setLoading(false);
  };

  const [formComponent, setFormComponent] = useState(<Spinner />);

  const onClickAddButton = () => {
    switch (params.type) {
      case "sponsor":
        setFormComponent(
          sponsersFormCompoenent(addForm, null, addFormFinish, "ADD", onFileChange)
        );
        setShowAddModal(true);
        break;
      case "winner_categories":
        setFormComponent(
          winnerCategoryFormComponent(addForm, null, addFormFinish, "ADD")
        );
        setShowAddModal(true);
        break;
      case "scoring_categories":
        setFormComponent(
          scoringCategoryFormComponent(addForm, null, addFormFinish, "ADD")
        );
        setShowAddModal(true);
        break;
      case "judge":
        setFormComponent(
          judgeFormComponent(addForm, null, addFormFinish, "ADD")
        );
        setShowAddModal(true);
        break;
      case "project_types":
        setFormComponent(
          projectTypeFormComponent(
            addForm,
            null,
            addFormFinish,
            "ADD",
            refDataForForms
          )
        );
        setShowAddModal(true);
        break;
      case "course_code":
        setFormComponent(
          courseCodeFormComponent(addForm, null, addFormFinish, "ADD")
        );
        setShowAddModal(true);
        break;
      case "user":
        setFormComponent(
          usersFormComponent(addForm, null, addFormFinish, "ADD")
        );
        setShowAddModal(true);
        break;
    }
  };
  const onCloseAddModal = () => {
    setShowAddModal(false);
    setSelectedRowKeys([]);
    addForm.resetFields();
  };
  const onClickEditButton = () => {
    if (selectedRowsByType[params.type].length) {
      setShowEditModal(true);
    } else {
      NotificationHandler(
        "info",
        "Information!",
        "Select row(s) to proceed with the action"
      );
    }
  };
  const onCloseEditModal = () => {
    // setRefresh(true);
    setShowEditModal(false);
    setSelectedRowKeys([]);
    editForm.resetFields();
  };
  const initialSelectedRows = {
    sponsor: [],
    winner_categories: [],
    scoring_categories: [],
    judge: [],
    project_types: [],
    course_code: [],
    user: [],
  };
  const [selectedRowsByType, setSelectedRowsByType] =
    useState(initialSelectedRows);
  const typeNameMaps = {
    sponsor: "sponsor",
    winner_categories: "winner-categories",
    scoring_categories: "scoring-categories",
    judge: "judge",
    project_types: "project-type",
    course_code: "course-code",
    user: "user",
  };
  const filterTypeMapsSetting = (type, result) => {
    switch (type) {
      case "sponsor":
        const tempFilter = getSponsorsFilters(result);
        setColumns({
          ...columns,
          sponsor: RefDataColumnDefinitions("sponsors", {
            ...localTableFilters,
            sponsors: tempFilter,
          }).filter((k) => !k.hidden),
        });
        break;
      case "winner_categories":
        const winnerFilter = getWinnerCategoryFilter(result);
        setColumns({
          ...columns,
          "winner-categories": RefDataColumnDefinitions("winner_categories", {
            ...localTableFilters,
            winner_categories: winnerFilter,
          }).filter((k) => !k.hidden),
        });
        break;
      case "scoring_categories":
        const scFilter = getScoringCategoryFilter(result);
        setColumns({
          ...columns,
          "scoring-categories": RefDataColumnDefinitions("scoring_categories", {
            ...localTableFilters,
            scoring_categories: scFilter,
          }).filter((k) => !k.hidden),
        });
        break;
      case "judge":
        const jFilter = getJudgesFilters(result);
        setColumns({
          ...columns,
          judge: RefDataColumnDefinitions(
            "judges",
            {
              ...localTableFilters,
              judges: jFilter,
            },
            setRegenerateCodeDetails
          ).filter((k) => k.refdata),
        });
        break;
      case "project_types":
        const ptFilter = getProjectTypeFilters(result);
        setColumns({
          ...columns,
          "project-type": RefDataColumnDefinitions("project_types", {
            ...localTableFilters,
            project_types: ptFilter,
          }).filter((k) => !k.hidden),
        });
        break;
      case "course_code":
        const cCFilter = getCourseCodeFilters(result);
        setColumns({
          ...columns,
          "course-code": RefDataColumnDefinitions("course_code", {
            ...localTableFilters,
            course_code: cCFilter,
          }).filter((k) => !k.hidden),
        });
        break;
      case "user":
        const userFilter = getUsersFilters(result);
        setColumns({
          ...columns,
          user: RefDataColumnDefinitions("users", {
            ...localTableFilters,
            users: userFilter,
          }).filter((k) => !k.hidden),
        });
        break;
    }
  };
  const getReferenceData = async () => {
    setLoading(true);
    const result = await getRefDataByType(typeNameMaps[params.type]);
    if (params.type === "project_types") {
      const sCategoriesRefData = await getRefDataByType("scoring-categories");
      if (sCategoriesRefData.status === 200)
        setRefDataForForms({
          ...refDataForForms,
          scoring_categories: sCategoriesRefData.data,
        });
      else
        NotificationHandler(
          "failure",
          "Failed!",
          "Unable to get scoring categories info!"
        );
    }
    if (result.status === 200) {
      setData(result.data);
      filterTypeMapsSetting(params.type, result);
      setSelectedRowKeys([]);
      setSelectedRowsByType(initialSelectedRows);
    } else {
      NotificationHandler("failure", "Failed!", result.message);
    }
    setLoading(false);
  };
  const [random, setRandom] = useState(1);
  const reset = () => {
    setRandom(Math.random());
  };
  useEffect(() => {
    getReferenceData();
    reset();
  }, [params.type]);
  useEffect(() => {
    getReferenceData();
    return () => {
      setRefresh(false);
    };
  }, [refersh]);

  const [columns, setColumns] = useState({
    sponsor: RefDataColumnDefinitions("sponsors", localTableFilters).filter(
      (k) => !k.hidden
    ),
    "winner-categories": RefDataColumnDefinitions(
      "winner_categories",
      localTableFilters
    ).filter((k) => !k.hidden),
    "scoring-categories": RefDataColumnDefinitions(
      "scoring_categories",
      localTableFilters
    ).filter((k) => !k.hidden),
    judge: RefDataColumnDefinitions(
      "judges",
      localTableFilters,
      setRegenerateCodeDetails
    ).filter((k) => !k.hidden),
    "project-type": RefDataColumnDefinitions(
      "project_types",
      localTableFilters
    ).filter((k) => !k.hidden),
    "course-code": RefDataColumnDefinitions(
      "course_code",
      localTableFilters
    ).filter((k) => !k.hidden),
    user: RefDataColumnDefinitions("users", localTableFilters).filter(
      (k) => !k.hidden
    ),
  });
  const deleteSelectedRowsByType = async () => {
    setLoading(true);
    if (selectedRowsByType[params.type].length) {
      const result = await deleteReferencedataByType(
        { ids: selectedRowsByType[params.type] },
        typeNameMaps[params.type]
      );
      if (result.status === 200) {
        NotificationHandler("success", "Success!", result.message);
        setRefresh(true);
      } else {
        NotificationHandler("failure", "Failed!", result.message);
      }
    } else {
      NotificationHandler(
        "info",
        "Information!",
        "Select row(s) to proceed with the action"
      );
    }

    setLoading(false);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: (newSelectedRowKeys, selectedRows) => {
      setSelectedRowKeys(newSelectedRowKeys);
      switch (params.type) {
        case "sponsor":
          selectedRowsByType.sponsor = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType.sponsor.push(obj.sponsor_id);
            });
          setSelectedRowsByType(selectedRowsByType);
          if (selectedRows.length) {
            editForm.resetFields();
            editForm.setFieldsValue(selectedRows[0]);
            setFormComponent(
              sponsersFormCompoenent(
                editForm,
                selectedRows[0],
                formOnFinish,
                "EDIT",
                onFileChange
              )
            );
          }
          break;
        case "user":
          selectedRowsByType.user = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType.user.push(obj.user_id);
            });
          setSelectedRowsByType(selectedRowsByType);
          if (selectedRows.length) {
            editForm.resetFields();
            editForm.setFieldsValue(selectedRows[0]);
            setFormComponent(
              usersFormComponent(
                editForm,
                selectedRows[0],
                formOnFinish,
                "EDIT"
              )
            );
          }
          break;
        case "winner_categories":
          selectedRowsByType.winner_categories = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType["winner_categories"].push(
                obj.winner_category_id
              );
            });
          setSelectedRowsByType(selectedRowsByType);
          if (selectedRows.length) {
            editForm.resetFields();
            editForm.setFieldsValue(selectedRows[0]);
            setFormComponent(
              winnerCategoryFormComponent(
                editForm,
                selectedRows[0],
                formOnFinish
              )
            );
          }
          break;
        case "scoring_categories":
          selectedRowsByType.scoring_categories = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType["scoring_categories"].push(
                obj.score_category_id
              );
            });
          setSelectedRowsByType(selectedRowsByType);
          if (selectedRows.length) {
            editForm.resetFields();
            editForm.setFieldsValue(selectedRows[0]);
            setFormComponent(
              scoringCategoryFormComponent(
                editForm,
                selectedRows[0],
                formOnFinish,
                "EDIT"
              )
            );
          }
          break;
        case "judge":
          selectedRowsByType.judge = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType["judge"].push(obj.user_id);
            });
          setSelectedRowsByType(selectedRowsByType);
          if (selectedRows.length) {
            editForm.resetFields();
            editForm.setFieldsValue(selectedRows[0]);
            setFormComponent(
              judgeFormComponent(
                editForm,
                selectedRows[0],
                formOnFinish,
                "EDIT"
              )
            );
          }
          break;
        case "project_types":
          selectedRowsByType.project_types = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType["project_types"].push(obj.project_type_id);
            });
          setSelectedRowsByType(selectedRowsByType);
          if (selectedRows.length) {
            editForm.resetFields();
            editForm.setFieldsValue(selectedRows[0]);
            setFormComponent(
              projectTypeFormComponent(
                editForm,
                selectedRows[0],
                formOnFinish,
                "EDIT",
                refDataForForms
              )
            );
          }
          break;
        case "course_code":
          selectedRowsByType.project_types = [];
          selectedRows.length &&
            selectedRows.map((obj) => {
              selectedRowsByType["course_code"].push(obj.course_code_id);
            });
          setSelectedRowsByType(selectedRowsByType);
          if (selectedRows.length) {
            editForm.resetFields();
            editForm.setFieldsValue(selectedRows[0]);
            setFormComponent(
              courseCodeFormComponent(
                editForm,
                selectedRows[0],
                formOnFinish,
                "EDIT",
                refDataForForms
              )
            );
          }
          break;
      }
      //console.log(selectedRowsByType);
      // console.log(
      //   `selectedRowKeys: ${selectedRowKeys}`,
      //   "selectedRows: ",
      //   selectedRows
      // );
    },
  };

  return (
    <PageHeader
      title={titleNameMaps[params.type]}
      className="site-page-header"
      ghost={false}
      extra={[
        <Button
          key="add"
          type="primary"
          icon={<PlusOutlined />}
          size="middle"
          onClick={onClickAddButton}
        />,
        <Button
          key="edit"
          type="primary"
          icon={<EditOutlined />}
          size="middle"
          onClick={onClickEditButton}
        />,

        params.type !== "user" ? (
          <Button
            key="delete"
            type="danger"
            icon={<DeleteOutlined />}
            size="middle"
            onClick={deleteSelectedRowsByType}
          />
        ) : null,
      ]}
      avatar={{ icon: <DatabaseOutlined /> }}
    >
      {columns ? (
        <>
          {loading && <Spinner />}
          <Table
            key={random}
            bordered
            rowSelection={{
              type: "checkbox",
              ...rowSelection,
            }}
            pagination={{
              defaultPageSize: 10,
              pageSizeOptions: ["10", "20", "30", "40"],
              showSizeChanger: true,
            }}
            columns={columns[typeNameMaps[params.type]]}
            dataSource={data}
          />
          {showEditModal && selectedRowsByType[params.type] ? (
            <Modal
              title={
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "22px",
                    color: "midnightblue",
                  }}
                >
                  <EditTwoTone
                    style={{ fontSize: "22px" }}
                    twoToneColor="red"
                  />
                  &nbsp; Edit Record
                </p>
              }
              centered
              visible={showEditModal}
              onCancel={onCloseEditModal}
              footer={null}
              width="40%"
            >
              {formComponent}
            </Modal>
          ) : null}
          {showAddModal ? (
            <Modal
              title={
                <p
                  style={{
                    textAlign: "center",
                    fontSize: "22px",
                    color: "midnightblue",
                  }}
                >
                  <PlusSquareTwoTone
                    style={{ fontSize: "22px" }}
                    twoToneColor="red"
                  />
                  &nbsp; Add Record
                </p>
              }
              centered
              visible={showAddModal}
              onCancel={onCloseAddModal}
              footer={null}
              width="40%"
            >
              {formComponent}
            </Modal>
          ) : null}
        </>
      ) : (
        <ErrorPage />
      )}
    </PageHeader>
  );
};

export default ViewReferenceData;
