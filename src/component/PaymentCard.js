import React from "react";
import { View, Text, Image } from "react-native";
import styled from "styled-components";
import colors from "../config/colors";
import Colors from "../constants/Colors";

export default function PaymentCard() {
  return (
    <CardItemWrap>
      <CardBody>
        <CardDescription>
          <CardTitle>Payment for Mobile App</CardTitle>
          <CardMeta>August 19, 2020 &bull; 10:37 AM</CardMeta>
        </CardDescription>
      </CardBody>
      <CardAmount>+ &#8358; 50000</CardAmount>
    </CardItemWrap>
  );
}

const CardItemWrap = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin-bottom: 35px;
`;

const CardBody = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
`;

const CardImage = styled.View`
  height: 50px;
  width: 50px;
  background-color: #f3f3f3;
  border-radius: 10px;
`;

const CardDescription = styled.View`
  flex: 1;
  margin-left: 10px;
  padding-right: 10px;
`;

const CardTitle = styled.Text`
  font-size: 15px;
  font-weight: 600;
  line-height: 20px;
  margin-bottom: 3px;
`;

const CardMeta = styled.Text`
  font-size: 13px;
  color: ${Colors.mutedText};
  line-height: 18px;
`;

const CardAmount = styled.Text`
  font-size: 15px;
  font-weight: 500;
  color: ${colors.green};
`;
