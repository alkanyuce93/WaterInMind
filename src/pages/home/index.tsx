import React, { useEffect, useMemo, useRef } from "react";
import {
  Alert,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import moment from "moment";
import BottomSheet from "@gorhom/bottom-sheet";
import { useNavigation } from "@react-navigation/native";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { IntakeType, GoalType } from "../../interface/common";
import { TimeType } from "../../interface/enum";
import { CreateModal, UpdateModal } from "../../modals";
import {
  createIntake,
  deleteIntake,
  updateIntake,
} from "../../services/intake";

export default function Home() {
  const { data } = useQuery(["intakes"], getIntakes);
  const { isLoading, refetch } = useQuery(["intakes"], getIntakes);
  const { mutate: deleteIntakeMutation } = useMutation(deleteIntake, {
    onSuccess: () => {
      queryClient.invalidateQueries(["intakes"]);
    },
    onError: () => {
      Alert.alert("Error", "Something went wrong");
      console.log("error", Error);
    },
  });
  const { mutate: updateIntakeMutation } = useMutation(updateIntake, {
    onSuccess: () => {
      queryClient.invalidateQueries(["intakes"]);
    },
    onError: () => {
      Alert.alert("Error", "Something went wrong");
      console.log("error", Error);
    },
  });
  const { data: dataGoal } = useQuery(["goal"], () => getGoals("1"));

  const [selectedTimeType, setSelectedTimeType] =
    React.useState<TimeType | null>(null);
  const [openModal, setOpenModal] = React.useState(false);
  const [openCreateModal, setOpenCreateModal] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState<IntakeType | null>(
    null
  );
  const navigation = useNavigation();
  const queryClient = useQueryClient();

  const { mutate } = useMutation(createIntake, {
    onSuccess: () => {
      queryClient.invalidateQueries(["intakes"]);
    },
    onError: () => {
      Alert.alert("Error", "Something went wrong");
      console.log("error", Error);
    },
  });

  const dataIntake = data?.data as IntakeType[];
  const dataGoalData = dataGoal?.data as GoalType;
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["100%", "100%"], []);
  const [dataIntakeList, setDataIntakeList] = React.useState<IntakeType[]>();

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

  const todayData = dataIntake?.filter?.(
    (item) =>
      moment(item.createdAt).format("DD/MM/YYYY") ===
      moment().format("DD/MM/YYYY")
  );

  const thisWeekData = dataIntake?.filter(
    (item) =>
      moment(item.createdAt).format("WW/YYYY") === moment().format("WW/YYYY")
  );

  const thisMonthData = dataIntake?.filter(
    (item) =>
      moment(item.createdAt).format("MM/YYYY") === moment().format("MM/YYYY")
  );

  const showAlert = () => {
    Alert.alert("You haven't drunk water today. Please drink water.", "", [
      { text: "OK", onPress: () => setOpenCreateModal(true) },
    ]);
  };

  useEffect(() => {
    if (todayData?.length === 0) {
      showAlert();
    }
  }, []);

  const selectedDataFunction = () => {
    if (
      selectedTimeType === TimeType.Daily &&
      todayData &&
      todayData.length > 0
    ) {
      return todayData;
    } else if (selectedTimeType === TimeType.Weekly) {
      return thisWeekData;
    } else if (selectedTimeType === TimeType.Monthly) {
      return thisMonthData;
    } else {
      return dataIntake;
    }
  };

  const targetIntake = (): number => {
    if (selectedTimeType === TimeType.Weekly) {
      return dataGoalData?.weeklyGoal;
    } else if (selectedTimeType === TimeType.Monthly) {
      return dataGoalData?.monthlyGoal;
    } else {
      return dataGoalData?.dailyGoal;
    }
  };

  const actualIntake = () => {
    if (selectedTimeType === TimeType.Weekly) {
      return thisWeekData?.reduce(
        (total, item) => total + parseInt(item.amount as unknown as string),
        0
      );
    } else if (selectedTimeType === TimeType.Monthly) {
      return thisMonthData?.reduce(
        (total, item) => total + parseInt(item.amount as unknown as string),
        0
      );
    } else {
      return todayData?.reduce(
        (total, item) => total + parseInt(item.amount as unknown as string),
        0
      );
    }
  };

  useEffect(() => {
    return setDataIntakeList(actualIntake() as unknown as IntakeType[]);
  }, [actualIntake]);

  useEffect(() => {
    if (actualIntake() === 0) {
      setOpenCreateModal(true);
    }
  }, [actualIntake]);

  const onRenderFill = () => {
    const goalTargetPercentage =
      dataIntakeList && targetIntake()
        ? (
            ((dataIntakeList as unknown as number) / targetIntake()) *
            100
          ).toFixed(0)
        : 0;

    return (
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Text style={{ color: "#000", fontSize: 48, fontWeight: "bold" }}>
          {`${goalTargetPercentage}%`}
        </Text>
        <Text style={{ color: "#444", fontSize: 16, fontWeight: "bold" }}>
          {`${dataIntakeList} / ${targetIntake()} ml`}
        </Text>
      </View>
    );
  };

  const createIntakeNew = (intake: Text) => {
    mutate({
      amount: intake,
      unit: "ml",
      createdAt: new Date(),
    } as unknown as IntakeType);
    refetch();
    setOpenCreateModal(false);
  };

  const onLongPress = (id: string) => {
    const selectedItem = dataIntake?.find((item) => item.id === id);
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
              actualIntake={actualIntake()}
              targetIntake={targetIntake()}
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
              marginHorizontal: 20,
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
