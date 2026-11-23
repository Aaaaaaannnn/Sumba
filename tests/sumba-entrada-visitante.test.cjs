const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=f=>fs.readFileSync(path.join(root,f),'utf8');
const html=read('public/index.html'),auth=read('public/real/real.js');
test('Both SUMBA main entries are synchronized and syntactically valid',()=>{
 assert.equal(html,read('index.html'));
 const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];assert.ok(js);new Function(js);new Function(auth);
});
test('Visible account actions lead to actual Supabase portal instead of fake login',()=>{
 assert.match(html,/authButton\('Criar conta','real-register'\)/);
 assert.match(html,/authButton\('Já tenho conta','real-login','outline'\)/);
 assert.match(html,/const SUMBA_AUTH_URL='https:\/\/zunga-auth\.stivenluanda04\.workers\.dev\/'/);
 assert.match(html,/location\.assign\(SUMBA_AUTH_URL\+'\?flow='/);
 assert.match(auth,/const entryMode=new URLSearchParams\(location\.search\)/);
 assert.match(auth,/authScreen\(entryMode\)/);
 assert.match(auth,/Continuar com Facebook \(brevemente\)/);
 assert.match(auth,/disabled aria-disabled="true"/);
 assert.match(auth,/const providers=\{google:'Google'\}/);
});
test('Guest must provide name and role; without it main demo is gated',()=>{
 assert.match(html,/id="sumbaVisitorForm"/);
 assert.match(html,/name="visitorName"/);
 assert.match(html,/name="visitorRole"/);
 assert.match(html,/sumbaVisitorSession=null/);
 assert.match(html,/if\(!sumbaVisitorSession\)openAuth\('welcome'\)/);
 assert.match(html,/if\(!account\.guest\)\{openAuth\('welcome'\);return\}/);
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
test('Active cinematic CSS is focused, correctly cropped and contains no filter/opacity haze',()=>{
 const start=html.lastIndexOf('/* SUMBA | entrada fotográfica nítida: sem filtros, sem imagem deformada */');
 assert.ok(start>0,'Unified photo styling is missing');
 const styles=html.slice(start,html.indexOf('</style>',start));
 assert.match(styles,/\.sumba-welcome-photo\{[\s\S]*?object-fit:cover!important/);
 assert.match(styles,/object-position:50% 38%!important/);
 assert.match(styles,/filter:none!important;opacity:1!important/);
 assert.match(styles,/\.sumba-welcome-photo-scene\{\s*display:none!important/);
 assert.match(styles,/clip-path:none!important/);
 assert.match(styles,/max-height:30dvh!important/);
 assert.ok(!styles.includes('filter:blur('),'Active styles cannot blur the scene');
 for(const name of ['market','farmers','produce']){
  const photo=read('public/assets/sumba-onboarding-'+name+'.svg');
  const match=photo.match(/width="(\d+)" height="(\d+)"/);
  assert.ok(match&&Number(match[1])>=1400&&Number(match[2])>=950,'Source photo is below intended resolution: '+name);
 }
});
test('First-visit tutorial is preserved for every guest role and real account',()=>{
 assert.match(html,/const identity=r=>account\.guest\?'visitante-'/);
 assert.match(html,/const seenId=r=>v21SeenKey\(r,identity\(r\)\)/);
 assert.match(html,/start\('intro',r,true\)/);
 assert.match(html,/function enterSumbaVisitor\(name,visitorRole\)/);
 assert.match(auth,/function maybeShowFirstAccountGuide\(ticket\)/);
 assert.match(auth,/client\.from\('sumba_tutorial_progress'\)/);
});
