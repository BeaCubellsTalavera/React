# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

Run tests with `npx vitest`

`npm install --save-dev @testing-library/react@16.3.0 @testing-library/jest-dom@6.6.3 @testing-library/user-event@14.6.1 jsdom@26.1.0`

With `npm run build` we run `vite build` which converts all the jsx to js, saves the code in a folder called `dist`. It also minifies (compresses) the code in one file for js and another for css.

Install React Compiler to avoid the rerender of the complete Component when some things are not changed they don't to be rendered again: 

1. Install the React Compiler npm package:
```bash
npm install --save-dev babel-plugin-react-compiler@rc
```

2. Copy this react config:
```js
react({
  babel: {
    plugins: [['babel-plugin-react-compiler', { target: '19' }]],
  },
})
```

3. Update the react config in `vite.config.js`:
```js
export default defineConfig({
  /* Replace the default react config:
  plugins: [react()]
  */

  // With the react config you copied above, like this:
  plugins: [react({
    babel: {
      plugins: [['babel-plugin-react-compiler', { target: '19' }]],
    },
  })],

  ...
})
```

### Check if React Compiler is Working
1. Start the backend using `npm run dev`.
2. Start the frontend using `npm run dev`.
3. Install the [React DevTools Chrome extension](https://chromewebstore.google.com/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=en).
4. In your project (open the URL provided by Vite in the browser), open the Inspector, and open the "Components" tab.
5. If there's a badge beside the components called "Memo ✨" the React Compiler is working.

El file vite-env.d.ts con `/// <reference types="vite/client" />` hace que se pueda usar la funcionalidad de Vite de importar cualquier archivo (.png, .css, ...) con TypeScript.