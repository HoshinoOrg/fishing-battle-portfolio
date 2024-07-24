import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FirebaseService, { BattleData } from "@/firebase/firebaseService";
import { formatDateForShow } from "@/utils/formatDateTime";
import {
  calculatePoint,
  calculateTotalPoint,
  handleCopyUrl,
} from "@/utils/utils";
import Dialog from "@/components/Dialog";
import useBattleState, { BattleState } from "@/hooks/useBattleState";

const Path = () => {
  const router = useRouter();
  const [battleData, setBattleData] = useState<BattleData>();
  const { battleState, getCurrentBattleState } = useBattleState();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [id, setId] = useState<string>("");
  const [result, setResult] = useState<{ name: string; totalPoint: number }[]>(
    []
  );

  const navigateToNewFish = () => {
    router.push(`/group/${id}/fish/new`);
  };
  const navigateToGroupEdit = () => {
    router.push(`/group/${id}/edit`);
  };

  const removeFish = async (index: number) => {
    const firebaseService = new FirebaseService("groups");
    let pushData = {
      result: battleData?.result.filter((_, i) => i !== index),
    };

    await firebaseService.updateDocument(id, pushData); // 非同期処理を待つ
    fetchData(id);
  };
  const fetchData = async (id: string) => {
    const firebaseService = new FirebaseService("groups");
    const docs = await firebaseService.getBattleDataById(id);
    if (docs !== null) {
      // result が null でない場合、結果を配列にラップして setDocuments に渡す
      setBattleData(docs); // result を Document[] に適合させる
      let currentBattleState = getCurrentBattleState(
        docs.startDate,
        docs.endDate
      );

      if (currentBattleState == BattleState.AFTER) {
        let result: { name: string; totalPoint: number }[] = [];
        docs.groupMembers.forEach((member) => {
          result.push({
            name: member,
            totalPoint: calculateTotalPoint(
              docs.result,
              docs.regulation,
              member
            ),
          });
        });
        result.sort((a, b) => b.totalPoint - a.totalPoint);
        setResult(result);
      }
    } else {
      // result が null の場合、documents を空の配列に設定する（または適切なデフォルト値に設定）
      setBattleData(undefined);
    }
  };

  useEffect(() => {
    if (typeof router.query.id === "string") {
      const { id } = router.query;
      setId(id);
      fetchData(id);
    }
  }, [router.query.id]);

  return (
    <div>
      <div className="text-center">
        {(() => {
          switch (battleState) {
            case BattleState.BEFORE:
              return <div className="text-xl">バトル開始前！</div>;
            case BattleState.DURING:
              return <div className="text-xl">バトル中！</div>;
            case BattleState.AFTER:
              return <div className="text-xl">バトル終了！</div>;
            default:
              return <></>;
          }
        })()}

        <div className="font-bold mt-4">{battleData?.groupName}</div>
        <>
          {battleData?.groupMembers.map((member, index) => (
            <span key={index}>
              {member} {index < battleData?.groupMembers.length - 1 && ", "}
            </span>
          ))}
        </>
        <div className="mt-4">
          {formatDateForShow(battleData?.startDate)}　〜　
          {formatDateForShow(battleData?.endDate)}
        </div>
      </div>
      <div>
        <button
          className="border border-sky-300 mt-4 rounded w-full py-4 text-sky-500 font-semibold"
          onClick={() => {
            setDialogOpen(true);
          }}
        >
          レギュレーションを確認する
        </button>
      </div>
      <div>
        <button
          className="border border-gray-300 mt-4 rounded-full w-full py-4 text-gray-500 font-semibold"
          onClick={handleCopyUrl}
        >
          URLをコピー
        </button>
      </div>
      {(() => {
        switch (battleState) {
          case BattleState.BEFORE:
            return (
              battleData && (
                <BeforeTournamentUI
                  doc={battleData}
                  navigateToGroupEdit={navigateToGroupEdit}
                />
              )
            );
          case BattleState.DURING:
            return (
              <DuringTournamentUI
                navigateToNewFish={navigateToNewFish}
                removeFish={removeFish}
                doc={battleData}
              />
            );
          case BattleState.AFTER:
            return <AfterTournamentUI result={result} />;
          default:
            return <></>;
        }
      })()}
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
          {battleData?.regulation.fishRegulation.map((fish, index) => (
            <div className="flex flex-col" key={index}>
              <label>{fish.name}</label>
              <span className="border border-gray-300 p-2 rounded bg-gray-100 mb-2">
                {fish.point}
              </span>
            </div>
          ))}
        </div>
        <h2 className="font-bold mt-4">サイズボーナス</h2>
        <div className="flex flex-col">
          {battleData?.regulation.sizeRegulation.map((regu, index) => (
            <div className="flex flex-col" key={index}>
              <label>
                {regu.minSize !== undefined && `${regu.minSize}cm以上`}
                {regu.maxSize !== undefined && `${regu.maxSize}cm未満`}
              </label>
              <span className="border border-gray-300 p-2 rounded bg-gray-100 mb-2">
                {regu.point}
              </span>
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
};

interface BeforeTournamentUIProps {
  doc: BattleData;
  navigateToGroupEdit: () => void;
}
const BeforeTournamentUI: React.FC<BeforeTournamentUIProps> = ({
  doc,
  navigateToGroupEdit,
}) => {
  return (
    <div>
      <div>
        <button
          className="bg-gray-100 mt-4 rounded w-full py-4 text-gray-500 font-semibold"
          onClick={navigateToGroupEdit}
        >
          グループ編集
        </button>
      </div>
    </div>
  );
};
interface DuringTournamentUIProps {
  navigateToNewFish: () => void;
  removeFish: (index: number) => void;
  doc: BattleData | undefined;
}
const DuringTournamentUI: React.FC<DuringTournamentUIProps> = ({
  navigateToNewFish,
  removeFish,
  doc,
}) => {
  return (
    <div>
      <div>
        <button
          className="bg-sky-500 mt-8 w-full font-semibold text-white py-4 px-4 rounded"
          onClick={navigateToNewFish}
        >
          釣果を登録する
        </button>
        <div className="mt-8 ">
          {doc?.result.map((result, index) => (
            <div key={index}>
              <div className="flex-low flex justify-between  items-center ">
                <div className="flex flex-col mr-8">
                  <span className="font-bold ">{result.memberName}</span>
                  <span>{result.fishName}</span>
                  <span>{result.fishSize}cm</span>
                </div>
                <div className="flex-low flex justify-between  items-center ">
                  <div className="mr-8">
                    {calculatePoint(
                      result.fishName,
                      result.fishSize,
                      doc.regulation
                    )}
                    Point
                  </div>
                  <button onClick={() => removeFish(index)}>削除</button>
                </div>
              </div>
              <hr className="my-4" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
interface AfterTournamentUIProps {
  result: { name: string; totalPoint: number }[];
}
const AfterTournamentUI: React.FC<AfterTournamentUIProps> = ({ result }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  return (
    <div>
      <button
        onClick={() => setDialogOpen(true)}
        className="bg-sky-500 mt-8 w-full font-semibold text-white py-4 px-4 rounded"
      >
        結果を見る
      </button>
      <Dialog
        isOpen={isDialogOpen}
        onClose={() => setDialogOpen(false)}
        zIndex={10}
      >
        <div className="items-center mb-8 mx-8">
          <h2 className="font-bold">結果</h2>
          {result.map((result, index) => (
            <div className="mt-4 flex justify-between" key={index}>
              <span className="mr-8">{index + 1}位</span>
              <span className="mr-8">{result.name}</span>
              <span>{result.totalPoint} Point</span>
              <hr />
            </div>
          ))}
        </div>
      </Dialog>
    </div>
  );
};
export default Path;
