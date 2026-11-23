const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('public/index.html'),auth=read('public/real/real.js');
test('Both SUMBA main entries are synchronized and syntactically valid',()=>{
 assert.equal(html,read('index.html'));
 const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(js);new Function(js);new Function(auth);
});
test('Entry stays demonstrative; real Supabase access stays in the customer profile',()=>{
 assert.match(html,/authButton\('Criar conta','demo-register'\)/);
 assert.match(html,/authButton\('Entrar na minha conta','login','outline'\)/);
 assert.match(html,/authButton\('Entrar como visitante','guest','outline'\)/);
 assert.match(html,/Esta é a demonstração da SUMBA/);
 assert.match(html,/id="demoCustomerRegister"/);
 assert.match(html,/id="demoLogin"/);
 assert.doesNotMatch(html,/input\('Palavra-passe de teste'/);
 assert.match(html,/href="\/real\/"/);
 assert.match(html,/Testar autenticação real \(Supabase\)/);
 assert.match(html,/const SUMBA_AUTH_URL='https:\/\/zunga-auth\.stivenluanda04\.workers\.dev\/'/);
 assert.match(html,/location\.assign\(SUMBA_AUTH_URL\+'\?flow='/);
 assert.match(auth,/const entryMode=new URLSearchParams\(location\.search\)/);
 assert.match(auth,/authScreen\(entryMode\)/);
 assert.match(auth,/const providers=\{google:'Google'\}/);
});
test('Guest must provide name and role; without it main demo is gated',()=>{
 assert.match(html,/id="sumbaVisitorForm"/);
 assert.match(html,/name="visitorName"/);
 assert.match(html,/name="visitorRole"/);
 assert.match(html,/sumbaVisitorSession=null/);
 assert.match(html,/if\(!sumbaVisitorSession\)openAuth\('welcome'\)/);
 assert.match(html,/if\(!account\.guest&&!account\.signed\)\{openAuth\('welcome'\);return\}/);
 assert.match(html,/SUMBA_VISITOR_KEY='sumba-visitor-session-v1'/);
});
test('Guest shopping is genuinely non-finalizable',()=>{
 assert.match(html,/function placeCart\(v\)\{if\(sumbaGuestBrowsing\(\)\)/);
 assert.match(html,/if\(t==='checkout'&&sumbaGuestBrowsing\(\)\)/);
 assert.match(html,/if\(sumbaGuestBrowsing\(\)\)\{e\.preventDefault\(\);e\.stopImmediatePropagation\(\)/);
 assert.match(html,/Podes organizar produtos, mas não criar encomendas/);
});
test('Profile-specific guide is persisted per authenticated user in protected Supabase table',()=>{
 assert.match(html,/const identity=r=>account\.guest\?'visitante-'/);
 assert.match(html,/const seenId=r=>v21SeenKey\(r,identity\(r\)\)/);
 assert.match(auth,/client\.from\('sumba_tutorial_progress'\)/);
 assert.match(auth,/\.eq\('user_id',user\.id\)\.eq\('role',profile\.role\)\.maybeSingle\(\)/);
 assert.match(auth,/onConflict:'user_id,role'/);
 for(const r of ['buyer','producer','company','courier','admin'])assert.match(auth,new RegExp(' '+r+':\\['));
});
test('Full-screen welcome keeps one sharp photograph and a proportional central logo',()=>{
 const start=html.lastIndexOf('/* SUMBA 0.25 — entrada fotográfica em ecrã inteiro e percursos de teste claros.');
 assert.ok(start>0,'New onboarding styles must be the final active rules');
 const styles=html.slice(start,html.indexOf('</style>',start));
 assert.match(styles,/\.sumba-welcome-photo\{[\s\S]*?filter:none!important/);
 assert.match(styles,/\.sumba-welcome-photo-scene\{\s*display:none!important/);
 assert.match(styles,/object-fit:cover!important/);
 assert.match(styles,/max-height:34dvh!important/);
 assert.ok(!styles.includes('filter:blur('));
 assert.match(html,/sumba-onboarding-refresh/);
 assert.match(html,/const SUMBA_ORIGINAL_BRAND='\/assets\/sumba-brand-original\.svg'/);
 assert.match(html,/title:'Compre diretamente dos agricultores\.'/);
 assert.match(html,/title:'Valoriza quem trabalha a terra\.'/);
 assert.match(html,/title:'Mais escolhas\. Mais proximidade\.'/);
 assert.match(html,/authButton\('Entrar como visitante','guest','outline'\)/);
 assert.match(html,/authButton\('Criar conta','demo-register'\)/);
 assert.match(html,/authButton\('Entrar na minha conta','login','outline'\)/);
 assert.match(html,/if\(\+\+introStep>=slides\.length\)\{introStep=0;authPage='welcome'\}/);
 assert.match(html,/authButton\('Saltar introdução','intro-skip','outline'\)/);
});
test('New photographs are original, high quality and embedded locally',()=>{
 for(const name of ['woman','man']){
  const photo=read('public/assets/sumba-farmer-'+name+'.svg');
  const size=photo.match(/width="(\d+)" height="(\d+)"/);
  assert.ok(size&&Number(size[1])>=1500&&Number(size[2])>=1000);
  assert.match(photo,/href="data:image\/webp;base64,/);
 }
 assert.match(html,/sumbaWelcomePhotos\.woman/);
 assert.match(html,/sumbaWelcomePhotos\.man/);
 assert.equal(html.match(/sumba-welcome-photo" src=/g)?.length,1);
});
