export const getAllPokemon = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      //fetchでデータを取得することができればthenメソッドでつなげることができる
      .then((res) => res.json())
      .then((data) => {
        resolve(data);
      });
  });
};
// fetchでデータを取得→データが取れたらjson形式に変換→json形式をデータとして受け取る→resolve()を使って最終的にjsonをreturnで返す
// Promiseは約束、fetch.then.thenが全て成功するまで待ってくださいということ

// ポケモンの詳細を取得
export const getPokemon = (url) => {
  return new Promise((resolve, reject) => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        resolve(data);
      });
  });
};
