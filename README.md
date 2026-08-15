# WIND / PULSE

現在地の GPS と Open-Meteo の風況データから、風力発電量をシミュレーションする Next.js アプリです。

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## WIND / PULSE の使い方

`npm install` 後に `npm run dev` を実行し、`http://localhost:3000` を開いて位置情報の利用を許可してください。実機では HTTPS が必要です。

Vercel ではこのフォルダーを GitHub から import し、Install Command を `npm install`、Build Command を `npm run build` のまま Deploy します。Open-Meteo は API キー不要です。

主な構成: `app/page.tsx` (UI)、`lib/calculateWindPower.ts` (計算)、`hooks/` (データ取得)、`components/` (地図・グラフ)。
