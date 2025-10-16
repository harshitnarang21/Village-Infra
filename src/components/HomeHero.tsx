import React from "react";

const HomeHero: React.FC = () => (
  <section className="hero">
    <div className="hero-headline">
      Transforming Villages with Smart Infrastructure
    </div>
    <div className="hero-subline">
      Track assets, manage projects, empower citizens & build greener communities—all at your fingertips.
    </div>
    <div className="cta">
      <button className="cta-btn">Get Started</button>
    </div>
    <div className="hero-stats">
      <div className="stat">
        <div className="stat-main">120+</div>
        <div className="stat-desc">Villages upgraded with digital twins</div>
      </div>
      <div className="stat">
        <div className="stat-main">3,500+</div>
        <div className="stat-desc">IoT devices in rural infrastructure</div>
      </div>
      <div className="stat">
        <div className="stat-main">50,000+</div>
        <div className="stat-desc">Citizens empowered by smart technology</div>
      </div>
    </div>
  </section>
);

export default HomeHero;
