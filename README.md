# Aplikacja czat internetowy (Opis)

Prosta aplikacja zbudowana w node.js która jest czatem.

## Opis funkcjonalności

- Frontend
  - Zapisywanie nazwy użytkownika do localStorage
  - Obsługa zdarzeń z serwera wtyczki odpowiadających w sekcji Backend
  - Wysyłanie konkretnych zdarzeń do serwera wtyczki
  - Blokowanie pustego pola wiadomości(Zapobieganie przed wysyłaniem pustych stringów)
  - Przewijaj feed do nowej wiadomości
- Backend
  - Wyświetlanie strony
  - Obsługa wtyczki
    - Dołączenie do czatu
    - Wysyłanie wiadomości
    - Opuszczenie czatu

## Instalacja i uruchomienie

- Sklonować repozytorium
- W pliku .env należy zdefiniować port oraz adres serwera (Jeśli uruchamiasz lokalnie to ws://localhost) na jakim ma działać aplikacja
- W katalogu głównym projektu wpisać `npm install`
- Następnie należy wpisać `npm run start`
- Aplikacja powinna się uruchomić `http://localhost:{Zdefiniowany port}`
