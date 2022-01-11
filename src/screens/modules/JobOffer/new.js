import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  ScrollView,
  StatusBar,
  Dimensions
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Feather from 'react-native-vector-icons/Feather'
import { useNavigation } from '@react-navigation/native';
import {InputLabel, InputGroup, styles as style, styles} from './styles';
import { colors, wp, hp } from 'src/config/variables';
import TextField from 'src/component/TextField';
import TextArea from 'src/component/TextArea';
import SelectField from 'src/component/SelectField';
import Button from 'src/component/Button';
import { connect, useSelector } from 'react-redux';
import { BASEURL } from 'src/constants/Services';
import { SET_LOADING } from 'src/redux/action-types';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import LocationInput from 'src/component/LocationInput';
import Toast from 'react-native-toast-message';

const SCREEN_HEIGHT = Dimensions.get('window').height;


function ProjectApplication(props) {
  const { next } = props;
  const navigation = useNavigation();
  const {auth} = useSelector(state=>state)
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [value, setValue] = useState({});
  const {name = "", description="",skill_set, type="", profession="", payment_mode="", budget="", start_date, end_date="", address_str="", attachments=[]}= value;
  
  const onChangeText = (key, data) => {
    console.log("___VALUE__",key,data )
    setValue({ ...value, [key]: data });
   
  };
  const goNext = () => {
    props.saveState({...value})
    if (name === "" || description == "" || skill_set === "" || type === "" || profession === "" ||address_str==="",!attachments.length) {
      Toast.show({
        type: 'error',
        text1: 'Required Field',
        text2: 'Fill all required field'
      });
      return;
    
    }
    next()
}
  const _pickPortfolio = async () => {
    const {saveGovId} = props;

    try {
      let result = await launchImageLibrary({
        mediaType: 'photo',
        aspect: [4, 3],
        quality: 0.4,
        includeBase64: true,
        selectionLimit: 0
      });
      if (!result.cancelled) {
        console.log("__FILE__", result)
        const { assets = [] } = result
        const fileItems = []
        if (assets.length) {
          assets.forEach(item => {
            let name = item.fileName;
            let uri = item.uri;
            let lastIndexOf = uri.lastIndexOf(".");
            let ext = uri.substr(lastIndexOf+1, uri.length-1);
            var file = {
                name: name,
                uri: Platform.OS === 'android' ? item.uri : item.uri.replace("file://", ""),
                base64: item.base64
            };
            fileItems.push(file)
            
          })
        }
        
        setSelectedFiles(fileItems)
        console.log("__FILE__2", fileItems)
        onChangeText("attachments", fileItems)
      }

    } catch (E) {
      console.log(E);
    }
  };


  const handleLocationAddress = (data, details) => {
    
    const { description, terms =[]} = data;
    const {
      geometry: {
        location: { lat, lng },
      },
    } = details;
    console.log("LOCATION+++", details)
    console.log("LOCATION+++3", data)
    setValue({ ...value, address_str: description, longitude: lng, latitude: lat, country:terms[2].value, city:terms[1].value  });
    
  };


  const sum = input => {
    var total = 0;
    for (var i = 0; i < input.length; i++) {
      if (isNaN(input.amount)) {
        console.log(input);
        continue;
      }
      console.log(input);
      total += Number(input.amount);
    }
    console.log(total);
    return total;
  };


  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const BackButton = () => {
    return (
      <TouchableOpacity
        // style={{ paddingLeft: 10 }}
        onPress={() => navigation.goBack()}>
        <Feather name="chevron-left" size={28} color="white" />
      </TouchableOpacity>
    );
  };

  return (
    <View
      style={{  flex: 1, backgroundColor: 'white' }}>
      <StatusBar backgroundColor={colors.green} />
     
      <View
        style={{
          backgroundColor: colors.green,
          height: wp('25%'),
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
         {/* <Toast /> */}
        <BackButton />
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
          Create a Project
        </Text>
        <View />
      </View>

      <View
        style={{
          paddingHorizontal: wp('8%'),
          marginTop: -20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor: 'white',
          paddingVertical: wp('4%'),
        }}>
        
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={{ color: colors.grey, fontSize: 15 }}>
            Create a project and access top skilled protisians near you
          </Text>

          <View
            style={{
              borderWidth: StyleSheet.hairlineWidth,
              borderColor: colors.grey,
              marginVertical: 10,
            }}
          />

          
          <TextField
            value={name}
            label="Choose a name for your project"
            placeholder="E.g Fix my TV"
            onChangeText={itemValue => onChangeText('name', itemValue)}
          />

          
          <TextArea
            value={description}
            label="Tell us more about your project"
            placeholder="Describe your project here"
            onChangeText={itemValue => onChangeText('description', itemValue)}
          />
          <Text
            style={{
              color: colors.green,
              textAlign: 'right',
              fontWeight: '700',
              fontSize: 14,
            }}>
            1000 characters remaining
          </Text>

          <TouchableOpacity
        style={{flexDirection: 'row', marginVertical: hp('1%')}}
        onPress={_pickPortfolio}>
        <View style={styles.circle}>
          <MaterialCommunityIcons name="plus" style={styles.white_plus} />
        </View>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text style={styles.portfolio_text}>
            <InputLabel>Attachments</InputLabel>{selectedFiles.length? ` (${selectedFiles.length} files selected)`:" (upload attachment of your work)"}
          </Text>
        </View>
      </TouchableOpacity>

         
          <SelectField
             value={type}
             label="Project type"
             items={[
               {label: 'Short Term', value: 'Short Term'},
               {label: 'Long Term', value: 'Long Term'},
               
             ]}
            onChangeText={itemValue => {
              onChangeText('type', itemValue)
            }}
          />

         
          <SelectField
            value={profession}
             label="Profession"
             items={[
               {label: 'Software Engineer', value: 'Software Engineer'},
               {label: 'Doctor', value: 'Doctor'},
               {label: 'Teacher', value: 'Teacher'},
               {label: 'Acountant', value: 'Acountant'},
               {label: 'Psychologist', value: 'Psychologist'},
             ]}
            onChangeText={itemValue => {
              onChangeText('profession', itemValue)
            }}
          />

         
          <TextField 
            value={skill_set}
        label="Skill set"
        placeholder="E.g DevOps, Painter, Photographer"
            onChangeText={itemValue => {
              onChangeText('skill_set', itemValue)
            }} />
          <LocationInput
          label="Location"
          placeholder="E.g Enter address"
          handleLocationAddress={handleLocationAddress}
          />
 
          <View
            style={{
              height: hp('30%'),
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: hp('3%')
            }}>
            <Button text="Next" onPress={() => {goNext()}} />
          </View>
        </ScrollView>
        <Toast style={{position: 'absolute'}} />
      </View>
    </View>
  );
}


export default ProjectApplication;
