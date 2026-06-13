# Mobile Movie App

A React Native mobile app built with Expo that lets users discover movies, search for titles, save favourites, and sign in to their personal account.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo (SDK 54) |
| Navigation | Expo Router (file-based) |
| Styling | NativeWind (Tailwind CSS for RN) |
| State Management | Zustand |
| Local Persistence | AsyncStorage + Zustand persist middleware |
| Backend / Auth / DB | Appwrite (Cloud) |
| Movie Data | TMDB API |
| Language | TypeScript |

---

## Features

- Browse popular / latest movies on the home screen
- Search movies in real time with 500 ms debounce
- Trending movies section driven by actual search frequency
- Save / unsave movies to a personal collection that persists across app restarts
- Email & password authentication (sign up, sign in, sign out) via Appwrite
- Profile screen showing user info and saved movie count

---

## Project Structure

```
mobile_movie_app/
├── app/
│   ├── _layout.tsx          # Root layout — auth guard & navigation shell
│   ├── globals.css          # Global Tailwind styles
│   ├── (auth)/
│   │   ├── _layout.tsx      # Stack layout for auth screens
│   │   ├── login.tsx        # Sign-in screen
│   │   └── sign-up.tsx      # Registration screen
│   ├── (tabs)/
│   │   ├── _layout.tsx      # Tab bar layout with custom icons
│   │   ├── index.tsx        # Home screen (trending + latest movies)
│   │   ├── search.tsx       # Search screen with debounced input
│   │   ├── saved.tsx        # Saved movies collection screen
│   │   └── profile.tsx      # User profile + sign-out
│   └── movies/
│       └── [id].tsx         # Movie detail screen
├── components/
│   ├── MovieCard.tsx        # Reusable card (supports trending rank badge)
│   └── SearchBar.tsx        # Controlled search input component
├── services/
│   ├── api.ts               # TMDB API calls (fetchMovies, fetchMovieDetails)
│   ├── appwrite.ts          # Appwrite DB: updateSearchCount, getTrendingMovies
│   ├── auth.ts              # Zustand auth store (login, signup, logout, init)
│   ├── savedMovies.ts       # Zustand saved-movies store with AsyncStorage persist
│   └── useFetch.ts          # Generic data-fetching hook
├── lib/
│   └── appwrite.ts          # Appwrite client + Databases instance
├── interfaces/
│   └── interfaces.d.ts      # Global TypeScript interfaces
└── constants/
    ├── icons.ts             # Icon asset exports
    └── images.ts            # Image asset exports
```

---

## Environment Variables

Create a `.env` file in the project root with the following keys:

```env
EXPO_PUBLIC_MOVIE_API_KEY=<your TMDB JWT bearer token>
EXPO_PUBLIC_APPWRITE_PROJECT_ID=<your Appwrite project ID>
EXPO_PUBLIC_APPWRITE_ENDPOINT=<your Appwrite endpoint e.g. https://fra.cloud.appwrite.io/v1>
EXPO_PUBLIC_APPWRITE_DATABASE_ID=<your Appwrite database ID>
EXPO_PUBLIC_APPWRITE_COLLECTION_ID=metrics
```

### Appwrite collection schema (`metrics`)

| Field | Type | Description |
|---|---|---|
| `searchTerm` | String | The search query |
| `count` | Integer | Number of times this term was searched |
| `movie_id` | Integer | TMDB ID of the top result |
| `title` | String | Movie title |
| `poster_url` | String | Full image URL |

---

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npx expo start --clear
```

Scan the QR code with **Expo Go** on your device, or press `i` / `a` to open in a simulator.

> **Note:** This app is tested with Expo Go. Libraries that require custom native modules (e.g. `react-native-mmkv`) will not work in Expo Go — use `npx expo prebuild` and build a custom dev client if you need them.

---

## Architecture Notes

### Authentication (`services/auth.ts`)

Authentication is handled entirely by Appwrite using email/password sessions.

- On app launch, `init()` calls `account.get()` to restore an existing session.
- `login()` creates an email/password session and fetches the user profile.
- `signup()` creates the account then immediately creates a session.
- `logout()` deletes the current Appwrite session.

The root layout (`app/_layout.tsx`) contains an `AuthGuard` component that watches the auth store. If no user is present, it redirects to `/(auth)/login`. Once authenticated, it redirects away from auth screens to `/(tabs)`.

### Trending Movies (`services/appwrite.ts`)

Every time a user performs a search, the first result's record in the Appwrite `metrics` collection is either incremented (if it exists) or created (if it doesn't). The home screen fetches the top 10 records ordered by `count` descending to populate the **Trending Movies** horizontal list.

**Flow:**

```
User types query → 500ms debounce → fetchMovies() → returns results
  → updateSearchCount(query, results[0]) → upserts metrics in Appwrite
Home screen → getTrendingMovies() → top 10 by count → rendered with rank badge
```

The fix that makes this work reliably: `useFetch`'s `refetch` function now returns the fetched data directly, so `updateSearchCount` receives the actual first result rather than stale React state.

### Saved Movies (`services/savedMovies.ts`)

Saved movies are managed with a Zustand store wrapped in the `persist` middleware, backed by `@react-native-async-storage/async-storage`. This means the saved list survives app restarts.

- `saveMovie(movie)` — adds to the store (deduplication by ID) and writes through to AsyncStorage.
- `removeSavedMovie(id)` — removes from the store and AsyncStorage.
- `isMovieSaved(id)` — synchronous check used on the movie detail screen.

The Saved screen subscribes directly to the store with `useSavedMoviesStore(state => state.movies)` so it updates reactively whenever a movie is saved or removed, including after the initial AsyncStorage hydration.

### Data Fetching (`services/useFetch.ts`)

A generic hook that wraps any async function with `data`, `loading`, and `error` states plus a `refetch` function. `refetch` returns the fetched result directly (in addition to updating state) so callers can act on fresh data without waiting for a React re-render.

---

## Screens

### Home (`app/(tabs)/index.tsx`)

- Displays a **Trending Movies** horizontal scroll list (sourced from Appwrite, ranked by search count).
- Displays a **Latest Movies** 3-column grid (sourced from TMDB discover endpoint).
- Tapping the search bar navigates to the Search screen.

### Search (`app/(tabs)/search.tsx`)

- Full-text movie search against the TMDB API.
- 500 ms debounce prevents excessive API calls while typing.
- After each successful search, `updateSearchCount` is called with the first result to keep trending data up to date.

### Movie Detail (`app/movies/[id].tsx`)

- Displays backdrop image, poster, title, rating, synopsis, genres, runtime, budget, and revenue.
- **Save / Unsave** button that writes to the persisted Zustand store.
- The save button state is read from the store on mount via `isMovieSaved`.

### Saved (`app/(tabs)/saved.tsx`)

- Shows the user's saved movies in a 3-column grid.
- Reactively updates when movies are added or removed elsewhere in the app.
- Displays a hydration loading indicator on first launch while AsyncStorage data is being read.

### Profile (`app/(tabs)/profile.tsx`)

- Shows an avatar generated from the user's initials.
- Displays the user's full name and email (from Appwrite).
- Shows the count of saved movies pulled live from the saved-movies store.
- **Sign Out** button that ends the Appwrite session and returns the user to the login screen.

### Login (`app/(auth)/login.tsx`)

- Email and password inputs with inline validation.
- Error message displayed on failed login.
- Link to the sign-up screen.

### Sign Up (`app/(auth)/sign-up.tsx`)

- Name, email, and password inputs.
- Client-side validation (all fields required, password minimum 8 characters).
- On success, automatically signs the user in and navigates to the app.
