import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- CONFIGURATION ---
const SUPABASE_URL = "https://jbibxamfverttyjmbmxk.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpiaWJ4YW1mdmVydHR5am1ibXhrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ2MDg2NTUsImV4cCI6MjA5MDE4NDY1NX0.k3p_PUADX2NYryGnahMVln5Frjlv17U56p80LYWZYPM";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface Option {
  id: string
  letter: string
  text: string
}

const App: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    edition: 'Type or select an option',
    challenges: [] as string[],
    peeves: [] as string[],
    motivation: [] as string[],
    celebrating: '',
    industry: 'Type or select an option',
    teamSize: '',
    website: '',
    socials: '',
    bookingTimeline: ''
  })

  const [isEditionOpen, setIsEditionOpen] = useState(false)
  const [isIndustryOpen, setIsIndustryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const editions = [
    'Edition 1 - April 2026',
    'Edition 2 - May 2026',
    'Edition 3 - June 2026'
  ]

  const industries = [
    'SaaS / Software',
    'Health & Wellness',
    'E-commerce / Retail',
    'Fintech',
    'Agency / Services',
    'EdTech',
    'D2C Brand',
    'Other'
  ]

  const challenges: Option[] = [
    { id: '1', letter: 'A', text: 'Cash flow hacks & bootstrapping tips' },
    { id: '2', letter: 'B', text: 'Hiring talent in Odisha / Bhubaneswar' },
    { id: '3', letter: 'C', text: 'Founder burnout recovery tools' },
    { id: '4', letter: 'D', text: 'Peer intros for collaborators/partners' },
    { id: '5', letter: 'E', text: 'Distribution & customer acquisition wins' },
    { id: '6', letter: 'F', text: 'Team retention strategies' },
    { id: '7', letter: 'G', text: 'Decision fatigue fixes / Wellness resets for focus' }
  ]

  const peeves: Option[] = [
    { id: '1', letter: 'A', text: 'Boring lectures instead of peer solutions' },
    { id: '2', letter: 'B', text: 'Forced icebreakers & nametag games' },
    { id: '3', letter: 'C', text: 'Vague motivational guru talks' },
    { id: '4', letter: 'D', text: 'Unmatched random networking rounds' },
    { id: '5', letter: 'E', text: 'Too much wellness fluff, no real work' },
    { id: '6', letter: 'F', text: 'Long events (6+ hours)' },
    { id: '7', letter: 'G', text: 'Sales pitches disguised as networking' },
    { id: '8', letter: 'H', text: 'No actionable takeaways' },
    { id: '9', letter: 'I', text: 'Overpriced for basic coffee chats' }
  ]

  const motivations: Option[] = [
    { id: '1', letter: 'A', text: 'Founder wellness reset' },
    { id: '2', letter: 'B', text: 'Networking with fellow Bhubaneswar Entrepreneurs' },
    { id: '3', letter: 'C', text: 'Real peer solutions (no lectures, just founder fixes)' },
    { id: '4', letter: 'D', text: 'The overall concept' },
    { id: '5', letter: 'E', text: 'Exclusive tribe building' },
    { id: '6', letter: 'F', text: 'Just the Hop Studios vibe' }
  ]

  const teamSizes: Option[] = [
    { id: '1', letter: 'A', text: '0 - 50 Employees' },
    { id: '2', letter: 'B', text: '50 - 100 Employees' },
    { id: '3', letter: 'C', text: '100 - 200 Employees' },
    { id: '4', letter: 'D', text: 'Above 200 Employees' }
  ]

  const bookingDeadlines: Option[] = [
    { id: '1', letter: 'A', text: 'Immediately' },
    { id: '2', letter: 'B', text: 'Within 3 days' },
    { id: '3', letter: 'C', text: 'Within 1 week' },
    { id: '4', letter: 'D', text: 'Need to check schedule' }
  ]

  const toggleChallenge = (text: string) => {
    setFormData(prev => ({
      ...prev,
      challenges: prev.challenges.includes(text)
        ? prev.challenges.filter(c => c !== text)
        : [...prev.challenges, text]
    }))
  }

  const togglePeeve = (text: string) => {
    setFormData(prev => ({
      ...prev,
      peeves: prev.peeves.includes(text)
        ? prev.peeves.filter(p => p !== text)
        : [...prev.peeves, text]
    }))
  }

  const toggleMotivation = (text: string) => {
    setFormData(prev => ({
      ...prev,
      motivation: prev.motivation.includes(text)
        ? prev.motivation.filter(m => m !== text)
        : [...prev.motivation, text]
    }))
  }

  const handleSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // SAVE TO SUPABASE
      // Sync to Google Sheets is now handled automatically by the Supabase Webhook!
      const { error: supabaseError } = await supabase
        .from('applications')
        .insert([{
          firstname: formData.firstName,
          lastname: formData.lastName,
          phone: formData.phone,
          email: formData.email,
          edition: formData.edition,
          challenges: (formData.challenges || []).join(", "),
          peeves: (formData.peeves || []).join(", "),
          motivation: (formData.motivation || []).join(", "),
          celebrating: formData.celebrating,
          industry: formData.industry,
          teamsize: formData.teamSize,
          website: formData.website,
          socials: formData.socials,
          bookingtimeline: formData.bookingTimeline
        }]);

      if (supabaseError) {
        alert("⚠️ Database Error: " + supabaseError.message);
        setIsSubmitting(false);
        return;
      }

      alert("✨ Success! Your application has been submitted.");
      
    } catch (error: any) {
      console.error("Critical submission error:", error);
      alert("❌ Submission Failed: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [formData.celebrating]);

  return (
    <main className="form-container">
      <header className="header">
        <h1>The Gathering: Founder's Edition</h1>
        <p className="subtitle">Fill this out and we'll handle the rest.</p>
      </header>

      {/* Section 1 */}
      <section className="section" id="personal-details">
        <div className="section-header">
          <span className="section-number">1</span>
          <h2 className="section-title">Let us know about you! *</h2>
        </div>
        <div className="input-grid">
          <div className="input-group">
            <label className="label">First name *</label>
            <input
              type="text"
              className="input-underline"
              placeholder="Jane"
              value={formData.firstName}
              onChange={e => setFormData({ ...formData, firstName: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="label">Last name *</label>
            <input
              type="text"
              className="input-underline"
              placeholder="Smith"
              value={formData.lastName}
              onChange={e => setFormData({ ...formData, lastName: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="label">Phone number *</label>
            <input
              type="text"
              className="input-underline"
              placeholder="081234 56789"
              value={formData.phone}
              onChange={e => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <div className="input-group">
            <label className="label">Email *</label>
            <input
              type="email"
              className="input-underline"
              placeholder="name@example.com"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Section 2 */}
      <section className="section" id="edition-section">
        <div className="section-header">
          <span className="section-number">2</span>
          <h2 className="section-title">Edition & Dates *</h2>
        </div>
        <p className="section-description">We know you are busy and we value your time. Pick your preferred date to let us know when we will get to see you!</p>
        <div className="dropdown-container">
          <label className="dropdown-label">Type or select an option</label>
          <div
            className="dropdown-trigger"
            onClick={() => setIsEditionOpen(!isEditionOpen)}
          >
            {formData.edition}
            <span className={`arrow ${isEditionOpen ? 'up' : 'down'}`}>▼</span>
          </div>
          {isEditionOpen && (
            <div className="dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => { setFormData({ ...formData, edition: 'Type or select an option' }); setIsEditionOpen(false) }}
              >
                Type or select an option
              </div>
              {editions.map(e => (
                <div
                  key={e}
                  className={`dropdown-item ${formData.edition === e ? 'selected' : ''}`}
                  onClick={() => { setFormData({ ...formData, edition: e }); setIsEditionOpen(false) }}
                >
                  {e}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Section 3 */}
      <section className="section" id="challenges-section">
        <div className="section-header">
          <span className="section-number">3</span>
          <h2 className="section-title">What are you looking for? *</h2>
        </div>
        <p className="section-description">Select the top challenges you're facing or outcomes you want from this 3-hour founder reset. Be real! Our 16 founders solve what others dodge.</p>
        <p className="sub-instruction">Choose as many as you like</p>
        <div className="mc-list">
          {challenges.map(c => (
            <div
              key={c.id}
              className={`mc-option ${formData.challenges.includes(c.text) ? 'selected' : ''}`}
              onClick={() => toggleChallenge(c.text)}
            >
              <span className="mc-letter">{c.letter}</span>
              <span className="mc-text">{c.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 4 */}
      <section className="section" id="peeves-section">
        <div className="section-header">
          <span className="section-number">4</span>
          <h2 className="section-title">One thing that does it NOT for you? *</h2>
        </div>
        <p className="section-description">What typically ruins wellness/networking events for you? Select your top pet peeves.</p>
        <p className="sub-instruction">Choose as many as you like</p>
        <div className="mc-grid">
          {peeves.map(p => (
            <div
              key={p.id}
              className={`mc-option ${formData.peeves.includes(p.text) ? 'selected' : ''}`}
              onClick={() => togglePeeve(p.text)}
            >
              <span className="mc-letter">{p.letter}</span>
              <span className="mc-text">{p.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 5 */}
      <section className="section" id="motivation-section">
        <div className="section-header">
          <span className="section-number">5</span>
          <h2 className="section-title">What drew you here? *</h2>
        </div>
        <p className="section-description">Which part of The Gathering excites you most? We lean into your top interest for circle prompts and energy!</p>
        <p className="sub-instruction">Choose as many as you like</p>
        <div className="mc-list">
          {motivations.map(m => (
            <div
              key={m.id}
              className={`mc-option ${formData.motivation.includes(m.text) ? 'selected' : ''}`}
              onClick={() => toggleMotivation(m.text)}
            >
              <span className="mc-letter">{m.letter}</span>
              <span className="mc-text">{m.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Section 6 */}
      <section className="section" id="celebrating-section">
        <div className="section-header">
          <span className="section-number">6</span>
          <h2 className="section-title">Celebrating anything?</h2>
        </div>
        <p className="section-description">Are you hitting any recent milestones? Recent wins, survival stories, or quiet milestones that show your founder grit.</p>
        <div className="textarea-group">
          <textarea
            className="textarea"
            placeholder="Type your answer here..."
            value={formData.celebrating}
            onChange={e => setFormData({ ...formData, celebrating: e.target.value })}
          />
        </div>
      </section>

      {/* Section 7 */}
      <section className="section" id="company-section">
        <div className="section-header">
          <span className="section-number">7</span>
          <h2 className="section-title">Tell us more about what you are building! *</h2>
        </div>
        <p className="section-description" style={{ fontStyle: 'normal' }}>Drop your company website and key social channels, for us to curate the entire experience better.</p>

        <div className="form-inner-group" style={{ marginLeft: 'var(--content-indent)', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          {/* Industry Dropdown */}
          <div className="inner-input-item">
            <label className="dropdown-label" style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.5rem' }}>Your Focus Area - <span style={{ fontWeight: '400', color: 'var(--text-muted)', fontStyle: 'italic' }}>What's your primary industry? *</span></label>
            <div className="dropdown-container" style={{ marginLeft: 0 }}>
              <div className="dropdown-trigger" onClick={() => setIsIndustryOpen(!isIndustryOpen)}>
                {formData.industry}
                <span className={`arrow ${isIndustryOpen ? 'up' : 'down'}`}>▼</span>
              </div>
              {isIndustryOpen && (
                <div className="dropdown-menu">
                  <div
                    className="dropdown-item"
                    onClick={() => { setFormData({ ...formData, industry: 'Type or select an option' }); setIsIndustryOpen(false) }}
                  >
                    Type or select an option
                  </div>
                  {industries.map(i => (
                    <div
                      key={i}
                      className={`dropdown-item ${formData.industry === i ? 'selected' : ''}`}
                      onClick={() => { setFormData({ ...formData, industry: i }); setIsIndustryOpen(false) }}
                    >
                      {i}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Team Size - Single Select */}
          <div className="inner-input-item">
            <label className="dropdown-label" style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Your Squad Status - <span style={{ fontWeight: '400', color: 'var(--text-muted)', fontStyle: 'italic' }}>Team Size *</span></label>
            <div className="mc-list" style={{ marginLeft: 0 }}>
              {teamSizes.map(t => (
                <div
                  key={t.id}
                  className={`mc-option ${formData.teamSize === t.text ? 'selected' : ''}`}
                  onClick={() => setFormData({ ...formData, teamSize: t.text })}
                >
                  <span className="mc-letter">{t.letter}</span>
                  <span className="mc-text">{t.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Website Input */}
          <div className="input-group">
            <label className="label" style={{ fontWeight: '700', color: '#fff' }}>Website</label>
            <input
              type="text"
              className="input-underline"
              placeholder="https://"
              value={formData.website}
              onChange={e => setFormData({ ...formData, website: e.target.value })}
            />
          </div>

          {/* Socials Input */}
          <div className="input-group">
            <label className="label" style={{ fontWeight: '700', color: '#fff' }}>Socials <span style={{ fontWeight: '400', color: 'var(--text-muted)', fontStyle: 'italic' }}>(Instagram, LinkedIn, Facebook)</span></label>
            <input
              type="text"
              className="input-underline"
              placeholder="https://"
              value={formData.socials}
              onChange={e => setFormData({ ...formData, socials: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Section 8 */}
      <section className="section" id="booking-section">
        <div className="section-header">
          <span className="section-number">8</span>
          <h2 className="section-title">If invited, when would you book? *</h2>
        </div>
        <p className="section-description" style={{ fontStyle: 'normal' }}>How quickly can you commit? Tell us how excited you are!</p>
        <div className="mc-list">
          {bookingDeadlines.map(b => (
            <div
              key={b.id}
              className={`mc-option ${formData.bookingTimeline === b.text ? 'selected' : ''}`}
              onClick={() => setFormData({ ...formData, bookingTimeline: b.text })}
            >
              <span className="mc-letter">{b.letter}</span>
              <span className="mc-text">{b.text}</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: '4rem', display: 'flex', justifyContent: 'flex-start', paddingBottom: '6rem', marginLeft: 'var(--content-indent)' }}>
        <button
          className="submit-small-btn"
          disabled={isSubmitting}
          onClick={handleSubmit}
        >
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </footer>
    </main>
  )
}

export default App
