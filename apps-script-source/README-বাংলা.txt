বাংলা Product Dashboard — সম্পূর্ণ সেটআপ ও ব্যবহার নির্দেশিকা
===========================================================

এই প্যাকেজে কী আছে
------------------
1. Code.gs          — সার্ভার-সাইড Apps Script কোড
2. Index.html       — Dashboard-এর HTML ও JavaScript
3. Styles.html      — Dashboard-এর ডিজাইন/CSS
4. appsscript.json  — Apps Script manifest ও অনুমতির scope
5. screenshots/    — ব্যবহারকারীর লাইভ Dashboard-এর Screenshot
6. Manual.pdf       — Screenshot-সহ বিস্তারিত বাংলা PDF ম্যানুয়াল

গুরুত্বপূর্ণ: এই সংস্করণটি Standalone Apps Script Project-এর জন্য প্রস্তুত।
অর্থাৎ Apps Script আলাদা Project হিসেবে তৈরি হলে Spreadsheet ID কোডে সরাসরি বসাতে হবে।

প্রথমে যা লাগবে
---------------
- নিজের Google/Gmail অ্যাকাউন্ট
- একটি Google Spreadsheet
- Google Drive-এ পর্যাপ্ত জায়গা
- প্রথম সেটআপের জন্য কম্পিউটার ও Chrome/Firefox ব্রাউজার

A. Google Sheet তৈরি ও ID সংগ্রহ
--------------------------------
1. https://sheets.google.com খুলুন।
2. Blank spreadsheet তৈরি করুন। নাম দিন: Product Dashboard
3. Spreadsheet-এর URL হবে এ রকম:
   https://docs.google.com/spreadsheets/d/এখানে_ID_থাকবে/edit
4. /d/ এবং /edit এর মাঝখানের পুরো অংশটি কপি করুন। এটিই Spreadsheet ID।
   উদাহরণ (শুধু নমুনা):
   https://docs.google.com/spreadsheets/d/1AbC_defGHIjkLmNopQRstuVWxyz123456789/edit
   ID = 1AbC_defGHIjkLmNopQRstuVWxyz123456789
5. পুরো URL নয়, শুধু ID কপি করবেন।

B. Standalone Apps Script Project তৈরি
-------------------------------------
1. https://script.google.com খুলুন।
2. New project চাপুন। Project-এর নাম দিন: Bangla Product Dashboard
3. বাম পাশের Code.gs খুলুন। ZIP-এর Code.gs-এর সম্পূর্ণ কোড কপি করে সেখানে পেস্ট করুন।
4. Code.gs-এর একদম উপরের এই লাইনটি খুঁজুন:
   const SPREADSHEET_ID = 'PASTE_YOUR_GOOGLE_SHEET_ID_HERE';
5. PASTE_YOUR_GOOGLE_SHEET_ID_HERE অংশটি মুছে A ধাপে কপি করা নিজের Sheet ID বসান।
   উদাহরণ:
   const SPREADSHEET_ID = '1AbC_defGHIjkLmNopQRstuVWxyz123456789';
   উদ্ধৃতি চিহ্ন থাকবে; ID-র আগে/পরে স্পেস দেবেন না।
6. Ctrl+S চাপুন বা Save আইকনে ক্লিক করুন।

কেন ID সরাসরি বসাতে হবে?
-----------------------
আপনি যদি Google Sheet-এর Extensions > Apps Script দিয়ে Script না খুলে script.google.com থেকে
New project তৈরি করেন, তাহলে সেটি Standalone Project। Standalone Project-এর সঙ্গে কোনো নির্দিষ্ট
Spreadsheet স্বয়ংক্রিয়ভাবে যুক্ত থাকে না। তাই কোডকে বলে দিতে হয় কোন Spreadsheet ব্যবহার করবে।
এই কাজের জন্য Code.gs-এর SPREADSHEET_ID ধ্রুবকে নিজের Sheet ID বসানো হয়।
শুধু Spreadsheet ID বসালেই হবে; initializeDashboard চালালে কোড সেটি Script Properties-এও
সংরক্ষণ করে এবং ভবিষ্যতে সেই Sheet-ই ব্যবহার করে।

C. HTML ফাইল তৈরি
-----------------
Apps Script Editor-এর বাম পাশের Files-এর পাশে + চাপুন:
1. HTML নির্বাচন করুন, নাম লিখুন Index (শুধু Index লিখুন, .html নয়)।
2. Index.html ফাইলের সম্পূর্ণ কোড কপি করে নতুন Index ফাইলে পেস্ট করুন।
3. আবার + > HTML নির্বাচন করুন, নাম লিখুন Styles।
4. Styles.html-এর সম্পূর্ণ কোড Styles ফাইলে পেস্ট করুন।
5. Code.gs, Index, Styles — তিনটি ফাইলই Save করুন।

D. appsscript.json Manifest চালু ও বসানো
---------------------------------------
1. Apps Script Editor-এর বাম পাশের Project Settings (গিয়ার আইকন) খুলুন।
2. নিচে Apps Script Manifest অংশে “Show appsscript.json manifest file in editor” চালু করুন।
3. বাম পাশের Files তালিকায় appsscript.json দেখা যাবে।
4. ফাইলটি খুলে ZIP-এর appsscript.json-এর সম্পূর্ণ কনটেন্ট দিয়ে প্রতিস্থাপন করুন।
5. Save করুন। Manifest-এ Asia/Dhaka, V8 runtime এবং Sheets/Drive/UrlFetch scope দেওয়া আছে।

E. প্রথমবার Initialize / Sheet ও Drive Folder তৈরি
-------------------------------------------------
1. Code.gs ফাইল খুলুন।
2. উপরের Function dropdown থেকে initializeDashboard নির্বাচন করুন।
3. Run চাপুন।
4. প্রথমবার Google অনুমতি চাইলে Review permissions চাপুন, নিজের Gmail নির্বাচন করুন এবং প্রয়োজনীয় অনুমতি দিন।
5. যদি “Google hasn’t verified this app” সতর্কতা আসে, শুধু নিজের তৈরি ও নিজের পর্যালোচিত স্ক্রিপ্ট হলে Advanced > Go to project (unsafe) দিয়ে এগোন। সন্দেহ হলে থামুন; অজানা কোডে অনুমতি দেবেন না।
6. Execution log-এ Execution completed দেখুন।
7. Google Sheet রিফ্রেশ করুন। Products এবং StockLog নামে দুটি Sheet তৈরি হওয়ার কথা।
8. Google Drive-এ Bangla Product Dashboard নামে Folder তৈরি হবে; তার ভেতরে Product Images এবং Backups থাকবে।

F. Web App Deploy
-----------------
1. Apps Script-এর ডানদিকে Deploy > New deployment চাপুন।
2. Select type-এর গিয়ার আইকন > Web app নির্বাচন করুন।
3. Description: Bangla Product Dashboard
4. Execute as: Me
5. Who has access: Only myself (ব্যক্তিগত ব্যবহারের জন্য)
6. Deploy চাপুন এবং প্রয়োজন হলে অনুমতি দিন।
7. Web app URL কপি করুন। URL-এর শেষে /exec থাকে।
8. URL নতুন Browser tab-এ খুলুন। এটি আপনার Dashboard।
9. কোড পরিবর্তন করলে Deploy > Manage deployments > Edit (পেন্সিল) > Version: New version > Deploy করুন। শুধু Save করলে প্রকাশিত Web App-এর কোড আপডেট নাও হতে পারে।

G. Dashboard ব্যবহার
-------------------
নতুন পণ্য:
- + নতুন পণ্য চাপুন।
- পণ্যের নাম বাধ্যতামূলক। SKU, ক্যাটাগরি, ক্রয়মূল্য, বিক্রয়মূল্য, স্টক, সর্বনিম্ন স্টক, ছবি ও বিবরণ দিন।
- JPG/PNG/WebP ছবি, সর্বোচ্চ 2 MB। সংরক্ষণ করুন।

Edit / Delete:
- তালিকার Edit দিয়ে তথ্য পরিবর্তন করুন।
- Delete দিয়ে পণ্য মুছুন। সংশ্লিষ্ট ছবিটি Trash-এ পাঠানো হয়।

স্টক পরিবর্তন:
- পণ্যের সারিতে স্টক বাটন চাপুন।
- ধনাত্মক পূর্ণসংখ্যা দিলে স্টক বাড়বে; ঋণাত্মক পূর্ণসংখ্যা দিলে কমবে।
- স্টক শূন্যের নিচে নামানো যাবে না।
- পরিবর্তনের রেকর্ড StockLog-এ যোগ হবে।

সার্চ:
- পণ্যের নাম, SKU অথবা ক্যাটাগরির অংশ লিখে খুঁজুন।

হিসাব:
- স্টকের ক্রয়মূল্য = বর্তমান স্টক × একক ক্রয়মূল্য
- স্টকের বিক্রয়মূল্য = বর্তমান স্টক × একক বিক্রয়মূল্য
- সম্ভাব্য মোট লাভ = বর্তমান স্টক × (একক বিক্রয়মূল্য − একক ক্রয়মূল্য)
- এটি সম্ভাব্য স্টক মার্জিন; প্রকৃত বিক্রয়, খরচ, VAT/কর, ফেরত বা নিট লাভের হিসাব নয়।

Excel / PDF / Backup:
- Excel রিপোর্ট Products শিটের ডেটা XLSX হিসেবে Backups Folder-এ তৈরি করে।
- PDF রিপোর্ট Products শিট PDF হিসেবে Backups Folder-এ তৈরি করে।
- Drive Backup সম্পূর্ণ Spreadsheet-এর একটি কপি Backups Folder-এ তৈরি করে।
- রিপোর্ট তৈরি হলে Drive ফাইলের লিংক খোলে; প্রয়োজন হলে Drive থেকে Download করুন।

H. মোবাইলে ব্যবহার
------------------
1. মোবাইলের Chrome-এ একই /exec Web App URL খুলুন।
2. Deploy access Only myself হলে যে Gmail দিয়ে Deploy করেছেন সেই Gmail-এ Sign in থাকতে হবে।
3. Chrome-এর তিন ডট > Add to Home screen / Install app নির্বাচন করুন।
4. মোবাইল ও কম্পিউটার একই Spreadsheet-এ যুক্ত; তাই উভয় ডিভাইসে একই ডেটা দেখা যাবে।

সমস্যা সমাধান
-------------
1. “SPREADSHEET_ID সেট করা নেই” — Code.gs-এ ID বসান, Save করুন, initializeDashboard Run করুন।
2. “You do not have permission” — Sheet ও Script একই Google অ্যাকাউন্টে খুলুন; প্রয়োজনীয় অনুমতি দিন।
3. Products/StockLog না এলে — সঠিক ID বসানো হয়েছে কি না যাচাই করে initializeDashboard আবার Run করুন; Execution log-এর Error পড়ুন।
4. Web App-এ পুরোনো কোড — Manage deployments থেকে New version Deploy করুন।
5. ছবি দেখা না গেলে — Drive-এর Product Images ফোল্ডারে ফাইল আছে কি না এবং ছবির লিংক-শেয়ারিং নীতি পরীক্ষা করুন।
6. Excel/PDF কাজ না করলে — প্রথমবার UrlFetch/Drive permission দিন; Apps Script-এর Executions-এ Error দেখুন।

সংশোধিত কোডে কী ঠিক করা হয়েছে
----------------------------
- setup_()-এর মধ্যে একই scope-এ দ্বিতীয়বার let props ঘোষণা করার SyntaxError সরানো হয়েছে।
- Standalone Apps Script-এর জন্য SPREADSHEET_ID স্পষ্টভাবে Code.gs-এ সেট করার ব্যবস্থা করা হয়েছে।
- initializeDashboard প্রথমে ID যাচাই করে, তারপর Script Properties-এ সংরক্ষণ করে এবং Sheet প্রস্তুত করে।
- ভুল/ফাঁকা Spreadsheet ID থাকলে অস্পষ্টভাবে Execution completed না দেখিয়ে স্পষ্ট Error দেয়।
- Product save ও stock update-এ LockService যোগ করা হয়েছে, যাতে একসঙ্গে পরিবর্তনে সংঘর্ষের ঝুঁকি কমে।
- মূল্য ও স্টক ইনপুটের validation যোগ করা হয়েছে; ছবি JPG/PNG/WebP এবং 2 MB সীমায় যাচাই করা হয়।
- একই পণ্যের ছবি প্রতিস্থাপন করলে আগের ছবিটি Trash-এ পাঠানো হয়।

নিরাপত্তা ও সীমাবদ্ধতা
--------------------
- ব্যক্তিগত/গোপন ছবি আপলোড করবেন না। Dashboard-এ ছবি দেখানোর জন্য ছবিতে Anyone with the link – Viewer শেয়ারিং প্রয়োগ করা হয়।
- Web App access Only myself রাখুন। অন্যকে প্রবেশাধিকার দিলে তারা Spreadsheet/Drive ডেটাও দেখতে বা বদলাতে পারে—আগে অনুমতি ও নিরাপত্তা বুঝুন।
- এই সংস্করণ একক ব্যবহারকারীর ছোট/মাঝারি পণ্য তালিকা ব্যবস্থাপনার জন্য। পূর্ণ POS, বিক্রয় ইনভয়েস, ক্রয় অর্ডার, সরবরাহকারী, বহু-ব্যবহারকারী role, অডিট ট্রেইল বা হিসাবরক্ষণ সফটওয়্যার নয়।
- নিয়মিত Drive Backup তৈরি করুন।
- আপনার আসল Spreadsheet ID কাউকে প্রকাশ করার প্রয়োজন নেই; ম্যানুয়ালের নমুনা ID কেবল উদাহরণ।
