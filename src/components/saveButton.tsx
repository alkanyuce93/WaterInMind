import React, { useEffect, useRef } from "react";
import { TouchableOpacity, Animated, Easing } from "react-native";

import { saveButton } from "../../assets";

type Props = {
  onPress: () => void;
};

export const SaveButton: React.FC<Props> = ({ onPress }) => {
  const opacityValue = useRef(new Animated.Value(0)).current;

  const startAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 750,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  useEffect(() => {
    startAnimation();
  }, []);

  const interpolatedOpacity = opacityValue.interpolate({
    inputRange: [0.001, 10],
    outputRange: [0.001, 10],
  });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <Animated.Image
        source={saveButton}
        style={{ width: 80, height: 60, opacity: interpolatedOpacity }}
      />
      <Animated.Text
        style={{
          fontSize: 16,
          fontWeight: "bold",
          opacity: interpolatedOpacity,
        }}
      >
        Save
      </Animated.Text>
    </TouchableOpacity>
  );
};
