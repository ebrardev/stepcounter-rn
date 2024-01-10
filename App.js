import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Accelerometer } from 'expo-sensors';
import { Constants } from 'expo-constants';
import LottieView from 'lottie-react-native';
import runningAnimation from './assets/kos.gif'; // Örnek bir koşu animasyonu
import sittingAnimation from './assets/sito.json'; // Örnek bir oturma animasyonu


const CALORIES_PER_STEP = 0.05;

export default function App() {

  const [steps, setSteps] = useState(0)
  const [isWalking, setIsWalking] = useState(false)
  const [lastY, setLastY] = useState(0)
  const [lastTimeStamp, setLastTimeStamp] = useState(0)

  const animationRefRunning = useRef(null)
  const animationRefSitting = useRef(null)

  useEffect(() => {
    let subscription;
    Accelerometer.isAvailableAsync().then((result) => {
      if (result) {
        subscription = Accelerometer.addListener((accelerometer) => {
          const { y } = accelerometer;
          const thresold = 0.1;
          const timeStamp = new Date().getTime();

          if (
            Math.abs(y - lastY) > thresold &&
            !isWalking && (timeStamp - lastTimeStamp) > 800
          ) {
            setIsWalking(true)
            setLastY(y)
            setLastTimeStamp(timeStamp)

            setSteps((prevSteps) => prevSteps + 1)

            setTimeout(() => {
              setIsWalking(false)
            }, 1200)
          }

        })
      } else {
        console.log('Accelerometer is not available on this device')
      }
    })
    return () => {
      if (subscription) {
        subscription.remove()

      }
    }
  }, [isWalking, lastY, lastTimeStamp])

  const resetSteps = () => {
    setSteps(0)
  }
  const estimatedCaloriesBurned = steps * CALORIES_PER_STEP
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Step Tracker App</Text>
      <View style={styles.infoContainer} >
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsText}>{steps}</Text>
          <Text style={styles.stepsLabel}>Steps</Text>

        </View>
        <View style={styles.caloriesContainer}>
          <Text style={styles.caloriesLabel}>Estimated Calories Burned: </Text>
          <Text style={styles.caloriesText}>
            {estimatedCaloriesBurned.toFixed(2)} cal

          </Text>

        </View>

      </View>
      <View style={styles.animationContainer}>
        {isWalking ? (
          <LottieView
            autoPlay
            ref={animationRefRunning}
            style={styles.animation}
            source={runningAnimation}
          />
        ) : (
          <LottieView
            autoPlay
            ref={animationRefSitting}
            style={styles.animation}
            source={sittingAnimation}
          />

        )}

      </View>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: 20,
  },
  stepsText: {
    fontSize: 36,
    color: '#0c7275',
    fontWeight: 'bold',
    marginRight: 8,
  },
  stepsLabel: {
    fontSize: 24,
    color: '#555',
    fontWeight: 'bold',
  },
  caloriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  caloriesLabel: {
    fontSize: 20,
    color: '#e74c3c',
    fontWeight: 'bold',
    margin: 8,
  },
  caloriesText: {
    fontSize: 20,
    color: '#555',
    fontWeight: 'bold',
  },
  animationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    elevation: 5,
  },
  animation: {
    width: 400,
    height: 400,
    backgroundColor: 'transparent',
  },
});