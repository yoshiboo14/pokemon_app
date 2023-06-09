import { useEffect, useState } from "react";
import "./App.css";
import { getAllPokemon, getPokemon } from "./utils/pokemon.js";
import Card from "./components/Card/Card";
import Navbar from "./components/Navbar/Navbar";

function App() {
  //ポケモンAPI このURLを叩くことでポケモンのデータを取得する
  const initialURL = "https://pokeapi.co/api/v2/pokemon";

  //初回マウント時にloading中を表示 ローディング中かそうでないかの状態を持たさる必要がある
  const [loading, setLoading] = useState(true);

  // ポケモンの詳細データ
  const [pokemonData, setPokemonData] = useState([]);

  // 次のページのURLを格納するための状態変数を準備
  const [nextURL, setNextURL] = useState("");
  // 前のページのURLを格納するための状態変数を準備
  const [prevURL, setPrevURL] = useState("");

  useEffect(() => {
    // 非同期処理
    const fetchPokemonData = async () => {
      // すべてのポケモンのデータを取得
      let res = await getAllPokemon(initialURL);
      // 詳細なポケモンのデータを取得
      loadPokemon(res.results);

      // console.log(res);

      //useEffectが最初に発火するタイミングで入れておく
      // これで自動的にnextURLに値が入る
      setNextURL(res.next);
      // 最初はnullになる
      setPrevURL(res.previous);

      //getAllPokemon(initialURL)でしっかり値を取得できればもうローディングするものはないので値をfalseに変える
      setLoading(false);
    };
    fetchPokemonData();
    // []で一回だけ呼び出し
  }, []);

  // 引数dataはres.result
  // ２０種類のポケモンのデータ
  const loadPokemon = async (data) => {
    // 20件の情報を一つずつ取り出し、一つずつfetchをかけている。すべてにfetchをかけていると時間がかかってしまうので、allをつけてあげることで20件すべてにfetchをかけるまで待ってあげることができる
    let _pokemonData = await Promise.all(
      //data配列(res.result)を一つずつ展開
      data.map((pokemon) => {
        // urlを一件ずつ取得
        let pokemonRecord = getPokemon(pokemon.url);
        return pokemonRecord;
      })
    );
    setPokemonData(_pokemonData);
  };

  // console.log(pokemonData);

  const handlePrevPage = async () => {
    if (!prevURL) return;

    setLoading(true);
    let data = await getAllPokemon(prevURL);
    await loadPokemon(data.results);
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  const handleNextPage = async () => {
    // 20件読み込むのでその間ローディングを入れておく
    setLoading(true);
    let data = await getAllPokemon(nextURL);
    console.log(data);
    await loadPokemon(data.results);
    // これを入れることで毎回次のページのURLを持ってくることができる(data.nextを次のものに更新)
    setNextURL(data.next);
    setPrevURL(data.previous);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <div className="App">
        {loading ? (
          <h1>ローディング中です</h1>
        ) : (
          <>
            <div className="pokemonCardContainer">
              {pokemonData.map((pokemon, i) => {
                // pokemonという配列をpropsとして渡す
                return <Card key={i} pokemon={pokemon} />;
              })}
            </div>
            <div className="btn">
              <button onClick={handlePrevPage}>前へ</button>
              <button onClick={handleNextPage}>次へ</button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
export default App;
