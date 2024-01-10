import React,{useState,useEffect,useRef} from 'react';
import { StyleSheet, Text, View,TouchableOpacity,SafeAreaView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Constants } from 'expo-constants';
import LottieView from 'lottie-react-native';

export default function App() {

  const [steps,setSteps] = useState(0)
  const [isWalking,setIsWalking] = useState(false)
  const [lastY,setLastY] = useState(0)
  const [lastTimeStamp,setLastTimeStamp] = useState(0)

  const animationRefRunning = useRef(null)
  const animationRefSitting = useRef(null)

  useEffect(()=>{
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometer) => {
          const {y} = accelerometer;
          const thresold = 0.1;
          const timeStamp = new Date().getTime();

          if(
            Math.abs(y-lastY) > thresold &&
            !isWalking && (timeStamp - lastTimeStamp) > 800
          ) {
            setIsWalking(true)
            setLastY(y)
            setLastTimeStamp(timeStamp)

            setSteps((prevSteps)=>prevSteps+1)

            setTimeout(() =>{
              setIsWalking(false)
            })
          }
          
        })
      }
    })
  }, [])

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});