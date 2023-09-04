import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AnimatedCircular, SaveButton } from "../../components";
import { updateGoal } from "../../services/goal";

export default function Goal() {
  const queryClient = useQueryClient();

  const [defaultAmount, setDefaultAmount] = useState(false);
  const [value, setValue] = useState(0);

  const navigation = useNavigation();

  const { mutate: updateGoalMutation } = useMutation(updateGoal, {
    onSuccess: () => {
      queryClient.invalidateQueries(["goal"]);
    },
    onError: () => {
      Alert.alert("Error", "Something went wrong");
      console.log("error", Error);
    },
  });

  const showAlert = () => {
    Alert.alert("Congrats!", "Your daily goal has been entered", [
      { text: "Thanks", onPress: () => navigation.navigate("Home") },
    ]);
  };

  const goalTargetPercentage = value ? (value / 2000) * 100 : 0;

  const onRenderFill = () => {
    return (
      <View style={styles.fillContainer}>
        <Text style={styles.fillText}>{goalTargetPercentage.toFixed(0)}%</Text>
        <TouchableOpacity onPress={() => setDefaultAmount(true)}>
          <Text style={styles.fillSubText}>{value ? value : 0} / 2000 ml</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onChangeText = (text: string) => {
    const value = text === "" ? 0 : parseInt(text);

    setValue(value);
  };

  const dailyGoal = value === 0 ? 2000 : value;
  const monthlyGoal = dailyGoal * 30;
  const weeklyGoal = dailyGoal * 7;

  const onSave = async () => {
    const data = {
      id: "1",
      dailyGoal: dailyGoal,
      monthlyGoal: monthlyGoal,
      weeklyGoal: weeklyGoal,
    };
    await updateGoalMutation(data);

    showAlert();
  };

  return (
    <View style={styles.container}>
      <View style={styles.circularContainer}>
        <AnimatedCircular
          actualIntake={value}
          targetIntake={2000}
          onRenderFill={onRenderFill}
        />
      </View>
      <View style={styles.separator} />
      <View style={styles.inputContainer}>
        <TextInput
          defaultValue={defaultAmount ? "2000" : ""}
          onChangeText={onChangeText}
          placeholder="How ml Water"
          keyboardType="numeric"
          style={styles.textInput}
        />
      </View>
      <SaveButton
        onPress={() => {
          onSave();
        }}
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptionText}>
          Drinking at least 2000 ml of water daily is vital for optimal health.
          Water is crucial for regulating body temperature, lubricating joints,
          aiding digestion, and transporting nutrients. It flushes out toxins,
          enhances physical performance, prevents dehydration, supports
          metabolism, and promotes healthy skin. Stay hydrated for a healthier
          life!
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  circularContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  separator: {
    borderBottomColor: "black",
    borderBottomWidth: StyleSheet.hairlineWidth,
    width: "85%",
    alignSelf: "center",
    marginTop: 10,
  },
  inputContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  textInput: {
    width: "80%",
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 10,
    textAlign: "center",
    marginTop: "10%",
  },
  descriptionContainer: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  descriptionText: {
    fontSize: 12,
    marginTop: 10,
    textAlign: "center",
  },
  fillContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  fillText: {
    fontSize: 24,
    fontWeight: "bold",
  },
  fillSubText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#6488ea",
  },
});
