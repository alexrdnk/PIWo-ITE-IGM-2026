# Lab4 - Firebase Board Games Shop

To jest kopia Lab3 przerobiona na Firebase.

## Co robi aplikacja

- pobiera gry z kolekcji `games` w Firestore,
- pozwala logowac sie przez Google,
- pozwala logowac sie przez Email/Haslo,
- pozwala kliknac `Kup Teraz`,
- po zakupie ustawia w Firestore `available: false`,
- sprzedana oferta jest wyszarzona i nie da sie jej kupic drugi raz.

## Co trzeba zrobic recznie w Firebase

1. Wejdz na https://console.firebase.google.com/
2. Utworz nowy projekt Firebase.
3. Wejdz w `Build -> Authentication -> Get started`.
4. Wlacz metody logowania:
   - Google,
   - Email/Password.
5. Wejdz w `Build -> Firestore Database`.
6. Utworz baze danych Firestore.
7. Na czas testow ustaw reguly:

```txt
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    match /games/{gameId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

8. Wejdz w ustawienia projektu i dodaj aplikacje web.
9. Skopiuj konfiguracje Firebase.
10. Utworz plik `.env.local` na podstawie `.env.local.example`.
11. Wklej swoje dane Firebase do `.env.local`.

## Wgranie danych do Firestore

Po uzupelnieniu `.env.local` uruchom:

```bash
npm run seed
```

Ten skrypt pobierze dane z API z Lab3 i zapisze je do Firestore.

## Uruchomienie

```bash
npm run dev
```

Potem wejdz na:

http://localhost:3000

## Hosting

Najprosciej opublikowac aplikacje na Vercel:

1. Wrzuc kod na GitHub.
2. Wejdz na https://vercel.com/
3. Kliknij `Add New -> Project`.
4. Wybierz repozytorium.
5. Jako katalog projektu wybierz `lab4/todos`.
6. Dodaj te same zmienne srodowiskowe co w `.env.local`.
7. Kliknij `Deploy`.
