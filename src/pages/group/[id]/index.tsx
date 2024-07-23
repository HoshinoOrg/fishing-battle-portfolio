import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import FirebaseService, { BattleData } from "@/firebase/firebaseService";
import { formatDateForShow } from "@/utils/formatDateTime";
import { calculatePoint, handleCopyUrl } from "@/utils/utils";
import Dialog from "@/components/Dialog";

const BattleState = {
  BEFORE: "BEFORE",
  DURING: "DURING",
  AFTER: "AFTER",
  UNKNOWN: "UNKNOWN",
};

const Path = () => {
  const router = useRouter();
  const [battleData, setBattleData] = useState<BattleData>();
  const [battleState, setBattleState] = useState(BattleState.UNKNOWN);
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [id, setId] = useState<string>();
  const [result, setResult] = useState<{ name: string; totalPoint: number }[]>(
    []
  );

  const navigateToNewFish = () => {
    console.log("navigateToNewFish");
    router.push(`/group/${id}/fish/new`);
  };

  const getCurrentBattleState = (startDate: Date, endDate: Date) => {
    const currentDate = new Date();
    console.log(currentDate, startDate, endDate);
    if (currentDate < startDate) {
      return BattleState.BEFORE;
    } else if (currentDate >= startDate && currentDate <= endDate) {
      return BattleState.DURING;
    } else if (endDate <= currentDate) {
      return BattleState.AFTER;
    } else {
      return BattleState.UNKNOWN;
    }
  };

  const calculateTotalPoint = (
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

  useEffect(() => {
    if (typeof router.query.id === "string") {
      const firebaseService = new FirebaseService("groups");
      const { id } = router.query;
      setId(id);
      const fetchData = async () => {
        const docs = await firebaseService.getBattleDataById(id as string);
        if (docs !== null) {
          // result が null でない場合、結果を配列にラップして setDocuments に渡す
          setBattleData(docs); // result を Document[] に適合させる
          let battleState = getCurrentBattleState(docs.startDate, docs.endDate);
          setBattleState(battleState);
          if (battleState == BattleState.AFTER) {
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

      fetchData();
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
            return battleData && <BeforeTournamentUI doc={battleData} />;
          case BattleState.DURING:
            return (
              <DuringTournamentUI
                navigateToNewFish={navigateToNewFish}
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
}
const BeforeTournamentUI: React.FC<BeforeTournamentUIProps> = ({ doc }) => {
  return (
    <div>
      <div>
        <button
          className="bg-gray-100 mt-4 rounded w-full py-4 text-gray-500 font-semibold"
          onClick={() => {}}
        >
          グループ編集
        </button>
      </div>
    </div>
  );
};
interface DuringTournamentUIProps {
  navigateToNewFish: () => void;
  doc: BattleData | undefined;
}
const DuringTournamentUI: React.FC<DuringTournamentUIProps> = ({
  navigateToNewFish,
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
                  <button>編集</button>
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
        <div className="items-center">
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
