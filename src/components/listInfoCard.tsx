import React from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { TouchableOpacity } from "@gorhom/bottom-sheet";
import moment from "moment";

import { waterDrop } from "../../assets";

type Props = {
  id: string;
  unit: string;
  amount: string;
  createdAt: string;
  onLongPress: (id: string) => void;
};

export const ListInfoCard: React.FC<Props> = ({
  id,
  unit,
  amount,
  createdAt,
  onLongPress,
}) => {
  return (
    <TouchableOpacity
      onLongPress={() => onLongPress(id)}
      style={styles.cardStyle}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginLeft: 5,
        }}
      >
        <Image
          source={waterDrop}
          style={{
            width: 30,
            height: 30,
            borderRadius: 50 / 2,
            marginRight: 20,
          }}
        />

        <View style={{ marginRight: 5 }}>
          <Text style={{ fontSize: 12, color: "#9B9B9B" }}>
            {moment(createdAt).format("DD/MM/YYYY HH:mm")}
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginRight: 10 }}>
          {amount}
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginRight: 5 }}>
          {unit}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
    borderColor: "#9B9B9B",
    borderWidth: 1,
    marginHorizontal: 15,
    marginTop: 10,
  },
});
