import React from 'react';
import { View, StatusBar } from 'react-native';
import JobSwiper from './JobSwiper';

function Home(props) {
  return <>
    <StatusBar translucent={true} backgroundColor="transparent" />
    <JobSwiper />

  </>;
  
}

export default Home;
