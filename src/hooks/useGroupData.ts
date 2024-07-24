import { useState } from "react";
import { useRouter } from "next/router";
import FirebaseService from "@/firebase/firebaseService";
import { formatDateInput } from "@/utils/formatDateTime";
import {
  areAllFieldsEmpty,
  generateRandomString,
  isNullOrEmpty,
} from "@/utils/utils";
import { set } from "firebase/database";

interface initialGroupData {
  groupName: string;
  groupMembers: string[];
  startDate: string;
  endDate: string;
  regulation: {
    fishRegulation: { name: string; point: number }[];
    sizeRegulation: { maxSize?: number; minSize?: number; point: number }[];
  };
}

type GroupDaraError = {
  groupNameError: string;
  groupMembersError: string;
  dateError: string;
  regulationError: string;
};

const useGroupData = () => {
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [error, setError] = useState<GroupDaraError>({
    groupNameError: "",
    groupMembersError: "",
    dateError: "",
    regulationError: "",
  });
  const [fishRegulation, setFishRegulation] = useState<
    { name: string; point: number }[]
  >([
    { name: "シーバス", point: 1 },
    { name: "青物", point: 1 },
    { name: "タイ", point: 2 },
    { name: "フラットフィッシュ", point: 1.5 },
    { name: "その他", point: 0.5 },
  ]);
  const [sizeRegulation, setSizeRegulation] = useState<
    { maxSize?: number; minSize?: number; point: number }[]
  >([
    { maxSize: 40, point: 0.5 },
    { maxSize: 50, minSize: 40, point: 1 },
    { maxSize: 60, minSize: 50, point: 2 },
    { maxSize: 70, minSize: 60, point: 3 },
    { maxSize: 80, minSize: 70, point: 5 },
    { maxSize: 90, minSize: 80, point: 10 },
    { maxSize: 100, minSize: 90, point: 20 },
    { minSize: 100, point: 100 },
  ]);

  const addMember = (memberName: string) => {
    if (groupMembers.includes(memberName)) {
      alert("同じ名前のメンバーが既に存在します。");
    } else {
      setGroupMembers([...groupMembers, memberName]);
    }
  };

  const removeMember = (index: number) => {
    setGroupMembers(groupMembers.filter((_, i) => i !== index));
  };

  const handlePointChange = (index: number, newPoint: number) => {
    const updatedFishSpecies = fishRegulation.map((fish, i) =>
      i === index ? { ...fish, point: newPoint } : fish
    );
    setFishRegulation(updatedFishSpecies);
  };

  const handleSizePointChange = (index: number, newPoint: number) => {
    const updatedSizeRegulation = sizeRegulation.map((regu, i) =>
      i === index ? { ...regu, point: newPoint } : regu
    );
    setSizeRegulation(updatedSizeRegulation);
  };

  const postGroupData = async () => {
    let path = generateRandomString(20);
    const firebaseService = new FirebaseService("groups");
    if (startDate === undefined || endDate === undefined) {
      return alert("開始日時と終了日時を入力してください");
    }
    let addData: initialGroupData = {
      groupName: groupName,
      groupMembers: groupMembers,
      startDate: formatDateInput(startDate),
      endDate: formatDateInput(endDate),
      regulation: {
        fishRegulation: fishRegulation,
        sizeRegulation: sizeRegulation,
      },
    };

    let error = validationGroupData(addData);
    setError(error);
    if (!areAllFieldsEmpty(error)) {
      return;
    }

    try {
      let id = await firebaseService.addDocumentWithId(path, addData); // 非同期処理を待つ
      return path;
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };
  const validationGroupData = (
    initialGroupData: initialGroupData
  ): GroupDaraError => {
    let error: GroupDaraError = {
      groupNameError: "",
      groupMembersError: "",
      dateError: "",
      regulationError: "",
    };
    if (isNullOrEmpty(initialGroupData.groupName)) {
      error.groupNameError = "グループ名を入力してください";
    }
    if (
      initialGroupData.groupMembers.length === 0 ||
      initialGroupData.groupMembers[0] === ""
    ) {
      error.groupMembersError = "メンバーを追加してください";
    }
    if (
      isNullOrEmpty(initialGroupData.startDate) ||
      isNullOrEmpty(initialGroupData.endDate)
    ) {
      error.dateError = "開始日時と終了日時を入力してください";
    } else if (new Date(initialGroupData.startDate) < new Date()) {
      error.dateError = "開始日時を現在時刻より後に設定してください";
    } else if (
      new Date(initialGroupData.startDate) > new Date(initialGroupData.endDate)
    ) {
      error.dateError = "開始日時を終了日時より前に設定してください";
    }
    if (initialGroupData.regulation.fishRegulation.length === 0) {
      error.regulationError = "魚のポイントを設定してください";
    }
    if (initialGroupData.regulation.sizeRegulation.length === 0) {
      error.regulationError = "サイズのポイントを設定してください";
    }
    console.log(error);
    return error;
  };
  return {
    groupName,
    setGroupName,
    groupMembers,
    addMember,
    removeMember,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    fishRegulation,
    handlePointChange,
    sizeRegulation,
    handleSizePointChange,
    postGroupData,
    setFishRegulation,
    setSizeRegulation,
    setGroupMembers,
    error,
  };
};

export default useGroupData;
