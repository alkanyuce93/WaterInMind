import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
} from "react-native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatedCircular, SaveButton } from "../../components";
import { getGoals } from "../../services";
import { updateGoal } from "../../services/goal";
import { useNavigation } from "@react-navigation/native";

export default function Goal() {
  const { data: dataGoal } = useQuery(["goal"], () => getGoals("1"));
  const queryClient = useQueryClient();

  const [defaultAmount, setDefaultAmount] = useState(false);
  const [value, setValue] = useState(0);

  const navigation = useNavigation();

  const { mutate: updateGoalMutation } = useMutation(updateGoal, {
    onSuccess: () => {
      queryClient.invalidateQueries(["goal"]);
    },
  });

  const showAlert = () => {
    Alert.alert("Congrats!", "Your daily goal has been entered", [
      { text: "Thanks", onPress: () => navigation.navigate("Home") },
    ]);
  };

  const goalTargetPercentage = (value / 2000) * 100;

  const onRenderFill = () => {
    return (
      <View style={styles.fillContainer}>
        <Text style={styles.fillText}>{goalTargetPercentage}%</Text>
        <TouchableOpacity onPress={() => setDefaultAmount(true)}>
          <Text style={styles.fillSubText}>{value} / 2000 ml</Text>
        </TouchableOpacity>
      </View>
    );
  };

  const onChangeText = (text: string) => {
    if (text === "") {
      setValue(parseInt("0"));
    }
    setValue(parseInt(text));
  };

  console.log("dataIntake", dataGoal);

  const onSave = async () => {
    const data = {
      id: "1",
      dailyGoal: value,
      monthlyGoal: value * 30,
      weeklyGoal: value * 7,
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
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Sit laborum
          numquam eum exercitationem nobis. Ea, repellendus quod quisquam nulla,
          soluta quas doloremque nesciunt, molestias illo consequatur quos
          expedita! Quisquam, mollitia.
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
    color: "blue",
  },
});
