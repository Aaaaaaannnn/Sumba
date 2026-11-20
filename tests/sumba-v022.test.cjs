/* Executar com: node --test tests/sumba-v022.test.cjs */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const home=read('public/index.html'),alternate=read('index.html');
const auth=read('public/real/real.js'),admin=read('public/real/admin.js'),notifications=read('public/real/notifications.js');
test('entradas HTML sincronizadas',()=>assert.equal(home,alternate));
test('logo oficial no site e na autenticação',()=>{
 assert.equal(read('public/assets/sumba-emblem.svg'),read('public/real/assets/sumba-emblem.svg'));
 assert.match(home,/Do campo à sua mesa\./);assert.match(auth,/Do campo à sua mesa\./);
});
test('JavaScript sintacticamente válido',()=>{
 const inline=home.match(/<script>([\s\S]*?)<\/script>/);
 assert.ok(inline);new Function(inline[1]);new Function(auth);
 new Function(admin.replace(/^export\s+/m,''));new Function(notifications.replace(/^export\s+/m,''));
});
test('entrada real e protecção contra compras simuladas',()=>{
 assert.match(home,/const sumbaPublicMode=/);assert.match(home,/href="\/real\/"/);
 assert.match(home,/account\.guest=true;account\.signed=false/);
 assert.match(home,/Não foi registada nenhuma compra/);
 assert.match(home,/script src="\/real\/config\.js"/);
});
test('carrossel sobreposto sem faixa separada',()=>{
 assert.match(home,/\.sumba-carousel-controls\{position:absolute/);
 assert.match(home,/\.sumba-carousel-dots\{position:absolute/);
 assert.match(home,/setInterval\(\(\)=>\{/);
});
test('email, telefone, OTP e início de OAuth Google',()=>{
 assert.match(auth,/signInWithPassword/);assert.match(auth,/signInWithOtp\(\{phone:/);
 assert.match(auth,/type:'sms'/);assert.match(auth,/signInWithOAuth/);
});
test('ADM com moderação e confirmação',()=>{
 assert.match(admin,/data-tab="users"/);assert.match(admin,/data-tab="compose"/);
 assert.match(admin,/\['suspend','block','activate'\]\.includes\(action\)/);
 assert.match(admin,/api\(client,'moderate'/);assert.match(admin,/name="confirm" required/);
});
test('alertas persistidos com indicador vermelho',()=>{
 assert.match(notifications,/unread===0/);assert.match(notifications,/update\(\{read_at:now\}\)/);
 assert.match(notifications,/postgres_changes/);assert.match(notifications,/sms_marketing/);
});
