// SUMBA Auth · testes de execução em memória. Sem rede e sem envio de mensagens.
import vm from 'node:vm';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const path=fileURLToPath(new URL('../public/real/real.js',import.meta.url));
const src=readFileSync(path,'utf8');
const patched=src.replace(/start\(\);\s*\}\)\(\);\s*$/,"globalThis.__sumbaTest={setClient:c=>client=c,execute,requestCode,otpScreen,restorePending,clearPending,resumeOtpFromEmailLink,authError,socialButtons};})();");
assert.notEqual(patched,src,'Teste não conseguiu aceder ao módulo');
let now=1732000000000;
const saved=new Map();
const sessionStorage={getItem:k=>saved.get(k)||null,setItem:(k,v)=>saved.set(k,v),removeItem:k=>saved.delete(k)};
const elements=new Map(),digits=Array.from({length:6},()=>({textContent:'',classList:{toggle(){}}}));
const node=()=>({innerHTML:'',textContent:'',value:'',disabled:false,classList:{toggle(){}},listeners:{},addEventListener(k,cb){this.listeners[k]=cb},focus(){this.focused=true},remove(){this.removed=true}});
const document={getElementById:id=>{if(!elements.has(id))elements.set(id,node());return elements.get(id)},querySelectorAll:selector=>selector==='.otp-digit'?digits:[],addEventListener:()=>{}};
class FormData{constructor(f){this.values=f.values}get(n){return this.values[n]??null}has(n){return Object.hasOwn(this.values,n)}}
const calls=[],success=data=>({data,error:null});let activeUser=null;
const auth={
 signUp:async x=>(calls.push(['signup',x]),success({session:null})),
 resend:async x=>(calls.push(['resend',x]),success({})),
 signInWithOtp:async x=>(calls.push(['signInWithOtp',x]),success({})),
 resetPasswordForEmail:async(...x)=>(calls.push(['reset',x]),success({})),
 verifyOtp:async x=>(calls.push(['verify',x]),activeUser={id:'test',email:x.email,email_confirmed_at:'now'},success({session:{}})),
 getUser:async()=>success({user:activeUser}),
 updateUser:async x=>(calls.push(['update',x]),success({})),
 signOut:async x=>(calls.push(['signOut',x]),activeUser=null,success({})),
 signInWithPassword:async x=>(calls.push(['password',x]),success({}))
};
const client={auth,from:()=>({select:()=>({eq:()=>({maybeSingle:async()=>success(null)})})})};
const ctx=vm.createContext({console,document,window:{ZUNGA_REAL_CONFIG:{oauth:{google:false,facebook:false}}},location:{origin:'https://zunga-auth.stivenluanda04.workers.dev',pathname:'/'},sessionStorage,FormData,Date:{now:()=>now},setInterval:()=>1,clearInterval:()=>{},setTimeout:()=>{},URLSearchParams,history:{}});
vm.runInContext(patched,ctx,{filename:'real.js'});
const app=ctx.__sumbaTest;app.setClient(client);
let checks=0;const check=(x,m)=>{assert.ok(x,m);checks++};
const form=(id,mode,values)=>({id,dataset:{mode},values});
await app.execute(form('authForm','register',{email:'teste@example.test',password:'abcdefgh1234',confirm:'abcdefgh1234',agree:'yes'}));
check(calls.at(-1)[0]==='signup','signup enviado ao backend');
check(elements.get('content').innerHTML.includes('otpForm'),'formulário de código visível');
check(JSON.parse(saved.get('sumba-auth-otp-v2')).mode==='register','modo guardado sem token');
const st=saved.get('sumba-auth-otp-v2');app.clearPending();saved.set('sumba-auth-otp-v2',st);app.restorePending();app.otpScreen();check(elements.get('content').innerHTML.includes('otpForm'),'recupera pedido no mesmo browser');
check(elements.get('content').innerHTML.includes('otp-digits'),'six visual digit slots');
const otp=elements.get('otpCode');otp.value='12a3456';otp.listeners.input();
check(otp.value==='123456','OTP digits normalized');
check(digits.every((item)=>item.textContent!==''),'OTP digits distributed in six slots');
otp.listeners.paste({clipboardData:{getData:()=> '8 7 6 5 4 3'},preventDefault(){}});
check(otp.value==='876543','paste six digits at once');
await app.execute(form('otpForm','',{token:'123456'}));
check(calls.at(-1)[1].type==='email','tipo de confirmação correcto');
check(!saved.has('sumba-auth-otp-v2'),'estado limpo depois de confirmar');
now+=61000;await app.requestCode('otp','teste@example.test');
check(calls.at(-1)[1].options.shouldCreateUser===false,'login OTP não cria utilizadores');
app.clearPending();now+=61000;await app.requestCode('reset','teste@example.test');
await app.execute(form('otpForm','',{token:'123456'}));
check(calls.filter(x=>x[0]==='verify').at(-1)[1].type==='recovery','recuperação verificada pelo servidor');
await app.execute(form('recovery','',{password:'abcdefgh5678',confirm:'abcdefgh5678'}));
check(calls.at(-1)[0]==='signOut'&&calls.at(-1)[1].scope==='global','logout global após reset');
check(!saved.has('sumba-auth-otp-v2'),'sem código no browser após reset');
check(app.socialButtons().includes('Continuar com Google'),'OAuth Google permanece disponível como alternativa');
await app.execute(form('authForm','login',{email:'teste@example.test'}));
check(calls.at(-1)[0]==='signInWithOtp'&&calls.at(-1)[1].options.shouldCreateUser===false,'email login defaults to OTP without creating accounts');
check(app.authError({code:'otp_expired'}).includes('expirado'),'erro de código amigável');

app.clearPending();
ctx.location.hash='#email-otp=teste%2Bnovo%40example.test';
ctx.history.replaceState=(...args)=>{ctx.history.replacedWith=args.at(-1)};
check(app.resumeOtpFromEmailLink(),'valid direct email link accepted');
check(ctx.history.replacedWith==='https://zunga-auth.stivenluanda04.workers.dev/','email removed from URL');
app.otpScreen();
check(elements.get('content').innerHTML.includes('teste+novo@example.test'),'direct email link opens six-digit verification UI');
await app.execute(form('otpForm','',{token:'123456'}));
check(calls.filter(x=>x[0]==='verify').at(-1)[1].email==='teste+novo@example.test','linked email verified using server-side OTP');

console.log('SUMBA Auth runtime: '+checks+' verificações simuladas aprovadas. SMTP e login real não testados.');
