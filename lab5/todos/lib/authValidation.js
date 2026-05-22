const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export function validateAuthForm(email, password) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) {
    return "Podaj adres e-mail.";
  }

  if (!EMAIL_PATTERN.test(trimmedEmail)) {
    return "Podaj poprawny adres e-mail (np. jan@example.com).";
  }

  if (!password) {
    return "Podaj hasło.";
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return `Hasło musi mieć co najmniej ${MIN_PASSWORD_LENGTH} znaków (wymaganie Firebase).`;
  }

  return null;
}

export function getFirebaseAuthErrorMessage(error) {
  const code = error?.code ?? "";

  switch (code) {
    case "auth/invalid-email":
      return "Nieprawidłowy adres e-mail.";
    case "auth/user-disabled":
      return "To konto zostało wyłączone przez administratora.";
    case "auth/user-not-found":
      return "Nie ma konta z tym adresem e-mail. Zarejestruj się lub sprawdź wpis.";
    case "auth/wrong-password":
      return "Nieprawidłowe hasło.";
    case "auth/invalid-credential":
      return "Błędny e-mail lub hasło. Sprawdź dane i spróbuj ponownie.";
    case "auth/email-already-in-use":
      return "Ten e-mail jest już zarejestrowany. Zaloguj się zamiast tego.";
    case "auth/weak-password":
      return `Hasło jest za słabe — minimum ${MIN_PASSWORD_LENGTH} znaków.`;
    case "auth/too-many-requests":
      return "Zbyt wiele prób. Odczekaj chwilę i spróbuj ponownie.";
    case "auth/popup-closed-by-user":
      return "Logowanie Google zostało anulowane.";
    case "auth/network-request-failed":
      return "Brak połączenia z siecią. Sprawdź internet i spróbuj ponownie.";
    case "auth/operation-not-allowed":
      return "Ta metoda logowania nie jest włączona w Firebase (Email/Hasło lub Google).";
    default:
      return error?.message || "Wystąpił nieoczekiwany błąd logowania.";
  }
}
