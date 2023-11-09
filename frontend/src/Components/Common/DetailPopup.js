import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
const DetailPopup = () => {
    type = type ? type : "student";
    id = id ? id : null;
    // const getDetails = async () => {
    //     if(type == "project"){

    //     }
    // };
    // useEffect(() => {
    //     getDetails();
    //   }, [type, id]);

    return (
        <Modal><ProjectDetails projectId={id}/></Modal>
    );
};