import "./TokenSelect.css";
import { useMemo, useState, type FC } from "react";
import type { Token } from "../../interfaces";
import DEFAULT_ICON from "../../assets/default-token.svg";
import SEARCH_ICON from "../../assets/search-icon.svg";

const TokenSelect: FC<{
  tokens: Token[];
  value?: Token;
  invalid?: boolean;
  onChange: (value?: Token) => void;
}> = ({ tokens, value, invalid, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selected = tokens.find((t) => t.symbol === value?.symbol);

  // Filter tokens by search keyword
  const filteredTokens = useMemo(() => {
    return tokens.filter((t) => {
      const s = search.toLowerCase();
      return t.symbol.toLowerCase().includes(s);
    });
  }, [tokens, search]);

  return (
    <>
      {/* Button */}
      <button
        className={`menu-toggle${invalid ? " invalid" : ""}`}
        onClick={() => setOpen(true)}
      >
        <span
          className="toggle-base-bg"
          style={{
            backgroundColor: `${selected?.dominantColor}11`,
          }}
        />
        {selected ? (
          <>
            <img
              src={selected.image}
              alt={selected.symbol}
              onError={(e) => (e.currentTarget.src = DEFAULT_ICON)}
            />
            <span>{selected.symbol}</span>
          </>
        ) : (
          <>
            <div className="placeholder-icon">?</div>
            <span className="placeholder-text">Select token</span>
          </>
        )}
      </button>

      {/* Modal */}
      {open && (
        <div className="menu-overlay" onClick={() => setOpen(false)}>
          <div className="menu-modal" onClick={(e) => e.stopPropagation()}>
            {/* Header stays fixed */}
            <div className="menu-header">
              <div className="modal-header">
                <h4>Select a token</h4>

                <button
                  className="modal-close-btn"
                  onClick={() => setOpen(false)}
                >
                  ✕
                </button>
              </div>

              <div className="search-wrapper">
                <img className="search-icon" src={SEARCH_ICON} />
                <input
                  className="menu-search"
                  placeholder="Search token..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* Scroll Area */}
            <div className="menu-scroll">
              {filteredTokens.length === 0 ? (
                <div className="menu-empty">No tokens found.</div>
              ) : (
                filteredTokens.map((token) => (
                  <div
                    key={token.symbol}
                    className="menu-item"
                    onClick={() => {
                      onChange(token);
                      setSearch("");
                      setOpen(false);
                    }}
                  >
                    <img src={token.image} alt={token.symbol} />
                    <div className="menu-info">
                      <strong>{token.symbol}</strong>
                      {/* {token.price && <small>${token.price}</small>} */}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TokenSelect;
