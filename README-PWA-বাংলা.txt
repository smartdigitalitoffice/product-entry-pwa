বাংলা Product Dashboard — Installable PWA
=========================================

এই PWA আপনার বর্তমান Google Sheets + Apps Script backend ব্যবহার করে। আলাদা database নয়।
কম্পিউটারের Dashboard এবং মোবাইল PWA একই Spreadsheet-এ কাজ করবে।

ধাপ ১: Apps Script Web App URL
আপনার Deploy করা Web App-এর সম্পূর্ণ /exec URL কপি করুন।
উদাহরণ: https://script.google.com/macros/s/DEPLOYMENT_ID/exec

ধাপ ২: iframe অনুমতি
Code.gs-এর doGet() ফাংশনটি APPS_SCRIPT_doGet_PATCH.txt-এর সংস্করণ দিয়ে প্রতিস্থাপন করুন।
Save করুন। Deploy > Manage deployments > Edit > New version > Deploy করুন।
Web App access “Only myself” রাখুন।

ধাপ ৩: PWA URL বসান
config.js খুলে PASTE_YOUR_APPS_SCRIPT_WEB_APP_EXEC_URL_HERE-এর জায়গায় নিজের /exec URL বসান।
উদ্ধৃতি চিহ্ন রাখুন এবং Save করুন।

ধাপ ৪: HTTPS-এ Hosting (অবশ্যক)
PWA install করতে HTTPS hosting প্রয়োজন। ZIP extract করে index.html, config.js,
manifest.webmanifest, service-worker.js এবং icons ফাইলগুলো একই root folder-এ রাখুন।
GitHub Pages:
1. GitHub-এ নতুন repository তৈরি করুন।
2. এই PWA folder-এর ফাইলগুলো repository root-এ upload করুন।
3. Settings > Pages > Deploy from a branch নির্বাচন করুন।
4. Branch main, folder /(root) দিয়ে Save করুন।
5. GitHub প্রদত্ত HTTPS URL খুলুন। Netlify-ও ব্যবহার করতে পারেন।

ধাপ ৫: Android-এ Install
1. Android Chrome-এ PWA HTTPS URL খুলুন।
2. Install বোতাম অথবা Chrome ⋮ > Install app / Add to Home screen চাপুন।
3. Install নিশ্চিত করুন। Home screen-এ অ্যাপ আইকন আসবে।

ব্যবহার
PWA-তে Dashboard iframe-এর মধ্যে দেখাবে। Google login/iframe সমস্যা হলে “পূর্ণ স্ক্রিনে খুলুন” চাপুন।
একই Gmail account ব্যবহার করুন, যার Apps Script access আছে।

গুরুত্বপূর্ণ সীমাবদ্ধতা
- PWA shell offline-এ খুলতে পারে; কিন্তু live products, stock, image upload, reports-এর জন্য
  internet এবং Apps Script access লাগবে।
- এই সংস্করণ offline data editing/sync করে না।
- Service worker শুধু PWA shell cache করে; Google Sheets/Drive data বা credentials cache করে না।
- ALLOWALL embedding চালু করলে অন্য সাইটও embed করতে পারে, তাই Web App access “Only myself” রাখুন।
- Google sign-in-এর browser privacy settings iframe-এ বাধা দিতে পারে; Full screen fallback আছে।
