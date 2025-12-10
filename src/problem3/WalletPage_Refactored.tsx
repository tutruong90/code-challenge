interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: string;
}

interface FormattedWalletBalance extends WalletBalance {
  formatted: string;
}

const getPriority = (blockchain: string): number => {
  switch (blockchain) {
    case "Osmosis":
      return 100;
    case "Ethereum":
      return 50;
    case "Arbitrum":
      return 30;
    case "Zilliqa":
    case "Neo":
      return 20;
    default:
      return -99;
  }
};

// TODO: all the props attributes will be passed to div element,
// it better to strict the props type
const WalletPage: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  // TODO: assume that it is filtering for positive balances and priority > -99
  const sortedAndFormatted = useMemo<FormattedWalletBalance[]>(() => {
    return (
      balances
        // keep valid priority and positive balances
        .filter((b) => getPriority(b.blockchain) > -99 && b.amount > 0)
        // sort by priority (high -> low)
        .sort((a, b) => getPriority(b.blockchain) - getPriority(a.blockchain))
        // format at the same time, other than formatting one more time outside
        .map((b) => ({
          ...b,
          formatted: b.amount.toFixed(2),
        }))
    );
  }, [balances]); // prices not used here, so removed

  return (
    // TODO: I'm not aware of the circumstance, so I just put div element as is
    <div {...props}>
      {sortedAndFormatted.map((balance) => {
        const price = prices[balance.currency] ?? 0;
        const usdValue = price * balance.amount;

        return (
          <WalletRow
            className={classes.row}
            // TODO: assume that each row represents for a distinct currency
            key={balance.currency}
            amount={balance.amount}
            usdValue={usdValue}
            formattedAmount={balance.formatted}
          />
        );
      })}
    </div>
  );
};

// TODO: bonus export :D
export default WalletPage;
