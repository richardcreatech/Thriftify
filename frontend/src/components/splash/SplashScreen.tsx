import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Animated, Easing, Text, View } from "react-native";
import styles from "./splash.styles";

const SplashScreen = () => {
  const router = useRouter();
  const [logoAnimation] = useState(() => new Animated.Value(0));
  const [textAnimation] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const entrance = Animated.parallel([
      Animated.timing(logoAnimation, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.delay(160),
        Animated.timing(textAnimation, {
          toValue: 1,
          duration: 550,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]),
    ]);

    entrance.start(({ finished }) => {
  if (finished) {
    router.replace('/(auth)');
  }
});
    return () => entrance.stop();
  }, [logoAnimation, textAnimation, router]);

  const logoTranslate = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [32, 0],
  });

  const logoScale = logoAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [0.88, 1],
  });

  const textTranslate = textAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [22, 0],
  });

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require("../../assets/images/thriftify-logo.png")}
        style={[
          styles.logo,
          {
            opacity: logoAnimation,
            transform: [{ translateX: logoTranslate }, { scale: logoScale }],
          },
        ]}
        resizeMode="contain"
      />

      <Animated.View
        style={[
          styles.brandContainer,
          {
            opacity: textAnimation,
            transform: [{ translateX: textTranslate }],
          },
        ]}
      >
        <Text style={styles.brandName}>Thriftify</Text>

        <Text style={styles.tagline}>Discover. Shop. Enjoy.</Text>
      </Animated.View>
    </View>
  );
};

export default SplashScreen;
