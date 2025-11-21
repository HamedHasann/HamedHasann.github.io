/* Hybrid JS — small & performant
   - menu toggles
   - nav active on scroll
   - counters
   - lightweight bg canvas (few particles)
   - profile orbit rings (CSS)
*/
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initMenu();
  highlightOnScroll();
  initCounters();
  initBgCanvas();
  initCopyEmail();
  hideLoading();
});

/* footer year */
function setYear(){ const y=document.getElementById('year'); if(y) y.textContent = new Date().getFullYear(); }

/* menu */
function initMenu(){
  const menuBtn=document.getElementById('menuBtn');
  const mobile=document.getElementById('mobile');
  const mobileClose=document.getElementById('mobileClose');
  menuBtn?.addEventListener('click', ()=>{ mobile.hidden=false; document.body.style.overflow='hidden'; });
  mobileClose?.addEventListener('click', ()=>{ mobile.hidden=true; document.body.style.overflow=''; });
  document.querySelectorAll('.mobile-nav a').forEach(a=>a.addEventListener('click', ()=>{ mobile.hidden=true; document.body.style.overflow=''; }));
}

/* active nav on scroll */
function highlightOnScroll(){
  const links=[...document.querySelectorAll('.nav-link')];
  const sections=[...document.querySelectorAll('main section')];
  function update(){
    const y=window.scrollY + window.innerHeight*0.18;
    let curr = sections.find(s => (s.offsetTop <= y && (s.offsetTop + s.offsetHeight) > y));
    if(!curr) curr = document.getElementById('home');
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${curr.id}`));
  }
  update();
  window.addEventListener('scroll', throttle(update, 120));
  document.querySelectorAll('a[href^="#"]').forEach(a=>a.addEventListener('click', e=>{
    e.preventDefault();
    const t=document.querySelector(a.getAttribute('href'));
    if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
    const mobile=document.getElementById('mobile'); if(mobile) mobile.hidden=true;
  }));
}

/* counters */
function initCounters(){
  const els=document.querySelectorAll('.num[data-count], .num[data-count]');
  if(!els.length) return;
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(en => {
      if(en.isIntersecting){
        const el = en.target;
        const to = Number(el.getAttribute('data-count') || el.textContent || 0);
        animateCount(el, to, 900);
        o.unobserve(el);
      }
    });
  }, {threshold:0.6});
  els.forEach(e => obs.observe(e));
}
function animateCount(el, to, dur){
  let start = 0, t0 = null;
  function step(t){
    if(!t0) t0 = t;
    const p = Math.min((t - t0) / dur, 1);
    el.textContent = Math.floor(easeOutCubic(p) * to);
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOutCubic(t){ return (--t)*t*t+1; }

/* copy email button */
function initCopyEmail(){
  const btn = document.getElementById('copyEmail');
  btn?.addEventListener('click', async () => {
    try{
      await navigator.clipboard.writeText('hamed2002273@gmail.com');
      toast('Email copied to clipboard');
    } catch { toast('Unable to copy'); }
  });
}

/* tiny toast */
function toast(msg){
  const el=document.createElement('div'); el.className='mini-toast'; el.textContent=msg;
  Object.assign(el.style,{position:'fixed',right:'18px',top:'100px,',background:'#7c5cff',color:'#fff',padding:'10px 14px',borderRadius:'8px',zIndex:9999});
  document.body.appendChild(el); setTimeout(()=>el.style.opacity='0',2000); setTimeout(()=>el.remove(),2600);
}

/* hide loading screen after DOM+short delay */
function hideLoading(){
  window.addEventListener('load', ()=>{ setTimeout(()=>{ const l=document.getElementById('loading'); if(l) l.style.opacity='0'; setTimeout(()=>l?.remove(),500); }, 400); });
}

/* background canvas (few particles) */
function initBgCanvas(){
  const c = document.getElementById('bg');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w = innerWidth, h = innerHeight;
  let dots = [];
  function resize(){ w=c.width=innerWidth; h=c.height=innerHeight; dots = []; const N = Math.max(10, Math.floor(w/160)); for(let i=0;i<N;i++){ dots.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+0.8,dx:(Math.random()-0.5)*0.25,dy:(Math.random()-0.5)*0.25}); } }
  function frame(){
    ctx.clearRect(0,0,w,h);
    // subtle vignette
    const g=ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,'rgba(124,92,255,0.03)'); g.addColorStop(1,'rgba(6,214,214,0.02)'); ctx.fillStyle=g; ctx.fillRect(0,0,w,h);
    ctx.globalCompositeOperation='lighter';
    dots.forEach(d=>{
      d.x += d.dx; d.y += d.dy;
      if(d.x<0) d.x=w; if(d.x>w) d.x=0; if(d.y<0) d.y=h; if(d.y>h) d.y=0;
      ctx.beginPath(); ctx.fillStyle='rgba(124,92,255,0.08)'; ctx.arc(d.x,d.y,d.r,0,Math.PI*2); ctx.fill();
    });
    ctx.globalCompositeOperation='source-over';
    requestAnimationFrame(frame);
  }
  resize(); frame(); addEventListener('resize', debounce(resize, 220));
}

/* helpers */
function throttle(fn, t){ let last=0; return (...a)=>{ const now=Date.now(); if(now-last>t){ last=now; fn(...a);} }; }
function debounce(fn,t){ let id; return (...a)=>{ clearTimeout(id); id=setTimeout(()=>fn(...a),t); }; }
