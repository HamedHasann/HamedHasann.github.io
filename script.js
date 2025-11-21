// script.js (improved)

// DOM Loaded
document.addEventListener('DOMContentLoaded', () => {
  initAll();
});

function initAll() {
  initLoading();
  initMobileMenu();
  initNavActiveOnScroll();
  initSmoothScroll();
  initTyping();
  initCounters();
  initSkillProgress();
  initForm();
  initParticles();
  initThemeToggle();
}

/* Loading */
function initLoading(){
  const loading = document.querySelector('.loading-screen');
  if(!loading) return;
  setTimeout(()=> {
    loading.classList.add('loaded');
    setTimeout(()=> loading.remove(), 600);
  }, 1000);
}

/* Mobile menu */
function initMobileMenu(){
  const openBtn = document.getElementById('mobileBtn');
  const closeBtn = document.getElementById('mobileClose');
  const mobile = document.getElementById('mobileMenu');
  if(!openBtn || !mobile) return;

  openBtn.addEventListener('click', ()=> {
    mobile.classList.add('active');
    document.body.style.overflow = 'hidden';
  });
  if(closeBtn) closeBtn.addEventListener('click', closeMobile);
  document.querySelectorAll('.mobile-nav-link').forEach(a => a.addEventListener('click', closeMobile));
  function closeMobile(){ mobile.classList.remove('active'); document.body.style.overflow = ''; }
}

/* Nav highlight on scroll */
function initNavActiveOnScroll(){
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if(!sections.length) return;

  function onScroll(){
    const fromTop = window.scrollY + 110; // offset for header
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop;
      if(fromTop >= top) current = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
    // mobile links
    document.querySelectorAll('.mobile-nav-link').forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  }

  window.addEventListener('scroll', throttle(onScroll, 120));
  onScroll();
}

/* Smooth scroll */
function initSmoothScroll(){
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href = a.getAttribute('href');
      if(!href || href === '#') return;
      const target = document.querySelector(href);
      if(target){
        e.preventDefault();
        target.scrollIntoView({behavior:'smooth',block:'start'});
        // close mobile if open
        document.getElementById('mobileMenu')?.classList.remove('active');
      }
    });
  });
}

/* Typing effect */
function initTyping(){
  const el = document.querySelector('.typed-text');
  if(!el) return;
  const words = ['embedded systems','IoT solutions','circuit design','electronic innovation'];
  let w = 0, i = 0, deleting=false;
  function tick(){
    const word = words[w];
    el.textContent = deleting ? word.substring(0,i--) : word.substring(0,++i);
    if(!deleting && i === word.length){ deleting = true; setTimeout(tick, 900); return; }
    if(deleting && i===0){ deleting=false; w=(w+1)%words.length; setTimeout(tick, 400); return; }
    setTimeout(tick, deleting?50:95);
  }
  setTimeout(tick, 800);
}

/* Counters */
function initCounters(){
  const counters = document.querySelectorAll('.stat-number');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        runCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.5});
  counters.forEach(c => obs.observe(c));
}

function runCounter(el){
  const target = parseInt(el.getAttribute('data-count')||'0',10);
  if(!target) return;
  let current = 0;
  const step = Math.max(1, Math.round(target/120));
  const timer = setInterval(()=> {
    current += step;
    if(current >= target){ el.textContent = String(target); clearInterval(timer); }
    else el.textContent = String(current);
  }, 12);
}

/* Skill progress bars */
function initSkillProgress(){
  const elems = document.querySelectorAll('.skill-progress, .tech-progress');
  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        const w = entry.target.getAttribute('data-width') || '0';
        entry.target.style.width = w + '%';
        obs.unobserve(entry.target);
      }
    });
  }, {threshold:0.4});
  elems.forEach(e => obs.observe(e));
}

/* Form handling */
function initForm(){
  const form = document.querySelector('.message-form');
  if(!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = fd.get('name')?.toString().trim();
    const email = fd.get('email')?.toString().trim();
    const message = fd.get('message')?.toString().trim();
    if(!name || !email || !message) return notify('Please fill all fields', 'error');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return notify('Please enter valid email', 'error');
    const btn = form.querySelector('button[type="submit"]');
    const old = btn.innerHTML;
    btn.disabled = true; btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    setTimeout(()=> {
      notify('Message sent. I will contact you soon','success');
      form.reset(); btn.innerHTML = old; btn.disabled = false;
    }, 1400);
  });
}

/* Notification helper */
function notify(msg, type='info'){
  const existing = document.querySelector('.notification'); if(existing) existing.remove();
  const n = document.createElement('div');
  n.className = `notification notification-${type}`;
  n.innerHTML = `<div class="notification-content"><i class="fas fa-${type==='success'?'check-circle':type==='error'?'exclamation-circle':'info-circle'}"></i><span>${msg}</span></div>`;
  Object.assign(n.style, {position:'fixed',top:'90px',right:'20px',background: type==='success'?'#10b981':type==='error'?'#ef4444':'#3b82f6',color:'#fff',padding:'12px 14px',borderRadius:'10px',zIndex:10000,boxShadow:'0 10px 30px rgba(0,0,0,.2)'});
  document.body.appendChild(n);
  setTimeout(()=> { n.style.transform='translateX(400px)'; setTimeout(()=> n.remove(),300); }, 4200);
}

/* Particles (lightweight) */
function initParticles(){
  const container = document.getElementById('particles');
  if(!container) return;
  const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
  canvas.style.position='absolute'; canvas.style.inset='0'; canvas.style.pointerEvents='none';
  container.appendChild(canvas);
  let w=container.clientWidth, h=container.clientHeight; canvas.width=w; canvas.height=h;
  window.addEventListener('resize', ()=> { w=container.clientWidth; h=container.clientHeight; canvas.width=w; canvas.height=h; });

  const particles = [];
  const count = Math.max(20, Math.floor(w*h/40000));
  for(let i=0;i<count;i++) particles.push({x:Math.random()*w,y:Math.random()*h,r:Math.random()*1.6+0.5,dx:(Math.random()-0.5)*0.5,dy:(Math.random()-0.5)*0.5,alpha:Math.random()*0.4+0.1});
  function loop(){
    ctx.clearRect(0,0,w,h);
    particles.forEach(p=>{
      p.x += p.dx; p.y += p.dy;
      if(p.x<0) p.x=w; if(p.x>w) p.x=0; if(p.y<0) p.y=h; if(p.y>h) p.y=0;
      ctx.beginPath(); ctx.fillStyle = `rgba(99,102,241,${p.alpha})`; ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
    });
    requestAnimationFrame(loop);
  }
  loop();
}

/* Theme toggle (basic) */
function initThemeToggle(){
  const btn = document.getElementById('themeToggle'); if(!btn) return;
  btn.addEventListener('click', ()=> {
    const dark = document.documentElement.classList.toggle('light-mode');
    btn.innerHTML = dark ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
  });
}

/* Utility: throttle */
function throttle(fn, limit){
  let last=false;
  return function(...args){ if(!last){ fn.apply(this,args); last=true; setTimeout(()=> last=false, limit); } }
}
