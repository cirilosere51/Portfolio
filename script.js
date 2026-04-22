document.addEventListener("DOMContentLoaded", () => {
  const navPanel = document.getElementById("navPanel");
  const menuToggle = document.getElementById("menuToggle");

  if (menuToggle && navPanel) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navPanel.classList.toggle("is-open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener("click", () => {
        navPanel.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const targetId = anchor.getAttribute("href");
      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  });

  const revealItems = document.querySelectorAll(".reveal");
  if (revealItems.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealItems.forEach((item) => observer.observe(item));
  }

  const projectsCarousel = document.getElementById("projectsCarousel");
  const projectsTrack = document.getElementById("projectsTrack");
  const projectsDots = document.getElementById("projectsDots");
  const projectsPrev = document.getElementById("projectsPrev");
  const projectsNext = document.getElementById("projectsNext");
  const projectSlides = projectsTrack
    ? Array.from(projectsTrack.querySelectorAll(".project-slide"))
    : [];

  if (projectsCarousel && projectsTrack && projectSlides.length > 0) {
    let currentSlide = 0;
    let autoSlide;

    const updateCarousel = () => {
      projectsTrack.style.transform = `translateX(-${currentSlide * 100}%)`;

      if (!projectsDots) {
        return;
      }

      projectsDots.querySelectorAll(".projects-dot").forEach((dot, index) => {
        dot.classList.toggle("is-active", index === currentSlide);
      });
    };

    const goToSlide = (index) => {
      currentSlide = (index + projectSlides.length) % projectSlides.length;
      updateCarousel();
    };

    const startAutoSlide = () => {
      autoSlide = window.setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 4000);
    };

    const stopAutoSlide = () => {
      window.clearInterval(autoSlide);
    };

    if (projectsDots) {
      projectSlides.forEach((_, index) => {
        const dot = document.createElement("button");
        dot.className = "projects-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Go to project ${index + 1}`);
        dot.addEventListener("click", () => {
          goToSlide(index);
          stopAutoSlide();
          startAutoSlide();
        });
        projectsDots.appendChild(dot);
      });
    }

    if (projectsPrev) {
      projectsPrev.addEventListener("click", () => {
        goToSlide(currentSlide - 1);
        stopAutoSlide();
        startAutoSlide();
      });
    }

    if (projectsNext) {
      projectsNext.addEventListener("click", () => {
        goToSlide(currentSlide + 1);
        stopAutoSlide();
        startAutoSlide();
      });
    }

    projectsCarousel.addEventListener("mouseenter", stopAutoSlide);
    projectsCarousel.addEventListener("mouseleave", startAutoSlide);

    updateCarousel();
    startAutoSlide();
  }
});
