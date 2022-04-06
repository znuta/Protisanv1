/* eslint-disable react-native/no-inline-styles */
import React from 'react';
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

import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Entypo from 'react-native-vector-icons/Entypo'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import Foundation from 'react-native-vector-icons/Foundation'

import {colors, wp} from 'src/config/variables';
import TextField from 'src/component/TextField';
import TextArea from 'src/component/TextArea';
import SelectField from 'src/component/SelectField';
import {useNavigation} from '@react-navigation/native';
import styled from 'styled-components/native';
import Button from 'src/component/Button';
import { hp } from 'src/config/variables';

const SCREEN_HEIGHT = Dimensions.get('window').height;

const mock = [];

const Payment = props => {
  const {back, next} = props;
  const navigation = useNavigation();
  const {name = "", description="", type="", profession="", payment_mode="", budget="", start_date, end_date=""} = props.getState()
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
      style={{ flex: 1, backgroundColor: 'white'}}>
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
        <Text style={{color: 'white', fontWeight: 'bold', fontSize: 20}}>
          Project Summary
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
            <Text style={{color: colors.grey, fontSize: 15}}>
              Please review your project details before posting
            </Text>
            <View
              style={{
                borderWidth: StyleSheet.hairlineWidth,
                borderColor: colors.grey,
                marginVertical: 10,
              }}
            />
            <View
              style={{
                display: 'flex',
                
                justifyContent: 'space-between',
               
                paddingVertical: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  // justifyContent: 'center',
                marginBottom: hp('1%')
                }}>
                <Entypo name="list" size={18} color={colors.green} />
                <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                  Project name
                </Text>
              </View>

              <Text style={{color: 'gray', fontSize: 13}}>{name||"Fix my TV"}</Text>
            </View>

            <View
              style={{
                display: 'flex',
                // flexDirection: 'row',
                // justifyContent: 'space-between',
                // alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  // justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: hp('1%')
                }}>
                <FontAwesome
                  name="exclamation-circle"
                  size={18}
                  color={colors.green}
                />
                <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                  Project description
                </Text>
              </View>

              <Text style={{color: 'gray', fontSize: 13}}>{description ||"Fix my TV"}</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome5 name="clock" size={18} color={colors.green} />
                <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                  Project type
                </Text>
              </View>

              <Text style={{color: 'gray', fontSize: 13}}>{type||"Short term"}</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Entypo name="star" size={18} color={colors.green} />
                <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                  Project profession
                </Text>
              </View>

              <Text style={{color: 'gray', fontSize: 13}}>
                {profession||"Engineering & Science"}
              </Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <FontAwesome name="money" size={18} color={colors.green} />
                <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                  Payment mode
                </Text>
              </View>

              <Text style={{color: 'gray', fontSize: 13}}>{payment_mode||"Fixed price"}</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Foundation name="list" size={18} color={colors.green} />
                <View style={{marginHorizontal:10}}>
                 
                  <Text style={{marginLeft: 8, fontWeight: 'bold'}}>
                    Budget
                  </Text>
                </View>
              </View>

              <Text style={{color: 'gray', fontSize: 13}}>{`N${budget||"100,000.00"}`}</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="date-range"
                  size={18}
                  color={colors.green}
                />
                <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                  start date
                </Text>
              </View>

              <Text style={{color: 'gray', fontSize: 13}}>{start_date||"2021-02-02"}</Text>
            </View>

            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                paddingVertical: 10,
              }}>
              <View
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <MaterialIcons
                  name="date-range"
                  size={18}
                  color={colors.green}
                />

                <Text style={{marginLeft: 10, fontWeight: 'bold'}}>
                  end date
                </Text>
              </View>

              <Text style={{color: 'gray', fontSize: 13}}>{end_date||"2021-02-02"}</Text>
            </View>
            <View
              style={{
                backgroundColor: 'transparent',
                // height: SCREEN_HEIGHT / 3,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Button text="Next" onPress={() => next()} />
            </View>
          </ScrollView>
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
