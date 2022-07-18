import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Platform,
  Alert,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  Animated,
  FlatList,
  ScrollView,
  TextInput,
 
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {check, request, PERMISSIONS} from 'react-native-permissions';
import RNLocation from 'react-native-location';
import { artisans, jobs } from './mock';
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome' 
import MaterialIcons from 'react-native-vector-icons/MaterialIcons' 
import RBSheet from 'react-native-raw-bottom-sheet';
import { Avatar } from 'react-native-elements';
import { hp, wp } from 'src/config/variables';
import {useNavigation} from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { BASEURL } from 'src/constants/Services';
import { setLoading } from 'src/redux/actions/AuthActions';
import axios from 'axios';
import colors from 'src/config/colors';
import styled from 'styled-components/native';
import LocationInput from 'src/component/LocationInput';
import TextField from 'src/component/TextField';
import { debounce } from "debounce";
import Button from 'src/component/Button/index';
import SelectField from 'src/component/SelectField';
const { height, width } = Dimensions.get('window');
const ITEM_SIZE = width * 0.30;
const SPACER_ITEM_SIZE = (width * - ITEM_SIZE) / 2;
const JobSwiper = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const { auth } = useSelector(state => state)
  const refRBSheet = useRef();
  const [searchItem, setsearchItem] = useState('');
  const [filters, setFilter] = useState({});
  const [artisanData, setArtisanData] = useState([{key: 'left-spacer'}, ...artisans, {key: 'right-spacer'}])
  const [isFetching, setisFetching] = useState(false);
  const scrollX = useRef(new Animated.Value(0)).current;
  const defaultImage = 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1222&q=80'
  const [cordinate, setCordinate] = useState({
    longitude: 7.385256,
    latitude: 9.1322927,
    longitudeDelta: 0.05,
    latitudeDelta: 0.05,
  });
  const [Permission, setPermission] = useState(null);
  const [selectedUser, setSelectedUser] = useState({});

  const mapAnimation = new Animated.Value(0);


  const onChangeText = (key, data) => {
    setFilter({...filters, [key]: data});
  };

  const handleLocationAddress = (data, details) => {
    
    const { description } = data;
    const {
      geometry: {
        location: { lat, lng },
      },
    } = details;
    setFilter({...filters, address_str: description, longitude: lng, latitude: lat });
    
  };
  console.log('======scordinate', cordinate);
  const mapRef = useRef();

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.fitToSuppliedMarkers(artisanData.map(({ id }) => id));
    }
  }, [artisanData]);

  useEffect(() => {
    const permcheck = async () => {
      let status = null
    if (Platform.OS === 'ios' && status === 'active') {
      const permission = await request(PERMISSIONS.IOS.LOCATION_ALWAYS)
      status = permission.status

    } else {
      const permission  = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      status = permission.status
    }
      console.log('=====perm status', status);
      if (status === 'granted') {
        return getLocation();
      }
      requestLocationPermission();
    };
    permcheck();
    GetArtisan()
  }, []);

  useEffect(() => {
    if (Permission !== 'granted') {
      console.log('====isidecheck');
      return;
    }

    getLocation();
  }, [Permission]);

  

  const GetArtisan = () => {
    console.log("__Download___Aritsan_LOCATION", auth.userData)
    const {location = {}} = auth.userData
    const {coordinates = []} = location
    const longitude = coordinates[0] === null ?"0.0": coordinates[0]
    const latitude = coordinates[1] === null ? "0.0": coordinates[1]
    let uri = BASEURL + `/users/location/find?longitude=${longitude}&latitude=${latitude}`;
    
    dispatch(setLoading(true));
    axios.get(uri, 
      {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer' + ' ' + auth.token,
      },
      }).then(res => {
        const {data} = res.data
        console.log("__Download___Aritsan", data[0].user.location)
        dispatch(setLoading(false));
        setArtisanData([{key: 'left-spacer'}, ...data, {key: 'right-spacer'}]);
        const { user = {} } = data[0]
         console.log("____OBJECT_USER__", user)
         const {coordinates=[0,0]} = user.location
       setCordinate({
        longitude: coordinates[0],
        latitude: coordinates[1],
        longitudeDelta: 0.05,
        latitudeDelta: 0.05,
      })

      })
      .catch(error => {
        setisFetching(false);
        dispatch(setLoading(false));
        console.log('___ARTISAN_ERROR___', error.response);
        //dispatch(setLoading(false));
       
      });
  };


  const filterJobs = () => {
    const {latitude="", longitude = "", priority="", skill="", profession} = filters
    let uri = BASEURL + `/profiles/artisans/longitude=${longitude}&latitude=${latitude}&priority=${priority}&skill_set=${skill}&profession=${profession}`;
    const data = {
      longitude: auth.userData.location.lng,
      latitude: auth.userData.location.lat
}
     dispatch(setLoading(true));
    axios.get(uri,{
      headers: {
        "Content-Type": "application/json;charset=utf-8",
        Authorization: 'Bearer' + ' ' +auth.token,
      },
    }).then(res => {
      const {data} = res.data
        console.log("__Download___", res)
         dispatch(setLoading(false));
         setArtisanData([{key: 'left-spacer'}, ...data, {key: 'right-spacer'}]);
         const { user = {} } = data[0]
         console.log("____OBJECT_USER__", user)
         const {coordinates=[0,0]} = user.location
       setCordinate({
        longitude: coordinates[0],
        latitude: coordinates[1],
        longitudeDelta: 0.05,
        latitudeDelta: 0.05,
      })
       
      })
      .catch(error => {
        console.log('Artisan filter Get Failed because', error.response);
         dispatch(setLoading(false));
        setisFetching(false);
       
      });
  };

  const JobsSearch = () => {

    let uri = BASEURL + `/projects/find`;
    const {location = {}} = auth.userData
    const {coordinates = []} = location
    const longitude = coordinates[0] === null ?"0.0": coordinates[0]
    const latitude = coordinates[1] === null ? "0.0": coordinates[1]
    //props.setLoading(true);
    let data = {
      longitude: longitude,
      latitude: latitude,
      search: searchItem
    };
    axios.get(uri, 
     JSON.stringify(data),
      {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer' + ' ' +auth.token,
      },
    })
     
      .then(res => {
        const {data} = res.data
        console.log("__Download___", res)
         dispatch(setLoading(false));
         setArtisanData([{key: 'left-spacer'}, ...data, {key: 'right-spacer'}]);
        const { user = {} } = data[0]
        const {coordinates=[0,0]} = user.location
       setCordinate({
        longitude: coordinates[0],
        latitude: coordinates[1],
        longitudeDelta: 0.05,
        latitudeDelta: 0.05,
      })
      })
      
      .catch(error => {
        
        console.log('Artisan Search Get Failed because', error.response);
         dispatch(setLoading(false));
        
      });
  };
  const handler = useCallback(debounce(()=>JobsSearch(), 2000), []);
  useEffect(() => {
    handler()
},[searchItem])
  /*  const requestLocationPermission = async () => {
     if (Platform.OS === 'ios') {
       var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
       console.log('iPhone: ' + response);

       if (response === 'granted') {
         this.locateCurrentPosition();effect
    return () => {
      cleanup
    }
       }
     } else {
       var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
       console.log('Android: ' + response);

       if (response === 'granted') {
         locateCurrentPosition();
       }
     }
   }; */

  const requestLocationPermission = async () => {
    let status = null
    if (Platform.OS === 'ios' && status === 'active') {
      const permission = await request(PERMISSIONS.IOS.LOCATION_ALWAYS)
      status = permission.status

    } else {
      const permission  = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      status = permission.status
    }
    setPermission(status);
    //let { status } = await Location.requestPermissionsAsync();
  };

  const _handleLocationPermission = async () => {
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse"
      }
    }).then(granted => {
      if (granted) {
        setLocation_per(granted);
          const locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
            
           dispatch(setLocation(locations));
          })
        }
      })
   
  };

  const getLocation = async () => {
   
    RNLocation.requestPermission({
      ios: "whenInUse",
      android: {
        detail: "coarse"
      }
    }).then(granted => {
      if (granted) {
        setLocation_per(granted);
          const locationSubscription = RNLocation.subscribeToLocationUpdates(locations => {
            
            setCordinate(locations);
          })
        }
      })
  };

  /*  const locateCurrentPosition = () => {
    Geolocation.getCurrentPosition(
      position => {
        console.log(JSON.stringify(position));

        let initialPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          latitudeDelta: 0.09,
          longitudeDelta: 0.035,
        };

        setCordinate({initialPosition});
      },
      error => Alert.alert(error.message),
      {enableHighAccuracy: true, timeout: 10000, maximumAge: 1000},
    );
  }; */

  if (Object.keys(cordinate).length === 0) {
    return <Text>Loading...</Text>;
  }

  const RenderSearchBar = () => {
    return (
      <View style={[styles.parentContainer, styles.shadow]}>
        <View style={styles.children}>
          <Avatar
            onPress={()=> navigation.navigate('Profile')}
            rounded
            source={{
              uri: auth.userData.avatar,
            }}
          />

          <TextInput style={styles.search}>
            <Feather name="search" size={20} color='white' style={{ marginLeft: wp("2%") }} />

          </TextInput>
          <TouchableOpacity
             
              onPress={() => {
             
                refRBSheet.current.open();
              }}>
          <MaterialIcons name="tune" size={20} color={colors.green} style={{ marginLeft: wp('-10%') }}  />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const RenderMapCard = () => {
   
    return (
      <View style={styles.mapCardContainer}>
        <Animated.FlatList
          horizontal
          pagingEnabled={true}
          // scrollEnabled
          contentContainerStyle={{
            alignItems: 'center',
           // paddingHorizontal: '2.5%',
          
          }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          // snapToAlignment="center"
          snapToInterval={ITEM_SIZE}
          decelerationRate={0}
          onScroll={Animated.event(
            [{nativeEvent:{contentOffset: {x: scrollX}}}],
            {useNativeDriver: true}
          )}
          bounces={false}
          data={artisanData}
        
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item, index }) => {
            const {user={},expertise={} } = item
            if (!user.id) {
              return <View style={{width: ITEM_SIZE,  marginHorizontal: wp('3%'),}} />
            }
            const inputRange = [
              (index - 2) * ITEM_SIZE,
              (index - 1) * ITEM_SIZE,
              index * ITEM_SIZE,
             
            ];
            const translateY = scrollX.interpolate({
              inputRange,
              outputRange: [0, -30, 0]
            })
            return(
           <View style={{ width: ITEM_SIZE,}}>
              <Animated.View style={[styles.shadow, styles.cardContent, {transform:[{translateY}]}]}>
                 <TouchableOpacity onPress={()=>{
                    const { location = {} } = user
                    const {coordinates=[0,0]} = location
                   setCordinate({
                    longitude: coordinates[0],
                    latitude: coordinates[1],
                    longitudeDelta: 0.05,
                    latitudeDelta: 0.05,
                  })
                  setSelectedUser(user)
                  //  setCordinate(item.location.coordinates)
                  //  navigation.navigate("ArtisanProfile", {...item})
                   }}
                  style={{ 
                    justifyContent: 'center',
                  alignItems: 'center',
                   flex: 1,
                   paddingVertical: wp('2.5%'),
                   paddingHorizontal: wp('5%'),
                   } } >
              <Image
                source={{ uri: user.avatar || defaultImage }}
                style={styles.card_image}
              />
              <View style={styles.rating_box}>
                <FontAwesome name='star' style={[styles.rating, {color: "orange", marginRight: wp('1%')}]} />
                <Text style={styles.rating}>{user.rating||"4.5"}</Text>
              </View>
              <Text style={styles.name}>{user.first_name||user.name}</Text>
              <View>
                
              </View>
              <SkillBadge>
                    <Text
                      style={styles.profession}>
                      {`${expertise.category}`.substring(0,6)}
                    </Text>
                  </SkillBadge>
              
              <Text style={styles.distance}>{user.distance||"90M away"}</Text>
              <Text style={styles.location}>{user.city?user.city:"Lagos"}</Text>
              </TouchableOpacity>
              </Animated.View>
              </View>
            
          )}}
        />
      </View>
    );
  };

  return (
    <>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={{ flex: 1 }}
        initialRegion={cordinate}
        region={cordinate}
        zoomEnabled={true}
        showsUserLocation={true}
        // initialPosition={cordinate}
        minZoomLevel={10}>
        {artisanData.map(item => { 
           const {user} =item
           const art = user

           if (!art) {
            return null
            
           }

          return(
         
          <Marker
            onSelect={ ()=>{
              navigation.navigate("ArtisanProfile", {...art})
            }}

            // style={{width: 400, height: 400}}
            identifier={art.id}
            id={art.id}
            onPress={()=>navigation.navigate("ArtisanProfile", {...art})}
            draggable={false}
            coordinate={{
              latitude: art.location&& art.location.coordinates[1],
              longitude: art.location&& art.location.coordinates[0],
            }}
          //   image={require('src/assets/marker.png')}
          >
         
            <ImageBackground
           
              source={selectedUser.id === art.id ?require('src/assets/mark.png'):require('src/assets/location-pin.png')}
              style={{
                width: selectedUser.id === art.id ?wp('30%'): wp('21%'),
                height:selectedUser.id === art.id ? wp('30%'):wp('21%'),
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                 
              <Image
              
                source={{ uri: art.avatar }}
                style={{
                  width: selectedUser.id === art.id ?wp('17%'): wp('12%'),
                  height: selectedUser.id === art.id? wp('17%'):wp('12%'),
                  borderRadius: 100,
                  marginBottom: 10,
                  borderWidth: 1.5,
                  borderColor: '#fff',
                  shadowColor: '#7F5DF0',
                  shadowOffset: {
                    width: 0,
                    height: 10,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.5,
                  elevation: 5,
                }}
              />
             
            </ImageBackground>
           
          </Marker>
        
        )}
        
        )
        
        }
      </MapView>
      <View
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          position: 'absolute',
          width: '100%',
        }}>
        <RenderSearchBar />
      </View>
      <RenderMapCard />
      <RBSheet
        ref={refRBSheet}
        height={hp('70%')}
        animationType="slide"
        closeOnDragDown={true}
        closeOnPressMask={true}
        customStyles={{
          container: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            marginTop: 0,
          },
          wrapper: {
            backgroundColor: 'transparent',
            borderTopLeftRadius: 10,
          },
          draggableIcon: {
            backgroundColor: 'lightgrey',
            width: '30%',
            height: '11%',
          },
        }}>
        <ScrollView style={styles.filterContainer}>
          <View style={styles.filterHeader}>
            <GreenText>Filter</GreenText>

            <Button
              text="Apply"
              type="primary"
              additionalStyle={{
                button: {
                  width: wp('30%'),
                  borderRadius: 50,
                  paddingVertical: hp('1.5%'),
                  marginLeft: 'auto',
                },
                text: {fontSize: wp('3%')},
              }}
              onPress={() => {
                filterJobs()
              }}
            />
          </View>

          <LocationInput icon={
            <MaterialIcons
            name="location-pin"
            size={20}
            color={colors.medium}
            style={{marginRight: 5}}
            />}
            label={"Location"}
            handleLocationAddress={handleLocationAddress}
            placeholder={"Enter Location"}
          />

          <TextField
            placeholder={"Profession"}
            label="Profession"
            onChangeText={itemValue => onChangeText('profession', itemValue)}
          />

          <TextField
            
            label="Skill"
            placeholder={"e.g Plumber, Architect, Vet Doctor "}
            onChangeText={itemValue => onChangeText('skill', itemValue)}
          />

         

         
         
        </ScrollView>
      </RBSheet>
    </>
  );
};

export default JobSwiper;

const SkillBadge = styled.View`
  background-color: ${colors.green};
  padding-top: ${wp('1%')};
  padding-bottom: ${wp('1%')};
  padding-left: ${wp('3%')};
  padding-right: ${wp('3%')};
  border-radius: 8px;
  margin-bottom: ${wp('1%')};
 
`;
const GreenText = styled.Text`
  font-weight: 700;
  font-size: ${wp('5%')};
  color: ${colors.green};
`;


const styles = StyleSheet.create({
  parentContainer: {
    borderColor: '#32C47B',
    borderWidth: 1,
    borderRadius: 25,
    height: 50,
    width: '80%',
    position: 'absolute',
    top: 40,
    backgroundColor: '#fff',
  },
  filterContainer: {
    flex: 1,
    paddingHorizontal: wp('8%'),
  },
  filterHeader: {
    flexDirection: 'row',
    marginBottom: hp('2%'),
    alignItems: 'center',
  },
  search: {
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    height: 35,
    flexBasis: '80%',
    marginLeft: 10,
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center'
    paddingLeft: 10,
  },
  children: {
    // backgroundColor: 'blue',
    width: '100%',
    position: 'absolute',
    display: 'flex',
    margin: 8,
    // justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadow: {
    shadowColor: '#7F5DF0',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
    backgroundColor: '#fff',
  },
  mapCardContainer: {
    position: 'absolute',
    bottom: 0,
  },
  cardContent: {
   
    borderRadius: 20,
   
    marginHorizontal: wp('3%'),
    marginVertical: wp('2%'),
    display: 'flex',
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center',
    backgroundColor: '#FEFEFE',
    marginTop: hp('5%')
  },
  card_image:{
    width: wp('16.5%'),
    height: hp('12%'),
    borderRadius: 25,
    borderWidth: 2,
    borderColor: '#fff',
    marginTop: hp('-2.5%'),
    marginBottom: hp("1%")
  },
  name: {
    fontWeight: 'bold',
    fontSize: wp('3%'),
    marginBottom: wp('1%')
  },
  rating_box: {
    flexDirection: 'row',
    width: wp('10%'),
    height: wp('4%'),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: 50,
    borderColor: colors.green,
    borderWidth: 1,
    position: 'absolute',
    top: hp('9.5%')
  },
  rating: {
    fontSize: wp('2.2%'),
    fontWeight: '300',
  },
  profession:{
  
    color: '#fff',
    fontSize: wp('2%'),
    fontWeight: '500'
  },
  distance: {
    color: 'grey',
    fontSize: wp('2%'),
    fontWeight: '400'
  },
  location: {
    color: colors.green,
    fontSize: wp('2%'),
    fontWeight: '400'
  },

});
