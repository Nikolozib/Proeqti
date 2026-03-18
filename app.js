(function initScrollReveal() {
  const targets = document.querySelectorAll('.sr, .sr-left, .sr-right');
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  targets.forEach((el) => observer.observe(el));
})();

const NUMBER_RX = /[0-9]/;

function blockNumbers(inputId) {
  const input = document.getElementById(inputId);
  if (!input) return;

  
  input.addEventListener('keydown', (e) => {
    if (NUMBER_RX.test(e.key)) e.preventDefault();
  });

  
  input.addEventListener('input', () => {
    const clean = input.value.replace(/[0-9]/g, '');
    if (clean !== input.value) {
      const pos = input.selectionStart - (input.value.length - clean.length);
      input.value = clean;
      input.setSelectionRange(pos, pos);
    }
  });
}

blockNumbers('fname');
blockNumbers('lname');

const EMAIL_RX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateField(inputId, groupId, check) {
  const input = document.getElementById(inputId);
  const group = document.getElementById(groupId);
  if (!input || !group) return true;   

  const valid = check(input.value.trim());
  group.classList.toggle('error', !valid);
  return valid;
}

function attachLive(inputId, groupId, check) {
  const input = document.getElementById(inputId);
  const group = document.getElementById(groupId);
  if (!input || !group) return;

  input.addEventListener('blur', () => {
    if (input.value.trim()) {
      group.classList.toggle('error', !check(input.value.trim()));
    }
  });

  input.addEventListener('input', () => {
    if (group.classList.contains('error')) {
      group.classList.toggle('error', !check(input.value.trim()));
    }
  });
}

const FIELDS = [
  { inputId: 'fname', groupId: 'fg-fname', check: (v) => v.length >= 2 },
  { inputId: 'lname', groupId: 'fg-lname', check: (v) => v.length >= 2 },
  { inputId: 'email', groupId: 'fg-email', check: (v) => EMAIL_RX.test(v) },
];

FIELDS.forEach(({ inputId, groupId, check }) => attachLive(inputId, groupId, check));

const form = document.getElementById('contactForm');

if (form) {
  form.addEventListener('submit', function (e) {
    e.preventDefault();

    
    FIELDS.every(({ inputId, groupId, check }) =>
      validateField(inputId, groupId, check)
    );
  });
}

(function initNewsletterForms() {
  document.querySelectorAll('.newsletter-form').forEach((nForm) => {
    const input     = nForm.querySelector('.newsletter-input');
    const errorEl   = nForm.querySelector('.newsletter-error');
    const successEl = nForm.querySelector('.newsletter-success');
    if (!input) return;

    
    input.addEventListener('input', () => {
      if (errorEl && EMAIL_RX.test(input.value.trim())) {
        errorEl.style.display        = 'none';
        input.style.borderBottomColor = '';
      }
    });

    nForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = input.value.trim();

      if (errorEl)   errorEl.style.display   = 'none';
      if (successEl) successEl.style.display = 'none';

      if (!EMAIL_RX.test(val)) {
        if (errorEl) {
          errorEl.style.display        = 'block';
          input.style.borderBottomColor = '#cc0000';
          input.focus();
        }
        return;
      }

      
      input.style.borderBottomColor = '';
      input.value    = '';
      input.disabled = true;

      if (successEl) {
        successEl.style.display = 'block';
        setTimeout(() => {
          successEl.style.display = 'none';
          input.disabled          = false;
        }, 4000);
      }
    });
  });
})();