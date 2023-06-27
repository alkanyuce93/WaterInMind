import React, { useState } from "react";
import { View, Text, Modal, Button, TextInput, StyleSheet } from "react-native";

type Props = {
  isVisible: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
};

export const CreateModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onSave,
}) => {
  const [text, setText] = useState("");
  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Create Intake</Text>
          <Text style={styles.content}>Enter the Intake</Text>

          <View>
            <TextInput
              keyboardType="numeric"
              style={styles.input}
              onChangeText={(text) => setText(text)}
            />
            <View style={{ flexDirection: "row" }}>
              <Button
                color={"#0A6EBD"}
                title="Save"
                onPress={() => {
                  onSave(text);
                  onClose();
                }}
              />
              <Button
                color={"#F24C3D"}
                title="Cancel"
                onPress={() => {
                  onClose();
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderColor: "#43a",
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  content: {
    fontSize: 16,
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 4,
    marginBottom: 16,
  },
});
