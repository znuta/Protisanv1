import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import BottomTabs from "./BottomTabs";
import {
  getAllCategories,
  initUser,
  sendUserDetails,
  saveAvatar,
  saveBalance
} from "src/redux/actions/AuthActions";
import { BASEURL } from "src/constants/Services";
import {useSelector, useDispatch} from 'react-redux';

const Main = (props) => {
  const dispatch = useDispatch();
  const {auth} = useSelector(state => state);

  const GetProfile = () => {
    let uri = BASEURL + "/auth/profile";
    axios.get(uri, {
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: "Bearer" + " " + auth.token,
      },
    }) .then((res) => {
      const {data} = res.data
        dispatch(sendUserDetails(data));
      }).catch((error) => {
        
      });
  };

  return (
      <BottomTabs />
  );
}



export default Main;
