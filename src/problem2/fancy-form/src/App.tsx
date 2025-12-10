import "./App.css";
import LoadingScreen from "./components/LoadingScreen/LoadingScreen";
import MainForm from "./components/MainForm/MainForm";
import useTokens from "./hooks/useTokens";

function App() {
  const { tokens, loading } = useTokens();

  return (
    <div className="app">
      {loading ? <LoadingScreen /> : <MainForm tokens={tokens} />}
    </div>
  );
}

export default App;
