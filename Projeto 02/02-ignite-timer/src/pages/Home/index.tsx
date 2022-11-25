import { HandPalm, Play } from "phosphor-react";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import {
  HomeContainer,
  StartCountdownButton,
  StopCountdownButton,
} from "./styles";
import { useContext } from "react";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import { useForm, FormProvider } from "react-hook-form";
import { CycleContext } from "../../contexts/CyclesContext";

const newCycleFormValidationsSchema = zod.object({
  task: zod.string().min(1, "Informe s tarefa"),
  minutesAmount: zod
    .number()
    .min(1, "O ciclo precisa ser no mínimo 5 minutos")
    .max(60, "O ciclo precisa ser no máximo de 60 minutos"),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationsSchema>;

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } =
    useContext(CycleContext);

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationsSchema),
    defaultValues: {
      task: "",
      minutesAmount: 0,
    },
  });

  const { handleSubmit, watch, reset } = newCycleForm;

  function handleCreateNewCycle(data: NewCycleFormData) {
    createNewCycle(data);
    reset();
  }

  const task = watch("task");
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown />

        {activeCycle ? (
          <StopCountdownButton onClick={interruptCurrentCycle} type="button">
            <HandPalm size={24} />
            Interromper
          </StopCountdownButton>
        ) : (
          <StartCountdownButton disabled={isSubmitDisabled} type="submit">
            <Play size={24} />
            Começar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  );
}
