const header = document.querySelector('.site-header');
const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const quiz = document.querySelector('#element-quiz');
const quizResult = document.querySelector('#quiz-result');
const progress = document.querySelector('#quiz-progress');
const dialog = document.querySelector('#product-dialog');
const installApp = document.querySelector('#install-app');
let deferredInstallPrompt;
const lineShareUrl = 'https://lin.ee/qNNVrL3';

const products = {
  signature: {
    symbol: '✦',
    title: 'Signature · Thai Golden Harmony',
    copy: 'เอกลักษณ์ของ Siam Herbal ในโทนอบอุ่น อ่อนโยน และสง่างาม เหมาะสำหรับผู้ที่ต้องการสัมผัสแบรนด์ในภาพรวม หรือเลือกเป็นของขวัญ'
  },
  earth: {
    symbol: 'ดิน',
    title: 'Earth · Grounded & Warm',
    copy: 'เหมาะกับวันที่คุณต้องการความมั่นคง ความสงบ และบรรยากาศอบอุ่น ใช้เป็นช่วงพักใจหลังวันทำงานหรือประกอบการนวดผ่อนคลาย'
  },
  water: {
    symbol: 'น้ำ',
    title: 'Water · Soft & Flowing',
    copy: 'เหมาะกับวันที่คุณต้องการความอ่อนโยนและการผ่อนคลาย โทนกลิ่นนุ่มช่วยสร้างบรรยากาศเบาสบายหลังอาบน้ำหรือก่อนพักผ่อน'
  },
  wind: {
    symbol: 'ลม',
    title: 'Wind · Clear & Airy',
    copy: 'เหมาะกับวันที่ต้องการความโปร่ง เบาสบาย และพื้นที่ให้ความคิด ใช้ในช่วงเช้าหรือก่อนเริ่มกิจกรรมเพื่อสร้างบรรยากาศสดชื่น'
  },
  fire: {
    symbol: 'ไฟ',
    title: 'Fire · Bright & Vital',
    copy: 'เหมาะกับวันที่ต้องการแรงบันดาลใจ ความมั่นใจ และบรรยากาศมีชีวิตชีวา ใช้ก่อนออกไปพบปะหรือเริ่มภารกิจสำคัญ'
  }
};

header && window.addEventListener('scroll', () => header.classList.toggle('scrolled', window.scrollY > 32));

menuToggle?.addEventListener('click', () => {
  const open = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.textContent = open ? '×' : '☰';
});

mainNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  mainNav.classList.remove('open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  if (menuToggle) menuToggle.textContent = '☰';
}));

const updateProgress = () => {
  if (!quiz || !progress) return;
  const answered = new Set([...quiz.querySelectorAll('input:checked')].map(input => input.name)).size;
  progress.style.width = `${answered * 25}%`;
};

quiz?.addEventListener('change', updateProgress);

quiz?.addEventListener('submit', event => {
  event.preventDefault();
  const data = new FormData(quiz);
  const score = { earth: 0, water: 0, wind: 0, fire: 0 };
  for (const value of data.values()) score[value] += 1;
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);
  const key = sorted[0][1] === sorted[1][1] ? 'signature' : sorted[0][0];
  const result = products[key];
  document.querySelector('#result-symbol').textContent = result.symbol;
  document.querySelector('#result-title').textContent = result.title;
  document.querySelector('#result-copy').textContent = result.copy;
  quiz.hidden = true;
  quizResult.hidden = false;
  quizResult.scrollIntoView({ behavior: 'smooth', block: 'center' });
});

quiz?.addEventListener('reset', () => {
  setTimeout(() => { if (progress) progress.style.width = '0'; }, 0);
});

document.querySelector('#try-again')?.addEventListener('click', () => {
  quiz.reset();
  quiz.hidden = false;
  quizResult.hidden = true;
  quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelectorAll('[data-open-product]').forEach(button => {
  button.addEventListener('click', () => {
    const product = products[button.dataset.openProduct];
    document.querySelector('#dialog-symbol').textContent = product.symbol;
    document.querySelector('#dialog-title').textContent = product.title;
    document.querySelector('#dialog-copy').textContent = product.copy;
    dialog.showModal();
    document.body.classList.add('dialog-open');
  });
});

const closeDialog = () => {
  dialog?.close();
  document.body.classList.remove('dialog-open');
};

document.querySelector('.dialog-close')?.addEventListener('click', closeDialog);
dialog?.addEventListener('click', event => {
  if (event.target === dialog) closeDialog();
});
dialog?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeDialog));

document.querySelector('#lead-form')?.addEventListener('submit', event => {
  event.preventDefault();
  const form = event.currentTarget;
  const data = new FormData(form);
  const body = [
    'สวัสดีค่ะ ต้องการสั่งซื้อ / สอบถาม Siam Herbal',
    `ชื่อ / บริษัท: ${data.get('name') || ''}`,
    `เบอร์โทรศัพท์ / LINE: ${data.get('contact') || ''}`,
    `สนใจเรื่อง: ${data.get('interest') || ''}`,
    `จำนวนโดยประมาณ: ${data.get('quantity') || ''}`,
    `รายละเอียด: ${data.get('message') || ''}`
  ].join('\n');
  navigator.clipboard?.writeText(body).catch(() => {});
  window.open(lineShareUrl, '_blank', 'noopener');
});

const socialToggle = document.querySelector('#social-toggle');
const socialPanel = document.querySelector('#social-panel');
const socialClose = document.querySelector('#social-close');
const setSocialPanel = open => {
  if (!socialPanel || !socialToggle) return;
  socialPanel.hidden = !open;
  socialToggle.setAttribute('aria-expanded', String(open));
};
socialToggle?.addEventListener('click', () => setSocialPanel(socialPanel.hidden));
socialClose?.addEventListener('click', () => setSocialPanel(false));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') setSocialPanel(false);
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: .08 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));
document.querySelector('#year').textContent = new Date().getFullYear();

window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault();
  deferredInstallPrompt = event;
  if (installApp) installApp.hidden = false;
});

installApp?.addEventListener('click', async () => {
  if (!deferredInstallPrompt) return;
  deferredInstallPrompt.prompt();
  await deferredInstallPrompt.userChoice;
  deferredInstallPrompt = null;
  installApp.hidden = true;
});

window.addEventListener('appinstalled', () => {
  if (installApp) installApp.hidden = true;
  deferredInstallPrompt = null;
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => navigator.serviceWorker.register('./service-worker.js').catch(() => {}));
}
