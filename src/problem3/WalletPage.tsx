interface WalletBalance {
  currency: string;
  amount: number;
  // FIXME: missing "blockchain" attribute, which used in filter function
}

// FIXME: can extend from WalletBalance
interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
}

// FIXME: extends but not adding anything
interface Props extends BoxProps {}
const WalletPage: React.FC<Props> = (props: Props) => {
  const { children, ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  // FIXME: getPriority is defined inside the component — recreated every render.
  // there is no states used in the function, so we can move it outside
  // FIXME: should not use any type -> anti-pattern
  const getPriority = (blockchain: any): number => {
    switch (blockchain) {
      case "Osmosis":
        return 100;
      case "Ethereum":
        return 50;
      case "Arbitrum":
        return 30;
      // FIXME: they can be merged if both return 20
      case "Zilliqa":
        return 20;
      case "Neo":
        return 20;
      default:
        return -99;
    }
  };

  // FIXME: All balances with positive amount get filtered out.
  // If it is intended, the variable's name should be sortedNegativeBalances, or something else
  // If priority > -99 but amount > 0 -> balance is removed.
  // If priority <= -99 -> always removed.
  const sortedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const balancePriority = getPriority(balance.blockchain);
        // FIXME: lhsPriority — variable does not exist
        // should it be balancePriority?
        if (lhsPriority > -99) {
          if (balance.amount <= 0) {
            return true;
          }
        }
        return false;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        if (leftPriority > rightPriority) {
          return -1;
        } else if (rightPriority > leftPriority) {
          return 1;
        }
      });
    // FIXME: lacks a final return 0, which may return an unpredictably result
    // FIXME: dependencies include prices but prices aren’t used, which cause performance issues
  }, [balances, prices]);

  // FIXME: recomputing formattedBalances on every render, which cause performance issues
  const formattedBalances = sortedBalances.map((balance: WalletBalance) => {
    return {
      ...balance,
      // FIXME: toFixed() should have a parameter, in most case 10
      formatted: balance.amount.toFixed(),
    };
  });

  // FIXME: recomputing rows on every render, which cause performance issues
  // FIXME: formattedBalances instead of sortedBalances?
  const rows = sortedBalances.map(
    // FIXME: sortedBalances is an array of WalletBalance, not FormattedWalletBalance
    (balance: FormattedWalletBalance, index: number) => {
      // FIXME: Not validating prices / undefined access
      const usdValue = prices[balance.currency] * balance.amount;
      return (
        <WalletRow
          className={classes.row}
          // FIXME: should not use index as key, which is an anti-pattern
          key={index}
          amount={balance.amount}
          usdValue={usdValue}
          formattedAmount={balance.formatted}
        />
      );
    }
  );

  // FIXME: Rendering rows directly instead of using semantic elements, UX anti-pattern
  // FIXME: Passing props directly to div element can cause unintended props,
  // lose full control of which props belong to the div
  return <div {...rest}>{rows}</div>;
};
