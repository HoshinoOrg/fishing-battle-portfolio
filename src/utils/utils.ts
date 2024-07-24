import { BattleData, Regulations } from "@/firebase/firebaseService";

export const handleCopyUrl = () => {
  navigator.clipboard.writeText(window.location.href);
  alert("URLがコピーされました");
};

export const calculatePoint = (
  fishName: string,
  fishSize: number,
  regulation: Regulations
) => {
  let point = 0;
  const fishRegulation = regulation.fishRegulation.find(
    (regulation) => regulation.name === fishName
  );
  const sizeRegulation = regulation.sizeRegulation.find((regulation) => {
    if (regulation.minSize && regulation.maxSize) {
      return fishSize >= regulation.minSize && fishSize < regulation.maxSize;
    } else if (regulation.minSize) {
      return fishSize >= regulation.minSize;
    } else if (regulation.maxSize) {
      return fishSize < regulation.maxSize;
    }
  });

  if (fishRegulation && sizeRegulation) {
    point = fishRegulation.point * sizeRegulation.point;
  }
  return point;
};

export const calculateTotalPoint = (
  result: BattleData["result"],
  regulation: BattleData["regulation"],
  member: string
) => {
  let totalPoint = 0;
  result.forEach((result) => {
    if (result.memberName === member) {
      totalPoint += calculatePoint(
        result.fishName,
        result.fishSize,
        regulation
      );
    }
  });
  return totalPoint;
};

export const generateRandomString = (length: number) => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isNotNullOrEmpty = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value !== "";
};

export const isNullOrEmpty = (value: string | null | undefined): boolean => {
  return value === null || value === undefined || value === "";
};

// 全ての要素が空文字かどうかをチェックする関数
export const areAllFieldsEmpty = (errors: {
  [key: string]: string;
}): boolean => {
  return Object.values(errors).every((error) => error === "");
};
