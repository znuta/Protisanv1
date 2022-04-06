import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Feather from 'react-native-vector-icons/Feather'
import { colors, wp } from 'src/config/variables';
import TextField from 'src/component/TextField';
import TextArea from 'src/component/TextArea';
import SelectField from 'src/component/SelectField';
import { useNavigation } from '@react-navigation/native';
import styled from 'styled-components/native';
import Button from 'src/component/Button';
import Toast from 'react-native-toast-message';
import DataTimeField from 'src/component/DataTimeField';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const Payment = props => {
  const { back, next } = props;
  const navigation = useNavigation();
  const [value, setValue] = useState({});
  const {  payment_mode="", budget="", start_date="", end_date="" } = value;
  
  const onChangeText = (key, data) => {
    console.log("___VALUE__",key,data )
    setValue({ ...value, [key]: data });
    props.saveState({...props.getState(),...value})
  };
  const BackButton = () => {
    return (
      <TouchableOpacity
        // style={{ paddingLeft: 10 }}
        onPress={() => back()}>
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
          height: wp('35%'),
          justifyContent: 'space-between',
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 10,
        }}>
        <BackButton />
        <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 20 }}>
          Create a Project
        </Text>
        <View />
      </View>
      <View
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: wp('8%'),
          marginTop: -20,
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
          backgroundColor: 'white',
          paddingVertical: wp('4%'),
        }}>
        <View>
          {/* viewwwww */}
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={{ color: colors.grey, fontSize: 15 }}>
              Provide more information about the project timeline and milestone
            </Text>

            <View
              style={{
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.grey,
                marginVertical: 10,
              }}
            />
           
           <TextField
            value={payment_mode}
            label="Payment mode"
            placeholder="E.g Card/Wallet or Cash"
            onChangeText={itemValue => onChangeText('payment_mode', itemValue)}
          />

            {/* <SelectField
              value={payment_mode}
              label="Payment mode"
              onValueChange={itemValue => onChangeText('payment_mode', itemValue)}
              items={[
                {label: 'Card/Wallet', value: 'Card/Wallet'},
                {label: 'Cash', value: 'Cash'},
                
              ]}
            /> */}

            <Text>Project budget</Text>
            <View style={styles.inputContainer}>
              <View style={styles.nairaStyle}>
                <Text style={{ fontWeight: 'bold', fontSize: wp('7%') }}>N</Text>
              </View>
              <BudgetField>
                <TextInput
                  placeholder="Amount"
                  style={[styles.BudgetField]}
                  keyboardType="phone-pad"
                  onChangeText={itemValue => onChangeText('budget', itemValue)}
                />
              </BudgetField>
            </View>

            <View
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                width: '100%',
                flexDirection: 'row',
              }}>

<         DataTimeField
            // style={{ width: 100 }}
            duration={150}
            date={start_date}
            label="Project start date"
            placeholder="select date"
            setDate={value => onChangeText('start_date', value)}
          />

          {/* ios stop date */}
          <DataTimeField
            // style={{ width: 100 }}
            duration={150}
            date={end_date}
            label="Project end date"
            placeholder="select date"
            setDate={value => onChangeText('end_date', value)}
          />
              {/* <View style={{ flex: 0.45 }}>
                <Text>Project start date</Text>
                <View style={[styles.inputContainer]}>
                  <View style={styles.nairaStyle}>
                    <FontAwesome name="calendar" size={20} color="gray" />
                  </View>
                  <InputField>
                    <TextInput
                      onChangeText={itemValue => onChangeText('start_date', itemValue)}
                      placeholder="2021-02-02"
                      style={[styles.inputField]}
                      keyboardType="phone-pad"
                    />
                  </InputField>
                </View>
              </View>
              <View style={{ flex: 0.45 }}>
                <Text>Project end date</Text>
                <View style={[styles.inputContainer]}>
                  <View style={styles.nairaStyle}>
                    <FontAwesome name="calendar" size={20} color="gray" />
                  </View>
                  <InputField>
                    <TextInput
                      onChangeText={itemValue => onChangeText('end_date', itemValue)}
                      placeholder="2021-02-02"
                      style={[styles.inputField]}
                      keyboardType="phone-pad"
                    />
                  </InputField>
                </View>
              </View> */}
            </View>
            <View
            style={{
              height: SCREEN_HEIGHT / 3,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Button text="Next" onPress={() => {
              if (payment_mode=="" || budget=="" || start_date=="" || end_date=="") {
                Toast.show({
                  type: 'error',
                  text1: 'Required Field',
                  text2: 'Fill all required field'
                });
                return;
              
              }
              next()
            }} />
          </View>
          </ScrollView>
          <Toast style={{position: 'absolute'}} />
         
        </View>
      </View>
    </View>
  );
};

export default Payment;

const InputField = styled.View`
  width: 70%;
  background-color: #f2f3f4;
  border-top-right-radius: 50;
  border-bottom-right-radius: 50;
  flex-direction: row;
  padding-horizontal: ${wp('3%')};
  height: ${wp('12%')};
  align-items: center;
  margin-bottom: ${wp('3%')};
`;

const BudgetField = styled.View`
  width: 88%;
  background-color: #f2f3f4;
  border-top-right-radius: 50;
  border-bottom-right-radius: 50;
  flex-direction: row;
  padding-horizontal: ${wp('3%')};
  height: ${wp('12%')};
  align-items: center;
  margin-bottom: ${wp('3%')};
`;
const styles = StyleSheet.create({
  nairaStyle: {
    backgroundColor: '#f2f3f4',
    width: wp(10),
    height: wp('12%'),
    borderBottomLeftRadius: 50,
    borderTopLeftRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: StyleSheet.hairlineWidth,
    borderColor: '#8492a6',
    marginBottom: wp('3%'),
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: wp('3%'),
  },
});
