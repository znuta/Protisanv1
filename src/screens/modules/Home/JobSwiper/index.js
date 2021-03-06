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
  ScrollView
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

const JobSwiper = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch()
  const { auth } = useSelector(state => state)
  const refRBSheet = useRef();
  const [searchItem, setsearchItem] = useState('');
  const [filters, setFilter] = useState({});
  const [artisanData, setArtisanData] = useState([...artisans])
  const [isFetching, setisFetching] = useState(false);
  const { height, width } = Dimensions.get('window');
  const [cordinate, setCordinate] = useState({
    longitude: 7.385256,
    latitude: 9.1322927,
    longitudeDelta: 0.05,
    latitudeDelta: 0.05,
  });
  const [Permission, setPermission] = useState(null);

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
    console.log("__Download___Aritsan_LOCATION", auth.userData.location.coordinates[0])
    let uri = BASEURL + `/users/location/find?longitude=${auth.userData.location.coordinates[0]}&latitude=${auth.userData.location.coordinates[1]}`;
    
    dispatch(setLoading(true));
    axios.get(uri, 
      {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        Authorization: 'Bearer' + ' ' + auth.token,
      },
      }).then(res => {
        const {data} = res.data
        console.log("__Download___Aritsan", res)
        dispatch(setLoading(false));
        setArtisanData(data);
        const { location = {} } = data[0]
        const {coordinates=[0,0]} = location
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
    let uri = BASEURL + `/projects/filter/longitude=${longitude}&latitude=${latitude}&priority=${priority}&skill_set=${skill}&profession=${profession}`;
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
         setArtisanData(data);
        const { location = {} } = data[0]
        const {coordinates=[0,0]} = location
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

    //props.setLoading(true);
    let data = {
      longitude: auth.userData.location.lng,
      latitude: auth.userData.location.lat,
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
         setArtisanData(data);
        const { location = {} } = data[0]
        const {coordinates=[0,0]} = location
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
              uri: 'https://images.unsplash.com/photo-1566753323558-f4e0952af115?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1222&q=80',
            }}
          />

          <TouchableOpacity style={styles.search}>
            <Feather name="search" size={20} color='white' style={{ marginLeft: wp("2%") }} />

          </TouchableOpacity>
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
        <FlatList
          horizontal
          pagingEnabled
          scrollEnabled
          contentContainerStyle={{
            justifyContent: 'center',
            paddingHorizontal: '5%',
          }}
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={32}
          snapToAlignment="center"
          data={artisanData}
          bounces={false}
          keyExtractor={(item, index) => `${index}`}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={()=>navigation.navigate("ArtisanProfile", {...item}) } style={[styles.shadow, styles.cardContent]}>
              <Image
                source={{ uri: item.image_url }}
                style={styles.card_image}
              />
              <View style={styles.rating_box}>
                <FontAwesome name='star' style={[styles.rating, {color: "orange", marginRight: wp('1%')}]} />
                <Text style={styles.rating}>4.5</Text>
              </View>
              <Text style={styles.name}>{item.first_name||item.name}</Text>
              <View>
                
              </View>
              <SkillBadge>
                    <Text
                      style={styles.profession}>
                      {item.profession || "Doctor"}
                    </Text>
                  </SkillBadge>
              
              <Text style={styles.distance}>{item.distance||"90M away"}</Text>
              <Text style={styles.location}>{item.address_str?item.address_str.split(',')[1]:"Lagos"}</Text>
            </TouchableOpacity>
          )}
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
        {artisanData.map(art => (
          <Marker
            onSelect={ ()=>{}}
            style={{width: 400, height: 400}}
            identifier={art.id}
            id={art.id}
            draggable={false}
            coordinate={{
              latitude: art.location&& art.location.coordinates[1],
              longitude: art.location&& art.location.coordinates[0],
            }}
          //   image={require('src/assets/marker.png')}
          >
           
            <ImageBackground
              source={require('src/assets/mark.png')}
              style={{
                width: 50,
                height: 50,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                source={{ uri: art.image_url }}
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
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
        ))}
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

          {/* <SelectField
            value={''}
            label="Location"
            items={[
              {label: 'Junior WAEC', value: 'Junior WAEC'},
              {label: 'WAEC', value: 'WAEC'},
              {label: 'B.Sc', value: 'Bachelor of Science'},
              {label: 'Masters', value: 'Masters'},
              {label: 'PhD', value: 'Doctor of Philosophy'},
            ]}
            onChangeText={itemValue => onChangeText('degree', itemValue)}
          />

          <SelectField
            value={''}
            label="Distance"
            items={[
              {label: 'Junior WAEC', value: 'Junior WAEC'},
              {label: 'WAEC', value: 'WAEC'},
              {label: 'B.Sc', value: 'Bachelor of Science'},
              {label: 'Masters', value: 'Masters'},
              {label: 'PhD', value: 'Doctor of Philosophy'},
            ]}
            onChangeText={itemValue => onChangeText('degree', itemValue)}
          /> */}

          <SelectField
            value={''}
            label="Urgency"
            items={[
              {label: 'Junior WAEC', value: 'Junior WAEC'},
              {label: 'WAEC', value: 'WAEC'},
              {label: 'B.Sc', value: 'Bachelor of Science'},
              {label: 'Masters', value: 'Masters'},
              {label: 'PhD', value: 'Doctor of Philosophy'},
            ]}
            onChangeText={itemValue => onChangeText('priority', itemValue)}
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

  search: {
    backgroundColor: '#E8E8E8',
    borderRadius: 25,
    height: 35,
    flexBasis: '80%',
    marginLeft: 10,
    display: 'flex',
    justifyContent: 'center',
    // alignItems: 'center'
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
    bottom: 20,
  },
  cardContent: {
    borderRadius: 20,
    paddingVertical: wp('2.5%'),
    paddingHorizontal: wp('5%'),
    marginHorizontal: wp('2.5%'),
    marginVertical: wp('5%'),
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
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
