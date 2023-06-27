import React, { useEffect } from "react";
import { View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";

type Props = {
  actualIntake: number;
  targetIntake: number;
  isUpdate?: boolean;
  onRenderFill?: () => JSX.Element;
};

export const AnimatedCircular: React.FC<Props> = ({
  actualIntake,
  targetIntake,
  isUpdate,
  onRenderFill,
}) => {
  const [fill, setFill] = React.useState(0);

  useEffect(() => {
    const fillValue = (actualIntake / targetIntake) * 100;

    if (isUpdate) {
      setFill(fillValue);
    }

    setFill(fillValue);
  }, [actualIntake, targetIntake, isUpdate]);

  return (
    <View>
      <AnimatedCircularProgress
        size={300}
        width={40}
        fillLineCap="round"
        fill={fill}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        rotation={0}
        lineCap="round"
      >
        {onRenderFill}
      </AnimatedCircularProgress>
    </View>
  );
};
