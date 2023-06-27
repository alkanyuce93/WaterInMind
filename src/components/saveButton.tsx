import React from "react";
import { Image, TouchableOpacity } from "react-native";

import { saveButton } from "../../assets";

type Props = {
  onPress: () => void;
};

export const SaveButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "center",
        marginTop: 20,
      }}
    >
      <Image source={saveButton} style={{ width: 60, height: 60 }} />
    </TouchableOpacity>
  );
};
