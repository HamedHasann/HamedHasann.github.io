// script.js (module) - advanced mode with Three.js scene + interactions
import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

document.addEventListener('DOMContentLoaded', () => {
  initUI();
  initThreeScene();
  initForm();
  initNav();
  document.getElementById('year').textContent = new Date().getFullYear();
});

// ---------- UI helpers ----------
function initUI(){
  // theme toggle
  const themeBtn = document.getElementById('themeToggle');
  themeBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light');
    themeBtn.querySelector('i').classList.toggle('fa-sun');
    themeBtn.querySelector('i').classList.toggle('fa-moon');
  });

  // mobile menu
  const mobileBtn = document.getElementById('mobileBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const closeMobile = document.getElementById('closeMobile');
  mobileBtn?.addEventListener('click', () => mobileMenu.style.display = 'block');
  closeMobile?.addEventListener('click', () => mobileMenu.style.display = 'none');

  // copy email
  const copyEmail = document.getElementById('copyEmail');
  copyEmail?.addEventListener('click', async () => {
    await navigator.clipboard?.writeText('hamed2002273@gmail.com');
    showNotification('Email copied to clipboard', 'success');
  });
}

// small notification
function showNotification(text, type='info'){
  const notif = document.createElement('div');
  notif.className = `notify notify-${type}`;
  notif.textContent = text;
  Object.assign(notif.style, {
    position:'fixed',right:'20px',top:'100px',padding:'12px 18px',borderRadius:'10px',
    background: type==='success' ? '#10b981' : '#2563eb', color:'#fff',zIndex:10000
  });
  document.body.appendChild(notif);
  setTimeout(()=> notif.remove(), 3500);
}

// ---------- Form handling ----------
function initForm(){
  const form = document.getElementById('contactForm');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const msg = data.get('message')?.toString().trim();
    if(!name || !email || !msg){ showNotification('Please fill all fields','info'); return; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){ showNotification('Invalid email','info'); return; }

    // simulate send
    const btn = form.querySelector('button[type="submit"]');
    const old = btn.innerHTML;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(()=> {
      showNotification('Message sent — thank you!', 'success');
      form.reset();
      btn.innerHTML = old;
      btn.disabled = false;
    }, 1200);
  });
}

// ---------- Navigation & active link ----------
function initNav(){
  const links = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');
  const sections = Array.from(document.querySelectorAll('section, header'));

  function onScroll(){
    const y = window.scrollY + 200;
    for(let sec of sections){
      if(sec.offsetTop <= y && (sec.offsetTop + sec.offsetHeight) > y){
        const id = sec.id || 'home';
        links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
        mobileLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href')===`#${id}`));
      }
    }
  }
  onScroll();
  window.addEventListener('scroll', onScroll);
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const t = document.querySelector(a.getAttribute('href'));
      if(t) t.scrollIntoView({behavior:'smooth',block:'start'});
      document.getElementById('mobileMenu').style.display = 'none';
    });
  });
}

// ---------- Three.js scene ----------
function initThreeScene(){
  const container = document.getElementById('three-container');
  if(!container) return;

  // sizes
  const sizes = { width: container.clientWidth, height: container.clientHeight };

  // renderer
  const renderer = new THREE.WebGLRenderer({ antialias:true, alpha:true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(sizes.width, sizes.height);
  container.appendChild(renderer.domElement);

  // scene & camera
  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000007, 0.0025);
  const camera = new THREE.PerspectiveCamera(40, sizes.width / sizes.height, 0.1, 2000);
  camera.position.set(0, 80, 220);
  scene.add(camera);

  // lights
  const hemi = new THREE.HemisphereLight(0xbfefff, 0x080820, 0.8);
  scene.add(hemi);
  const spot = new THREE.PointLight(0x7c5cff, 1.2, 1000, 2);
  spot.position.set(200, 200, 200);
  scene.add(spot);
  const accent = new THREE.PointLight(0x06d6d6, 0.8, 500);
  accent.position.set(-200, -80, 100);
  scene.add(accent);

  // --- PCB base ---
  const pcbGeo = new THREE.BoxGeometry(220, 4, 160);
  const pcbMat = new THREE.MeshStandardMaterial({
    color: 0x051018,
    metalness: 0.2,
    roughness: 0.6,
    emissive: 0x020b12,
  });
  const pcb = new THREE.Mesh(pcbGeo, pcbMat);
  pcb.position.y = -6;
  pcb.receiveShadow = true;
  scene.add(pcb);

  // --- traces (thin lines simulated with extruded planes) ---
  const traceMat = new THREE.MeshBasicMaterial({ color: 0x6f7cff, transparent:true, opacity:0.85 });
  const traces = new THREE.Group();
  const tracePaths = [
    { w:120, h:6, x:-10, z:30, r:0.2 },
    { w:200, h:6, x:0, z:-20, r:-0.1 },
    { w:60, h:6, x:60, z:0, r:0.5 },
  ];
  tracePaths.forEach(t => {
    const g = new THREE.BoxGeometry(t.w, 1.5, t.h);
    const m = new THREE.Mesh(g, traceMat);
    m.position.set(t.x, -3.5, t.z);
    m.rotation.y = t.r;
    traces.add(m);
  });
  scene.add(traces);

  // --- chip (center) ---
  const chipGeo = new THREE.BoxGeometry(60, 18, 60);
  const chipMat = new THREE.MeshStandardMaterial({
    color: 0x0c1020,
    metalness: 0.6,
    roughness: 0.2,
    emissive: 0x1b1f40,
  });
  const chip = new THREE.Mesh(chipGeo, chipMat);
  chip.position.set(0, 6, 0);
  scene.add(chip);

  // chip glow (emissive plane)
  const glowGeo = new THREE.PlaneGeometry(260, 180);
  const glowMat = new THREE.MeshBasicMaterial({color:0x7c5cff, transparent:true, opacity:0.06, side: THREE.DoubleSide});
  const glow = new THREE.Mesh(glowGeo, glowMat);
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -4;
  scene.add(glow);

  // small components (caps, resistors)
  const comps = new THREE.Group();
  for(let i=0;i<8;i++){
    const g = new THREE.BoxGeometry(12, 8, 6);
    const m = new THREE.Mesh(g, new THREE.MeshStandardMaterial({color:0x233b4a, metalness:0.2, roughness:0.3}));
    const angle = Math.PI * 2 * (i/8);
    m.position.set(Math.cos(angle)*80, 0.5, Math.sin(angle)*50);
    m.rotation.y = angle;
    comps.add(m);
  }
  scene.add(comps);

  // orbiting micro-chip (glowing)
  const microGeo = new THREE.BoxGeometry(18, 6, 18);
  const microMat = new THREE.MeshStandardMaterial({color:0x1e2140, emissive:0x7c5cff, emissiveIntensity:0.6});
  const micro = new THREE.Mesh(microGeo, microMat);
  scene.add(micro);

  // post-process-like shimmer: a transparent plane that rotates slowly
  const shimmerGeo = new THREE.PlaneGeometry(260, 160);
  const shimmerMat = new THREE.MeshBasicMaterial({color:0xffffff, transparent:true, opacity:0.015});
  const shimmer = new THREE.Mesh(shimmerGeo, shimmerMat);
  shimmer.rotation.x = -Math.PI / 2;
  shimmer.position.y = -3.9;
  scene.add(shimmer);

  // controls (gentle)
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableRotate = true;
  controls.enablePan = false;
  controls.enableZoom = false;
  controls.autoRotate = false;
  controls.minPolarAngle = Math.PI/6;
  controls.maxPolarAngle = Math.PI/2;

  // resize
  function onResize(){
    sizes.width = container.clientWidth;
    sizes.height = container.clientHeight;
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
  }
  window.addEventListener('resize', onResize);

  // mouse parallax
  const mouse = {x:0,y:0};
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouse.x = (e.clientX - rect.left) / rect.width * 2 - 1;
    mouse.y = -((e.clientY - rect.top) / rect.height * 2 - 1);
  });

  // animation loop
  let t = 0;
  const animate = () => {
    requestAnimationFrame(animate);
    t += 0.005;

    // gentle chip rotation
    chip.rotation.y += 0.0025;
    chip.rotation.x = Math.sin(t * 0.6) * 0.02;

    // micro orbit
    micro.position.x = Math.cos(t * 1.6) * 90;
    micro.position.z = Math.sin(t * 1.6) * 55;
    micro.position.y = 8 + Math.sin(t * 2.3) * 3;
    micro.rotation.y += 0.02;

    // slightly rotate components for life
    comps.rotation.y = Math.sin(t*0.2) * 0.02;

    // shimmer rotates
    shimmer.rotation.z += 0.0006;

    // parallax camera based on mouse
    camera.position.x += (mouse.x * 20 - camera.position.x) * 0.02;
    camera.position.y += (mouse.y * 20 + 40 - camera.position.y) * 0.02;
    camera.lookAt(0, 0, 0);

    controls.update();
    renderer.render(scene, camera);
  };

  // hide loading after first frame
  renderer.domElement.addEventListener('mousemove', function onFirst(){
    const load = document.getElementById('loading');
    if(load){ load.style.display='none'; }
    renderer.domElement.removeEventListener('mousemove', onFirst);
  });

  // initial render and start
  animate();
}

// End of script.js
