import React, { useMemo, useRef } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import { ScrollView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";

import { getGoals, getIntakes } from "../../services";
import {
  AnimatedCircular,
  ListInfoCard,
  SaveButton,
  SelectBox,
} from "../../components";
import { goalPageIcon } from "../../../assets";
import { TimeType, UsersType } from "../../interface/enum";
import { CreateModal, UpdateModal } from "../../modals";
import {
  createIntake,
  deleteIntake,
  updateIntake,
} from "../../services/intake";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function Home() {
  const { data, isLoading, refetch } = useQuery(["intakes"], getIntakes);
  const { mutate: deleteIntakeMutation } = useMutation(deleteIntake, {
    onSuccess: () => {
      queryClient.invalidateQueries(["intakes"]);
    },
  });
  const { mutate: updateIntakeMutation } = useMutation(updateIntake, {
    onSuccess: () => {
      queryClient.invalidateQueries(["intakes"]);
    },
  });
  const { data: dataGoal } = useQuery(["goal"], () => getGoals("1"));

  const [selectedTimeType, setSelectedTimeType] =
    React.useState<TimeType | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<UsersType | null>(
    null
  );
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createIntake, {
    onSuccess: () => {
      queryClient.invalidateQueries(["intakes"]);
    },
  });

  const dataUsers = data?.data as UsersType[];
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%", "100%"], []);

  const selectedButton = (type: TimeType) => {
    if (selectedTimeType === type) {
      setSelectedTimeType(null);
      return;
    }

    setSelectedTimeType(type);
  };
  const renderSelectBox = (type: TimeType, label: string) => (
    <SelectBox
      isSelected={selectedTimeType === type}
      label={label}
      onPress={() => selectedButton(type)}
    />
  );

  const todayData = dataUsers?.filter(
    (item) =>
      moment(item.createdAt).format("DD/MM/YYYY") ===
      moment().format("DD/MM/YYYY")
  );

  const thisWeekData = dataUsers?.filter(
    (item) =>
      moment(item.createdAt).format("WW/YYYY") === moment().format("WW/YYYY")
  );

  const thisMonthData = dataUsers?.filter(
    (item) =>
      moment(item.createdAt).format("MM/YYYY") === moment().format("MM/YYYY")
  );

  const selectedDataFunction = () => {
    if (selectedTimeType === TimeType.Daily) {
      return todayData;
    } else if (selectedTimeType === TimeType.Weekly) {
      return thisWeekData;
    } else if (selectedTimeType === TimeType.Monthly) {
      return thisMonthData;
    } else {
      return dataUsers;
    }
  };

  const targetIntake = dataGoal?.data?.dailyGoal as number;
  const actualIntake = todayData?.reduce(
    (acc, item) => acc + parseInt(item?.amount as unknown as string),
    0
  );

  const onRenderFill = () => {
    const goalTargetPercentage = ((actualIntake / targetIntake) * 100).toFixed(
      0
    );

    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#000", fontSize: 48, fontWeight: "bold" }}>
          {goalTargetPercentage}%
        </Text>
        <Text style={{ color: "#444", fontSize: 16, fontWeight: "bold" }}>
          {actualIntake} / {targetIntake} ml
        </Text>
      </View>
    );
  };

  const createIntakeNew = (intake: Text) => {
    mutate({
      amount: intake,
      unit: "ml",
      createdAt: new Date(),
    } as unknown as UsersType);
    refetch();
    setOpenCreateModal(false);
  };

  const onLongPress = (id: string) => {
    const selectedItem = dataUsers?.find((item) => item.id === id);
    setSelectedItem(selectedItem);
    setOpenModal(true);
  };

  const dataProvider = new DataProvider((r1, r2) => r1 !== r2);
  const layoutProvider = new LayoutProvider(
    (index) => "itemType",
    (type, dim) => {
      switch (type) {
        case "itemType":
          dim.width = 400;
          dim.height = 40;
          break;
        default:
          dim.width = 380;
          dim.height = 40;
          break;
      }
    }
  );

  return (
    <View>
      {isLoading ? (
        <View style={{ alignItems: "center", marginTop: 100 }}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Goal");
            }}
            style={{ alignItems: "flex-end", paddingTop: 48, paddingRight: 10 }}
          >
            <Image style={{ width: 36, height: 36 }} source={goalPageIcon} />
          </TouchableOpacity>
          <View style={{ alignItems: "center" }}>
            <AnimatedCircular
              actualIntake={actualIntake}
              targetIntake={targetIntake}
              onRenderFill={onRenderFill}
            />
          </View>
          <View
            style={{
              borderBottomColor: "black",
              borderBottomWidth: StyleSheet.hairlineWidth,
              width: "85%",
              alignSelf: "center",
              marginTop: 10,
            }}
          />
          <View
            style={{
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            {renderSelectBox(TimeType.Daily, "Daily")}
            {renderSelectBox(TimeType.Weekly, "Weekly")}
            {renderSelectBox(TimeType.Monthly, "Monthly")}
          </View>
          <SaveButton
            onPress={() => {
              setOpenCreateModal(true);
            }}
          />
          <View style={{ height: "30%", marginTop: 20 }}>
            <BottomSheet
              ref={bottomSheetRef}
              index={1}
              snapPoints={snapPoints}
              enableHandlePanningGesture={false}
              containerHeight={100}
              handleStyle={{
                backgroundColor: "#D4D4D8",
                borderTopRightRadius: 15,
                borderTopLeftRadius: 15,
                height: 30,
              }}
            >
              <RecyclerListView
                dataProvider={dataProvider.cloneWithRows(
                  selectedDataFunction()
                )}
                layoutProvider={layoutProvider}
                rowRenderer={(type, data) => {
                  return (
                    <ListInfoCard
                      id={data.id}
                      unit={data.unit}
                      amount={data.amount.toString()}
                      createdAt={data.createdAt.toString()}
                      onLongPress={() => {
                        onLongPress(data.id);
                      }}
                    />
                  );
                }}
              />
            </BottomSheet>
          </View>
          <UpdateModal
            item={selectedItem}
            isVisible={openModal}
            onClose={() => setOpenModal(false)}
            onSave={(text) => {
              updateIntakeMutation({
                ...selectedItem,
                amount: text,
              });
            }}
            onDelete={() => {
              deleteIntakeMutation(selectedItem?.id);
              setOpenModal(false);
            }}
          />
          <CreateModal
            isVisible={openCreateModal}
            onClose={() => setOpenCreateModal(false)}
            onSave={(text) => {
              createIntakeNew(text as unknown as Text);
            }}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
  },
});
