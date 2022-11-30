import { SumaryCard, SumaryContainer } from "./styles";
import { ArrowCircleDown, ArrowCircleUp, CurrencyDollar } from "phosphor-react";
import { TransactionsContext } from "../../contexts/TransactionsContext";
import { useContext } from "react";
import { priceFormatter } from "../../utils/Formatter";
import { useSummary } from "../../hooks/useSummary";

export function Summary() {
  const summary = useSummary()
  return (
    <SumaryContainer>
      <SumaryCard>
        <header>
          <span>Entardas</span>
          <ArrowCircleUp size={32} color="#00b37e" />
        </header>

        <strong> {priceFormatter.format(summary.income)} </strong>
      </SumaryCard>

      <SumaryCard>
        <header>
          <span>Saídas</span>
          <ArrowCircleDown size={32} color="#f75a68" />
        </header>

        <strong> {priceFormatter.format(summary.outcome)} </strong>
      </SumaryCard>
      <SumaryCard variant="green">
        <header>
          <span>Total</span>
          <CurrencyDollar size={32} color="#fff" />
        </header>

        <strong> {priceFormatter.format(summary.total)} </strong>
      </SumaryCard>
    </SumaryContainer>
  );
}
