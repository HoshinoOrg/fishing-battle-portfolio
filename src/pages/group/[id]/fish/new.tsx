import MainButton from "@/components/MainButton";
import FirebaseService, {
  BattleConfig,
  BattleResult,
} from "@/firebase/firebaseService";
import { get } from "http";
import { useRouter } from "next/router";
import React, { useEffect, useRef, useState } from "react";

const New = () => {
  const router = useRouter();
  const [documents, setDocuments] = useState<BattleConfig>();
  const memberRef = useRef<HTMLSelectElement>(null);
  const fishRef = useRef<HTMLSelectElement>(null);
  const sizeRef = useRef<HTMLInputElement>(null);

  const [id, setId] = useState<string>("");

  const registerFish = async () => {
    const firebaseService = new FirebaseService("groups");

    let addData: BattleResult = {
      memberName: memberRef.current?.value ?? "",
      fishSize: sizeRef.current?.value ? parseInt(sizeRef.current?.value) : 0,
      fishName: fishRef.current?.value ?? "",
    };
    console.log(addData);
    try {
      let nowData = await firebaseService.getBattleResultById(id);
      let pushData;
      if (nowData === null) {
        pushData = { result: [addData] };
      } else {
        nowData.result.push(addData);
        pushData = nowData;
      }
      await firebaseService.updateDocument(id, pushData); // 非同期処理を待つ
      router.push(`/group/${id}`);
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const goBack = () => {
    router.back();
  };

  useEffect(() => {
    if (typeof router.query.id === "string") {
      const firebaseService = new FirebaseService("groups");
      const { id } = router.query;
      setId(id);
      const fetchData = async () => {
        const docs = await firebaseService.getBattleConfigById(id as string);
        if (docs !== null) {
          // result が null でない場合、結果を配列にラップして setDocuments に渡す
          setDocuments(docs); // result を Document[] に適合させる
        } else {
          // result が null の場合、documents を空の配列に設定する（または適切なデフォルト値に設定）
          setDocuments(undefined);
        }
      };

      fetchData();
    }
  }, [router.query.id]);

  return (
    <div>
      <div>
        <label>誰が？</label>
        <select
          id="member"
          ref={memberRef}
          className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
        >
          {documents?.groupMembers.map((member) => (
            <option value={member}>{member}</option>
          ))}
        </select>
      </div>
      <div className="mt-4 flex flex-col">
        <label>なんセンチ？</label>
        <input
          id="size"
          className="border border-gray-300 p-2 rounded bg-gray-100 mb-2"
          type="number"
          ref={sizeRef}
        />
      </div>
      <div className="mt-4">
        <label>何を釣った？</label>
        <select
          id="fish"
          ref={fishRef}
          className="border border-gray-300 p-2 rounded bg-gray-100 w-full"
        >
          {documents?.regulation.fishRegulation.map((fish) => (
            <option value={fish.name}>{fish.name}</option>
          ))}
        </select>
      </div>
      <MainButton text="登録" onClick={registerFish} />
      <button
        className="bg-gray-100 mt-4 rounded w-full py-4 text-gray-500 font-semibold"
        onClick={goBack}
      >
        戻る
      </button>
    </div>
  );
};

export default New;
