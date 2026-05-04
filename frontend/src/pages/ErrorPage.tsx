export default function ErrorPage() {
    const dinoTalk = [
      "            ____                        __",
      "           / _:_| No RaaAaR?           |_*\\",
      "    .-^^^-/ /              No RaaAaR(    \\ \\.----._",
      " __/       /                             |          \\",
      "/__.|_|-|_|                              |_|-|_|\\_\\\\_\\",
    ];
  
    return (
      <main className="page">
        <h1>Щось пішло не так :( </h1>
        <p>Помилка: </p>
        <pre className="ascii-art">{dinoTalk}</pre>
      </main>
    );
  }