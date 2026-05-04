export default function MainPage() {
  const dinoTalk = [
    "            ____                        __",
    "           / _:_|    RaaAaR            |_*\\",
    "    .-^^^-/ /                RaaAaR      \\ \\.----._",
    " __/       /                             |          \\",
    "/__.|_|-|_|                              |_|-|_|\\_\\\\_\\",
  ].join("\n");

  return (
    <main className="page">
      <h1>Баг-трекер «Канбанчик»</h1>
      <p>Поставте, будь ласка, нам максимальні бали</p>
      <p>Якщо це Вас не переконало, то можете подивитися на смол ток двох динозаврів</p>
      <pre className="ascii-art">{dinoTalk}</pre>
    </main>
  );
}