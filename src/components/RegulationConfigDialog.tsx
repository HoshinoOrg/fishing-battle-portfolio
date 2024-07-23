import React from "react";
import Dialog from "./Dialog";
import { Regulations } from "@/firebase/firebaseService";

interface RegulationConfigDialogProps {
  isDialogOpen: boolean;
  setDialogOpen: (isOpen: boolean) => void;
  regulation: Regulations;
  handlePointChange: (index: number, value: number) => void;
  handleSizePointChange: (index: number, value: number) => void;
}

const RegulationConfigDialog: React.FC<RegulationConfigDialogProps> = ({
  isDialogOpen,
  setDialogOpen,
  regulation,
  handlePointChange,
  handleSizePointChange,
}) => {
  return (
    <div>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        zIndex={10}
      >
        <div className="items-center">
          <h2 className="font-bold">レギュレーションの設定</h2>
        </div>
        ポイント制：ポイントは魚種ポイント×サイズポイントで決まります。
        <h3 className="font-bold mt-4">魚種ポイント</h3>
        <div className="flex flex-col">
          {regulation.fishRegulation.map((fish, index) => (
            <div className="flex flex-col" key={index}>
              <label>{fish.name}</label>
              <input
                className="border border-gray-300 p-2 rounded bg-gray-100 mb-2"
                id="endDate"
                type="number"
                value={fish.point}
                onChange={(e) => {
                  handlePointChange(index, parseInt(e.target.value));
                }}
              />
            </div>
          ))}
        </div>
        <h2 className="font-bold mt-4">サイズボーナス</h2>
        <div className="flex flex-col">
          {regulation.sizeRegulation.map((regu, index) => (
            <div className="flex flex-col" key={index}>
              <label>
                {regu.minSize !== undefined && `${regu.minSize}cm以上`}
                {regu.maxSize !== undefined && `${regu.maxSize}cm未満`}
              </label>
              <input
                className="border border-gray-300 p-2 rounded bg-gray-100 mb-2"
                id="endDate"
                type="number"
                value={regu.point}
                onChange={(e) => {
                  handleSizePointChange(index, parseInt(e.target.value));
                }}
              />
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

export default RegulationConfigDialog;
