export default function Home() {
  return (
    <main>
      <h1>Pastebin Lite</h1>
      <form method="post" action="/api/pastes">
        <textarea name="content" required />
        <button type="submit">Create Paste</button>
      </form>
    </main>
  );
}
