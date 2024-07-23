import { Regulations } from "@/firebase/firebaseService";

export const handleCopyUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('URLがコピーされました');
  };

export const calculatePoint = (fishName: string, fishSize: number, regulation: Regulations) => {
  let point = 0;
  const fishRegulation = regulation.fishRegulation.find((regulation) => regulation.name === fishName);
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
}

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