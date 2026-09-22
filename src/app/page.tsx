import Image from "next/image";
import { PoolHero } from "@/components/pool-hero/pool-hero";
import { CopyEmailButton } from "@/components/portfolio/copy-email-button";
import { PeelHand } from "@/components/portfolio/peel-hand";
import { PortfolioTabs } from "@/components/portfolio/portfolio-tabs";
import { WorkSamples } from "@/components/portfolio/work-samples";
import { albums, experience, pokerHand, projects, songs } from "@/content/portfolio";
import { MONKEYTYPE_PROFILE, getPersonalBests } from "@/lib/monkeytype";
import styles from "@/components/portfolio/portfolio.module.css";

export default async function Home() {
  const personalBests = await getPersonalBests();

  return (
    <PoolHero>
      <PortfolioTabs
        panels={{
          about: (
            <section id="about" className={`${styles.section} ${styles.about}`}>
              <div>
                <h1 className={styles.intro}>Hey, I’m Dawson.</h1>
                <p>
                  I'm currently studying computer science at the{" "}
                  <a
                    className={styles.schoolLink}
                    href="https://uwaterloo.ca"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    University of Waterloo
                  </a>{" "}
                  and previously worked full-time at{" "}
                  <a
                    className={styles.companyLink}
                    href="https://generallearning.com"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    General Learning (YC F24)
                  </a>{" "}
                  as a Senior Software Engineer.
                </p>
                <p>
                  I specialize in designing backend systems and designing UI/UX for web and mobile
                  apps. If I'm not at the keyboard, you might find me at the gym or the poker table.
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
                      <h3>
                        <a href={project.href} target="_blank" rel="noopener noreferrer">
                          {project.name}
                        </a>
                      </h3>
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
          misc: (
            <section id="misc" className={styles.section}>
              <div>
                <ol>
                  <li className={styles.entry}>
                    <h3>
                      <a href={MONKEYTYPE_PROFILE} target="_blank" rel="noopener noreferrer">
                        Monkeytype
                      </a>
                    </h3>
                    <dl className={styles.bests}>
                      {personalBests.map((best) => (
                        <div key={best.label}>
                          <dt>{best.label}</dt>
                          <dd className={styles.bestWpm}>{best.wpm}</dd>
                          {best.topPercent !== undefined && (
                            <dd className={styles.bestRank}>Top {best.topPercent.toFixed(2)}%</dd>
                          )}
                        </div>
                      ))}
                    </dl>
                  </li>
                  <li className={styles.entry}>
                    <h3>Favourite albums right now</h3>
                    <ul className={styles.picks}>
                      {albums.map((album) => (
                        <li key={album.title}>
                          <Image
                            className={styles.cover}
                            src={album.cover}
                            alt=""
                            width={40}
                            height={40}
                          />
                          <span className={styles.pickTitle}>{album.title}</span>
                          <span className={styles.pickArtist}>{album.artist}</span>
                        </li>
                      ))}
                    </ul>
                  </li>
                  {/* <li className={styles.entry}>
                    <h3>Songs</h3>
                    <ul className={styles.picks}>
                      {songs.map((song) => (
                        <li key={song.title}>
                          <Image
                            className={styles.cover}
                            src={song.cover}
                            alt=""
                            width={40}
                            height={40}
                          />
                          <span className={styles.pickTitle}>{song.title}</span>
                          <span className={styles.pickArtist}>{song.artist}</span>
                        </li>
                      ))}
                    </ul>
                  </li> */}
                  <li className={styles.entry}>
                    <h3>Favourite poker hand</h3>
                    <div className={styles.hand}>
                      <PeelHand cards={pokerHand.cards} />
                    </div>
                  </li>
                </ol>
              </div>
            </section>
          ),
        }}
      />
    </PoolHero>
  );
}
