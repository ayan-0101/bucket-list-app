# Our Bucket List

A shared bucket list for two people. Add, edit, delete, and check off items — changes sync
in real time on both your phones/laptops, no refresh needed.

## How it works

- No login system. You each type your name and a shared **list code** once; the code decides
  which shared list you both see (like a room code).
- Data lives in **Firebase Firestore**, which pushes updates to every open tab instantly.
- Hosted as a static site on **Vercel**, free.

---

## 1. Create your Firebase project (5 min)

1. Go to https://console.firebase.google.com and click **Add project**. Name it anything
   (e.g. "our-bucket-list"). You can disable Google Analytics.
2. Once created, click the **web icon (`</>`)** on the project overview page to register a web app.
   Give it any nickname. You don't need Firebase Hosting here — you'll use Vercel instead.
3. Firebase will show you a `firebaseConfig` object like:
   ```js
   const firebaseConfig = {
     apiKey: "AIza...",
     authDomain: "our-bucket-list.firebaseapp.com",
     projectId: "our-bucket-list",
     storageBucket: "our-bucket-list.appspot.com",
     messagingSenderId: "123456789",
     appId: "1:123456789:web:abcdef"
   };
   ```
   Keep this tab open — you'll need these values in step 3.
4. In the left sidebar, go to **Build → Firestore Database → Create database**. Choose
   **production mode** and any region close to you.
5. Go to the **Rules** tab of Firestore and paste the contents of `firestore.rules` from this
   project, then click **Publish**. (This lets anyone with your list code read/write just that
   list's items — fine for a private two-person list, since the code itself is the secret.)

## 2. Run it locally

```bash
npm install
cp .env.example .env.local
```

Open `.env.local` and paste in the values from your `firebaseConfig` (step 1.3), matching each
field name, e.g.:

```
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=our-bucket-list.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=our-bucket-list
VITE_FIREBASE_STORAGE_BUCKET=our-bucket-list.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

Then:

```bash
npm run dev
```

Open the printed `localhost` URL. Enter a name and a list code (or click "Generate a new code"),
then open the same URL in another tab/browser with the **same code** and a different name —
add an item in one tab and watch it appear in the other instantly.

## 3. Deploy to Vercel (free)

1. Push this project to a GitHub repo (create one on github.com, then):
   ```bash
   git init
   git add .
   git commit -m "Our bucket list"
   git remote add origin <your-repo-url>
   git push -u origin main
   ```
2. Go to https://vercel.com, sign in with GitHub, click **Add New → Project**, and import your repo.
3. Vercel auto-detects Vite. Before deploying, open **Environment Variables** and add the same six
   `VITE_FIREBASE_...` values from your `.env.local`.
4. Click **Deploy**. In about a minute you'll get a live URL like `our-bucket-list.vercel.app`.
5. Send that link to your girlfriend. You each open it, enter your name and the same list code
   once, and you're both looking at the same live list from then on (the app remembers your
   session in the browser).

## Notes on privacy

There's no password — anyone who has your exact list code can see and edit that list. That's
intentional, to keep this simple for two people. Pick a code that isn't guessable (the
"generate a new code" button gives you something like `harbor-482`), and don't post it publicly.

## Project structure

```
src/
  App.jsx                 – top-level session state (list code + name)
  firebase.js             – Firebase/Firestore init
  components/
    EntryGate.jsx         – name + list code screen
    ListView.jsx          – real-time Firestore subscription, CRUD logic
    AddItemForm.jsx        – add/edit form
    ItemCard.jsx            – single item, with the "stamp" for completed items
    ProgressBar.jsx         – completion progress
    FilterBar.jsx           – category/status filters
```
