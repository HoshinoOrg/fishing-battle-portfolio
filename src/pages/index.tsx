import React, { useState } from "react";
import { useRouter } from "next/router";
import { formatDateInput } from "@/utils/formatDateTime";
import MainButton from "@/components/MainButton";
import SubButton from "@/components/SubButton";
import RegulationConfigDialog from "@/components/RegulationConfigDialog";
import useGroupData from "@/hooks/useGroupData";

const Index = () => {
  const {
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
    error,
  } = useGroupData();

  const [isDialogOpen, setDialogOpen] = useState(false);
  const router = useRouter();

  const handleAddMember = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const memberNameInput = (
      event.target as HTMLFormElement
    ).elements.namedItem("memberName") as HTMLInputElement;
    const memberName = memberNameInput.value.trim();
    if (memberName) {
      addMember(memberName);
      memberNameInput.value = "";
    }
  };

  const handlePostGroupData = async () => {
    try {
      const path = await postGroupData();
      if (!path) return;
      router.push(`/group/${path}`);
    } catch (error) {
      console.error("Error navigating to about: ", error);
    }
  };

  return (
    <div>
      <div>
        <label htmlFor="group-name">グループ名</label>
        <input
          id="group-name"
          className="border mt-2 border-gray-300 p-2 rounded w-full bg-gray-100"
          type="text"
          value={groupName}
          onChange={(e) => setGroupName(e.target.value)}
        />
      </div>
      {error.groupNameError && (
        <p className="text-red-500">{error.groupNameError}</p>
      )}
      <div className="mt-4">
        <label htmlFor="group-members">メンバー名</label>
        <div className="flex items-center mt-2">
          <form onSubmit={handleAddMember} className="flex items-center w-full">
            <input
              className="border  border-gray-300 p-2 rounded bg-gray-100 flex-grow "
              id="group-members"
              type="text"
              name="memberName"
            />
            <button
              className="bg-sky-500 font-semibold text-white py-2 px-4 rounded"
              type="submit"
            >
              追加
            </button>
          </form>
        </div>
      </div>
      {error.groupMembersError && (
        <p className="text-red-500">{error.groupMembersError}</p>
      )}
      <div className="flex flex-wrap mt-4 space-x-2">
        {groupMembers.map((member, index) => (
          <div
            key={index}
            className="flex items-center space-x-2 p-2 rounded-lg border-2 border-gray-300 mb-2"
          >
            <span>{member}</span>
            <button
              className="text-blacks px-2 rounded"
              onClick={() => removeMember(index)}
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <div className="flex-col items-center">
        <div>
          <label htmlFor="startDate">開始</label>
          <input
            className="border ml-2 border-gray-300 p-2 rounded bg-gray-100"
            id="startDate"
            type="datetime-local"
            value={formatDateInput(startDate)}
            onChange={(e) => setStartDate(new Date(e.target.value))}
          />
        </div>
        <div className="mt-2">
          <label htmlFor="endDate">終了</label>
          <input
            className="border ml-2 border-gray-300 p-2 rounded bg-gray-100"
            id="endDate"
            type="datetime-local"
            value={formatDateInput(endDate)}
            onChange={(e) => setEndDate(new Date(e.target.value))}
          />
        </div>
        {error.dateError && <p className="text-red-500">{error.dateError}</p>}
      </div>
      <SubButton
        text="レギュレーションの設定"
        onClick={() => setDialogOpen(true)}
      />
      <div className="flex items-center">
        <MainButton text="グループ作成" onClick={handlePostGroupData} />
      </div>
      <RegulationConfigDialog
        isDialogOpen={isDialogOpen}
        setDialogOpen={setDialogOpen}
        regulation={{
          fishRegulation: fishRegulation,
          sizeRegulation: sizeRegulation,
        }}
        handlePointChange={handlePointChange}
        handleSizePointChange={handleSizePointChange}
      />
    </div>
  );
};

export default Index;
