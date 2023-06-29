import React, { useEffect } from "react";
import { Image, View } from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { happyFace, sadFace, waterDrop } from "../../assets";

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

  useEffect(() => {
    if (!fill) {
      setFill(0);
    }
  }, [fill]);

  return (
    <View>
      <AnimatedCircularProgress
        size={300}
        width={40}
        fillLineCap="round"
        fill={fill}
        tintColor="#00e0ff"
        backgroundColor="#3d5875"
        rotation={-120}
        lineCap="round"
        arcSweepAngle={240}
      >
        {onRenderFill}
      </AnimatedCircularProgress>
      <View
        style={{
          justifyContent: "space-between",
          flexDirection: "row",
          marginTop: -50,
          marginHorizontal: 30,
        }}
      >
        <Image style={{ width: 32, height: 32 }} source={sadFace} />
        <Image style={{ width: 32, height: 32 }} source={happyFace} />
      </View>
    </View>
  );
};
