/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useState} from 'react';
import {StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import AnimatedMultistep from 'react-native-animated-multistep';

import Layout from 'src/constants/Layout';
import New from './new';
import Duration from './duration';
import SUmmary from './summary';
import Payment from './payment';
import DocumentPicker from 'react-native-document-picker'
import {check, request, PERMISSIONS} from 'react-native-permissions';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import colors from 'src/config/colors';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { BASEURL } from 'src/constants/Services';
import { setLoading } from 'src/redux/actions/AuthActions';

const Steps = [
  {name: 'New', component: New},
  {name: 'Duration', component: Duration},
  {name: 'summary', component: SUmmary},
  
];

const SCREEN_HEIGHT = Layout.window.height;

const IS_IPHONE_X = SCREEN_HEIGHT === 812 || SCREEN_HEIGHT === 896;
const HEADER_HEIGHT = 100;

const Auth = () => {
  const navigation = useNavigation();
  const { auth } = useSelector(state => state)
  const dispatch = useDispatch()
  useEffect(() => {
    StatusBar.setHidden(false);
  }, []);

  const onNext = () => {
    console.log('Next');
  };

  const onBack = () => {
    console.log('Back');
  };

  const finish = finalState => {
    console.log("Final_Sate", finalState);
    const callAction = async () => {
     await SendProposalToApi(finalState)
    }

    callAction()
      
  };

  const SendProposalToApi = async (payload) => {
    let uri = BASEURL + '/projects/add';
    const { longitude = "0.0", latitude = "0.0", address_str = "Ikeja", country = "Nigeria", skill_set = "", type = "Project", profession = "Software Engineer" } = payload
    console.log("___PAYLOD__",payload)
    let data = {
      ...payload,
      user_id: auth.userData.id,
      role: 'protisan',
      avatar: auth.userData.avatar || "",
      location: {
        coordinates: [
          longitude, latitude
        ]
      },
      address_str,
      country, 
      type,
      profession,
      skill_set: Array.isArray(skill_set) ? skill_set : skill_set.split(","),
     
      tags: [
        "file1", "file2"
      ]

    };
    console.log("___PAYLOD__3",data)
    dispatch(setLoading(true));
    axios.post(uri, data,{
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer' + ' ' + auth.token,
      },
    }) .then(res => {
        console.log('Proposal sent', res);
        dispatch(setLoading(false));
      navigation.navigate('Home');
        
      })
      .catch(error => {
        console.log("__ERROR_RESPONSE__",error.response);
       dispatch(setLoading(false));
       
      });
  };

  const HeaderLeft = () => {
    return (
      <TouchableOpacity
        style={{
          //marginLeft: -15,
          marginBottom: 10,
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: 'white',
        }}
        onPress={() => navigation.goBack()}>
        <MaterialIcons name="arrow-back" size={24} color="black" />
        {/* <Text style={styles.headerBack}>Wallet</Text> */}
      </TouchableOpacity>
    );
  };
  return (
    <AnimatedMultistep
      steps={Steps}
      onFinish={finish}
      onBack={onBack}
      onNext={onNext}
      comeInOnNext="fadeInRight"
      OutOnNext="fadeOutLeft"
      comeInOnBack="fadeInLeft"
      OutOnBack="fadeOutRight"
    />
  );
};

export default Auth;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.green,
    paddingTop: HEADER_HEIGHT,
  },
  contentWrapper: {
    backgroundColor: 'white',
    flex: 1,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 0,
    paddingTop: 10,
    paddingHorizontal: 20,
  },
});
