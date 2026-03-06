document.querySelectorAll("#MA#MA .card").forEach(card => {
    card.addEventListener("click", function () {
      this.querySelector("#MA#MA .card-inner").classList.toggle("flipped"); // 個別翻轉
    });
});

// ===== 翻翻卡 =====
document.addEventListener('DOMContentLoaded', function () {
  const scrollAreas = document.querySelectorAll('#MA#MA .card-back .card_content > div:last-child');

  function updateScrollableState(area) {
    area.classList.remove('is-scrollable', 'is-scrolled-to-bottom');

    const isScrollable = area.scrollHeight > area.clientHeight + 2;

    if (isScrollable) {
      area.classList.add('is-scrollable');

      const isAtBottom = area.scrollTop + area.clientHeight >= area.scrollHeight - 2;
      if (isAtBottom) {
        area.classList.add('is-scrolled-to-bottom');
      }
    }
  }

  function checkScrollable() {
    scrollAreas.forEach(updateScrollableState);
  }

  scrollAreas.forEach(area => {
    area.addEventListener('scroll', function () {
      const isAtBottom = area.scrollTop + area.clientHeight >= area.scrollHeight - 2;
      area.classList.toggle('is-scrolled-to-bottom', isAtBottom);
    });
  });

  checkScrollable();
  window.addEventListener('load', checkScrollable);
  window.addEventListener('resize', checkScrollable);

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(checkScrollable);
  }
});


// ===== 輪播圖（手動版）=====
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("#MA#MA .carousel").forEach((carousel) => {

    const track = carousel.querySelector(".carousel-track");
    const prevBtn = carousel.querySelector(".prev");
    const nextBtn = carousel.querySelector(".next");
    const dotsContainer = carousel.querySelector(".carousel-dots");

    // 取得原始 slides
    let realSlides = Array.from(track.querySelectorAll(".carousel-slide"))
      .filter((img) => !img.classList.contains("fake-first") && !img.classList.contains("clone"));

    // 清除舊 clone
    track.querySelectorAll(".carousel-slide.fake-first").forEach((el) => el.remove());
    track.querySelectorAll(".carousel-slide.clone").forEach((el) => el.remove());

    realSlides = Array.from(track.querySelectorAll(".carousel-slide"));
    const realCount = realSlides.length;
    if (realCount <= 1) return;

    // 建立前後 clone（做無縫循環）
    const firstClone = realSlides[0].cloneNode(true);
    const lastClone = realSlides[realCount - 1].cloneNode(true);
    firstClone.classList.add("clone");
    lastClone.classList.add("clone");

    track.insertBefore(lastClone, realSlides[0]);
    track.appendChild(firstClone);

    const slides = Array.from(track.querySelectorAll(".carousel-slide"));

    // 生成 dots
    dotsContainer.innerHTML = "";
    for (let i = 0; i < realCount; i++) {
      const dot = document.createElement("div");
      dot.dataset.index = i;
      dotsContainer.appendChild(dot);
    }

    const dots = Array.from(dotsContainer.querySelectorAll("div"));

    let currentIndex = 1;
    let isAnimating = false;

    function setTransition(on) {
      track.style.transition = on ? "transform 0.5s ease-in-out" : "none";
    }

    function setTranslate(idx) {
      track.style.transform = `translateX(-${idx * 100}%)`;
    }

    function getRealIndexFrom(idx) {
      let r = idx - 1;
      if (r < 0) r = realCount - 1;
      if (r >= realCount) r = 0;
      return r;
    }

    function updateDots(realIdx) {
      dots.forEach((d) => d.classList.remove("active"));
      if (dots[realIdx]) dots[realIdx].classList.add("active");
    }

    // 初始化
    setTransition(false);
    setTranslate(currentIndex);
    updateDots(getRealIndexFrom(currentIndex));

    // 動畫結束後做無縫跳轉
    track.addEventListener("transitionend", () => {
      if (currentIndex === slides.length - 1) {
        setTransition(false);
        currentIndex = 1;
        setTranslate(currentIndex);
      } else if (currentIndex === 0) {
        setTransition(false);
        currentIndex = realCount;
        setTranslate(currentIndex);
      }
      isAnimating = false;
    });

    function goToIndex(idx) {
      if (isAnimating) return;
      isAnimating = true;

      updateDots(getRealIndexFrom(idx));

      setTransition(true);
      currentIndex = idx;
      setTranslate(currentIndex);
    }

    function nextSlide() {
      goToIndex(currentIndex + 1);
    }

    function prevSlide() {
      goToIndex(currentIndex - 1);
    }

    // 按鈕控制
    prevBtn.addEventListener("click", prevSlide);
    nextBtn.addEventListener("click", nextSlide);

    // 點擊 dots
    dots.forEach((dot) => {
      dot.addEventListener("click", (e) => {
        const targetRealIndex = Number(e.currentTarget.dataset.index);
        goToIndex(targetRealIndex + 1);
      });
    });

    // 手機滑動
    let startX = 0;

    track.addEventListener("touchstart", (e) => {
      startX = e.touches[0].clientX;
    });

    track.addEventListener("touchend", (e) => {
      const endX = e.changedTouches[0].clientX;

      if (startX > endX + 50) nextSlide();
      else if (startX < endX - 50) prevSlide();
    });

  });
});
