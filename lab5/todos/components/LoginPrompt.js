import Link from "next/link";

export default function LoginPrompt({ message }) {
  return (
    <section className="panel login-prompt">
      <p>{message}</p>
      <div className="card-actions">
        <Link className="buy-button" href="/logowanie">
          Zaloguj
        </Link>
        <Link className="secondary-button" href="/rejestracja">
          Zarejestruj
        </Link>
      </div>
      <Link className="back-link" href="/">
        Wróć do sklepu
      </Link>
    </section>
  );
}
