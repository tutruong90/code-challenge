import "./App.css";
import MainForm from "./components/MainForm/MainForm";
import useTokens from "./hooks/useTokens";

function App() {
  const { tokens, loading } = useTokens();

  return (
    <div className="app">
      {loading ? (
        <h3>Loading token prices...</h3>
      ) : (
        <MainForm tokens={tokens} />
      )}
    </div>
  );
}

export default App;
