import Image from "next/image";
import { PoolHero } from "@/components/pool-hero/pool-hero";
import { CopyEmailButton } from "@/components/portfolio/copy-email-button";
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs";
import { WorkSamples } from "@/components/portfolio/work-samples";
import { activity, experience, projects } from "@/content/portfolio";
import styles from "@/components/portfolio/portfolio.module.css";

export default function Home() {
  return (
    <PoolHero>
      <PortfolioTabs
        panels={{
          about: (
            <section id="about" className={`${styles.section} ${styles.about}`}>
              <div>
                <h1 className={styles.intro}>Hey, I’m Dawson.</h1>
                <p>
                  I study computer science at the{" "}
                  <a
                    className={styles.schoolLink}
                    href="https://uwaterloo.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Waterloo
                  </a>{" "}
                  and build things for the web, mobile, and the occasional neural network.
                </p>
                <p>
                  I like making complicated things a little easier to use. Away from the keyboard,
                  you'll find me at the gym or the poker table.
                </p>
                <div className={styles.links}>
                  <CopyEmailButton className={styles.textLink} />
                  <a
                    className={styles.textLink}
                    href="https://github.com/dawsonxiong"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                  <a
                    className={styles.textLink}
                    href="https://www.linkedin.com/in/dawsonxiong/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    LinkedIn
                  </a>
                  <a
                    className={styles.textLink}
                    href="https://cal.com/dawsonxiong/15min"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Let’s chat
                  </a>
                </div>
              </div>
            </section>
          ),
          experience: (
            <section id="experience" className={styles.section}>
              <div>
                <ol>
                  {experience.map((job) => (
                    <li className={styles.entry} key={job.company}>
                      <div className={styles.experienceHeading}>
                        <a
                          className={styles.logoLink}
                          href={job.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Visit ${job.company}`}
                        >
                          <Image
                            className={styles.logoImage}
                            src={job.logo}
                            alt={job.logoAlt}
                            width={40}
                            height={40}
                          />
                        </a>
                        <div className={styles.experienceTitle}>
                          <h3>
                            <a href={job.href} target="_blank" rel="noopener noreferrer">
                              {job.company}
                            </a>
                          </h3>
                          <div className={styles.meta}>
                            <span>{job.role}</span>
                            <span>{job.date}</span>
                          </div>
                        </div>
                      </div>
                      <p>{job.description}</p>
                      {job.work ? <WorkSamples samples={job.work} /> : null}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          ),
          projects: (
            <section id="projects" className={styles.section}>
              <div>
                <ol>
                  {projects.map((project) => (
                    <li className={styles.entry} key={project.name}>
                      <div className={styles.entryHeading}>
                        <h3>
                          <a href={project.href} target="_blank" rel="noopener noreferrer">
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
            <section id="activity" className={styles.section}>
              <div>
                <ol>
                  {activity.map((item) => (
                    <li className={styles.activityItem} key={item.date + item.text}>
                      <time className={styles.date} dateTime={item.date}>
                        {item.label}
                      </time>
                      <a
                        className={styles.textLink}
                        href={item.href}
                        {...(item.href.startsWith("http")
                          ? { target: "_blank" as const, rel: "noopener noreferrer" }
                          : {})}
                      >
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
