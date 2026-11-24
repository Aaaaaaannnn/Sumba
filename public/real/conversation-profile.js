const escapeHtml=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const types={buyer:'Cliente',producer:'Fornecedor',company:'Empresa',courier:'Entregador',admin:'Administração',stall:'Bancada',support:'Atendimento'};
export async function openConversationProfile(client,type,reference,trigger){
 const dialog=document.createElement('dialog');
 dialog.className='sumba-chat-profile-dialog';
 dialog.setAttribute('aria-label','Perfil da conversa');
 dialog.innerHTML='<h2 data-profile-name>Perfil</h2><div data-profile-fields><p role="status">A carregar perfil…</p></div><form method="dialog"><button type="submit">Fechar</button></form>';
 dialog.addEventListener('close',()=>{dialog.remove();if(trigger?.isConnected)trigger.focus()},{once:true});
 document.body.append(dialog);dialog.showModal();
 const content=dialog.querySelector('[data-profile-fields]');
 try{
  const {data,error}=await client.rpc('sumba_chat_profile',{conversation_type:type,reference_id:reference});
  if(error||!data){content.innerHTML='<p>Perfil indisponível.</p>';return}
  dialog.querySelector('[data-profile-name]').textContent=data.name;
  const rows=[['Tipo',types[data.kind]],['Localização',[data.city,data.province].filter(Boolean).join(', ')],['Apresentação',data.description],['E-mail',data.email],['Telefone',data.phone],['Conta criada em',data.created&&new Date(data.created).toLocaleDateString('pt-AO')]];
  content.innerHTML=data.kind==='support'?'<p>Atendimento e ajuda com a tua conta e os teus pedidos.</p>':
   '<dl>'+rows.filter(([,value])=>value).map(([label,value])=>'<dt>'+escapeHtml(label)+'</dt><dd>'+escapeHtml(value)+'</dd>').join('')+'</dl>';
 }catch{content.innerHTML='<p>Não foi possível carregar o perfil.</p>'}
}
