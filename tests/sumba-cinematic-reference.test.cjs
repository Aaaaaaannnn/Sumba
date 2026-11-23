const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('public/index.html');
test('entradas continuam sincronizadas e javascript válido',()=>{
 assert.equal(html,read('index.html'));
 const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(script);
 new vm.Script(script);
});
test('boas-vindas e introdução ocupam o ecrã inteiro',()=>{
 assert.ok(html.includes("((authPage==='welcome'||authPage==='intro')?' sumba-cinematic sumba-onboarding-refresh':'')"));
 assert.match(html,/#auth \.authframe\.sumba-cinematic\{/);
 assert.match(html,/min-height:100dvh/);
 assert.match(html,/#auth \.authframe\.sumba-cinematic \.authphoto\{/);
 assert.match(html,/position:absolute;inset:0;width:100%;height:100%!important/);
 assert.match(html,/#auth \.authframe\.sumba-cinematic \.authbody\{/);
 assert.match(html,/margin:auto auto 0/);
});
test('não existe fundo branco nem cartão entre fotografia e botões',()=>{
 assert.match(html,/\.authframe\.sumba-cinematic \.authbody\{[^}]*background:transparent/);
 assert.match(html,/\.authframe\.sumba-cinematic \.authphoto \.sumba-auth-spotlight\{/);
 assert.match(html,/background:transparent!important;border:0!important;border-radius:0!important/);
 assert.match(html,/linear-gradient\(180deg,[^)]*rgba\(18,68,40/);
 assert.match(html,/\.authframe\.sumba-cinematic \.authbody h1\{[^}]*color:#fff/);
 assert.match(html,/\.authframe\.sumba-cinematic \.authbody \.btn\.outline\{/);
});
test('carrossel preserva interação, imagens fornecidas e logótipo original',()=>{
 assert.match(html,/const SUMBA_ORIGINAL_BRAND='\/assets\/sumba-brand-original\.svg'/);
 assert.match(html,/sumbaWelcomePhotos\.market/);
 assert.match(html,/title:'Compre diretamente dos agricultores\.'[^\n]*file:sumbaWelcomePhotos\.man/);
 assert.match(html,/data-auth="'\+act\+'"/);
 assert.ok(html.includes("'nextIntro'"));
 assert.ok(html.includes("'intro-skip'"));
 assert.ok(html.includes("Entrar na minha conta"));
 assert.ok(html.includes("Entrar como visitante"));
 assert.ok(html.includes("'register'"));
 assert.ok(html.includes("'guest'"));
});
test('formulários continuam fora da experiência cinematográfica',()=>{
 assert.match(html,/\(authPage==='welcome'\|\|authPage==='intro'\)/);
 assert.match(html,/id="demoLogin"/);
 assert.match(html,/id="demoRegister"/);
 assert.match(html,/Multicaixa Express \(simulação\)/);
});
