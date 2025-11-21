// Lightweight JS focused on performance & UX.
// - minimal DOM ops
// - intersection observers for counters/animations
// - tiny, low-cost background canvas animation
// - mobile menu + form handling

// When page loads
document.addEventListener('DOMContentLoaded', () => {
  setYear();
  initMobileMenu();
  initNavHighlight();
  initCounters();
  initForm();
  initBGCanvas();
  initProfileOrbits();
  initCopyEmail();
});

// 1) set footer year
function setYear(){ const y = new Date().getFullYear(); const el = document.getElementById('year'); if(el) el.textContent = y; }

// 2) mobile menu
function initMobileMenu(){
  const btn = document.getElementById('mobileToggle');
  const menu = document.getElementById('mobileMenu');
  const close = document.getElementById('mobileClose');
  btn?.addEventListener('click', () => { menu.hidden = false; document.body.style.overflow = 'hidden'; });
  close?.addEventListener('click', () => { menu.hidden = true; document.body.style.overflow = ''; });
  // close on link click
  document.querySelectorAll('.mobile-links a').forEach(a => a.addEventListener('click', () => {
    menu.hidden = true; document.body.style.overflow = '';
  }));
}

// 3) active nav on scroll (throttle)
function initNavHighlight(){
  const links = Array.from(document.querySelectorAll('.nav-link'));
  const sections = Array.from(document.querySelectorAll('main section, main header'));
  function onScroll(){
    const y = window.scrollY + (window.innerHeight * 0.18);
    let current = sections.find(s => (s.offsetTop <= y && (s.offsetTop + s.offsetHeight) > y));
    if(!current) current = document.getElementById('home');
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${current.id}`));
  }
  window.addEventListener('scroll', throttle(onScroll, 120));
  onScroll();
}

// 4) simple counters using IntersectionObserver
function initCounters(){
  const els = document.querySelectorAll('[data-count]');
  if(!els.length) return;
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(ent => {
      if(ent.isIntersecting){
        const el = ent.target;
        animateCount(el, Number(el.getAttribute('data-count')), 1000);
        o.unobserve(el);
      }
    });
  }, {threshold:0.6});
  els.forEach(e => obs.observe(e));
}
function animateCount(el, to, dur){
  let start = 0, startT = null;
  function step(t){
    if(!startT) startT = t;
    const p = Math.min((t - startT) / dur, 1);
    el.textContent = Math.floor(start + (to - start) * easeOutQuad(p));
    if(p < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}
function easeOutQuad(t){ return t*(2-t); }

// 5) contact form (simulate send)
function initForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(form);
    const name = (d.get('name')||'').toString().trim();
    const email = (d.get('email')||'').toString().trim();
    const msg = (d.get('message')||'').toString().trim();
    if(!name || !email || !msg){ toast('Please complete all fields'); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ toast('Please enter a valid email'); return; }
    const btn = form.querySelector('button[type="submit"]');
    const old = btn.textContent;
    btn.textContent = 'Sending...'; btn.disabled = true;
    setTimeout(() => { toast('Message sent — thank you!','success'); form.reset(); btn.textContent = old; btn.disabled = false; }, 900);
  });
}

// 6) copy email
function initCopyEmail(){
  const el = document.getElementById('copyEmail');
  el?.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('hamed2002273@gmail.com');
      toast('Email copied to clipboard','success');
    } catch(e) { toast('Failed to copy'); }
  });
}

// 7) tiny toast
function toast(txt, type='default'){
  const t = document.createElement('div');
  t.className = 'fast-toast';
  t.textContent = txt;
  Object.assign(t.style, {position:'fixed',right:'18px',top:'98px,zIndex':9999,background:type==='success'?'#10b981':'#2563eb',color:'#fff',padding:'10px 14px',borderRadius:'8px',boxShadow:'0 8px 30px rgba(0,0,0,0.4)'});
  document.body.appendChild(t);
  setTimeout(()=> t.style.opacity='0',2600);
  setTimeout(()=> t.remove(),3000);
}

// 8) tiny background canvas (low CPU: few dots)
function initBGCanvas(){
  const c = document.getElementById('bgCanvas');
  if(!c) return;
  const ctx = c.getContext('2d');
  let w=0,h=0, points=[];
  function resize(){
    w = c.width = innerWidth; h = c.height = innerHeight;
    points = [];
    const count = Math.max(12, Math.floor(w/160));
    for(let i=0;i<count;i++) points.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.4+0.6,dx:(Math.random()-0.5)*0.2,dy:(Math.random()-0.5)*0.2});
  }
  function frame(){
    ctx.clearRect(0,0,w,h);
    // subtle gradient overlay
    const g = ctx.createLinearGradient(0,0,w,h); g.addColorStop(0,'rgba(124,92,255,0.03)'); g.addColorStop(1,'rgba(6,214,214,0.02)');
    ctx.fillStyle = g; ctx.fillRect(0,0,w,h);
    // draw points
    ctx.globalCompositeOperation='lighter';
    for(const p of points){
      p.x += p.dx; p.y += p.dy;
      if(p.x<0) p.x = w; if(p.x>w) p.x=0; if(p.y<0) p.y=h; if(p.y>h) p.y=0;
      ctx.beginPath(); ctx.fillStyle='rgba(124,92,255,0.08)'; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    }
    ctx.globalCompositeOperation='source-over';
    requestAnimationFrame(frame);
  }
  resize(); frame();
  addEventListener('resize', debounce(resize, 250));
}

// 9) paint subtle profile orbit rings (CSS-based fallback)
function initProfileOrbits(){
  // create a few orbit divs to animate (pure CSS), low cost
  const wrap = document.querySelector('.orbits');
  if(!wrap) return;
  for(let i=0;i<3;i++){
    const el = document.createElement('div');
    el.className = 'orbit-ring';
    el.style.setProperty('--i', i);
    wrap.appendChild(el);
  }
}

/* helpers: throttle & debounce */
function throttle(fn, t){ let last=0; return (...a)=>{ const now=Date.now(); if(now-last>t){ last=now; fn(...a); } }; }
function debounce(fn,t){ let id; return (...a)=>{ clearTimeout(id); id=setTimeout(()=>fn(...a),t); }; }
