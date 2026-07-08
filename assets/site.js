(function () {
  "use strict";

  // ---------- Mobile menu ----------
  var burgerBtn = document.getElementById('dpBurgerBtn');
  var mobileMenu = document.getElementById('dpMobileMenu');
  if (burgerBtn && mobileMenu) {
    burgerBtn.addEventListener('click', function () {
      mobileMenu.style.display = mobileMenu.style.display === 'block' ? 'none' : 'block';
    });
  }

  // ---------- Reveal on scroll ----------
  var els = Array.prototype.slice.call(document.querySelectorAll('[data-reveal]'));
  els.forEach(function (el) {
    var d = el.getAttribute('data-delay') || 0;
    el.style.opacity = '0';
    el.style.transform = 'translateY(32px)';
    el.style.transition = 'opacity 1s cubic-bezier(.22,1,.36,1) ' + d + 'ms, transform 1s cubic-bezier(.22,1,.36,1) ' + d + 'ms';
  });

  function countUp(el) {
    if (el.__counted) return; el.__counted = true;
    var to = parseInt(el.getAttribute('data-count-to'), 10);
    var prefix = el.getAttribute('data-count-prefix') || '';
    var suffix = el.getAttribute('data-count-suffix') || '';
    var dur = 1400, start = performance.now();
    function fmt(n) { return n >= 1000 ? n.toLocaleString('pt-BR') : String(n); }
    function tick(now) {
      var p = Math.min(1, (now - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = prefix + fmt(Math.round(to * eased)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.style.opacity = '1';
          e.target.style.transform = 'none';
          if (e.target.hasAttribute('data-count-to')) countUp(e.target);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -6% 0px' });
    els.forEach(function (el) { io.observe(el); });

    var counters = document.querySelectorAll('[data-count-to]');
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(e.target); cio.unobserve(e.target); } });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { cio.observe(c); });
  } else {
    els.forEach(function (el) { el.style.opacity = '1'; el.style.transform = 'none'; });
    document.querySelectorAll('[data-count-to]').forEach(countUp);
  }

  // ---------- Vision comparison slider (Home) ----------
  var slider = document.getElementById('dpSlider');
  var sharp = document.getElementById('dpSharp');
  var handle = document.getElementById('dpHandle');
  if (slider && sharp && handle) {
    var dragging = false, touched = false;
    function setPos(x) {
      var r = slider.getBoundingClientRect();
      var pct = ((x - r.left) / r.width) * 100;
      pct = Math.max(2, Math.min(98, pct));
      sharp.style.clipPath = 'inset(0 ' + (100 - pct) + '% 0 0)';
      handle.style.left = pct + '%';
    }
    slider.addEventListener('pointerdown', function (e) { dragging = true; touched = true; setPos(e.clientX); e.preventDefault(); });
    window.addEventListener('pointermove', function (e) { if (dragging) setPos(e.clientX); });
    window.addEventListener('pointerup', function () { dragging = false; });
    var hinted = false;
    var hio = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting && !hinted) {
          hinted = true;
          var seq = [38, 62, 50], i = 0;
          function run() {
            if (i >= seq.length || touched) { sharp.style.transition = ''; handle.style.transition = ''; return; }
            sharp.style.transition = 'clip-path .8s cubic-bezier(.4,0,.2,1)';
            handle.style.transition = 'left .8s cubic-bezier(.4,0,.2,1)';
            sharp.style.clipPath = 'inset(0 ' + (100 - seq[i]) + '% 0 0)';
            handle.style.left = seq[i] + '%';
            i++; setTimeout(run, 850);
          }
          setTimeout(run, 500);
        }
      });
    }, { threshold: 0.4 });
    hio.observe(slider);
  }

  // ---------- Generic accordion (Tratamentos procedures, Duvidas FAQ via data-acc) ----------
  document.querySelectorAll('.dp-acc-open').forEach(function (panel) {
    panel.style.maxHeight = panel.scrollHeight + 'px';
  });
  document.querySelectorAll('[data-acc-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-acc-toggle');
      var panel = document.getElementById(id);
      var icon = btn.querySelector('[data-acc-icon]');
      var isOpen = panel.classList.contains('dp-acc-open');
      // close siblings in the same group
      var group = btn.getAttribute('data-acc-group');
      if (group) {
        document.querySelectorAll('[data-acc-group="' + group + '"]').forEach(function (b) {
          if (b !== btn) {
            var pid = b.getAttribute('data-acc-toggle');
            var p = document.getElementById(pid);
            p.classList.remove('dp-acc-open');
            p.style.maxHeight = '0px';
            var ic = b.querySelector('[data-acc-icon]');
            if (ic) { ic.style.transform = 'rotate(0deg)'; ic.style.background = 'transparent'; ic.style.color = '#BE9B45'; }
          }
        });
      }
      if (isOpen) {
        panel.classList.remove('dp-acc-open');
        panel.style.maxHeight = '0px';
        if (icon) { icon.style.transform = 'rotate(0deg)'; icon.style.background = 'transparent'; icon.style.color = '#BE9B45'; }
      } else {
        panel.classList.add('dp-acc-open');
        panel.style.maxHeight = panel.scrollHeight + 'px';
        if (icon) { icon.style.transform = 'rotate(135deg)'; icon.style.background = '#BE9B45'; icon.style.color = '#15263F'; }
      }
    });
  });

  // ---------- Lens picker (Tratamentos) ----------
  var lensData = {
    monofocal: { title: "Monofocal", life: "Para quem prioriza qualidade de visão à distância e não se incomoda de usar óculos para ler ou ver de perto.", near: 15, inter: 35, far: 100, indep: 30, note: "Foco único e consagrado, geralmente ajustado para longe — ótima nitidez à distância e excelente custo-benefício." },
    bifocal: { title: "Bifocal", life: "Boa para longe e para a leitura, com menos foco na distância intermediária — como a tela do computador.", near: 90, inter: 45, far: 95, indep: 68, note: "Atende bem longe e perto; a faixa intermediária pode exigir um ajuste eventual de óculos." },
    edof: { title: "EDOF", life: "Visão contínua do longe ao intermediário, com excelente conforto noturno e menos halos ao dirigir à noite.", near: 60, inter: 92, far: 95, indep: 80, note: "Profundidade de foco estendida (EDOF): transição suave de distâncias e ótimo conforto visual noturno." },
    trifocal: { title: "Trifocal", life: "Máxima independência dos óculos para uma rotina ativa: ler, usar o computador e dirigir sem trocar de óculos.", near: 95, inter: 88, far: 95, indep: 92, note: "A maior independência dos óculos. Indicada após avaliação criteriosa — uma das grandes assinaturas da minha atuação." }
  };
  var lensTabs = document.querySelectorAll('[data-lens-tab]');
  if (lensTabs.length) {
    var panelTitle = document.getElementById('lensPanelTitle');
    var panelLife = document.getElementById('lensPanelLife');
    var panelIndep = document.getElementById('lensPanelIndep');
    var panelRing = document.getElementById('lensPanelRing');
    var panelNote = document.getElementById('lensPanelNote');
    var barNear = document.getElementById('lensBarNear');
    var barInter = document.getElementById('lensBarInter');
    var barFar = document.getElementById('lensBarFar');
    var valNear = document.getElementById('lensValNear');
    var valInter = document.getElementById('lensValInter');
    var valFar = document.getElementById('lensValFar');

    function applyLens(key) {
      var d = lensData[key];
      if (!d) return;
      lensTabs.forEach(function (tab) {
        var on = tab.getAttribute('data-lens-tab') === key;
        tab.style.background = on ? '#BE9B45' : 'rgba(255,255,255,0.04)';
        tab.style.border = on ? '1px solid #BE9B45' : '1px solid rgba(190,155,69,0.22)';
        tab.style.boxShadow = on ? '0 18px 40px -20px rgba(190,155,69,0.7)' : 'none';
        var num = tab.querySelector('[data-lens-num]');
        var title = tab.querySelector('[data-lens-title]');
        var tag = tab.querySelector('[data-lens-tag]');
        if (num) num.style.color = on ? 'rgba(21,38,63,0.7)' : '#BE9B45';
        if (title) title.style.color = on ? '#15263F' : '#F4EEE2';
        if (tag) tag.style.color = on ? 'rgba(21,38,63,0.82)' : '#9AA6BB';
      });
      if (panelTitle) panelTitle.textContent = 'Lente ' + d.title;
      if (panelLife) panelLife.textContent = d.life;
      if (panelIndep) panelIndep.textContent = d.indep + '%';
      if (panelRing) panelRing.style.background = 'conic-gradient(#BE9B45 ' + (d.indep * 3.6) + 'deg, rgba(255,255,255,0.12) 0deg)';
      if (panelNote) panelNote.textContent = d.note;
      if (barNear) barNear.style.width = d.near + '%';
      if (barInter) barInter.style.width = d.inter + '%';
      if (barFar) barFar.style.width = d.far + '%';
      if (valNear) valNear.textContent = d.near + '%';
      if (valInter) valInter.textContent = d.inter + '%';
      if (valFar) valFar.textContent = d.far + '%';
    }

    lensTabs.forEach(function (tab) {
      tab.addEventListener('click', function () { applyLens(tab.getAttribute('data-lens-tab')); });
    });
    applyLens('monofocal');
  }

  // ---------- Contact form -> mailto ----------
  var contactForm = document.getElementById('dpContactForm');
  if (contactForm) {
    var successBox = document.getElementById('dpFormSuccess');
    var openMailBtn = document.getElementById('dpOpenMail');
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = document.getElementById('dpName').value;
      var phone = document.getElementById('dpPhone').value;
      var email = document.getElementById('dpEmail').value;
      var subject = document.getElementById('dpSubject').value;
      var message = document.getElementById('dpMessage').value;
      var subjectLine = 'Agendamento — ' + subject + (name ? ' — ' + name : '');
      var body = 'Olá, Dra. Denise!\nGostaria de agendar uma consulta.\n\n';
      if (name) body += 'Nome: ' + name + '\n';
      if (phone) body += 'Telefone/WhatsApp: ' + phone + '\n';
      if (email) body += 'E-mail: ' + email + '\n';
      body += 'Assunto: ' + subject + '\n';
      if (message) body += 'Mensagem: ' + message + '\n';
      var url = 'mailto:denisedpoftalmo@gmail.com?subject=' + encodeURIComponent(subjectLine) + '&body=' + encodeURIComponent(body);
      if (openMailBtn) openMailBtn.setAttribute('href', url);
      contactForm.style.display = 'none';
      if (successBox) successBox.style.display = 'block';
      setTimeout(function () { window.location.href = url; }, 150);
    });
  }
})();
