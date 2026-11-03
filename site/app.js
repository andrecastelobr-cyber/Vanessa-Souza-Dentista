/* Site Cinematográfico · © 2026 Labrego IA · LBG-SC-2026-v1 */
(() => {
  const site = window.SITE;
  const cine = document.querySelector(".cine");
  const canvas = document.querySelector(".cine-canvas");
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const mobile = matchMedia("(max-width: 760px)").matches;

  if (site && cine && canvas) {
    const context = canvas.getContext("2d", { alpha: false });
    const total = site.frames.total;
    const pattern = mobile ? site.frames.mobile : site.frames.desktop;
    const images = new Array(total);
    let current = 0;
    let drawn = -1;
    let goal = 0;

    const framePath = (index) => pattern.replace("{n}", String(index + 1).padStart(4, "0"));
    const resizeCanvas = () => {
      const ratio = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvas.clientWidth * ratio);
      canvas.height = Math.round(canvas.clientHeight * ratio);
      drawn = -1;
      draw(Math.round(current), true);
    };
    const loaded = (index) => images[index]?.complete && images[index].naturalWidth;
    const nearest = (index) => {
      for (let distance = 0; distance < total; distance++) {
        if (loaded(index - distance)) return index - distance;
        if (loaded(index + distance)) return index + distance;
      }
      return -1;
    };
    function draw(index, force = false) {
      const nearestIndex = nearest(Math.max(0, Math.min(total - 1, index)));
      if (nearestIndex < 0 || (nearestIndex === drawn && !force)) return;
      const image = images[nearestIndex];
      const scale = Math.max(canvas.width / image.naturalWidth, canvas.height / image.naturalHeight);
      const width = image.naturalWidth * scale;
      const height = image.naturalHeight * scale;
      context.drawImage(image, (canvas.width - width) / 2, (canvas.height - height) / 2, width, height);
      drawn = nearestIndex;
    }
    const load = (index) => {
      if (index < 0 || index >= total || images[index]) return;
      const image = new Image();
      images[index] = image;
      image.decoding = "async";
      image.onload = () => draw(Math.round(current), true);
      image.src = framePath(index);
    };
    const progress = () => {
      const rect = cine.getBoundingClientRect();
      return Math.max(0, Math.min(1, -rect.top / Math.max(1, cine.offsetHeight - innerHeight)));
    };
    const updateMoments = (value) => {
      cine.querySelectorAll(".momento").forEach((moment) => {
        const from = Number(moment.dataset.de || 0);
        const to = Number(moment.dataset.ate || 1);
        moment.classList.toggle("ativo", value >= from && (value < to || (to === 1 && value <= 1)));
      });
      cine.classList.toggle("andou", value > .02);
    };
    load(0);
    if (!reducedMotion) {
      const queue = [];
      for (const step of [8, 4, 2, 1]) {
        for (let i = 0; i < total; i += step) if (!queue.includes(i)) queue.push(i);
      }
      let cursor = 0;
      const preload = () => {
        for (let count = 0; count < 5 && cursor < queue.length; count++) load(queue[cursor++]);
        if (cursor < queue.length) setTimeout(preload, 35);
      };
      preload();
      const animate = () => {
        goal = progress() * (total - 1);
        current += (goal - current) * .2;
        if (Math.abs(goal - current) < .05) current = goal;
        draw(Math.round(current));
        updateMoments(current / (total - 1));
        requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    } else {
      updateMoments(0);
    }
    addEventListener("resize", resizeCanvas);
    resizeCanvas();
  }

  const header = document.querySelector(".topo");
  const whatsapp = document.querySelector(".whats");
  const updateHeader = () => {
    header?.classList.toggle("rolou", scrollY > 32);
    whatsapp?.classList.toggle("visivel", scrollY > innerHeight * .55);
  };
  addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visto");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: .16 });
  document.querySelectorAll(".revelar").forEach((element) => revealObserver.observe(element));
  document.querySelectorAll("[data-ano]").forEach((element) => { element.textContent = new Date().getFullYear(); });
})();
