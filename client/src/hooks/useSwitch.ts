// Imports main functionality
import { useReducer } from "react";

export const ACTIONS = {
  SWITCH_ON: "SWITCH_ON",
  SWITCH_OFF: "SWITCH_OFF",
} as const;

type Action = {
  type: keyof typeof ACTIONS;
};

export type SwitchReducer = (state: boolean, action: Action) => boolean;
export const defaultReducer: SwitchReducer = (state, action) => {
  switch (action.type) {
    case "SWITCH_ON":
      return true;
    case "SWITCH_OFF":
      return false;
    default:
      return state;
  }
};

export const useSwitch = (initialState = false, reducer = defaultReducer) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const switchOff = dispatch.bind(null, { type: "SWITCH_OFF" });
  const switchOn = dispatch.bind(null, { type: "SWITCH_ON" });

  return {
    isTurnedOn: state,
    switchOff,
    switchOn,
  };
};
