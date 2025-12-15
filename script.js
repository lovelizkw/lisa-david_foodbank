// ========== ГЛАВНЫЙ МОДУЛЬ ==========
document.addEventListener('DOMContentLoaded', function() {
  
  // ========== БУРГЕР МЕНЮ ==========
  function initBurgerMenu() {
    const burger = document.getElementById('burger');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (!burger || !mobileMenu) return;
    
    burger.addEventListener('click', (e) => {
      e.stopPropagation();
      burger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });
    
    document.querySelectorAll('.mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
    
    document.addEventListener('click', (e) => {
      if (!mobileMenu.contains(e.target) && !burger.contains(e.target)) {
        burger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
  
  // ========== УЛУЧШЕННЫЙ СЛАЙДЕР ==========
  function initSimpleSlider(trackId, prevBtnId, nextBtnId, counterId, totalItems) {
    const track = document.getElementById(trackId);
    const prevBtn = document.getElementById(prevBtnId);
    const nextBtn = document.getElementById(nextBtnId);
    const counter = document.getElementById(counterId);
    
    if (!track || !prevBtn || !nextBtn || !counter) {
      console.warn('Элементы слайдера не найдены:', trackId);
      return null;
    }
    
    // Пересчитываем общее количество слайдов на основе дочерних элементов
    const actualSlides = track.children.length;
    const finalTotalItems = totalItems || actualSlides;
    
    let currentIndex = 0;
    let autoSlideInterval = null;
    
    function updateSlider() {
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
      counter.textContent = `${currentIndex + 1}/${finalTotalItems}`;
    }
    
    function nextSlide() {
      currentIndex = (currentIndex < finalTotalItems - 1) ? currentIndex + 1 : 0;
      updateSlider();
    }
    
    function prevSlide() {
      currentIndex = (currentIndex > 0) ? currentIndex - 1 : finalTotalItems - 1;
      updateSlider();
    }
    
    function goToSlide(index) {
      if (index >= 0 && index < finalTotalItems) {
        currentIndex = index;
        updateSlider();
      }
    }
    
    function startAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }
    
    // Обработчики событий
    prevBtn.addEventListener('click', () => {
      prevSlide();
      stopAutoSlide();
    });
    
    nextBtn.addEventListener('click', () => {
      nextSlide();
      stopAutoSlide();
    });
    
    // Автопрокрутка для мобильных
    if (window.innerWidth <= 768) {
      startAutoSlide();
      
      // Пауза при наведении (если поддерживается)
      if (track.addEventListener) {
        track.addEventListener('mouseenter', stopAutoSlide);
        track.addEventListener('mouseleave', startAutoSlide);
      }
    }
    
    // Инициализация
    updateSlider();
    
    return { 
      nextSlide, 
      prevSlide, 
      goToSlide,
      startAutoSlide,
      stopAutoSlide
    };
  }
  
  // ========== ИНИЦИАЛИЗАЦИЯ ВСЕХ СЛАЙДЕРОВ ==========
  function initAllSliders() {
    console.log('Инициализация слайдеров...');
    
    const sliders = [];
    
    // Проверяем, нужно ли инициализировать мобильные слайдеры
    const isMobile = window.innerWidth <= 992;
    
    // Слайдер достижений
    if (document.getElementById('achievementsTrack')) {
      const achievementsSlider = initSimpleSlider(
        'achievementsTrack',
        'achievementsPrev',
        'achievementsNext',
        'achievementsCounter',
        6
      );
      if (achievementsSlider) sliders.push(achievementsSlider);
    }
    
    // Слайдер услуг
    if (document.getElementById('competenciesTrack') && isMobile) {
      const competenciesSlider = initSimpleSlider(
        'competenciesTrack',
        'competenciesPrev',
        'competenciesNext',
        'competenciesCounter',
        8
      );
      if (competenciesSlider) sliders.push(competenciesSlider);
    }
    
    // Слайдер преимуществ
    if (document.getElementById('supportTrack') && isMobile) {
      const supportSlider = initSimpleSlider(
        'supportTrack',
        'supportPrev',
        'supportNext',
        'supportCounter',
        8
      );
      if (supportSlider) sliders.push(supportSlider);
    }
    
    // Слайдер тарифов
    if (document.getElementById('pricingTrack') && isMobile) {
      const pricingSlider = initSimpleSlider(
        'pricingTrack',
        'pricingPrev',
        'pricingNext',
        'pricingCounter',
        4
      );
      if (pricingSlider) sliders.push(pricingSlider);
    }
    
    // Слайдер команды
    if (document.getElementById('teamTrack') && isMobile) {
      const teamSlider = initSimpleSlider(
        'teamTrack',
        'teamPrev',
        'teamNext',
        'teamCounter',
        6
      );
      if (teamSlider) sliders.push(teamSlider);
    }
    
    // Слайдер проектов
    if (document.getElementById('projectsTrack') && isMobile) {
      const projectsSlider = initSimpleSlider(
        'projectsTrack',
        'projectsPrev',
        'projectsNext',
        'projectsCounter',
        7
      );
      if (projectsSlider) sliders.push(projectsSlider);
    }
    
    console.log('Инициализировано слайдеров:', sliders.length);
    return sliders;
  }
  
  // ========== УЛУЧШЕННЫЙ СЛАЙДЕР ОТЗЫВОВ ==========
  function initReviewsSlider() {
    const track = document.querySelector('.reviews-track');
    const slides = document.querySelectorAll('.reviews-slide');
    const prevBtn = document.querySelector('.reviews-prev');
    const nextBtn = document.querySelector('.reviews-next');
    const counter = document.querySelector('.reviews-counter');
    const dots = document.querySelectorAll('.reviews-dot');
    
    if (!track || slides.length === 0) return;
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    let isAnimating = false;
    let autoSlideInterval = null;
    
    function updateSlider() {
      if (isAnimating) return;
      isAnimating = true;
      
      // Рассчитываем смещение в зависимости от ширины слайда
      const slideWidth = slides[0].offsetWidth;
      track.style.transform = `translateX(-${currentSlide * slideWidth}px)`;
      track.style.transition = 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
      
      if (counter) {
        counter.textContent = `${currentSlide + 1}/${totalSlides}`;
      }
      
      // Обновляем точки
      if (dots.length > 0) {
        dots.forEach((dot, index) => {
          dot.classList.toggle('active', index === currentSlide);
        });
      }
      
      setTimeout(() => {
        isAnimating = false;
      }, 500);
    }
    
    function nextSlide() {
      if (isAnimating) return;
      currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
      updateSlider();
    }
    
    function prevSlide() {
      if (isAnimating) return;
      currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalSlides - 1;
      updateSlider();
    }
    
    function goToSlide(index) {
      if (isAnimating || index < 0 || index >= totalSlides) return;
      currentSlide = index;
      updateSlider();
    }
    
    function startAutoSlide() {
      if (autoSlideInterval) clearInterval(autoSlideInterval);
      autoSlideInterval = setInterval(nextSlide, 5000);
    }
    
    function stopAutoSlide() {
      if (autoSlideInterval) {
        clearInterval(autoSlideInterval);
        autoSlideInterval = null;
      }
    }
    
    // Инициализация слайдера
    function initSlider() {
      // Устанавливаем начальную ширину слайдов
      slides.forEach(slide => {
        slide.style.flex = `0 0 calc(100% - 30px)`;
        slide.style.minWidth = `calc(100% - 30px)`;
      });
      
      // Для десктопа показываем 3 слайда
      if (window.innerWidth >= 768) {
        const visibleSlides = window.innerWidth >= 1200 ? 3 : 2;
        const slideWidth = 100 / visibleSlides;
        
        slides.forEach(slide => {
          slide.style.flex = `0 0 calc(${slideWidth}% - 30px)`;
          slide.style.minWidth = `calc(${slideWidth}% - 30px)`;
        });
      }
      
      updateSlider();
      
      // Автопрокрутка только на десктопе
      if (window.innerWidth >= 768) {
        startAutoSlide();
      }
    }
    
    // Инициализация обработчиков событий
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
      });
    }
    
    // Добавляем обработчики для точек
    if (dots.length > 0) {
      dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
          goToSlide(index);
          stopAutoSlide();
        });
      });
    }
    
    // Добавляем свайп для мобильных
    if (window.innerWidth <= 768) {
      let startX = 0;
      let isDragging = false;
      
      track.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        stopAutoSlide();
      }, { passive: true });
      
      track.addEventListener('touchmove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
      }, { passive: false });
      
      track.addEventListener('touchend', (e) => {
        if (!isDragging) return;
        isDragging = false;
        
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;
        
        if (Math.abs(diffX) > 50) {
          if (diffX > 0) {
            nextSlide();
          } else {
            prevSlide();
          }
        }
      }, { passive: true });
    }
    
    // Инициализация при загрузке
    setTimeout(initSlider, 100);
    
    // Переинициализация при изменении размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        stopAutoSlide();
        initSlider();
      }, 250);
    });
  }
  
  // ========== ОСТАЛЬНЫЕ ФУНКЦИИ ==========
  function initMobileSubmenus() {
    document.querySelectorAll('.has-submenu > a').forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const parent = link.parentElement;
        parent.classList.toggle('active');
      });
    });
  }
  
  function initLanguageSwitcher() {
    document.querySelectorAll('.language-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        document.querySelectorAll('.language-btn').forEach(b => {
          b.classList.remove('active');
        });
        this.classList.add('active');
      });
    });
  }
  
  function initPhoneMask() {
    const maskPhone = (input) => {
      input.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);
        
        let formatted = '+7 ';
        if (value.length > 1) formatted += '(' + value.slice(1, 4);
        if (value.length >= 4) formatted += ') ' + value.slice(4, 7);
        if (value.length >= 7) formatted += '-' + value.slice(7, 9);
        if (value.length >= 9) formatted += '-' + value.slice(9, 11);
        
        e.target.value = formatted;
      });
    };
    
    document.querySelectorAll('input[type="tel"]').forEach(maskPhone);
  }
  
  function initDateInputs() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    document.querySelectorAll('input[type="date"]').forEach(input => {
      input.min = today.toISOString().split('T')[0];
      if (!input.value) {
        input.value = tomorrow.toISOString().split('T')[0];
      }
    });
  }
  
  function initTariffs() {
    document.querySelectorAll('[data-details]').forEach(button => {
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const tariffId = this.getAttribute('data-details');
        let detailsElement;
        
        if (tariffId.startsWith('mobile-')) {
          detailsElement = document.getElementById(tariffId);
        } else {
          detailsElement = document.getElementById(`details-${tariffId}`);
        }
        
        if (detailsElement) {
          const isActive = detailsElement.classList.contains('active');
          detailsElement.classList.toggle('active');
          this.textContent = isActive ? 'Подробнее' : 'Скрыть';
        }
      });
    });
  }
  
  function initShowMoreButton() {
    const showMoreBtn = document.getElementById('showMoreBtn');
    const hiddenProjects = document.getElementById('hiddenProjects');
    
    if (!showMoreBtn || !hiddenProjects) return;
    
    showMoreBtn.addEventListener('click', function() {
      const isActive = hiddenProjects.classList.toggle('active');
      this.innerHTML = isActive 
        ? '<span>Скрыть проекты</span><span class="arrow">↑</span>'
        : '<span>Показать еще проекты</span><span class="arrow">↓</span>';
    });
  }
  
  function initPriceCalculator() {
    const guestsInput = document.getElementById('guests');
    const tariffSelect = document.getElementById('tariff');
    const priceCalculation = document.getElementById('priceCalculation');
    const totalPrice = document.getElementById('totalPrice');
    const priceInfo = document.getElementById('priceInfo');
    
    if (!guestsInput || !tariffSelect || !priceCalculation || !priceInfo) return;
    
    function calculatePrice() {
      const guests = parseInt(guestsInput.value) || 0;
      const selectedOption = tariffSelect.selectedOptions[0];
      
      if (!selectedOption || guests <= 0) {
        priceCalculation.style.display = 'none';
        return;
      }
      
      const pricePerPerson = parseInt(selectedOption.getAttribute('data-price')) || 0;
      const maxGuests = parseInt(selectedOption.getAttribute('data-max-guests')) || 99999;
      const total = guests * pricePerPerson;
      
      // Форматирование чисел с пробелами
      const formattedTotal = total.toLocaleString('ru-RU');
      const formattedPricePerPerson = pricePerPerson.toLocaleString('ru-RU');
      
      if (guests > maxGuests && maxGuests !== 99999) {
        priceInfo.innerHTML = `<span style="color: #e74c3c;">Внимание: выбранный тариф рассчитан только на ${maxGuests} гостей</span>`;
        totalPrice.textContent = '0 ₽';
      } else {
        priceInfo.innerHTML = `${guests} гостей × ${formattedPricePerPerson} ₽/чел`;
        totalPrice.textContent = formattedTotal + ' ₽';
      }
      
      priceCalculation.style.display = 'block';
    }
    
    guestsInput.addEventListener('input', calculatePrice);
    tariffSelect.addEventListener('change', calculatePrice);
    calculatePrice();
  }
  
  function initForm() {
    const mainForm = document.getElementById('mainForm');
    if (!mainForm) return;
    
    // Устанавливаем правильный action для Formcarry
    mainForm.action = 'https://formcarry.com/s/CvYZzGh1Org';
    
    const submitBtn = document.getElementById('submitBtn');
    const successMessage = document.getElementById('successMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    function validateForm() {
      const guests = parseInt(document.getElementById('guests').value) || 0;
      const selectedOption = document.getElementById('tariff').selectedOptions[0];
      
      if (selectedOption && selectedOption.disabled) {
        alert('Пожалуйста, выберите тариф, который подходит для указанного количества гостей.');
        return false;
      }
      
      if (guests <= 0) {
        alert('Пожалуйста, укажите корректное количество гостей.');
        return false;
      }
      
      return true;
    }
    
    mainForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      if (!validateForm()) return;
      
      submitBtn.disabled = true;
      submitBtn.textContent = 'Отправка...';
      
      // Собираем данные формы
      const formData = new FormData(this);
      
      // Добавляем дополнительные поля для лучшего отображения в Formcarry
      const selectedTariff = document.getElementById('tariff').selectedOptions[0];
      if (selectedTariff) {
        formData.append('tariff_name', selectedTariff.text);
        formData.append('tariff_price', selectedTariff.getAttribute('data-price'));
      }
      
      // Отправка через Formcarry
      fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      })
      .then(response => response.json())
      .then(data => {
        console.log('Formcarry response:', data);
        if (data.code === 200 || data.status === 'success') {
          // Успешная отправка
          successMessage.style.display = 'block';
          errorMessage.style.display = 'none';
          mainForm.reset();
          document.getElementById('priceCalculation').style.display = 'none';
          
          // Сброс формы через 5 секунд
          setTimeout(() => {
            successMessage.style.display = 'none';
          }, 5000);
        } else {
          // Ошибка
          errorMessage.style.display = 'block';
          successMessage.style.display = 'none';
          console.error('Formcarry error:', data);
        }
      })
      .catch(error => {
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        console.error('Fetch error:', error);
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Отправить заявку';
      });
    });
  }
  
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (!targetElement) return;
        
        const headerHeight = document.querySelector('header').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      });
    });
  }
  
  // ========== ИНИЦИАЛИЗАЦИЯ ВСЕГО ==========
  function initAll() {
    console.log('Инициализация приложения...');
    
    initBurgerMenu();
    initMobileSubmenus();
    initLanguageSwitcher();
    initPhoneMask();
    initDateInputs();
    initTariffs();
    
    // Инициализация слайдеров
    const sliders = initAllSliders();
    
    // Отдельная инициализация слайдера отзывов
    setTimeout(() => {
      initReviewsSlider();
    }, 300);
    
    initShowMoreButton();
    initPriceCalculator();
    initForm();
    initSmoothScroll();
    
    console.log('Приложение инициализировано. Слайдеров:', sliders.length);
  }
  
  // Запускаем инициализацию
  initAll();
  
  // Переинициализируем при изменении размера окна
  let resizeTimer;
  window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      console.log('Resize detected, reinitializing sliders...');
      initAllSliders();
      initReviewsSlider();
    }, 250);
  });
});