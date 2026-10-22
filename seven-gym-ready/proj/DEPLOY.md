# نشر Seven Gym (Cloudflare Workers - مجاني)

المشروع TanStack Start (SSR) + Supabase، والـ build بيطلع جاهز لـ Cloudflare.

## 1) ارفع على GitHub
```sh
git init
git add .
git commit -m "Seven Gym"
git branch -M main
git remote add origin https://github.com/USERNAME/seven-gym.git
git push -u origin main
```
(.env متتجاهل تلقائيًا - مش هيترفع)

## 2) Cloudflare
Workers & Pages → Create → Import a repository → اختار الريبو
- Build command: `npm install --legacy-peer-deps && npm run build`
- Deploy command: `npx wrangler deploy`
- Variables (Settings → Variables and Secrets): انسخ القيم من .env بنفس أسماء .env.example

## 3) الدومين
Settings → Domains & Routes → Add Custom Domain (sevengym.com مثلًا). HTTPS تلقائي.

## بديل: Vercel
أضف متغير `NITRO_PRESET=vercel` + نفس متغيرات .env، وImport من GitHub.
