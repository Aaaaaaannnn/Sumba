const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),read=p=>fs.readFileSync(path.join(root,p),'utf8');
const source=read('public/real/market.js'),auth=read('public/real/real.js'),sql=read('supabase/sql/sumba_live_market_v1.sql');
test('the authenticated market is a parseable isolated ES module',async()=>{
 const mod=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 assert.equal(typeof mod.mountMarket,'function');
});
test('real market uses persistent account data, not demo local storage',()=>{
 for(const t of ['sumba_products','sumba_cart_items','sumba_inquiries','sumba_inquiry_messages','zunga_stalls'])assert.ok(source.includes(t),t);
 assert.doesNotMatch(source,/localStorage|sessionStorage|SUMBA-DEMO|demo@sumba\.test/);
 assert.match(auth,/import\('\.\/market\.js'\)/);
 assert.match(auth,/document\.getElementById\('sumbaMarketRoot'\)/);
 assert.match(source,/upsert\(\{user_id:user\.id,product_id:id,quantity:q/);
 assert.match(source,/client\.from\('sumba_inquiries'\)\.insert/);
 assert.match(source,/client\.from\('sumba_inquiry_messages'\)\.insert/);
});
test('database security protects buyer and seller rows',()=>{
 for(const table of ['sumba_products','sumba_cart_items','sumba_inquiries','sumba_inquiry_messages']){
  assert.match(sql,new RegExp('alter table public\\.'+table+' enable row level security'));
 }
 assert.match(sql,/buyer_id=\(select auth\.uid\(\)\)/);
 assert.match(sql,/seller_id=\(select auth\.uid\(\)\)/);
 assert.match(sql,/owner_id=\(select auth\.uid\(\)\)/);
 assert.match(sql,/revoke all on public\.sumba_inquiries,public\.sumba_inquiry_messages from authenticated/);
 assert.match(sql,/grant update \(status,response\) on public\.sumba_inquiries to authenticated/);
});
test('real catalog has no payment completion or fake purchases',()=>{
 assert.match(source,/A finalização e o pagamento só serão disponibilizados/);
 assert.match(source,/Ainda não existem produtos publicados/);
 assert.doesNotMatch(source,/window\.location\.assign\('https:\/\/.+checkout|paymentDemo|approved_demo/);
});
const noop=()=>{};
const makeClient=()=>{
 const queried=[];
 return {queried,from(table){
   queried.push(table);
   const q={select(){return q},order(){return q},limit(){return q},eq(){return q},in(){return q},
     maybeSingle(){return Promise.resolve({data:null,error:null})},
     then(onFulfilled,onRejected){return Promise.resolve({data:[],error:null}).then(onFulfilled,onRejected)}};
   return q;
 }};
};
test('marketplace renders empty genuine data for buyers and seller without inventing products',async()=>{
 const module=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 for(const role of ['buyer','producer','company']){
  const client=makeClient(),element={isConnected:true,innerHTML:'',addEventListener:noop};
  await module.mountMarket(client,element,{id:'11111111-1111-4111-8111-111111111111'},{role});
  assert.match(element.innerHTML,/Mercado SUMBA/);
  if(role==='producer')assert.match(element.innerHTML,/Cria primeiro a tua bancada/);
  else assert.match(element.innerHTML,/Ainda não existem produtos publicados/);
  assert.ok(client.queried.includes('sumba_products'));
  assert.ok(client.queried.includes('sumba_inquiries'));
 }
});
