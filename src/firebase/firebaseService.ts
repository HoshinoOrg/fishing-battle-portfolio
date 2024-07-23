import { start } from 'repl';
import { db } from './firebaseConfig';
import { collection, getDoc, getDocs, addDoc, CollectionReference, DocumentData, doc, setDoc, updateDoc } from 'firebase/firestore';

  export interface BattleConfig {
    id: string;
    groupName: string;
    groupMembers: string[];
    startDate: Date;
    endDate: Date;
    regulation: {
    fishRegulation: { name: string; point: number }[];
    sizeRegulation: { maxSize?: number; minSize?: number; point: number }[];
  };
  }

  export interface Regulations {
      fishRegulation: { name: string; point: number }[];
      sizeRegulation: { maxSize?: number; minSize?: number; point: number}[];
    }


  export interface BattleResultDoc {
    result: BattleResult[];
  }

  export interface BattleResult {
      memberName: string;
      fishName: string;
      fishSize: number;
  };
  export interface BattleData extends BattleConfig, BattleResultDoc {}

  interface initialGroupData {
    groupName: string;
    groupMembers: string[];
  }

class FirebaseService {
  private collectionRef: CollectionReference<DocumentData>;

  constructor(collectionName: string) {
    this.collectionRef = collection(db, collectionName);
  }

  // コレクションから全ドキュメントを取得する
  async getAllDocuments(): Promise<{}[]> {
    const querySnapshot = await getDocs(this.collectionRef);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  // 新しいドキュメントをコレクションに追加する
  async addDocument(docData: { [key: string]: any }): Promise<string> {
    const docRef = await addDoc(this.collectionRef, docData);
    return docRef.id;
  }

  // 新しいドキュメントをコレクションに追加する（ID指定）
  async addDocumentWithId(docId: string, docData: { [key: string]: any }): Promise<string> {
    try {
      const docRef = doc(this.collectionRef, docId);
      await setDoc(docRef, docData);
      return docRef.id;
    } catch (error) {
      throw new Error('Failed to add document');
    }
  }

  async updateDocument(docId: string, updateData: { [key: string]: any }): Promise<void> {
    try {
      const docRef = doc(this.collectionRef, docId);
      await updateDoc(docRef, updateData);
    } catch (error) {
      throw new Error('Failed to update document');
    }
  }

  async getBattleConfigById(docId: string): Promise<BattleConfig | null> {
    console.log(docId)
    const docRef = doc(this.collectionRef, docId);

    const docSnap = await getDoc(docRef);
    const data=docSnap.data()

    if (docSnap.exists()) {
        let resultData:BattleConfig = {
            id:docSnap.id,
            groupName:data?.groupName ?? "",
            groupMembers:data?.groupMembers ?? [],
            startDate:new Date(data?.startDate) ?? "",
            endDate:new Date(data?.endDate) ?? "",
            regulation:data?.regulation ?? {fishRegulation:[],sizeRegulation:[]}
        }
      return resultData;
    } else {
      // ドキュメントが存在しない場合
      return null;
    }
  }

  async getBattleResultById(docId: string): Promise<BattleResultDoc | null> {
    console.log(docId)
    const docRef = doc(this.collectionRef, docId);

    const docSnap = await getDoc(docRef);
    const data=docSnap.data()

    if (docSnap.exists()) {
        let resultData:BattleResultDoc = {
            result:data?.result ?? []
        }
      return resultData;
    } else {
      // ドキュメントが存在しない場合
      return null;
    }
  }

  async getBattleDataById(docId: string): Promise<BattleData | null> {
    console.log(docId);
    const docRef = doc(this.collectionRef, docId);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    if (docSnap.exists()) {
      let resultData: BattleData = {
        id: docSnap.id,
        groupName: data?.groupName ?? "",
        groupMembers: data?.groupMembers ?? [],
        startDate: new Date(data?.startDate) ?? "",
        endDate: new Date(data?.endDate) ?? "",
        regulation: data?.regulation ?? { fishRegulation: [], sizeRegulation: [] },
        result: data?.result ?? []
      };
      return resultData;
    } else {
      // ドキュメントが存在しない場合
      return null;
    }
  }

}

export default FirebaseService;
