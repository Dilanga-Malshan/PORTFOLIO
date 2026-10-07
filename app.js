const groups={
'Languages':[['Python','python'],['JavaScript','js'],['TypeScript','ts'],['Dart','dart']],
'AI & Backend':[['LangChain','langchain'],['LangGraph','langgraph'],['OpenAI API','openai'],['Ollama','ollama'],['FastAPI','fastapi'],['PostgreSQL','postgres'],['Pydantic','pydantic'],['SQLAlchemy','sqlalchemy']],
'Frontend & Mobile':[['Angular','angular'],['HTML','html'],['CSS','css'],['Flutter','flutter']],
'Developer tools':[['Git','git'],['GitHub','github'],['VS Code','vscode'],['pytest','pytest'],['Ruff','ruff']],
'Software & Design Tools':[['Android Studio','androidstudio'],['IntelliJ IDEA','idea'],['PyCharm','pycharm'],['WebStorm','webstorm']]};
const simple=new Set(['langchain','langgraph','openai','ollama','pydantic','sqlalchemy','pytest','ruff']);
const grid=document.querySelector('#techs');
for(const [category,items] of Object.entries(groups))for(const [name,id] of items){const el=document.createElement('div');el.className='tech';el.dataset.category=category;const img=document.createElement('img');img.src=simple.has(id)?`https://cdn.simpleicons.org/${id}/c8f77c`:`https://skillicons.dev/icons?i=${id}&theme=dark`;img.alt='';img.loading='lazy';img.addEventListener('error',()=>{img.hidden=true});const text=document.createElement('div');const strong=document.createElement('strong');strong.textContent=name;const small=document.createElement('small');small.textContent=category;text.append(strong,small);el.append(img,text);grid.append(el)}
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{document.querySelectorAll('[data-filter]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button))});grid.querySelectorAll('.tech').forEach(t=>{t.hidden=button.dataset.filter!=='All'&&t.dataset.category!==button.dataset.filter})}));
document.querySelector('#year').textContent=new Date().getFullYear();
async function json(url){const r=await fetch(url,{signal:AbortSignal.timeout(10000)});if(!r.ok)throw Error('GitHub unavailable');return r.json()}
async function stats(){try{const user=await json('https://api.github.com/users/Dilanga-Malshan');document.querySelector('#repos').textContent=user.public_repos;document.querySelector('#followers').textContent=user.followers;const repos=[];for(let page=1;;page++){const batch=await json(`https://api.github.com/users/Dilanga-Malshan/repos?per_page=100&page=${page}`);repos.push(...batch);if(batch.length<100)break}document.querySelector('#stars').textContent=repos.reduce((n,r)=>n+r.stargazers_count,0);document.querySelector('#statstatus').textContent='Live public data from GitHub.';const owned=repos.filter(r=>!r.fork);const results=await Promise.allSettled(owned.map(r=>json(r.languages_url)));const totals={};for(const r of results)if(r.status==='fulfilled')for(const [language,bytes] of Object.entries(r.value))totals[language]=(totals[language]||0)+bytes;const entries=Object.entries(totals).sort((a,b)=>b[1]-a[1]);const total=entries.reduce((n,e)=>n+e[1],0);const box=document.querySelector('#langs');box.replaceChildren();if(!total){box.textContent='Language data is currently unavailable.';return}for(const [language,bytes]of entries.slice(0,5)){const pct=bytes/total*100;const row=document.createElement('div');row.className='langrow';const name=document.createElement('span');name.textContent=language;const track=document.createElement('div');track.className='track';const fill=document.createElement('i');fill.style.width=pct+'%';track.append(fill);const value=document.createElement('span');value.textContent=pct.toFixed(1)+'%';row.append(name,track,value);box.append(row)}if(results.some(r=>r.status==='rejected')){const note=document.createElement('p');note.className='status';note.textContent='Partial data: some repository languages could not be loaded.';box.append(note)}}catch{document.querySelector('#statstatus').textContent='Live stats are temporarily unavailable. Visit my GitHub profile for current activity.';document.querySelector('#langs').textContent='Language data is temporarily unavailable.'}}stats();
let contributionLoading=false;
async function loadContributions(){
 if(contributionLoading)return;contributionLoading=true;
 const status=document.querySelector('#contribution-status');
 try{
  const data=await json('https://github-contributions-api.jogruber.de/v4/Dilanga-Malshan?y=last');
  if(!Array.isArray(data.contributions)||!Number.isFinite(data.total?.lastYear))throw Error('Invalid contribution data');
  const days=data.contributions.filter(d=>/^\d{4}-\d{2}-\d{2}$/.test(d.date)&&Number.isFinite(d.count)&&Number.isInteger(d.level)&&d.level>=0&&d.level<=4).sort((a,b)=>a.date.localeCompare(b.date));
  if(!days.length)throw Error('No calendar data');
  const calendar=document.querySelector('#contribution-calendar');calendar.replaceChildren();
  const months=document.querySelector('#calendar-months');months.replaceChildren();
  const tooltip=document.querySelector('#calendar-tooltip');
  const offset=new Date(days[0].date+'T00:00:00Z').getUTCDay();
  for(let i=0;i<offset;i++){const spacer=document.createElement('i');spacer.className='spacer';calendar.append(spacer)}
  let lastMonth='',lastMonthColumn=-4;
  const columns=Math.ceil((offset+days.length)/7);
  months.style.gridTemplateColumns=`repeat(${columns},12px)`;
  days.forEach((day,index)=>{
   const date=new Date(day.date+'T00:00:00Z');const column=Math.floor((offset+index)/7);
   const month=day.date.slice(0,7);
   if(month!==lastMonth){
    if(column-lastMonthColumn>=3){const label=document.createElement('span');label.textContent=date.toLocaleDateString('en',{month:'short',timeZone:'UTC'});label.style.gridColumn=String(column+1);months.append(label);lastMonthColumn=column;}lastMonth=month;
   }
   const square=document.createElement('button');square.type='button';square.dataset.level=String(day.level);
   const description=day.count+' contribution'+(day.count===1?'':'s')+' on '+date.toLocaleDateString('en',{month:'long',day:'numeric',year:'numeric',timeZone:'UTC'});
   square.title=description;square.setAttribute('aria-label',description);
   for(const event of ['mouseenter','focus','click'])square.addEventListener(event,()=>{tooltip.textContent=description});
   calendar.append(square);
  });
  document.querySelector('#contribution-total').textContent=data.total.lastYear.toLocaleString();
  calendar.setAttribute('aria-label',`${data.total.lastYear} GitHub contributions from ${days[0].date} to ${days[days.length-1].date}.`);
  status.textContent='Auto-updated from GitHub profile data · source may cache for up to 1 hour.';
 }catch{status.textContent='Contribution data is temporarily unavailable. View the latest activity on GitHub.';}
 finally{contributionLoading=false}
}
loadContributions();setInterval(()=>{if(!document.hidden)loadContributions()},3600000);
