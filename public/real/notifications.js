
/* SUMBA — notificações verificadas no Supabase; sem contadores fictícios. */
const escapeNotification=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const when=v=>new Date(v).toLocaleString('pt-AO',{dateStyle:'short',timeStyle:'short'});
export async function mountNotifications(client,header,host){
 if(!header||!host||!header.isConnected||!host.isConnected)return;
 const userResult=await client.auth.getUser();
 const user=userResult.data?.user;if(userResult.error||!user)return;
 const existing=document.getElementById('sumbaNotifications');
 if(existing)existing.remove();
 const bell=document.createElement('section');bell.id='sumbaNotifications';bell.className='notification-shell';
 bell.innerHTML='<button type="button" id="sumbaNotificationBell" aria-label="Notificações" aria-expanded="false">'+
 '<svg viewBox="0 0 24 24" aria-hidden="true" width="21" height="21" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M18 8a6 6 0 0 0-12 0c0 8-3 8-3 10h18c0-2-3-2-3-10zM10 21h4"/></svg>'+
 '<span class="notification-count" id="sumbaNotificationCount" hidden></span></button>'+
 '<div id="sumbaNotificationPanel" class="notification-panel" hidden><div class="notification-title"><strong>Notificações</strong>'+
 '<button type="button" id="sumbaCloseNotifications" class="outline" aria-label="Fechar notificações">Fechar</button></div>'+
 '<div id="sumbaNotificationItems" class="notification-items"></div></div>';
 header.appendChild(bell);
 const toggle=bell.querySelector('#sumbaNotificationBell'),panel=bell.querySelector('#sumbaNotificationPanel'),
 count=bell.querySelector('#sumbaNotificationCount'),items=bell.querySelector('#sumbaNotificationItems');
 let list=[],active=true,loaded=false,lastId=null,channel=null;
 const updateBadge=()=>{
  const unread=list.filter(n=>!n.read_at).length;
  count.hidden=unread===0;
  count.textContent=unread>99?'99+':String(unread);
  toggle.setAttribute('aria-label',unread?unread+' notificações não lidas':'Notificações');
 };
 const render=()=>{
  items.innerHTML=list.length?list.map(n=>'<article class="notification-item '+(n.read_at?'read':'new')+'">'+
   '<div class="notification-item-head"><strong>'+escapeNotification(n.title)+'</strong><time>'+when(n.created_at)+'</time></div>'+
   '<p>'+escapeNotification(n.body)+'</p></article>').join(''):
   '<p class="muted">Ainda não tens notificações.</p>';
  updateBadge();
 };
 const refresh=async()=>{
  if(!bell.isConnected){active=false;return}
  const r=await client.from('sumba_notifications').select('id,kind,title,body,created_at,read_at')
   .eq('user_id',user.id).order('created_at',{ascending:false}).limit(80);
  if(r.error)return;
  const next=r.data||[];
  const newest=next[0]?.id;
  if(loaded&&newest&&newest!==lastId&&panel.hidden){
    const info=next.find(n=>n.id===newest);
    if(info){const toast=document.createElement('div');toast.className='sumba-notification-toast';toast.textContent=info.title+' — '+info.body;
      document.body.appendChild(toast);setTimeout(()=>toast.remove(),5000);}
  }
  lastId=newest;loaded=true;list=next;render();
 };
 const viewed=async()=>{
  const unread=list.filter(n=>!n.read_at).map(n=>n.id);
  if(!unread.length)return;
  const now=new Date().toISOString();
  const result=await client.from('sumba_notifications').update({read_at:now}).eq('user_id',user.id).in('id',unread);
  if(!result.error){list.forEach(n=>{if(unread.includes(n.id))n.read_at=now});render()}
 };
 toggle.addEventListener('click',async()=>{
  panel.hidden=!panel.hidden;
  toggle.setAttribute('aria-expanded',String(!panel.hidden));
  if(!panel.hidden){await refresh();await viewed();}
 });
 bell.querySelector('#sumbaCloseNotifications').addEventListener('click',()=>{panel.hidden=true;toggle.setAttribute('aria-expanded','false')});
 document.addEventListener('pointerdown',event=>{
  if(!bell.isConnected)return;
  if(!bell.contains(event.target)){panel.hidden=true;toggle.setAttribute('aria-expanded','false')}
 });
 const preferences=document.createElement('section');preferences.className='panel sumba-notification-preferences';preferences.id='sumbaNotificationPreferences';
 preferences.innerHTML='<h2>Preferências de notificações</h2><p class="muted">Escolhe como queres receber novidades da SUMBA. A autenticação e os alertas essenciais podem continuar a usar o canal de verificação da conta.</p>'+
 '<form id="sumbaPreferences">'+
 '<label class="check"><input type="checkbox" name="in_app" checked> Notificações no site</label>'+
 '<label class="check"><input type="checkbox" name="email_transactional" checked> Emails sobre a minha conta e actividade</label>'+
 '<label class="check"><input type="checkbox" name="email_marketing"> Ofertas e novidades por email</label>'+
 '<label class="check"><input type="checkbox" name="sms_transactional"> SMS sobre a minha conta e actividade</label>'+
 '<label class="check"><input type="checkbox" name="sms_marketing"> Ofertas por SMS</label>'+
 '<button type="submit">Guardar preferências</button><p class="muted" id="sumbaPreferencesStatus" role="status"></p></form>';
 host.appendChild(preferences);
 const prefForm=preferences.querySelector('#sumbaPreferences');
 const prefStatus=preferences.querySelector('#sumbaPreferencesStatus');
 let prefsLoaded=false;
 const prefs=await client.from('sumba_notification_preferences').select('*').eq('user_id',user.id).maybeSingle();
 if(!prefs.error){
  const values=prefs.data||{in_app:true,email_transactional:true,email_marketing:false,sms_transactional:false,sms_marketing:false};
  for(const field of ['in_app','email_transactional','email_marketing','sms_transactional','sms_marketing']){
   prefForm.elements[field].checked=!!values[field];
  }
  prefsLoaded=true;
 }
 prefForm.addEventListener('submit',async e=>{
  e.preventDefault();
  prefStatus.textContent='A guardar...';
  const payload={user_id:user.id,updated_at:new Date().toISOString()};
  for(const field of ['in_app','email_transactional','email_marketing','sms_transactional','sms_marketing'])
   payload[field]=prefForm.elements[field].checked;
  const result=await client.from('sumba_notification_preferences').upsert(payload,{onConflict:'user_id'});
  prefStatus.textContent=result.error?'Falha ao guardar. Tenta novamente.':'Preferências actualizadas.';
 });
 await refresh();
 try{
  channel=client.channel('sumba-notification-'+user.id)
   .on('postgres_changes',{event:'INSERT',schema:'public',table:'sumba_notifications',filter:'user_id=eq.'+user.id},()=>refresh())
   .subscribe();
 }catch{}
 const interval=setInterval(()=>{
  if(!bell.isConnected){active=false;clearInterval(interval);if(channel)client.removeChannel(channel);return}
  if(active&&!document.hidden)refresh();
 },30000);
}
