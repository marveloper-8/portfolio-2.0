'use client';

export default function CvDocument({ isModal = false }) {
  return (
    <div className={`cv-paper ${isModal ? 'modal-paper' : ''}`} id={isModal ? 'modal-cv-paper' : 'cv-printable-area'}>
      {/* CV Header */}
      <div className="cv-header">
        <h1 className="cv-name">JOSHUA SAMUEL EQUERE</h1>
        <div className="cv-contact-row">
          <a href="mailto:josh.sam.builds@gmail.com" className="cv-contact-item">josh.sam.builds@gmail.com</a>
          <span className="cv-separator">•</span>
          <a href="tel:+2348074681328" className="cv-contact-item">+2348074681328</a>
          <span className="cv-separator">•</span>
          <a href="https://github.com/marveloper-8" target="_blank" rel="noopener noreferrer" className="cv-contact-item">github.com/marveloper-8</a>
          <span className="cv-separator">•</span>
          <a href="https://linkedin.com/in/marveloper" target="_blank" rel="noopener noreferrer" className="cv-contact-item">linkedin.com/in/marveloper</a>
          <span className="cv-separator">•</span>
          <a href="https://josh.trynexalabs.com" target="_blank" rel="noopener noreferrer" className="cv-contact-item">josh.trynexalabs.com</a>
        </div>
        <div className="cv-role-title">SOFTWARE ENGINEER (MOBILE, WEB, BACKEND, &amp; CLOUD)</div>
        <p className="cv-summary">
          Senior Software Engineer who builds complete digital products from start to finish. I specialize in the four pillars of modern software: mobile apps, web interfaces, robust servers, and reliable cloud infrastructure. I focus on creating fast, scalable systems that can easily handle heavy load/usage without problems.
        </p>
      </div>

      {/* Core Skills */}
      <div className="cv-section-block">
        <h2 className="cv-section-heading">CORE SKILLS</h2>
        <div className="cv-skills-list">
          <div className="cv-skill-line">
            <strong>Backend &amp; Data:</strong> Go (Golang), Python, Node.js, Nest.js, Express.js, Redis, MySQL, PostgreSQL, MongoDB, Pub/Sub, Kafka, RabbitMQ
          </div>
          <div className="cv-skill-line">
            <strong>Web &amp; Mobile:</strong> React, Next.js, React Native, Redux, D3.js, Tailwind CSS, WebSockets, Rest APIs, Svelte
          </div>
          <div className="cv-skill-line">
            <strong>Cloud &amp; DevOps:</strong> AWS (EKS, S3, CloudFront), Docker, Kubernetes, Terraform, Ansible, GitHub Actions, Jenkins, CI/CD, Automated Testing Frameworks (Cypress, Playwright)
          </div>
          <div className="cv-skill-line">
            <strong>Architecture:</strong> Microservices, GraphQL Federation, Event-Driven, Domain-Driven Design (DDD), Offline-First Architecture
          </div>
        </div>
      </div>

      {/* Professional Experience */}
      <div className="cv-section-block">
        <h2 className="cv-section-heading">PROFESSIONAL EXPERIENCE</h2>

        {/* NexaLabs */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">NexaLabs LTD</span>
            <span className="cv-job-date">Jun 2026 - Present</span>
          </div>
          <div className="cv-job-title">Owner &amp; Software Engineer (Mobile, Web, &amp; Backend)</div>
          <ul className="cv-job-bullets">
            <li>Launched multiple digital products from initial idea to public release by directing the technical strategy and development for a software publishing business.</li>
            <li>Ensured reliable system performance by architecting complete systems that connect mobile and web interfaces to secure cloud infrastructure.</li>
          </ul>
          <div className="cv-job-env">
            Environment: Golang, TypeScript, NestJS, React Native, Next.js, Docker, Cloudflare, AWS, Python • <a href="https://nexalabs.site" target="_blank" rel="noopener noreferrer">https://nexalabs.site</a>
          </div>
        </div>

        {/* DoneThat: Sync */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">DoneThat: Sync</span>
            <span className="cv-job-date">Feb 2026 - Present</span>
          </div>
          <div className="cv-job-title">Owner &amp; Software Engineer (Mobile, Web, &amp; Backend)</div>
          <ul className="cv-job-bullets">
            <li>Enabled instant cross-device synchronization of household tasks by building a real-time React Native mobile application.</li>
            <li>Eliminated data delays and manual refreshes by designing a fast, reliable server backend with WebSockets and PostgreSQL.</li>
          </ul>
          <div className="cv-job-env">
            Environment: React Native, Golang, WebSockets, PostgreSQL, Coolify, AWS, Docker • <a href="https://donethat.online" target="_blank" rel="noopener noreferrer">https://donethat.online</a>
          </div>
        </div>

        {/* Bible Words */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">Bible Words: Play</span>
            <span className="cv-job-date">Aug 2025 - Present</span>
          </div>
          <div className="cv-job-title">Owner &amp; Software Engineer (Mobile, Web, &amp; Backend)</div>
          <ul className="cv-job-bullets">
            <li>Maintained 99.9% uptime for 10,000+ concurrent players by engineering a highly reliable backend server system.</li>
            <li>Accelerated global game load times by 40% by provisioning optimized cloud infrastructure on AWS.</li>
          </ul>
          <div className="cv-job-env">
            Environment: React Native, Golang, Docker, AWS S3, AWS CloudFront, Python • <a href="https://play.lolaschools.com" target="_blank" rel="noopener noreferrer">https://play.lolaschools.com</a>
          </div>
        </div>

        {/* LOLA */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">LOLA - JAMB &amp; WAEC PREP</span>
            <span className="cv-job-date">Sep 2024 - Aug 2025</span>
          </div>
          <div className="cv-job-title">Owner &amp; Software Engineer (Mobile, Web, &amp; Backend)</div>
          <ul className="cv-job-bullets">
            <li>Facilitated national exam success for over 90% of enrolled students by leading the technology strategy for the educational platform.</li>
            <li>Accelerated live message and video transmission by 65% by upgrading the real-time tutoring architecture.</li>
          </ul>
          <div className="cv-job-env">
            Environment: React Native, Node.js, JSON APIs, WebSockets, PostgreSQL, Python, Docker • <a href="https://lolaschools.com" target="_blank" rel="noopener noreferrer">https://lolaschools.com</a>
          </div>
        </div>

        {/* Page Divider in UI */}
        <div className="cv-page-divider">
          <span>PAGE 2</span>
        </div>

        {/* LifeApp */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">LifeApp</span>
            <span className="cv-job-date">Mar 2024 - May 2024</span>
          </div>
          <div className="cv-job-title">Backend &amp; Cloud Engineer (Contract)</div>
          <ul className="cv-job-bullets">
            <li>Processed 1 million+ daily user actions with a 60% increase in application speed by designing a scalable server system.</li>
            <li>Increased new feature launch speed by 50% by automating the backend CI/CD release pipeline.</li>
          </ul>
          <div className="cv-job-env">
            Environment: Go, Python, AWS (EKS), CI/CD, Kubernetes
          </div>
        </div>

        {/* BioCatlog */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">BioCatlog</span>
            <span className="cv-job-date">Aug 2022 - Mar 2023</span>
          </div>
          <div className="cv-job-title">Senior Software Engineer (Mobile, Web, &amp; Backend)</div>
          <ul className="cv-job-bullets">
            <li>Supported 50,000+ daily active users by managing the end-to-end development of a high-traffic web application.</li>
            <li>Boosted application speed by 70% for end-users by optimizing data retrieval operations via Redis and GraphQL.</li>
          </ul>
          <div className="cv-job-env">
            Environment: React, Next.js, Node.js, GraphQL, Redis, Docker, Python
          </div>
        </div>

        {/* SynOption */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">SynOption</span>
            <span className="cv-job-date">Sep 2021 - Aug 2022</span>
          </div>
          <div className="cv-job-title">Web Engineer</div>
          <ul className="cv-job-bullets">
            <li>Secured $10 million+ in daily transactions by helping build a robust financial trading platform.</li>
            <li>Broadened accessibility for users on slow connections by shrinking the mobile application's download size by 60%.</li>
          </ul>
          <div className="cv-job-env">
            Environment: React, TypeScript, Redux, Tailwind CSS
          </div>
        </div>

        {/* ProDevs */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">ProDevs</span>
            <span className="cv-job-date">Sep 2020 - Aug 2021</span>
          </div>
          <div className="cv-job-title">Software Engineer (Mobile &amp; Web)</div>
          <ul className="cv-job-bullets">
            <li>Delivered 100,000+ daily notifications flawlessly by building a dependable automated alert system.</li>
            <li>Reduced production application errors by 80% by creating an automated testing process that caught bugs before release.</li>
            <li>Retained seamless usability for 50,000+ users during internet drops by developing an offline-first mobile feature.</li>
          </ul>
          <div className="cv-job-env">
            Environment: React Native, Node.js, Express.js, Cypress, Playwright, Docker, Python
          </div>
        </div>

        {/* GidiJobs */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">GidiJobs</span>
            <span className="cv-job-date">Sep 2019 - Jul 2020</span>
          </div>
          <div className="cv-job-title">Software Engineer (Web)</div>
          <ul className="cv-job-bullets">
            <li>Cut web page load times by 35% for thousands of daily visitors by optimizing database search queries.</li>
          </ul>
          <div className="cv-job-env">
            Environment: React, MySQL, Node.js
          </div>
        </div>

        {/* Bethesda */}
        <div className="cv-job">
          <div className="cv-job-header">
            <span className="cv-job-company">Bethesda Child Support Foundation</span>
            <span className="cv-job-date">Jan 2018 - Jun 2018</span>
          </div>
          <div className="cv-job-title">Software Engineer Intern (Web)</div>
          <ul className="cv-job-bullets">
            <li>Streamlined educational and needs tracking for 500+ sponsored children by building a digital management system.</li>
            <li>Eliminated manual paperwork by automating payment tracking and application processes into a fast digital platform.</li>
          </ul>
          <div className="cv-job-env">
            Environment: JavaScript, HTML/CSS, MySQL, Node.js
          </div>
        </div>
      </div>

      {/* Education */}
      <div className="cv-section-block">
        <h2 className="cv-section-heading">EDUCATION</h2>
        <div className="cv-edu-row">
          <div className="cv-edu-item">
            <strong>BSc, Computer Science</strong> - Southwestern University (2024)
          </div>
          <div className="cv-edu-item">
            <strong>Diploma in Software Development &amp; Digital Design</strong> - Ekobits Academy (2019)
          </div>
        </div>
      </div>
    </div>
  );
}
