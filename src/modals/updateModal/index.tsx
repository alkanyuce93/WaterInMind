import React, { useState } from "react";
import { View, Text, Modal, Button, TextInput, StyleSheet } from "react-native";
import { IntakeType } from "../../interface/common";

type Props = {
  item: IntakeType;
  isVisible: boolean;
  onClose: () => void;
  onSave: (text: string) => void;
  onDelete: () => void;
};

export const UpdateModal: React.FC<Props> = ({
  isVisible,
  onClose,
  onSave,
  onDelete,
}) => {
  const [isUpdate, setIsUpdate] = useState(false);

  return (
    <Modal visible={isVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>Update</Text>
          <Text style={styles.content}>Enter the new amount</Text>
          {isUpdate ? (
            <View>
              <TextInput
                keyboardType="numeric"
                style={styles.input}
                placeholder="... ml"
                onChangeText={(text) => onSave(text)}
              />

              <View style={{ flexDirection: "row" }}>
                <Button
                  color={"#0A6EBD"}
                  title="Save"
                  onPress={() => {
                    setIsUpdate(false);
                    onClose();
                  }}
                />
                <Button
                  color={"#F24C3D"}
                  title="Cancel"
                  onPress={() => {
                    setIsUpdate(false);
                  }}
                />
              </View>
            </View>
          ) : (
            <>
              <Button
                color={"#6488ea"}
                title="Update"
                onPress={() => {
                  setIsUpdate(true);
                }}
              />
              <Button color={"gray"} title="Delete" onPress={onDelete} />
              <Button
                color={"#F24C3D"}
                title="Cancel"
                onPress={() => {
                  onClose();
                }}
              />
            </>
          )}
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
    fontSize: 20,
    textAlign: "center",
  },
});
