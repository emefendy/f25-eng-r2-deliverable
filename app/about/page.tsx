"use client";

import { useEffect, useState } from "react";

export default function BiodiversityLanding() {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    // Apply theme to document
    if (theme === "dark") {
      document.body.setAttribute("data-theme", "dark");
    } else {
      document.body.removeAttribute("data-theme");
    }
  }, [theme]);

  useEffect(() => {
    // Parallax effect for hero background
    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroBg = document.querySelector(".hero-bg")!;
      if (heroBg) {
        heroBg.style.transform = `translateY(${scrolled * 0.5}px)`;
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-content">
          <div className="hero-text">
            <h1>
              Explore the <span className="highlight">Living World</span>
            </h1>
            <p>
              Biodiversity Hub is your gateway to understanding and documenting Earth's incredible species. Connect with
              a community passionate about preserving our planet's natural heritage.
            </p>
          </div>

          <div className="hero-images">
            <div className="image-card">
              <img
                src="https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?w=800&h=1200&fit=crop"
                alt="Colorful hummingbird"
              />
              <div className="image-label">Sea Turtle</div>
            </div>
            <div className="image-card">
              <img
                src="https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=400&fit=crop"
                alt="Tropical frog"
              />
              <div className="image-label">Giant Panda</div>
            </div>
            <div className="image-card">
              <img
                src="https://images.unsplash.com/photo-1535083783855-76ae62b2914e?w=800&h=400&fit=crop"
                alt="Butterfly on flower"
              />
              <div className="image-label">Lilac-Breasted Roller</div>
            </div>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="features-content">
          <div className="section-header">
            <h2>Discover, Document, Protect</h2>
            <p>
              Join scientists, educators, and nature enthusiasts in building the most comprehensive biodiversity
              database
            </p>
          </div>

          <div className="feature-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>Document Species</h3>
              <p>
                Create detailed cards with species names, descriptions, population data, habitat information, and
                conservation status.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">🌍</div>
              <h3>Global Network</h3>
              <p>
                Connect with biodiversity enthusiasts worldwide and access a growing library of species information from
                every continent.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Stay Educated</h3>
              <p>
                Learn about ecosystem dynamics, conservation efforts, and the latest discoveries in biodiversity
                research.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
