import { useEffect, useState } from "react";
import { api } from "./services/api";

type Page =
  | "home"
  | "teams"
  | "united"
  | "men"
  | "ladies"
  | "squad"
  | "staff"
  | "player"
  | "fixtures"
  | "results"
  | "tables"
  | "match"
  | "news"
  | "article"
  | "media"
  | "club"
  | "history"
  | "honours"
  | "community"
  | "contact"
  | "search";

const routes: Record<Page, string> = {
  home: "/",
  teams: "/teams",
  united: "/teams/mphehli-united",
  men: "/teams/mphehli-all-stars-men",
  ladies: "/teams/mphehli-all-stars-ladies",
  squad: "/teams/mphehli-united/squad",
  staff: "/teams/mphehli-united/staff",
  player: "/players/player-id",
  fixtures: "/fixtures",
  results: "/results",
  tables: "/tables",
  match: "/matches/mu-mw-2026-09-26",
  news: "/news",
  article: "/news/five-star-united-set-the-standard",
  media: "/media",
  club: "/club",
  history: "/club/history",
  honours: "/club/honours",
  community: "/club/community",
  contact: "/contact",
  search: "/search",
};

const routePages = Object.entries(routes).reduce<Record<string, Page>>(
  (all, [page, path]) => ({ ...all, [path]: page as Page }),
  {},
);

const images = {
  hero: "/ABC/heroo.JPG",
  action: "/ABC/IMG_7900.JPG",
  ladies: "/Ladies/WhatsApp Image 2026-10-02 at 15.52.00.jpeg",
  huddle: "/ABC/WhatsApp Image 2026-10-01 at 16.47.29.jpeg",
  portrait: "/ABC/IMG_7880.JPG",
  training: "/All-Stars/IMG_7762.JPG",
  celebrate: "/ABC/WhatsApp Image 2026-10-01 at 16.48.05.jpeg",
  community: "/ABC/WhatsApp Image 2026-10-01 at 16.45.05.jpeg",
  women: "/Ladies/WhatsApp Image 2026-10-02 at 16.00.43.jpeg",
};

const navItems = ["TEAMS", "FIXTURES", "RESULTS", "TABLES", "NEWS", "MEDIA", "CLUB"];

function Crest({ light = false }: { light?: boolean }) {
  return (
    <img
      src="/color-logo-no-bg.png"
      alt="Mphehli All Stars Logo"
      className={`w-full h-full object-contain ${light ? "invert brightness-200" : ""}`}
      style={{
        maxWidth: '80px',
        maxHeight: '80px',
        filter: 'none'
      }}
      onError={(e) => {
        (e.target as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}

function Arrow() {
  return <span aria-hidden="true">↗</span>;
}

function LinkButton({
  children,
  onClick,
  inverse = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  inverse?: boolean;
}) {
  return (
    <button className={`link-button ${inverse ? "link-button--inverse" : ""}`} onClick={onClick}>
      <span>{children}</span>
      <Arrow />
    </button>
  );
}

function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return (
    <div className="section-head">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action && <LinkButton>{action}</LinkButton>}
    </div>
  );
}

function Header({ setPage, settings }: { setPage: (page: Page) => void; settings: any }) {
  const [switcher, setSwitcher] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);


  useEffect(() => {
    if (!switcher) return;

    const handleScroll = () => {
      setSwitcher(false);
    };

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.team-dropdown-container')) {
        setSwitcher(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [switcher]);

  return (
    <>
      <header className="site-header">
        <div className="utility">
          <span>{settings?.identityStatement || "ONE CLUB. MULTIPLE TEAMS. ONE IDENTITY."}</span>
          <nav>
            <button>LATEST</button>
            <button onClick={() => setPage("teams")}>TEAMS</button>
            <button>CONTACT</button>
            <span>FOLLOW: IG&nbsp;&nbsp;FB&nbsp;&nbsp;YT</span>
          </nav>
        </div>
        <div className="main-nav">
          <button className="brand" onClick={() => setPage("home")} aria-label="Home">
            <Crest light />
            <span className="brand-text">{settings?.clubName || "MPHEHLI ALL STARS"}</span>
          </button>
          <nav className="desktop-nav">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => setPage(
                  item === "TEAMS" ? "teams" :
                  item === "FIXTURES" ? "fixtures" :
                  item === "RESULTS" ? "results" :
                  item === "TABLES" ? "tables" :
                  item === "NEWS" ? "news" :
                  item === "MEDIA" ? "media" : "club"
                )}
              >
                {item}
              </button>
            ))}
          </nav>
          <div className="nav-actions">
            <button aria-label="Search" className="search-button" onClick={() => setPage("search")}>⌕</button>
            <button className="team-switch" onClick={() => setSwitcher(!switcher)}>
              SELECT TEAM <span>⌄</span>
            </button>
            <button className="menu-button" aria-label="Menu" aria-expanded={mobileMenu} onClick={() => setMobileMenu(!mobileMenu)}><i /><i /></button>
          </div>
        </div>
      </header>
      {switcher && (
        <div className="team-dropdown-container">
          <div className="team-dropdown">
            <div className="dropdown-header">
              <span className="eyebrow">SELECT TEAM</span>
            </div>
            <div className="dropdown-options">
              {[
                ["club", "MPHEHLI ALL STARS", "ALL CLUBS"],
                ["united", "MPHEHLI UNITED", "ABC MOTSEPE LEAGUE"],
                ["men", "ALL STARS MEN", "REGIONAL LEAGUE"],
                ["ladies", "ALL STARS LADIES", "SASOL LEAGUE"],
              ].map(([theme, name, league]) => (
                <button
                  key={theme}
                  className={`dropdown-option ${theme}`}
                  onClick={() => { setPage(theme === "club" ? "home" : theme as Page); setSwitcher(false); }}
                >
                  <div className="option-info">
                    <span className="swatch" />
                    <div className="text">
                      <b>{name}</b>
                      <small>{league}</small>
                    </div>
                  </div>
                  <Arrow />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      {mobileMenu && (
        <div className="mobile-menu">
          <div className="mobile-menu__top"><Crest light /><button onClick={() => setMobileMenu(false)}>CLOSE ×</button></div>
          <nav>
            {[
              ["TEAMS", "teams"], ["FIXTURES", "fixtures"], ["RESULTS", "results"],
              ["TABLES", "tables"], ["NEWS", "news"], ["MEDIA", "media"], ["CLUB", "club"],
            ].map(([label, target], index) => <button key={label} onClick={() => { setPage(target as Page); setMobileMenu(false); }}><small>0{index + 1}</small>{label}<Arrow /></button>)}
          </nav>
          <div className="mobile-menu__foot"><button onClick={() => { setPage("search"); setMobileMenu(false); }}>SEARCH</button><button onClick={() => { setSwitcher(true); setMobileMenu(false); }}>SWITCH TEAM</button></div>
        </div>
      )}
    </>
  );
}

function MatchLockup({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`match-lockup ${compact ? "match-lockup--compact" : ""}`}>
      <div className="match-team">
        <Crest light />
        <strong>MPHEHLI<br />UNITED</strong>
      </div>
      <div className="match-score">
        <span>5</span><em>—</em><span>0</span>
      </div>
      <div className="match-team match-team--away">
        <div className="opponent-crest">MW</div>
        <strong>MOGOPELA<br />WONDEROUS</strong>
      </div>
    </div>
  );
}

function Home({ setPage }: { setPage: (page: Page) => void }) {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [standings, setStandings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [fixtureFilter, setFixtureFilter] = useState("ALL");

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [fixturesData, newsData, standingsData] = await Promise.all([
          api.getFixtures(),
          api.getNews({ }),
          api.getStandings(),
        ]);
        setFixtures(fixturesData);
        setNews(newsData);
        setStandings(standingsData);
      } catch (e) {
        console.error("Error loading home data", e);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Home...</div>;

  const heroMatch = fixtures.find(f => f.status === "COMPLETED") || fixtures[0];
  const nextMatch = fixtures.find(f => f.status === "SCHEDULED") || fixtures[0];
  const topNews = news.slice(0, 3);

  return (
    <main>
      <section className="hero" style={{ backgroundImage: `url(${images.hero})` }}>
        <div className="hero-shade" />
        <div className="hero-kicker">
          <span className="live-dot" /> FULL TIME
          <span>{heroMatch?.competition || "LEAGUE MATCH"}</span>
        </div>
        <div className="hero-content">
          <div className="hero-result">
            <div className="match-lockup">
              <div className="match-team">
                <Crest light />
                <strong className="uppercase">{heroMatch?.homeTeam || "HOME TEAM"}</strong>
              </div>
              <div className="match-score">
                <span>{heroMatch?.homeScore || "0"}</span><em>—</em><span>{heroMatch?.awayScore || "0"}</span>
              </div>
              <div className="match-team match-team--away">
                <div className="opponent-crest">{heroMatch?.awayTeam?.charAt(0) || "O"}</div>
                <strong className="uppercase">{heroMatch?.awayTeam || "AWAY TEAM"}</strong>
              </div>
            </div>
            <div className="hero-meta">
              <span>{heroMatch?.date || "DATE TBC"}</span><span>{heroMatch?.venue || "STADIUM TBC"}</span>
            </div>
          </div>
          <div className="hero-side">
            <p>{heroMatch?.summary || "MATCH REPORT PENDING."}</p>
            <LinkButton inverse onClick={() => setPage("match")}>MATCH CENTRE</LinkButton>
          </div>
        </div>
        <div className="hero-index">01 / 04</div>
      </section>

      <section className="next-match">
        <div className="next-match__label">
          <span className="eyebrow">NEXT MATCH</span>
          <b>{nextMatch?.date || "DATE TBC"}</b>
          <small>{nextMatch?.status || "SCHEDULE PENDING"}</small>
        </div>
        <div className="next-match__teams">
          <strong className="uppercase">{nextMatch?.homeTeam || "HOME TEAM"}</strong>
          <Crest />
          <span>VS</span>
          <div className="opponent-crest opponent-crest--dark">{nextMatch?.awayTeam?.charAt(0) || "—"}</div>
          <strong className="uppercase">{nextMatch?.awayTeam || "OPPONENT TBC"}</strong>
        </div>
        <div className="next-match__meta">
          <span>{nextMatch?.competition || "COMPETITION TBC"}</span>
          <b>{nextMatch?.venue || "VENUE TBC"}</b>
          <LinkButton onClick={() => setPage("fixtures")}>VIEW FIXTURES</LinkButton>
        </div>
      </section>

      <section className="editorial section">
        <SectionHead eyebrow="THE LATEST" title="INSIDE THE CLUB" action="VIEW ALL NEWS" />
        <div className="editorial-grid">
          {topNews.length > 0 ? (
            <>
              <article className="lead-story" onClick={() => setPage("article")}>
                <img src={topNews[0].image || images.celebrate} alt={topNews[0].title} />
                <div className="story-overlay">
                  <span className="category">{topNews[0].category}</span>
                  <h3>{topNews[0].title}</h3>
                  <p>{topNews[0].excerpt}</p>
                </div>
              </article>
              {topNews.slice(1).map((story, i) => (
                <article key={story.id} className={i === 0 ? "side-story" : "side-story side-story--dark"}>
                  <div className={i === 1 ? "side-story-content" : ""}>
                    <span className="category">{story.category}</span>
                    <h3>{story.title}</h3>
                    <small>{story.date}</small>
                  </div>
                  {story.image && <img src={story.image} alt={story.title} />}
                </article>
              ))}
            </>
          ) : (
            <InterfaceState title="NO NEWS AVAILABLE" body="Editorial content will appear here soon." />
          )}
        </div>
        <div className="story-rail">
          {news.slice(3, 6).map((story, i) => (
            <article key={story.id} onClick={() => setPage("article")}>
              <b>0{i + 4}</b><span className="category">{story.category}</span><h4>{story.title}</h4><Arrow />
            </article>
          ))}
        </div>
      </section>

      <section className="fixtures section">
        <SectionHead eyebrow="2026 / 27 SEASON" title="FIXTURE CENTRE" action="FULL SCHEDULE" />
        <div className="filter-row">
          <div>{["ALL", "UNITED", "MEN", "LADIES"].map((f) => <button key={f} className={fixtureFilter === f ? "active" : ""} onClick={() => setFixtureFilter(f)}>{f}</button>)}</div>
          <div><button className="active">UPCOMING</button><button>RESULTS</button></div>
        </div>
        <div className="month">UPCOMING / SCHEDULE</div>
        {fixtures.filter(f => (fixtureFilter === "ALL" || f.teamSlug === fixtureFilter.toLowerCase())).slice(0, 3).map((f, i) => (
          <div className="fixture-row" key={f.id}>
            <span className="fixture-index">0{i + 1}</span><b>{f.date}<small>{f.day || "SATURDAY"}</small></b><strong>{f.score || "—"}</strong>
            <div className="fixture-teams"><span className="uppercase">{f.homeTeam}</span><em>VS</em><span className="uppercase">{f.awayTeam}</span></div>
            <span>{f.venue}<small>{f.status}</small></span><button onClick={() => setPage("match")}>MATCH CENTRE <Arrow /></button>
          </div>
        ))}
      </section>

      <section className="team-spotlight" style={{ backgroundImage: `url(${images.action})` }}>
        <div className="team-spotlight__block">
          <span className="eyebrow">TEAM 01 / BLUE</span>
          <h2 className="uppercase">MPHEHLI UNITED</h2>
          <p>ABC MOTSEPE LEAGUE<br />NORTH WEST · STREAM A</p>
          <LinkButton inverse onClick={() => setPage("united")}>ENTER TEAM</LinkButton>
        </div>
        <div className="team-pagination"><b>01</b><span>02</span><span>03</span></div>
      </section>

      <section className="player-feature">
        <div className="player-number">09</div>
        <div className="player-image"><img src={images.portrait} alt="Featured football player on the pitch" /></div>
        <div className="player-copy">
          <span className="eyebrow">PLAYER FOCUS / FORWARD</span>
          <h2 className="uppercase">PLAYER<br />NAME</h2>
          <p>MPHEHLI UNITED</p>
          <div className="placeholder-stats">
            {["APPEARANCES", "GOALS", "ASSISTS", "MINUTES"].map((s) => <span key={s}><b>—</b><small>{s}</small></span>)}
          </div>
          <LinkButton inverse onClick={() => setPage("player")}>PLAYER PROFILE</LinkButton>
        </div>
      </section>

      <section className="results-table section">
        <div className="latest-result">
          <span className="eyebrow">LATEST RESULT</span>
          <h2 className="uppercase">A STATEMENT<br />AT HOME.</h2>
          <div className="result-numbers"><b>{heroMatch?.homeScore || "0"}</b><em>—</em><b>{heroMatch?.awayScore || "0"}</b></div>
          <div className="result-names"><span className="uppercase">{heroMatch?.homeTeam || "HOME"}</span><span className="uppercase">{heroMatch?.awayTeam || "AWAY"}</span></div>
          <p className="uppercase">FULL TIME · {heroMatch?.venue || "STADIUM TBC"}</p>
        </div>
        <div className="table-wrap">
          <div className="table-title"><span className="eyebrow">LEAGUE TABLE</span><b className="uppercase">{standings?.league || "ABC MOTSEPE LEAGUE — STREAM A"}</b></div>
          <div className="league-table">
            <div className="table-row table-header"><span>POS</span><span>TEAM</span><span>P</span><span>W</span><span>D</span><span>L</span><span>GD</span><span>PTS</span></div>
            {standings?.rows ? (
              standings.rows.map((row: any, j: number) => (
                <div className="table-row" key={j}>{row.map((v: any, k: number) => <span key={k}>{v}</span>)}</div>
              ))
            ) : (
              <div className="table-row highlight">{["—", "MPHEHLI UNITED", "—", "—", "—", "—", "—", "—"].map((v, j) => <span key={j}>{v}</span>)}</div>
            )}
          </div>
          <small className="data-note">Official competition standings updated in real-time.</small>
          <LinkButton>FULL TABLE</LinkButton>
        </div>
      </section>

      <section className="media section">
        <SectionHead eyebrow="THE ARCHIVE" title="CLUB / IN FRAME" action="VIEW GALLERY" />
        <div className="media-grid">
          <figure className="media-main"><img src={images.training} alt="Players in competitive match action" /><figcaption><span>MATCHDAY</span><b>90 MINUTES AT IKAGENG</b></figcaption></figure>
          <figure><img src={images.women} alt="Women's football training session" /><figcaption><span>LADIES</span><b>ON THE GRASS</b></figcaption></figure>
          <figure><img src={images.huddle} alt="Football team huddle" /><figcaption><span>UNITED</span><b>TOGETHER</b></figcaption></figure>
        </div>
      </section>

      <section className="club-story">
        <div className="club-story__copy">
          <span className="eyebrow">OUR CLUB</span>
          <h2 className="uppercase">ONE CREST.<br />THREE TEAMS.<br />ONE FUTURE.</h2>
          <p>Mphehli All Stars is building a football institution rooted in people, place and ambition. Our story is still being written — on the pitch and beyond it.</p>
          <LinkButton inverse>DISCOVER THE CLUB</LinkButton>
        </div>
        <div className="club-story__image"><img src={images.hero} alt="Footballers competing under stadium lights" /><span className="uppercase">MPHEHLI<br />ALL STARS</span></div>
      </section>

      <section className="history section">
        <SectionHead eyebrow="HERITAGE" title="THE STORY SO FAR" />
        <div className="timeline">
          {["2024", "2025", "2026"].map((year, i) => (
            <div key={year} className={i === 2 ? "current" : ""}><b>{year}</b><span>CLUB HISTORY MILESTONE</span><p>Verified club history will be added here.</p></div>
          ))}
        </div>
      </section>

      <section className="community" style={{ backgroundImage: `url(${images.community})` }}>
        <div><span className="eyebrow">BEYOND 90 MINUTES</span><h2 className="uppercase">FOOTBALL<br />BELONGS TO<br />EVERYONE.</h2><p>Our club lives in its community. On the training ground, in the stands and wherever the next generation finds the game.</p><LinkButton inverse>OUR COMMUNITY</LinkButton></div>
      </section>
    </main>
  );
}

function TeamPage({ setPage, theme = "united" }: { setPage: (page: Page) => void; theme?: "united" | "men" | "ladies" }) {
  const [teamData, setTeamData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadTeam() {
      try {
        const data = await api.getTeamBySlug(theme);
        setTeamData(data);
      } catch (e) {
        console.error("Error loading team", e);
      } finally {
        setLoading(false);
      }
    }
    loadTeam();
  }, [theme]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Team...</div>;
  if (!teamData) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Team Not Found</div>;

  const { name, short, identity, competition, image } = teamData;

  return (
    <main className={`team-page team-page--${theme}`}>
      <section className="sub-hero" style={{ backgroundImage: `url(${image || images.action})` }}>
        <div><span className="eyebrow">{identity}</span><h1 className="uppercase">{name}</h1><p>{competition}</p></div>
      </section>
      <nav className="team-subnav"><b className="uppercase">{short}</b>{["HOME", "FIXTURES", "RESULTS", "TABLE", "SQUAD", "STAFF", "NEWS", "MEDIA"].map((n) => <button key={n} onClick={() => n === "SQUAD" ? setPage("squad") : n === "STAFF" ? setPage("staff") : undefined}>{n}</button>)}</nav>
      <section className="team-dashboard section">
        <SectionHead eyebrow={`${short} / CURRENT`} title={`${short} ENVIRONMENT`} />
        <div className="team-match-grid">
          <div className="blue-panel"><span className="eyebrow">NEXT MATCH</span><h3>FIXTURE<br /><b>—</b></h3><p>{short} <i>VS</i> OPPONENT</p><small>CMS-MANAGED FIXTURE INFORMATION</small><br /><br /><LinkButton inverse onClick={() => setPage("fixtures")}>VIEW FIXTURES</LinkButton></div>
          <div className="result-panel"><span className="eyebrow">LATEST RESULT</span>{theme === "united" ? <><div><b>5</b><em>—</em><b>0</b></div><p>UNITED · FULL TIME · WONDEROUS</p><LinkButton onClick={() => setPage("match")}>MATCH CENTRE</LinkButton></> : <div className="empty-result"><b>—</b><p>NO VERIFIED RESULT AVAILABLE</p></div>}</div>
        </div>
      </section>
      <section className="team-news section"><SectionHead eyebrow="FROM THE TEAM" title={`${short} NEWS`} action="ALL TEAM NEWS" /><div className="editorial-grid"><article className="lead-story"><img src={image || images.training} alt={`${name} football team`} /><div className="story-overlay"><span className="category">TEAM NEWS</span><h3>THE LATEST FROM {short}</h3></div></article><article className="side-story"><img src={images.training} alt="Players during a match" /><div><span className="category">TRAINING</span><h3>PREPARATION / STORY PLACEHOLDER</h3></div></article></div></section>
      <section className="squad-callout"><span>THE TEAM</span><h2 className="uppercase">MEET {short}.</h2><p>PLAYERS · STAFF · FIXTURES · MEDIA</p><LinkButton inverse onClick={() => setPage("squad")}>VIEW SQUAD</LinkButton></section>
    </main>
  );
}

function SquadPage({ setPage, theme = "united" }: { setPage: (page: Page) => void; theme?: string }) {
  const [players, setPlayers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSquad() {
      try {
        const data = await api.getPlayers({ teamSlug: theme });
        setPlayers(data);
      } catch (e) {
        console.error("Error loading squad", e);
      } finally {
        setLoading(false);
      }
    }
    loadSquad();
  }, [theme]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Squad...</div>;
  if (!players || players.length === 0) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">No Players Found</div>;

  const groups = ["GOALKEEPERS", "DEFENDERS", "MIDFIELDERS", "FORWARDS"];

  return (
    <main className="squad-page">
      <div className="page-intro blue-intro">
        <span className="eyebrow">{theme.toUpperCase().replace("-", " ") || "MPHEHLI UNITED"} / 2026–27</span>
        <h1 className="uppercase">THE SQUAD</h1>
        <p>ONE TEAM. EVERY ROLE. THE SAME STANDARD.</p>
      </div>
      {groups.map((group, gi) => {
        const groupPlayers = players.filter(p => p.position === group);
        return (
          <section className="squad-group section" key={group}>
            <div className="group-title">
              <span>0{gi + 1}</span>
              <h2 className="uppercase">{group}</h2>
            </div>
            <div className="players">
              {groupPlayers.length > 0 ? (
                groupPlayers.map((player) => (
                  <button className="player-tile" key={player.id} onClick={() => setPage("player")}>
                    <img src={player.image || images.portrait} alt={player.name} />
                    <span className="tile-number">{player.number || "00"}</span>
                    <div className="uppercase">
                      <b>{player.name}</b>
                      <small>{group.slice(0, -1)}</small>
                    </div>
                  </button>
                ))
              ) : (
                <div className="no-players">No {group.toLowerCase()} listed.</div>
              )}
            </div>
          </section>
        );
      })}
    </main>
  );
}

function PlayerPage({ setPage }: { setPage: (page: Page) => void }) {
  const [player, setPlayer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPlayer() {
      try {
        // In a real app, we'd get the ID from the URL. For now, we fetch the first player or a specific one.
        const players = await api.getPlayers();
        if (players && players.length > 0) {
          setPlayer(players[0]);
        }
      } catch (e) {
        console.error("Error loading player", e);
      } finally {
        setLoading(false);
      }
    }
    loadPlayer();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Profile...</div>;
  if (!player) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Player Not Found</div>;

  return (
    <main className="profile-page">
      <section className="profile-hero">
        <div className="profile-big-number">{player.number || "00"}</div>
        <img src={player.image || images.portrait} alt={player.name} />
        <div className="profile-title">
          <span className="eyebrow">{player.teamSlug?.toUpperCase().replace("-", " ") || "MPHEHLI UNITED"} / {player.position}</span>
          <h1>{player.name.toUpperCase()}</h1>
          <p>{player.biography || "PROFILE INFORMATION TO BE CONFIRMED"}</p>
        </div>
      </section>
      <section className="profile-stats">
        {[
          { label: "APPEARANCES", value: player.stats?.appearances || "—" },
          { label: "STARTS", value: player.stats?.starts || "—" },
          { label: "MINUTES", value: player.stats?.minutes || "—" },
          { label: "GOALS", value: player.stats?.goals || "—" },
          { label: "ASSISTS", value: player.stats?.assists || "—" },
          { label: "CARDS", value: player.stats?.cards || "—" },
        ].map(s => <div key={s.label}><b>{s.value}</b><span>{s.label}</span></div>)}
      </section>
      <section className="profile-body section">
        <div><span className="eyebrow">THE PLAYER</span><h2>BIOGRAPHY</h2></div>
        <div>
          <p>{player.biography || "Verified player biography and career information will appear here when supplied by the club."}</p>
          <div className="career-row"><b>CAREER</b><span>SEASON</span><span>CLUB</span><span>APPS</span></div>
        </div>
      </section>
    </main>
  );
}

function MatchPage({ setPage }: { setPage: (page: Page) => void }) {
  const [tab, setTab] = useState("OVERVIEW");
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMatch() {
      try {
        // Real app would use ID from URL. Using a placeholder ID for now.
        const data = await api.getFixtures(); // Using fixtures to find a match for now
        if (data && data.length > 0) {
          setMatch(data[0]);
        }
      } catch (e) {
        console.error("Error loading match", e);
      } finally {
        setLoading(false);
      }
    }
    loadMatch();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Match...</div>;
  if (!match) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Match Not Found</div>;

  return (
    <main className="match-page">
      <section className="match-centre-head">
        <span className="eyebrow">{match.competition || "ABC MOTSEPE LEAGUE"} / MATCHDAY</span>
        <div className="match-lockup">
          <div className="match-team">
            <Crest light />
            <strong className="uppercase">{match.homeTeam}</strong>
          </div>
          <div className="match-score">
            <span>{match.homeScore || "0"}</span><em>—</em><span>{match.awayScore || "0"}</span>
          </div>
          <div className="match-team match-team--away">
            <div className="opponent-crest">{match.awayTeam?.charAt(0) || "O"}</div>
            <strong className="uppercase">{match.awayTeam}</strong>
          </div>
        </div>
        <p className="uppercase">{match.date} · {match.venue}</p>
      </section>
      <nav className="match-tabs">
        {["OVERVIEW", "LINEUPS", "TIMELINE", "STATS", "MATCH REPORT", "MEDIA"].map(x => <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>{x}</button>)}
      </nav>
      <section className="match-overview section">
        <div className="match-report-lead">
          <span className="eyebrow">{tab}</span>
          <h1>{tab === "OVERVIEW" ? <>UNITED MAKE<br />THEIR MARK.</> : `${tab} / MATCH DATA`}</h1>
          {tab === "OVERVIEW" ? (
            <>
              <p>{match.summary || "A result at the stadium. Verified editorial reporting can be published here by the club."}</p>
              <img src={images.celebrate} alt="Football team celebrates on the pitch" />
            </>
          ) : (
            <InterfaceState title={`NO ${tab} DATA`} body="This panel only appears when verified match data is supplied by the club." />
          )}
        </div>
        <aside>
          <span className="eyebrow">MATCH INFORMATION</span>
          <div className="timeline-event"><b>FT</b><span><strong>FULL TIME</strong><small>FINAL SCORE CONFIRMED</small></span></div>
          <div className="timeline-event"><b>{match.date.split(' ')[0] || "26"}</b><span><strong className="uppercase">{match.date}</strong><small>{match.venue}</small></span></div>
          <InterfaceState title="TIMELINE PENDING" body="No event-by-event data has been supplied." compact />
        </aside>
      </section>
    </main>
  );
}

function ArticlePage({ setPage }: { setPage: (page: Page) => void }) {
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadArticle() {
      try {
        // In a real app, we'd get the ID from the URL.
        // For now, we fetch the first news item to demonstrate the dynamic layout.
        const news = await api.getNews();
        if (news && news.length > 0) {
          setArticle(news[0]);
        }
      } catch (e) {
        console.error("Error loading article", e);
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Article...</div>;
  if (!article) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Article Not Found</div>;

  return (
    <main className="article-page">
      <section className="article-hero">
        <img src={article.image || images.celebrate} alt={article.title} />
        <div>
          <span className="category">{article.category}</span>
          <h1 className="uppercase">{article.title}</h1>
          <p>{article.date} · MPHEHLI ALL STARS MEDIA</p>
        </div>
      </section>
      <article className="article-body">
        <aside>
          <b>SHARE</b>
          <span>IG</span>
          <span>FB</span>
          <span>X</span>
        </aside>
        <div>
          <p className="standfirst">{article.excerpt}</p>
          <div className="article-content">
            {article.content ? (
              <div dangerouslySetInnerHTML={{ __html: article.content }} />
            ) : (
              <p>Verified editorial content will be published here once supplied by the club newsroom.</p>
            )}
          </div>
          {article.image && <img src={article.image} alt={article.title} className="article-image" />}
        </div>
      </article>
    </main>
  );
}

function InterfaceState({ title, body, compact = false }: { title: string; body: string; compact?: boolean }) {
  return <div className={`interface-state ${compact ? "interface-state--compact" : ""}`}><span>—</span><div><b>{title}</b><p>{body}</p></div></div>;
}

function PageHero({ eyebrow, title, copy, image }: { eyebrow: string; title: string; copy?: string; image?: string }) {
  return <section className={`page-hero ${image ? "page-hero--image" : ""}`} style={image ? { backgroundImage: `url(${image})` } : undefined}><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{copy && <p>{copy}</p>}</div></section>;
}

function TeamsIndex({ setPage }: { setPage: (page: Page) => void }) {
  const teams: Array<{ key: "united" | "men" | "ladies"; number: string; name: string; meta: string; image: string }> = [
    { key: "united", number: "01", name: "MPHEHLI UNITED", meta: "ABC MOTSEPE LEAGUE · NORTH WEST · STREAM A", image: images.action },
    { key: "men", number: "02", name: "MPHEHLI ALL STARS MEN", meta: "REGIONAL LEAGUE · GAUTENG · JOHANNESBURG BLUE STREAM", image: images.huddle },
    { key: "ladies", number: "03", name: "MPHEHLI ALL STARS LADIES", meta: "SASOL LEAGUE · KWAZULU-NATAL", image: images.ladies },
  ];
  return <main><PageHero eyebrow="ONE CLUB / THREE TEAMS" title="OUR TEAMS" copy="Three competitive environments. One shared standard." image={images.hero} /><section className="team-directory">{teams.map((team) => <article className={`team-entry team-entry--${team.key}`} key={team.key}><img src={team.image} alt={`${team.name} football`} /><div className="team-entry__shade" /><div className="team-entry__number">{team.number}</div><div className="team-entry__content"><span className="eyebrow">TEAM {team.number}</span><h2>{team.name}</h2><p>{team.meta}</p><div className="team-entry__data"><span><small>NEXT MATCH</small><b>CMS SCHEDULE</b></span><span><small>LATEST RESULT</small><b>{team.key === "united" ? "5 — 0 / FULL TIME" : "AWAITING DATA"}</b></span></div><LinkButton inverse onClick={() => setPage(team.key)}>ENTER TEAM</LinkButton></div></article>)}</section></main>;
}

function StaffPage() {
  const sections = ["HEAD COACH", "ASSISTANT COACH", "TECHNICAL STAFF", "MEDICAL STAFF", "MANAGEMENT"];
  return <main><PageHero eyebrow="MPHEHLI UNITED / PEOPLE" title="STAFF" copy="The people behind the team." /><section className="staff-list section">{sections.map((role, index) => <article className="staff-row" key={role}><span>0{index + 1}</span><div className="staff-photo"><div>PHOTO<br />PENDING</div></div><h2>{role}</h2><div><b>PROFILE PENDING</b><p>Staff names, roles and biographies are displayed only when supplied by the club CMS.</p></div></article>)}</section></main>;
}

function FilterBar({ result = false }: { result?: boolean }) {
  return <div className="archive-filters"><button>ALL TEAMS⌄</button><button>{result ? "COMPLETED" : "UPCOMING"}⌄</button><button>2026 / 27⌄</button><button>ALL COMPETITIONS⌄</button></div>;
}

function FixturesPage({ mode, setPage }: { mode: "fixtures" | "results"; setPage: (page: Page) => void }) {
  const [fixtures, setFixtures] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const isResult = mode === "results";

  useEffect(() => {
    async function loadFixtures() {
      try {
        const data = await api.getFixtures({ status: isResult ? "COMPLETED" : "SCHEDULED" });
        setFixtures(data);
      } catch (e) {
        console.error("Error loading fixtures", e);
      } finally {
        setLoading(false);
      }
    }
    loadFixtures();
  }, [mode]);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Matches...</div>;
  if (!fixtures || fixtures.length === 0) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">No Matches Found</div>;

  return (
    <main>
      <PageHero eyebrow="MATCHES / 2026–27" title={isResult ? "RESULTS" : "FIXTURES"} copy={isResult ? "The official match archive." : "Every team. Every competition. Every matchday."} />
      <section className="archive section">
        <FilterBar result={isResult} />
        <div className="archive-month">
          <span>{isResult ? "SEASON ARCHIVE" : "UPCOMING SCHEDULE"}</span>
          <small>{fixtures.length} MATCHES FOUND</small>
        </div>
        {isResult ? (
          <div className="results-list">
            {fixtures.map((f, i) => (
              <div className="result-archive-row" key={f.id}>
                <div><span>{f.date}</span><small className="uppercase">{f.competition}</small></div>
                <strong className="uppercase">{f.homeTeam}</strong>
                <b className="score">{f.homeScore}</b><em>—</em><b className="score">{f.awayScore}</b>
                <strong className="uppercase">{f.awayTeam}</strong>
                <div><span className="uppercase">{f.status}</span><small>{f.venue}</small></div>
                <button onClick={() => setPage("match")}>MATCH CENTRE <Arrow /></button>
              </div>
            ))}
          </div>
        ) : (
          <div className="fixtures-list">
            {fixtures.map((f, i) => (
              <div className="fixture-rowed" key={f.id}>
                <span className="fixture-index">0{i + 1}</span>
                <b>{f.date}<small>{f.day || "TBC"}</small></b>
                <strong className="score-placeholder">{f.score || "—"}</strong>
                <div className="fixture-teams">
                  <span className="uppercase">{f.homeTeam}</span>
                  <em>VS</em>
                  <span className="uppercase">{f.awayTeam}</span>
                </div>
                <span>{f.venue}<small>{f.status}</small></span>
                <button onClick={() => setPage("match")}>MATCH CENTRE <Arrow /></button>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

function TablesPage() {
  return <main><PageHero eyebrow="COMPETITIONS / STANDINGS" title="TABLES" copy="Official standings supplied by the relevant competition." /><section className="table-page section"><FilterBar /><div className="table-title"><span className="eyebrow">ABC MOTSEPE LEAGUE</span><b>NORTH WEST · STREAM A · 2026 / 27</b></div><div className="full-league-table"><div className="full-table-row head"><span>POS</span><span>TEAM</span>{["P","W","D","L","GF","GA","GD","PTS"].map(x => <span key={x}>{x}</span>)}</div><div className="full-table-row focus"><span>—</span><span>MPHEHLI UNITED</span>{Array.from({ length: 8 }).map((_, i) => <span key={i}>—</span>)}</div><InterfaceState title="OFFICIAL STANDINGS PENDING" body="No league table will be shown until verified competition data is available." /></div></section></main>;
}

function Newsroom({ setPage }: { setPage: (page: Page) => void }) {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("LATEST");

  useEffect(() => {
    async function loadNews() {
      try {
        const data = await api.getNews();
        setNews(data);
      } catch (e) {
        console.error("Error loading news", e);
      } finally {
        setLoading(false);
      }
    }
    loadNews();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Newsroom...</div>;
  if (!news || news.length === 0) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">No News Available</div>;

  const filteredNews = filter === "LATEST" ? news : news.filter(n => n.category === filter);

  return (
    <main>
      <PageHero eyebrow="OFFICIAL CLUB EDITORIAL" title="NEWSROOM" copy="Reporting from every team and every part of the club." />
      <section className="newsroom section">
        <div className="news-categories">
          {["LATEST", "MATCH REPORTS", "TEAM NEWS", "TRAINING", "FEATURES", "PLAYERS", "CLUB", "COMMUNITY"].map((x) => (
            <button key={x} className={filter === x ? "active" : ""} onClick={() => setFilter(x)}>{x}</button>
          ))}
        </div>
        {filteredNews.length > 0 ? (
          <>
            <div className="news-lead" onClick={() => setPage("article")}>
              <img src={filteredNews[0].image || images.celebrate} alt={filteredNews[0].title} />
              <div className="story-overlay">
                <span className="category">{filteredNews[0].category}</span>
                <h2 className="uppercase">{filteredNews[0].title}</h2>
                <p>{filteredNews[0].date}</p>
              </div>
            </div>
            <div className="news-stream">
              {filteredNews.slice(1).map((story) => (
                <article key={story.id} onClick={() => setPage("article")}>
                  <img src={story.image || images.huddle} alt={story.title} />
                  <span className="category">{story.category}</span>
                  <h3 className="uppercase">{story.title}</h3>
                  <p>{story.excerpt || "Editorial content managed by the club newsroom."}</p>
                  <Arrow />
                </article>
              ))}
            </div>
          </>
        ) : (
          <InterfaceState title="NO ARTICLES FOUND" body={`No news available in the ${filter} category.`} />
        )}
      </section>
    </main>
  );
}

function MediaArchive({ setPage }: { setPage: (page: Page) => void }) {
  const [media, setMedia] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    async function loadMedia() {
      try {
        const data = await api.getMedia();
        setMedia(data);
      } catch (e) {
        console.error("Error loading media", e);
      } finally {
        setLoading(false);
      }
    }
    loadMedia();
  }, []);

  if (loading) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Media...</div>;
  if (!media || media.length === 0) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">No Media Found</div>;

  return (
    <main>
      <PageHero eyebrow="PHOTOGRAPHY / VIDEO / ARCHIVE" title="MEDIA" copy="The visual record of the club." />
      <section className="archive section">
        <div className="news-categories">
          {["FEATURED", "MATCHDAY", "TRAINING", "PLAYERS", "UNITED", "MEN", "LADIES", "COMMUNITY", "HISTORICAL"].map((x, i) => (
            <button key={x} className={i === 0 ? "active" : ""}>{x}</button>
          ))}
        </div>
        <div className="masonry-gallery">
          {media.map((item, i) => (
            <button onClick={() => setSelected(item.url)} key={item.id || i} className={i === 0 ? "wide" : ""}>
              <img src={item.url || images.training} alt={item.caption || "Club media"} />
              <span className="view-label">VIEW IMAGE 0{i + 1} ↗</span>
            </button>
          ))}
        </div>
      </section>
      {selected && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Media lightbox">
          <button onClick={() => setSelected(null)}>CLOSE ×</button>
          <img src={selected} alt="Selected club archive photograph" />
          <div className="lightbox-info">
            <b>CLUB ARCHIVE / IMAGE</b>
            <span>Verified metadata supplied by the CMS.</span>
          </div>
        </div>
      )}
    </main>
  );
}

function InstitutionalPage({ kind, setPage }: { kind: "club" | "history" | "honours" | "community" | "contact"; setPage: (page: Page) => void }) {
  if (kind === "history") return <main><PageHero eyebrow="CLUB / HERITAGE" title="OUR HISTORY" copy="A verified record of the club, built over time." image={images.hero} /><section className="history-page section">{["YEAR","YEAR","YEAR"].map((year, i) => <article key={i}><b>{year}</b><div><span className="eyebrow">CMS HISTORY ENTRY</span><h2>CLUB MILESTONE</h2><p>Verified event title, description and photography will be published here.</p></div><div className="history-placeholder">ARCHIVE IMAGE</div></article>)}</section></main>;
  if (kind === "honours") return <main><PageHero eyebrow="CLUB / RECORD" title="HONOURS" copy="The official archive of club achievements." /><section className="empty-honours section"><div className="honours-mark">★</div><span className="eyebrow">OFFICIAL RECORD</span><h2>THE ARCHIVE<br />STARTS HERE.</h2><p>No honours have been published. Achievements will only appear when verified by the club.</p></section></main>;
  if (kind === "contact") return <main><PageHero eyebrow="INSTITUTIONAL" title="CONTACT" copy="The right route into the club." /><section className="contact-layout section"><div className="contact-channels">{["GENERAL ENQUIRIES","CLUB","TEAMS","MEDIA","PARTNERSHIPS","SOCIAL MEDIA"].map(x => <div key={x}><b>{x}</b><span>CMS-MANAGED CONTACT DETAILS</span></div>)}</div><form className="contact-form" onSubmit={e => e.preventDefault()}><span className="eyebrow">SEND AN ENQUIRY</span><label>NAME<input placeholder="Your name" /></label><label>EMAIL<input type="email" placeholder="Your email address" /></label><label>SUBJECT<select defaultValue=""><option value="" disabled>Select a subject</option><option>General enquiry</option><option>Media</option><option>Partnerships</option></select></label><label>MESSAGE<textarea rows={5} placeholder="How can the club help?" /></label><button type="submit">SEND ENQUIRY <Arrow /></button></form></section></main>;
  if (kind === "community") return <main><PageHero eyebrow="BEYOND THE PITCH" title="COMMUNITY" copy="Football, people and place." image={images.community} /><section className="community-editorial section"><div><span className="eyebrow">OUR COMMUNITY</span><h2>THE CLUB LIVES WHERE THE GAME LIVES.</h2><p>Verified community initiatives, supporter stories and local football features will be managed by the club.</p></div><img src={images.women} alt="Football in the community" /><InterfaceState title="COMMUNITY STORIES PENDING" body="Programmes and initiatives appear only when approved and published." /></section></main>;
  return <main><PageHero eyebrow="THE INSTITUTION" title="MPHEHLI ALL STARS" copy="One club. Multiple teams. One identity." image={images.hero} /><section className="club-index section"><div className="club-manifesto"><span className="eyebrow">OUR IDENTITY</span><h2>BUILT FOR THE MATCH.<br />BUILT FOR THE FUTURE.</h2><p>Mphehli All Stars brings multiple teams into one football institution, with a shared crest, shared standards and distinct competitive identities.</p></div>{[["01","OUR TEAMS","teams"],["02","OUR HISTORY","history"],["03","HONOURS","honours"],["04","COMMUNITY","community"],["05","CONTACT","contact"]].map(([n,title,target]) => <button key={n} onClick={() => setPage(target as Page)}><span>{n}</span><b>{title}</b><Arrow /></button>)}</section></main>;
}

function SearchPage({ setPage }: { setPage: (page: Page) => void }) {
  const [query, setQuery] = useState("");
  const results = query ? [{ type: "TEAM", title: "MPHEHLI UNITED", page: "united" as Page }, { type: "MATCH", title: "MPHEHLI UNITED 5 — 0 MOGOPELA WONDEROUS", page: "match" as Page }, { type: "NEWS", title: "FIVE-STAR UNITED SET THE STANDARD", page: "article" as Page }] : [];
  return <main className="search-page"><section><span className="eyebrow">SEARCH THE CLUB</span><div className="search-field"><input autoFocus value={query} onChange={e => setQuery(e.target.value)} placeholder="TEAM, PLAYER, MATCH, STORY…" /><span>⌕</span></div><div className="search-tags">{["PLAYERS","TEAMS","MATCHES","NEWS","MEDIA","PAGES"].map(x => <button key={x}>{x}</button>)}</div></section><section className="search-results">{query ? <><p>{results.length} RESULTS FOR “{query.toUpperCase()}”</p>{results.map(r => <button key={r.title} onClick={() => setPage(r.page)}><small>{r.type}</small><b>{r.title}</b><Arrow /></button>)}</> : <InterfaceState title="START YOUR SEARCH" body="Search players, teams, matches, news, media and club pages." />}</section></main>;
}

function Footer({ setPage, settings }: { setPage: (p: Page) => void; settings: any }) {
  return <footer><div className="footer-top flex justify-between items-center"><Crest light /><p className="text-right">{settings?.slogan || "COMETH THE HOUR, COMETH THE MAN."}</p></div><div className="footer-links"><div><b>TEAMS</b><button onClick={() => setPage("united")}>MPHEHLI UNITED</button><button onClick={() => setPage("men")}>MPHEHLI ALL STARS MEN</button><button onClick={() => setPage("ladies")}>MPHEHLI ALL STARS LADIES</button></div><div><b>EXPLORE</b><button onClick={() => setPage("fixtures")}>FIXTURES</button><button onClick={() => setPage("results")}>RESULTS</button><button onClick={() => setPage("tables")}>TABLES</button><button onClick={() => setPage("news")}>NEWS</button><button onClick={() => setPage("media")}>MEDIA</button></div><div><b>CLUB</b><button onClick={() => setPage("club")}>ABOUT</button><button onClick={() => setPage("history")}>HISTORY</button><button onClick={() => setPage("honours")}>HONOURS</button><button onClick={() => setPage("community")}>COMMUNITY</button><button onClick={() => setPage("contact")}>CONTACT</button></div><div><b>FOLLOW THE CLUB</b><button>INSTAGRAM ↗</button><button>FACEBOOK ↗</button><button>YOUTUBE ↗</button></div></div><div className="footer-bottom"><span>© 2022—{new Date().getFullYear()} {settings?.clubName || "MPHEHLI ALL STARS"}</span><span>PRIVACY · TERMS · ACCESSIBILITY</span><span>SOUTH AFRICA</span></div></footer>;
}

export default function App() {
  const [page, setPage] = useState<Page>(() => routePages[window.location.pathname] || "home");
  const [settings, setSettings] = useState<any>(null);
  const [loadingSettings, setLoadingSettings] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const data = await api.getSettings();
        setSettings(data);
      } catch (e) {
        console.error("Error loading settings", e);
      } finally {
        setLoadingSettings(false);
      }
    }
    fetchSettings();
  }, []);

  const go = (next: Page) => {
    setPage(next);
    window.history.pushState({ page: next }, "", routes[next]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  useEffect(() => {
    document.title = "Mphehli All Stars — Official Club Website";
    const onPop = () => setPage(routePages[window.location.pathname] || "home");
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);
  if (loadingSettings) return <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-slate-400 font-bold uppercase tracking-widest">Loading Club Settings...</div>;
  return <>
    <Header setPage={go} settings={settings} />
    {page === "home" && <Home setPage={go} />}
    {page === "teams" && <TeamsIndex setPage={go} />}
    {page === "united" && <TeamPage setPage={go} theme="united" />}
    {page === "men" && <TeamPage setPage={go} theme="men" />}
    {page === "ladies" && <TeamPage setPage={go} theme="ladies" />}
    {page === "squad" && <SquadPage setPage={go} />}
    {page === "staff" && <StaffPage />}
    {page === "player" && <PlayerPage setPage={go} />}
    {page === "fixtures" && <FixturesPage mode="fixtures" setPage={go} />}
    {page === "results" && <FixturesPage mode="results" setPage={go} />}
    {page === "tables" && <TablesPage />}
    {page === "match" && <MatchPage setPage={go} />}
    {page === "news" && <Newsroom setPage={go} />}
    {page === "article" && <ArticlePage setPage={go} />}
    {page === "media" && <MediaArchive setPage={go} />}
    {(["club", "history", "honours", "community", "contact"] as Page[]).includes(page) && <InstitutionalPage kind={page as "club" | "history" | "honours" | "community" | "contact"} setPage={go} />}
    {page === "search" && <SearchPage setPage={go} />}
    <Footer setPage={go} settings={settings} />
  </>;
}
