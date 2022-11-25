import { differenceInSeconds } from "date-fns";
import {
  createContext,
  ReactNode,
  useEffect,
  useReducer,
  useState,
} from "react";
import {
  ActionsTypes,
  addNewCycleAction,
  interruptCurrentCycleAction,
  markCurrentCycleAsFineshedAction,
} from "../reducers/cycles/actions";
import { Cycle, cycleReducer } from "../reducers/cycles/reducers";

interface CreateCycleData {
  task: string;
  minutesAmount: number;
}

interface CycleContextType {
  cycles: Cycle[];
  activeCycle: Cycle | undefined;
  activeCycleId: string | null;
  amountSecondsPassed: number;
  markCurrentCycleAsFineshed: () => void;
  setSecondsPassed: (seconds: number) => void;
  createNewCycle: (data: CreateCycleData) => void;
  interruptCurrentCycle: () => void;
}

export const CycleContext = createContext({} as CycleContextType);

interface CycleContextProviderProps {
  children: ReactNode;
}

export function CycleContextProvider({ children }: CycleContextProviderProps) {
  const [cyclesState, dispatch] = useReducer(
    cycleReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    () => {
      const storageStateAsJSON = localStorage.getItem(
        "@ignite-timer:cycle-state-1.0.0",
      )

      if (storageStateAsJSON) {
        return JSON.parse(storageStateAsJSON)
      }

      return {
        cycles: [],
      activeCycleId: null,
      }
    }
  );

  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);

  const [amountSecondsPassed, setAmountSecondsPassed] = useState(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }
    return 0
  })

  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState);

    localStorage.setItem('@ignite-timer:cycle-state-1.0.0', stateJSON);
  }, [cyclesState]);

  function setSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds);
  }

  function markCurrentCycleAsFineshed() {
    dispatch(markCurrentCycleAsFineshedAction());
  }

  function createNewCycle(data: CreateCycleData) {
    const id = String(new Date().getTime());

    const newCycle: Cycle = {
      id,
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    };

    dispatch(addNewCycleAction(newCycle));

    setAmountSecondsPassed(0);
  }

  function interruptCurrentCycle() {
    dispatch(interruptCurrentCycleAction());
  }

  return (
    <CycleContext.Provider
      value={{
        cycles,
        activeCycle,
        activeCycleId,
        markCurrentCycleAsFineshed,
        amountSecondsPassed,
        setSecondsPassed,
        createNewCycle,
        interruptCurrentCycle,
      }}
    >
      {children}
    </CycleContext.Provider>
  );
}
