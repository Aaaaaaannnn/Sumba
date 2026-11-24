/* SUMBA — mercado de contas autenticadas.
   Toda a informação é lida/gravada no Supabase com RLS; não reutiliza dados demo. */
const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const kz=value=>new Intl.NumberFormat('pt-AO',{maximumFractionDigits:2}).format(Number(value)||0)+' Kz';
const num=value=>Number(String(value??'').replace(',','.'));
const safeQty=(value,product)=>{const q=num(value);return Number.isFinite(q)&&q>=Number(product.min_qty)&&q<=Number(product.available_qty)&&q>0&&q<=1000000?q:null};
const verified=result=>{if(result.error)throw result.error;return result.data};
const textInput=(name,label,attrs='')=>'<label class="sumba-field">'+label+'<input name="'+name+'" '+attrs+'></label>';
const statusLabel=s=>({open:'Aberto',answered:'Respondido',declined:'Recusado'})[s]||'Em análise';
export async function mountMarket(client,root,user,profile){
 if(!root||!user?.id||!['buyer','producer','company'].includes(profile?.role))return;
 const isSeller=profile.role==='producer',isBuyer=['buyer','company'].includes(profile.role);
 const state={products:[],stalls:new Map(),cart:[],inquiries:[],messages:[],stall:null,activeRequest:null,error:''};
 const canUse=()=>root.isConnected!==false;
 const render=()=>{
  if(!canUse())return;
  const myProducts=state.products.filter(p=>p.owner_id===user.id);
  const publicProducts=state.products.filter(p=>p.published&&Number(p.available_qty)>0&&state.stalls.has(p.stall_id));
  const availableIds=new Map(publicProducts.map(p=>[p.id,p]));
  const cartHtml=state.cart.map(row=>{
   const p=availableIds.get(row.product_id);
   if(!p)return '<div class="sumba-live-cartline"><span>Produto indisponível</span><button type="button" data-live-action="remove-cart" data-id="'+escapeHtml(row.product_id)+'">Remover</button></div>';
   return '<div class="sumba-live-cartline"><div><strong>'+escapeHtml(p.name)+'</strong><small>'+escapeHtml(p.unit)+' · '+kz(p.price_kz)+'</small></div>'+
    '<div class="sumba-live-cart-actions">'+textInput('qty','Quantidade','data-cart-qty="'+escapeHtml(p.id)+'" type="number" step="0.01" inputmode="decimal" min="'+escapeHtml(p.min_qty)+'" max="'+escapeHtml(p.available_qty)+'" value="'+escapeHtml(row.quantity)+'"')+
    '<button type="button" data-live-action="save-cart" data-id="'+escapeHtml(p.id)+'">Guardar</button><button type="button" class="outline" data-live-action="remove-cart" data-id="'+escapeHtml(p.id)+'">Remover</button></div></div>';
  }).join('');
  const inbox=state.inquiries.length?state.inquiries.map(q=>{
   const product=state.products.find(p=>p.id===q.product_id);
   const messages=state.messages.filter(m=>m.inquiry_id===q.id);
   const title=isSeller?'Ver perfil do cliente':'Ver perfil da bancada';
   return '<article class="sumba-live-inquiry"><header><button type="button" class="sumba-profile-trigger" data-live-action="conversation-profile" data-id="'+escapeHtml(q.id)+'" title="'+title+'" aria-label="'+title+'"><svg viewBox="0 0 24 24" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><circle cx="12" cy="8" r="3"/><path d="M5 20v-2a7 7 0 0 1 14 0v2"/></svg></button><strong>'+escapeHtml(product?.name||'Produto')+'</strong><span>'+statusLabel(q.status)+'</span></header>'+
   '<p>Quantidade solicitada: '+escapeHtml(q.quantity)+'</p><p>'+escapeHtml(q.note)+'</p>'+
   (q.response?'<p><strong>Resposta:</strong> '+escapeHtml(q.response)+'</p>':'')+
   '<div class="sumba-live-messages">'+messages.map(m=>'<p><strong>'+ (m.sender_id===user.id?'Eu':'Outra parte')+':</strong> '+escapeHtml(m.body)+'</p>').join('')+'</div>'+
   '<form class="sumba-live-reply" data-live-form="message"><input type="hidden" name="inquiryId" value="'+escapeHtml(q.id)+'">'+
   textInput('body','Mensagem','required maxlength="2000" minlength="1" placeholder="Escreve a mensagem"')+
   '<button type="submit">Enviar mensagem</button></form>'+
   (isSeller?'<button type="button" class="outline" data-live-action="decline-request" data-id="'+escapeHtml(q.id)+'" '+(q.status==='declined'?'disabled':'')+'>Recusar pedido</button>':'')+
   '</article>';
  }).join(''):'<p class="muted">Ainda não existem pedidos ou mensagens nesta conta.</p>';
  const supplierPanel=isSeller?
   '<section class="panel sumba-live-panel"><h2>Os meus produtos</h2>'+
   (!state.stall?'<p>Cria primeiro a tua bancada no formulário acima para adicionar produtos.</p>':
    '<p class="muted">Os produtos publicados só aparecem aos compradores se a bancada também estiver publicada.</p>'+
    '<form data-live-form="product" class="sumba-live-form">'+
    textInput('name','Nome do produto','required minlength="2" maxlength="100" placeholder="Ex.: Tomate fresco"')+
    '<label class="sumba-field">Categoria<select name="category"><option>Hortícolas</option><option>Frutas</option><option>Grãos</option><option>Tubérculos</option><option>Legumes</option><option>Outros</option></select></label>'+
    '<label class="sumba-field">Unidade<select name="unit"><option value="kg">Quilograma</option><option value="unidade">Unidade</option><option value="caixa">Caixa</option><option value="saco">Saco</option><option value="litro">Litro</option><option value="molho">Molho</option></select></label>'+
    textInput('price','Preço (Kz)','type="number" inputmode="decimal" step="0.01" min="0.01" required')+
    textInput('stock','Quantidade disponível','type="number" inputmode="decimal" step="0.01" min="0" required')+
    textInput('minimum','Quantidade mínima por pedido','type="number" inputmode="decimal" step="0.01" min="0.01" value="1" required')+
    '<label class="sumba-field">Descrição<textarea name="description" maxlength="1000" rows="2"></textarea></label>'+
    '<label class="sumba-live-check"><input type="checkbox" name="published" checked> Publicar produto</label>'+
    '<button type="submit">Adicionar produto</button></form>')+
   '<div class="sumba-live-products">'+(myProducts.length?myProducts.map(p=>'<article><h3>'+escapeHtml(p.name)+'</h3><p>'+kz(p.price_kz)+' / '+escapeHtml(p.unit)+' · '+escapeHtml(p.available_qty)+' disponíveis</p><p class="muted">Mínimo '+escapeHtml(p.min_qty)+' · '+(p.published?'Publicado':'Não publicado')+'</p>'+
    '<form data-live-form="stock" class="sumba-live-stock"><input type="hidden" name="id" value="'+escapeHtml(p.id)+'">'+
    textInput('price','Preço (Kz)','type="number" inputmode="decimal" step="0.01" min="0.01" required value="'+escapeHtml(p.price_kz)+'"')+
    textInput('stock','Disponibilidade','type="number" inputmode="decimal" step="0.01" min="0" required value="'+escapeHtml(p.available_qty)+'"')+
    '<button type="submit">Guardar</button><button type="button" class="outline" data-live-action="toggle-product" data-id="'+escapeHtml(p.id)+'">'+(p.published?'Retirar do catálogo':'Publicar')+'</button></form></article>').join(''):'<p class="muted">Ainda não adicionaste produtos.</p>')+'</div></section>'
   :'';
  const catalogPanel=isBuyer?'<section class="panel sumba-live-panel"><h2>Produtos dos fornecedores</h2><p class="muted">Ofertas publicadas por utilizadores registados, sem produtos demonstrativos.</p>'+
   '<div class="sumba-live-grid">'+(publicProducts.length?publicProducts.map(p=>{
    const stall=state.stalls.get(p.stall_id);
    return '<article class="sumba-live-product"><div><small>'+escapeHtml(p.category)+' · '+escapeHtml(stall?.name||'Bancada')+'</small><h3>'+escapeHtml(p.name)+'</h3><p>'+escapeHtml(p.description||'')+'</p><strong>'+kz(p.price_kz)+' / '+escapeHtml(p.unit)+'</strong><small>Mínimo '+escapeHtml(p.min_qty)+' · Disponível '+escapeHtml(p.available_qty)+'</small></div>'+
     textInput('qty','Quantidade','data-product-qty="'+escapeHtml(p.id)+'" type="number" inputmode="decimal" step="0.01" min="'+escapeHtml(p.min_qty)+'" max="'+escapeHtml(p.available_qty)+'" value="'+escapeHtml(p.min_qty)+'"')+
     '<button type="button" data-live-action="add-cart" data-id="'+escapeHtml(p.id)+'">Adicionar ao cesto</button>'+
     (state.activeRequest===p.id?'<form data-live-form="inquiry"><input type="hidden" name="productId" value="'+escapeHtml(p.id)+'">'+
      textInput('quantity','Quantidade pretendida','type="number" inputmode="decimal" step="0.01" min="'+escapeHtml(p.min_qty)+'" max="'+escapeHtml(p.available_qty)+'" value="'+escapeHtml(p.min_qty)+'" required')+
      '<label class="sumba-field">Mensagem ao fornecedor<textarea name="note" minlength="2" maxlength="1000" rows="2" required placeholder="Escreve o teu pedido"></textarea></label><button type="submit">Enviar pedido ao fornecedor</button></form>':
      '<button type="button" class="outline" data-live-action="open-request" data-id="'+escapeHtml(p.id)+'">Contactar fornecedor</button>')+
     '</article>';
   }).join(''):'<p class="muted">Ainda não existem produtos publicados por fornecedores. Não foram introduzidos exemplos artificiais.</p>')+'</div></section>'+
   '<section class="panel sumba-live-panel"><h2>O meu cesto</h2>'+(state.cart.length?cartHtml:'<p class="muted">O teu cesto está vazio.</p>')+
   '<p class="sumba-live-safe">O cesto fica associado à tua conta. A finalização e o pagamento só serão disponibilizados com integração financeira e logística verificada.</p></section>':'';
  root.innerHTML='<div class="sumba-live-market">'+
   '<div class="sumba-live-head"><h2>Mercado SUMBA</h2><button type="button" class="outline" data-live-action="refresh">Atualizar mercado</button></div>'+
   (state.error?'<p class="sumba-live-error" role="alert">'+escapeHtml(state.error)+'</p>':'')+
   supplierPanel+catalogPanel+
   '<section class="panel sumba-live-panel"><h2>'+ (isSeller?'Pedidos recebidos':'Contactos com fornecedores')+'</h2>'+inbox+'</section>'+
   '</div>';
 };
 const refresh=async()=>{
  if(!canUse())return;
  state.error='';
  const productsQuery=client.from('sumba_products').select('*').order('created_at',{ascending:false}).limit(120);
  state.products=verified(await (isSeller?productsQuery.eq('owner_id',user.id):productsQuery.eq('published',true)))||[];
  if(isSeller){state.stall=verified(await client.from('zunga_stalls').select('id,name,published').eq('owner_id',user.id).maybeSingle());}
  if(isBuyer){
    const stalls=verified(await client.from('zunga_stalls').select('id,name,province,city').eq('published',true).limit(200))||[];
    state.stalls=new Map(stalls.map(s=>[s.id,s]));
    state.cart=verified(await client.from('sumba_cart_items').select('id,product_id,quantity').eq('user_id',user.id).limit(120))||[];
  }
  state.inquiries=verified(await client.from('sumba_inquiries').select('id,buyer_id,seller_id,product_id,quantity,note,status,response,created_at').eq(isSeller?'seller_id':'buyer_id',user.id).order('created_at',{ascending:false}).limit(80))||[];
  const ids=state.inquiries.map(i=>i.id);
  state.messages=ids.length?(verified(await client.from('sumba_inquiry_messages').select('inquiry_id,sender_id,body,created_at').in('inquiry_id',ids).order('created_at',{ascending:true}).limit(250))||[]):[];
  render();
 };
 let busy=false;
 const doAction=async fn=>{
  if(busy)return;busy=true;
  try{await fn();await refresh();state.error='';}
  catch(e){state.error=e?.code==='42501'?'Esta operação não é permitida para a tua conta.':String(e?.message||'Falha ao comunicar com a SUMBA.').slice(0,180);render();}
  finally{busy=false}
 };
 const getProduct=id=>state.products.find(p=>p.id===id);
 const addCart=async(id,quantity)=>{
  if(!isBuyer)throw Error('Não tens autorização para usar o cesto.');
  const p=getProduct(id),q=p&&safeQty(quantity,p);
  if(!p||q===null)throw Error('Revê a quantidade e disponibilidade do produto.');
  verified(await client.from('sumba_cart_items').upsert({user_id:user.id,product_id:id,quantity:q,updated_at:new Date().toISOString()},{onConflict:'user_id,product_id'}));
 };
 root.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-live-action]');if(!b||!root.contains(b))return;
  const action=b.dataset.liveAction,id=b.dataset.id;
  if(action==='conversation-profile'){
   if(state.inquiries.some(row=>row.id===id))void import('./conversation-profile.js').then(({openConversationProfile})=>openConversationProfile(client,'market',id,b)).catch(()=>{state.error='Não foi possível carregar o perfil.';render()});
   return;
  }
  if(action==='open-request'){state.activeRequest=state.activeRequest===id?null:id;render();return;}
  if(action==='refresh'){void doAction(refresh);return;}
  if(action==='add-cart'){const input=root.querySelector('[data-product-qty="'+CSS.escape(id)+'"]');void doAction(()=>addCart(id,input?.value));return;}
  if(action==='save-cart'){const input=root.querySelector('[data-cart-qty="'+CSS.escape(id)+'"]');void doAction(()=>addCart(id,input?.value));return;}
  if(action==='remove-cart'){void doAction(async()=>{verified(await client.from('sumba_cart_items').delete().eq('user_id',user.id).eq('product_id',id))});return;}
  if(action==='toggle-product'&&isSeller){const product=getProduct(id);if(product)void doAction(async()=>{
   verified(await client.from('sumba_products').update({published:!product.published,updated_at:new Date().toISOString()}).eq('id',id).eq('owner_id',user.id));
  });return;}
  if(action==='decline-request'&&isSeller){void doAction(async()=>{
   verified(await client.from('sumba_inquiries').update({status:'declined'}).eq('id',id).eq('seller_id',user.id));
  });}
 });
 root.addEventListener('submit',e=>{
  const f=e.target;if(!f.matches('[data-live-form]'))return;
  e.preventDefault();
  const data=new FormData(f),val=k=>String(data.get(k)||'').trim(),form=f.dataset.liveForm;
  void doAction(async()=>{
   if(form==='product'){
    if(!isSeller||!state.stall)throw Error('Cria primeiro a tua bancada.');
    const price=num(val('price')),stock=num(val('stock')),minimum=num(val('minimum')),name=val('name');
    if(name.length<2||!Number.isFinite(price)||price<=0||!Number.isFinite(stock)||stock<0||!Number.isFinite(minimum)||minimum<=0)throw Error('Confirma os dados do produto.');
    verified(await client.from('sumba_products').insert({
      owner_id:user.id,stall_id:state.stall.id,name,category:val('category'),unit:val('unit'),
      price_kz:price,available_qty:stock,min_qty:minimum,description:val('description'),
      published:data.has('published')
    }));
   }else if(form==='stock'){
    if(!isSeller)throw Error('Apenas produtores podem alterar produtos.');
    const id=val('id'),price=num(val('price')),stock=num(val('stock'));
    if(!getProduct(id)||!Number.isFinite(price)||price<=0||!Number.isFinite(stock)||stock<0)throw Error('Produto ou preço inválido.');
    verified(await client.from('sumba_products').update({price_kz:price,available_qty:stock,updated_at:new Date().toISOString()}).eq('id',id).eq('owner_id',user.id));
   }else if(form==='inquiry'){
    if(!isBuyer)throw Error('Apenas compradores podem contactar fornecedores.');
    const product=getProduct(val('productId')),q=product&&safeQty(val('quantity'),product),note=val('note');
    if(!product||q===null||note.length<2||note.length>1000||product.owner_id===user.id)throw Error('Revê o teu pedido e a quantidade.');
    verified(await client.from('sumba_inquiries').insert({buyer_id:user.id,seller_id:product.owner_id,product_id:product.id,quantity:q,note}));
    state.activeRequest=null;
   }else if(form==='message'){
    const inquiry=state.inquiries.find(q=>q.id===val('inquiryId')),body=val('body');
    if(!inquiry||!body||body.length>2000)throw Error('Mensagem inválida.');
    verified(await client.from('sumba_inquiry_messages').insert({inquiry_id:inquiry.id,sender_id:user.id,body}));
    if(isSeller&&inquiry.status==='open'){
      verified(await client.from('sumba_inquiries').update({status:'answered'}).eq('seller_id',user.id).eq('id',inquiry.id));
    }
   }
  });
 });
 root.innerHTML='<div class="panel"><h2>Mercado SUMBA</h2><p class="muted">A carregar informações da tua conta…</p></div>';
 try{await refresh()}catch(e){state.error='Não foi possível carregar os dados do mercado. Confirma a ligação ou tenta novamente.';render();}
}
