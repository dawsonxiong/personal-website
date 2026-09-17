import { PoolHero } from "@/components/pool-hero/pool-hero";
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs";
import { activity, experience, projects } from "@/content/portfolio";
import styles from "@/components/portfolio/portfolio.module.css";

export default function Home() {
  return (
    <PoolHero>
      <PortfolioTabs
        panels={{
          about: (
            <section
              id="about"
              className={`${styles.section} ${styles.about}`}
              aria-labelledby="about-heading"
            >
              <div>
                <h2 id="about-heading">About</h2>
                <h1 className={styles.intro}>Hey, I’m Dawson.</h1>
                <p>
                  I study computer science at the University of Waterloo and build things for the
                  web, mobile, and the occasional neural network.
                </p>
                <p>
                  I like making complicated things a little easier to use. Away from the keyboard,
                  you'll find me at the gym or the poker table.
                </p>
                <div className={styles.links}>
                  <a className={styles.textLink} href="mailto:dawsonxiong@gmail.com">
                    Email
                  </a>
                  <a className={styles.textLink} href="https://github.com/dawsonxiong">
                    GitHub
                  </a>
                  <a className={styles.textLink} href="https://www.linkedin.com/in/dawsonxiong/">
                    LinkedIn
                  </a>
                  <a className={styles.textLink} href="https://cal.com/dawsonxiong/15min">
                    Let’s chat
                  </a>
                </div>
              </div>
            </section>
          ),
          experience: (
            <section
              id="experience"
              className={styles.section}
              aria-labelledby="experience-heading"
            >
              <div>
                <h2 id="experience-heading">Experience</h2>
                <ol>
                  {experience.map((job) => (
                    <li className={styles.entry} key={job.company}>
                      <h3>
                        <a className={styles.textLink} href={job.href}>
                          {job.company}
                        </a>
                      </h3>
                      <div className={styles.meta}>
                        <span>{job.role}</span>
                        <span>{job.date}</span>
                      </div>
                      <p>{job.description}</p>
                      {job.details && <p>{job.details}</p>}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ),
          projects: (
            <section id="projects" className={styles.section} aria-labelledby="projects-heading">
              <div>
                <h2 id="projects-heading">Selected projects</h2>
                <ol>
                  {projects.map((project) => (
                    <li className={styles.entry} key={project.name}>
                      <div className={styles.entryHeading}>
                        <h3>
                          <a className={styles.textLink} href={project.href}>
                            {project.name}
                          </a>
                        </h3>
                        <span className={styles.external} aria-hidden="true">
                          ↗
                        </span>
                      </div>
                      <p>{project.description}</p>
                      <p className={styles.stack}>{project.stack}</p>
                      {project.details && (
                        <details className={styles.details}>
                          <summary>A little more</summary>
                          <p>{project.details}</p>
                        </details>
                      )}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ),
          activity: (
            <section id="activity" className={styles.section} aria-labelledby="activity-heading">
              <div>
                <h2 id="activity-heading">Activity</h2>
                <p className={styles.activityIntro}>
                  Things I’m building, trying, and figuring out.
                </p>
                <ol>
                  {activity.map((item) => (
                    <li className={styles.activityItem} key={item.date + item.text}>
                      <time className={styles.date} dateTime={item.date}>
                        {item.label}
                      </time>
                      <a className={styles.textLink} href={item.href}>
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ),
        }}
      />
    </PoolHero>
  );
}
