import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

type Props = {
  isSelected: boolean;
  label: string;
  onPress: () => void;
};

export const SelectBox: React.FC<Props> = ({ isSelected, label, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 20,
      }}
    >
      <View
        style={{
          alignItems: "center",
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#000",
          justifyContent: "center",
          backgroundColor: isSelected ? "#000" : "#fff",
        }}
      ></View>
      <Text
        style={{
          color: "#000",
          fontSize: 16,
          fontWeight: "normal",
          marginTop: 10,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
};
