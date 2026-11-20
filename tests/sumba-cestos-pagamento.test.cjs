/* Contratos estáticos: node --test tests/sumba-cestos-pagamento.test.cjs */
const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const html=read('public/index.html');
const script=html.match(/<script>([\s\S]*?)<\/script>/)?.[1];
test('Entradas principais sincronizadas e script válido',()=>{
  assert.equal(html,read('index.html'));
  assert.ok(script,'script inline');
  new vm.Script(script);
});
test('Cabeçalho oculta login demo quando a sessão está iniciada',()=>{
  assert.match(script,/loginLink\.hidden=!!logged/);
  assert.match(html,/#sumbaAccountLink\[hidden\]/);
  assert.match(html,/\.sumba-notification-link\{order:8/);
});
test('Cestos independentes com estado preservado por cesto',()=>{
  for(const t of ['sumbaEnsureBaskets','sumbaPersistActiveBasket','sumbaSwitchBasket','sumbaBuySeparateStall','sumbaBasketForm','sumba-basket-manager'])
    assert.ok(html.includes(t),'Falta '+t);
  assert.match(script,/shop\.baskets/);
  assert.match(script,/shop\.activeBasketId/);
  assert.match(script,/saveShop=\(\)=>\{try\{sumbaPersistActiveBasket\(\)/);
});
test('Pagamento Multicaixa Express é apenas simulado, sem API bancária',()=>{
  assert.match(script,/Multicaixa Express \(simulação\)/);
  assert.match(script,/pending_demo/);
  assert.match(script,/approved_demo/);
  assert.match(script,/sumbaCompleteDemoPayment/);
  assert.match(script,/Não introduzas NIF ou telefone pessoais/);
  assert.match(script,/nifLast4/);
  assert.match(script,/phoneLast3/);
  assert.doesNotMatch(script,/api\.multicaixa/);
});
test('Publicação paralela preserva serviços existentes',()=>{
  assert.equal(JSON.parse(read('wrangler.jsonc')).name,'zunga');
  assert.equal(JSON.parse(read('wrangler.auth.jsonc')).name,'zunga-auth');
  assert.equal(JSON.parse(read('wrangler.sumba.jsonc')).name,'sumba');
});
