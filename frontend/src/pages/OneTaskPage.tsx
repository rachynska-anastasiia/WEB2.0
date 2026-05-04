export default function OneTaskPage() {
    return (
      <main className="page">
        <h1>Завдання</h1>
        <form>
          <input type="title" placeholder="Title" />
          <input type="description" placeholder="Description" />
          <input type="due_date" placeholder="Due Date" />
          <select name="priority">
            <option value="low" selected>Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
          <button type="submit">Зберегти</button>
        </form>
      </main>
    );
  }