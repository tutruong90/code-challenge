import "./MainForm.css";
import { useState, type FC } from "react";
import TokenSelect from "../TokenSelect/TokenSelect";
import LoadingButton from "../LoadingButton";
import type { Token } from "../../interfaces";
import ArrowDownIcon from "../ArrowDownIcon";
import WaterBox from "../WaterBox/WaterBox";

const MainForm: FC<{ tokens: Token[] }> = ({ tokens }) => {
  const [fromToken, setFromToken] = useState<Token>();
  const [toToken, setToToken] = useState<Token>();

  const [inputAmount, setInputAmount] = useState("");
  const [buttonPressed, setButtonPressed] = useState(false);

  const [swapStatus, setSwapStatus] = useState<"idle" | "loading" | "done">(
    "idle"
  );

  // calculate amount
  const raw = Number(inputAmount);
  const amount = isNaN(raw) ? 0 : raw;
  const outputAmount =
    amount > 0 && fromToken?.price && toToken?.price
      ? (amount * fromToken.price) / toToken.price
      : 0;

  const inputUsd = amount && fromToken?.price ? amount * fromToken.price : 0;
  const outputUsd =
    outputAmount && toToken?.price ? outputAmount * toToken.price : 0;

  const handleSwap = () => {
    if (!inputAmount || Number(inputAmount) <= 0) {
      setButtonPressed(true);
      return;
    }

    setSwapStatus("loading");

    setTimeout(() => {
      setSwapStatus("done");

      // schedule reset in a completely separate task
      setTimeout(() => {
        setSwapStatus("idle");
      }, 2000);
    }, 5000);
  };

  // animation
  const [waveBoost, setWaveBoost] = useState(0);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputAmount(e.target.value);

    setWaveBoost((v) => v + 1);
  };

  return (
    <div className="swap-box">
      <h2>Fancy Form</h2>

      <div className="inputs-wrapper">
        {/* FROM */}
        <div className="row row__from">
          <WaterBox boost={waveBoost} className={`water-box ${swapStatus}`} />

          <div
            className={`input-block${
              buttonPressed && !inputAmount ? " invalid" : ""
            }`}
          >
            <input
              className="input"
              type="number"
              value={inputAmount}
              onChange={handleAmountChange}
              placeholder="0"
            />

            {/* USD Display */}
            <div className="usd-label">≈ ${inputUsd.toFixed(6)}</div>
          </div>
          <TokenSelect
            tokens={tokens}
            value={fromToken}
            onChange={setFromToken}
            invalid={buttonPressed && !fromToken}
          />
        </div>

        {/* SWAP ICON */}
        <div className={`switch ${swapStatus === "loading" ? "swapping" : ""}`}>
          <ArrowDownIcon className="arrow-icon" />
        </div>

        {/* TO */}
        <div className={`row row__to ${swapStatus}`}>
          <div className="input-block">
            <input
              className="input"
              type="text"
              disabled
              value={outputAmount}
            />

            {/* USD Display */}
            <div className="usd-label">≈ ${outputUsd.toFixed(6)}</div>
          </div>
          <TokenSelect
            tokens={tokens}
            value={toToken}
            onChange={setToToken}
            invalid={buttonPressed && !toToken}
          />
        </div>
      </div>

      <LoadingButton
        disabled={swapStatus !== "idle"}
        className={swapStatus === "done" ? "swap-btn done" : "swap-btn"}
        onClick={handleSwap}
      >
        <div className="swap-label-wrapper">
          <div className={`swap-label swap-${swapStatus}`}>
            <span className="label-idle">SWAP</span>
            <span className="label-loading">Processing...</span>
            <span className="label-done">Swapped!</span>
          </div>
        </div>
      </LoadingButton>
    </div>
  );
};

export default MainForm;
