import { useState, useEffect } from 'react';
import { settingsService } from '../services/settingsService';
import { Mail, Phone, MapPin } from 'lucide-react';
import PageTitle from '../components/PageTitle';
import ErrorMessage from '../components/ErrorMessage';
import styles from './Contact.module.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadContact() {
      try {
        const data = await settingsService.getSettings('contact');
        setSettings(data);
      } catch (error) {
        console.error("Error loading contact settings:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
    loadContact();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  if (loading) {
    return <div className={styles.loadingContainer}>Loading...</div>;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  const socials = settings?.socials || [
    { name: 'Facebook', handle: '@MphehliAllStars', href: '#' },
    { name: 'Instagram', handle: '@mphehliallstars', href: '#' },
    { name: 'TikTok', handle: '@mphehliallstars', href: '#' },
    { name: 'X (Twitter)', handle: '@MphehliAllStars', href: '#' },
    { name: 'WhatsApp', handle: settings?.phone || '+27 00 000 0000', href: '#' },
  ];

  return (
    <div className={styles.page}>
      <PageTitle title="Contact" />
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContainer}>
          <div className={styles.heroSub}>Get In Touch</div>
          <h1 className={styles.heroTitle}>Contact Us</h1>
          <div className={styles.heroDivider} />
        </div>
      </section>

      <section className={styles.contactSection}>
        <div className={styles.sectionContainer}>
          <div className={styles.contactGrid}>
            {/* Contact Info */}
            <div className={styles.infoColumn}>
              <div>
                <div className={styles.infoSub}>Contact Information</div>
                <div className={styles.infoList}>
                  {[
                    { label: 'Email', value: settings?.email || 'info@mphehliallstarsfc.com', icon: <Mail size={18} /> },
                    { label: 'Phone', value: settings?.phone || '+27 00 000 0000', icon: <Phone size={18} /> },
                    { label: 'Location', value: settings?.address || 'Trezona Park Florida\\nJohannesburg', icon: <MapPin size={18} /> },
                  ].map(item => (
                    <div key={item.label} className={styles.infoItem}>
                      <div className={styles.infoIconBox}>
                        <span>{item.icon}</span>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>{item.label}</div>
                        <div className={styles.infoValue}>{item.value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className={styles.infoSub}>Follow Us</div>
                <div className={styles.socialsList}>
                  {socials.map(s => (
                    <a
                      key={s.name}
                      href={s.href}
                      className={styles.socialItem}
                    >
                      <div className={styles.socialIcon}>
                        <span className={styles.socialIconText}>
                          {s.name[0]}
                        </span>
                      </div>
                      <div>
                        <div className={styles.socialName}>{s.name}</div>
                        <div className={styles.socialHandle}>{s.handle}</div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Form */}
            <div className={styles.formColumn}>
              <div className={styles.formSub}>Send a Message</div>

              {sent ? (
                <div className={styles.successMsg}>
                  <div className={styles.successTitle}>Message Sent!</div>
                  <p className={styles.successText}>Thank you for reaching out. We will get back to you as soon as possible.</p>
                  <button
                    onClick={() => setSent(false)}
                    className={styles.resetBtn}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className={styles.contactForm}>
                  <div className={styles.formRow}>
                    <div>
                      <label className={styles.formLabel}>
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className={styles.formInput}
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label className={styles.formLabel}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className={styles.formInput}
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className={styles.formLabel}>
                      Subject *
                    </label>
                    <select
                      required
                      value={form.subject}
                      onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                      className={styles.formInput}
                    >
                      <option value="">Select a subject</option>
                      <option>General Enquiry</option>
                      <option>Sponsorship / Partnership</option>
                      <option>Player Registration</option>
                      <option>Media / Press</option>
                      <option>Youth Programme</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className={styles.formLabel}>
                      Message *
                    </label>
                    <textarea
                      required
                      rows={6}
                      value={form.message}
                      onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                      className={styles.formTextArea}
                      placeholder="Your message..."
                    />
                  </div>
                  <button
                    type="submit"
                    className={styles.submitBtn}
                  >
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
