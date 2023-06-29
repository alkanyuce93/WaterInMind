import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

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
        width: 100,
        height: 30,
      }}
    >
      <View
        style={[
          styles.selectedArea,
          isSelected ? styles.selectedContainer : styles.unselectedContainer,
        ]}
      />
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

const styles = StyleSheet.create({
  selectedArea: {
    alignItems: "center",
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#000",
    justifyContent: "center",
  },
  selectedContainer: {
    backgroundColor: "#000",
  },
  unselectedContainer: {
    backgroundColor: "#fff",
  },
});
