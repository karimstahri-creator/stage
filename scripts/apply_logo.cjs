const fs = require('fs');
const path = require('path');

const rootDir = process.cwd();
const indexPath = path.join(rootDir, 'index.html');
const logoPath = path.join(rootDir, 'public', 'logo.jfif');

if (!fs.existsSync(logoPath)) {
    console.error('Logo file not found at:', logoPath);
    process.exit(1);
}

const logoBuffer = fs.readFileSync(logoPath);
const logoBase64 = `data:image/jpeg;base64,${logoBuffer.toString('base64')}`;

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Add head meta and icons if not present
if (!html.includes('<link rel="icon"')) {
    html = html.replace(
        '<meta name="twitter:card" content="summary_large_image" />',
        `<meta name="twitter:card" content="summary_large_image" />
    <meta property="og:image" content="/logo.jfif" />
    <link rel="icon" type="image/jpeg" href="/logo.jfif">
    <link rel="apple-touch-icon" href="/logo.jfif">`
    );
}

// 2. Replace header flag with official logo
const oldHeaderLogoPattern = /<div class="w-12 h-12 rounded-full bg-white flex items-center justify-center p-1 border-2 border-tnGold shadow-md">[\s\S]*?<img src="https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/ce\/ce\/Flag_of_Tunisia\.svg"[\s\S]*?<\/div>/;

if (oldHeaderLogoPattern.test(html)) {
    html = html.replace(
        oldHeaderLogoPattern,
        `<div class="w-14 h-14 rounded-full bg-white flex items-center justify-center p-0.5 border-2 border-tnGold shadow-md overflow-hidden shrink-0">
                        <img src="/logo.jfif" alt="شعار الجامعة التونسية للووشو كونغ فو" class="w-full h-full object-contain rounded-full">
                    </div>`
    );
}

// 3. Add Brand Hero Banner on Login Screen
const oldLoginViewPattern = /<!-- VIEW 1: PORTAL SELECTION \/ LOGIN SCREEN -->\s*<main id="loginView" class="flex-grow flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">\s*<div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 my-8">/;

const newLoginViewReplacement = `<!-- VIEW 1: PORTAL SELECTION / LOGIN SCREEN -->
        <main id="loginView" class="flex-grow flex flex-col items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
            <!-- Brand / Federation Hero Header with Official Emblem -->
            <div class="max-w-4xl w-full text-center mt-6 mb-4 animate-fadeIn">
                <div class="inline-block relative">
                    <div class="w-28 h-28 md:w-36 md:h-36 mx-auto rounded-full bg-white p-1.5 shadow-2xl border-4 border-tnGold flex items-center justify-center ring-8 ring-white/10 overflow-hidden transform hover:scale-105 transition-transform duration-300">
                        <img src="/logo.jfif" alt="شعار الجامعة التونسية للووشو كونغ فو" class="w-full h-full object-contain rounded-full">
                    </div>
                </div>
                <h1 class="text-2xl md:text-3xl font-black text-white tracking-wide mt-4">الجامعة التونسية للووشو كونغ فو والرياضات التابعة</h1>
                <p class="text-sm md:text-base text-tnGold font-bold mt-1">Tunisian Wushu Kung Fu and Associated Sports Federation</p>
                <p class="text-xs md:text-sm text-slate-300 mt-2 max-w-xl mx-auto leading-relaxed">المنظومة الوطنية الموحدة لإدارة وتأكيد المشاركات في التربصات والبطولات الوطنية</p>
            </div>

            <div class="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">`;

if (oldLoginViewPattern.test(html)) {
    html = html.replace(oldLoginViewPattern, newLoginViewReplacement);
}

// 4. Replace FTWKF text placeholders in print headers with the official logo
const oldPrintFTWKF = /<div class="w-16 h-16 border-2 border-tnRed rounded-full flex items-center justify-center font-black text-xs p-1">\s*FTWKF\s*<\/div>/g;
html = html.replace(
    oldPrintFTWKF,
    `<div class="w-20 h-20 rounded-full border-2 border-tnGold p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                            <img src="/logo.jfif" alt="شعار الجامعة التونسية للووشو كونغ فو" class="w-full h-full object-contain rounded-full">
                        </div>`
);

// 5. Update download buttons in download modal to offer both wushu_kungfu_tunisia_platform.html and index.html
const oldDownloadBtnPattern = /<button type="button" onclick="downloadFullAppFile\(\)" class="w-full py-3\.5 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-sm shadow-md shadow-emerald-600\/20 transition-all flex items-center justify-center gap-2 cursor-pointer">\s*<i class="fas fa-download text-base"><\/i>\s*<span>تحميل ملف المنظومة الكامل \(wushu_kungfu_tunisia_platform\.html\)<\/span>\s*<\/button>/;

const newDownloadBtns = `<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <button type="button" onclick="downloadFullAppFile('wushu_kungfu_tunisia_platform.html')" class="py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black rounded-xl text-xs md:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i class="fas fa-download text-base"></i>
                            <span>تحميل كملف كامل (القرص الصلب)</span>
                        </button>
                        <button type="button" onclick="downloadFullAppFile('index.html')" class="py-3.5 px-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl text-xs md:text-sm shadow-md shadow-blue-600/20 transition-all flex items-center justify-center gap-2 cursor-pointer">
                            <i class="fas fa-globe text-base"></i>
                            <span>تحميل كملف جاهز للنشر (index.html)</span>
                        </button>
                    </div>`;

if (oldDownloadBtnPattern.test(html)) {
    html = html.replace(oldDownloadBtnPattern, newDownloadBtns);
}

// 6. Inject FED_LOGO_BASE64 variable and enhanced downloadFullAppFile function
if (!html.includes('const FED_LOGO_BASE64 =')) {
    html = html.replace(
        '// =========================================================================\n        // STATE MANAGEMENT & CORE DATA OBJECTS',
        `// =========================================================================
        // FEDERATION OFFICIAL LOGO & ASSETS
        // =========================================================================
        const FED_LOGO_BASE64 = "${logoBase64}";

        // =========================================================================
        // STATE MANAGEMENT & CORE DATA OBJECTS`
    );
}

// Update downloadFullAppFile implementation
const oldDownloadFuncPattern = /function downloadFullAppFile\(\) \{[\s\S]*?showToast\("تم بدء تحميل ملف المنظومة الكامل على قرصك الصلب بنجاح"\);\s*\}/;

const newDownloadFunc = `function downloadFullAppFile(fileName) {
            saveData();
            const targetFileName = fileName || 'wushu_kungfu_tunisia_platform.html';
            let fullHtml = \`<!DOCTYPE html>\\n<html lang="ar" dir="rtl">\\n\${document.documentElement.innerHTML}\\n</html>\`;
            
            // Replace relative logo references with the self-contained base64 data URI so the file works offline everywhere
            if (typeof FED_LOGO_BASE64 !== 'undefined' && FED_LOGO_BASE64) {
                fullHtml = fullHtml.split('/logo.jfif').join(FED_LOGO_BASE64);
                fullHtml = fullHtml.split('/logo.png').join(FED_LOGO_BASE64);
                fullHtml = fullHtml.split('/logo.jpg').join(FED_LOGO_BASE64);
                fullHtml = fullHtml.split('/public/logo.jfif').join(FED_LOGO_BASE64);
                fullHtml = fullHtml.split('public/logo.jfif').join(FED_LOGO_BASE64);
                fullHtml = fullHtml.split('/assets/aistudio/08fef388-9c54-48db-b191-abdea3b4bbc1_51367df2.jfif').join(FED_LOGO_BASE64);
            }

            const blob = new Blob([fullHtml], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = targetFileName;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            showToast(\`تم بدء تحميل ملف المنظومة (\${targetFileName}) بنجاح على قرصك الصلب\`);
        }`;

if (oldDownloadFuncPattern.test(html)) {
    html = html.replace(oldDownloadFuncPattern, newDownloadFunc);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('Successfully updated index.html with official federation logo and enhanced downloads!');
