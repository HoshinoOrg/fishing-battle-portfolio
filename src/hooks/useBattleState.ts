import { useState } from "react";

export const BattleState = {
  BEFORE: "BEFORE",
  DURING: "DURING",
  AFTER: "AFTER",
  UNKNOWN: "UNKNOWN",
};

const useBattleState = (initialState = BattleState.UNKNOWN) => {
  const [battleState, setBattleState] = useState(initialState);

  const getCurrentBattleState = (startDate: Date, endDate: Date) => {
    const currentDate = new Date();
    let state = BattleState.UNKNOWN;
    console.log(currentDate, startDate, endDate);
    if (currentDate < startDate) {
      state = BattleState.BEFORE;
    } else if (currentDate >= startDate && currentDate <= endDate) {
      state = BattleState.DURING;
    } else if (endDate <= currentDate) {
      state = BattleState.AFTER;
    }
    setBattleState(state);
    return state;
  };

  return { battleState, getCurrentBattleState };
};

export default useBattleState;
