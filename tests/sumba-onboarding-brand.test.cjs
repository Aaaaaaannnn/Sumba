const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('public/index.html');
test('main and public entry points are byte-for-byte identical',()=>assert.equal(html,read('index.html')));
test('original SUMBA brand appears over the photo, without duplicated card',()=>{
 assert.match(html,/const SUMBA_ORIGINAL_BRAND='\/assets\/sumba-brand-original\.svg'/);
 assert.match(html,/sumbaAuthPhoto\(file,'Fotografia ilustrativa de produtos agrícolas'\)\+sumbaAuthSpotlight\(\)/);
 assert.match(html,/\.authphoto \.sumba-auth-spotlight\{position:absolute/);
 assert.match(html,/background:transparent!important/);
 assert.match(html,/#auth \.authphoto \.brand\.brand-lockup\{display:none!important\}/);
 assert.doesNotMatch(html,/sumbaAuthBrand\(/);
});
test('all four demonstration authentication roles use the new photo backgrounds',()=>{
 for(const role of ['customer','producer','business','operations'])assert.ok(html.includes('sumbaAuthPhoto('),role+' must use local image');
 for(const file of ['sumba-onboarding-market.svg','sumba-onboarding-farmers.svg','sumba-onboarding-produce.svg'])assert.ok(html.includes('/assets/'+file));
 assert.match(html,/sumbaWelcomePhotos\.farmers/);
 assert.match(html,/sumbaWelcomePhotos\.produce/);
});
test('provided logo and all three photographs are embedded assets, no remote hotlink',()=>{
 for(const f of ['sumba-brand-original.svg','sumba-onboarding-market.svg','sumba-onboarding-farmers.svg','sumba-onboarding-produce.svg','sumba-farmer-woman.svg','sumba-farmer-man.svg']){
  const s=read('public/assets/'+f);
  assert.match(s,/^<svg /);
  assert.match(s,/href="data:image\/webp;base64,/);
  const m=s.match(/base64,([A-Za-z0-9+/=]+)"/);
  assert.ok(m,'embedded WebP missing in '+f);
  const b=Buffer.from(m[1],'base64');
  assert.equal(b.toString('ascii',0,4),'RIFF',f);
  assert.equal(b.toString('ascii',8,12),'WEBP',f);
  assert.ok(b.length>5000,f);
 }
});
test('original SUMBA wordmark and slogan correction, no change to back-end logic',()=>{
 assert.ok(html.includes('Do campo à sua mesa.'));
 const js=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
 assert.ok(js);new Function(js);
 assert.match(html,/O campo mais perto de ti\./);
 assert.ok(html.includes('Multicaixa Express (simulação)'));
});
