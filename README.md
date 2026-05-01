# flowstate-ui

React + Vite client for FlowState tasks. Talks to the FlowState REST API (`http://localhost:8000` in local dev).

**Companion API:** [flowstate-api](https://github.com/travwritescode/flowstate-api).

**Contracts / broker:** [Pactflow](https://pactflow.io/) (hosted Pact broker) — see [docs.pactflow.io](https://docs.pactflow.io/).

---

## Local development

```bash
npm install
npm run dev
```

The dev server listens on port **3000** (see [`vite.config.js`](vite.config.js)).
