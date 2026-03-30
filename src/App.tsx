import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

// --- CONFIGURATION ---
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.warn("⚠️ Supabase URL or Anon Key is missing! Check your .env file.");
}

const supabase = createClient(SUPABASE_URL || "", SUPABASE_ANON_KEY || "");

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
    bookingTimeline: '',
    otherIndustry: ''
  })

  const [isEditionOpen, setIsEditionOpen] = useState(false)
  const [isIndustryOpen, setIsIndustryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [step, setStep] = useState(1)
  const [applicationId, setApplicationId] = useState<string | null>(null)
  const [showError, setShowError] = useState(false)

  const editions = [
    '2nd May 2026',
    '3rd May 2025'
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
    { id: '1', letter: 'A', text: 'Mental overload / decision fatigue' },
    { id: '2', letter: 'B', text: 'Feeling constantly “on” with no real reset' },
    { id: '3', letter: 'C', text: 'Pressure of leading a team' },
    { id: '4', letter: 'D', text: 'Burnout creeping in' },
    { id: '5', letter: 'E', text: 'Lack of clarity or direction' },
    { id: '6', letter: 'F', text: 'Trying to build more intentional routines' },
    { id: '7', letter: 'G', text: 'Navigating uncertainty in key decisions' },
    { id: '8', letter: 'H', text: 'Looking to connect with the right kind of founders' },
    { id: '9', letter: 'I', text: 'I’m not sure, but something feels off' },
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

  const validateStep = () => {
    switch (step) {
      case 1:
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return formData.firstName && formData.lastName && formData.phone.length > 5 && emailRegex.test(formData.email);
      case 2:
        return formData.edition !== 'Type or select an option';
      case 3:
        return formData.challenges.length > 0;
      case 4:
        return formData.peeves.length > 0;
      case 5:
        return formData.motivation.length > 0;
      case 6:
        return formData.celebrating.trim() !== '';
      case 7:
        return (formData.industry !== 'Type or select an option' && (formData.industry !== 'Other' || formData.otherIndustry.trim() !== '')) && formData.teamSize;
      case 8:
        return formData.bookingTimeline !== '';
      default:
        return true;
    }
  }

  const handleNext = async () => {
    if (!validateStep()) {
      setShowError(true);
      return;
    }
    setShowError(false);

    setIsSubmitting(true);
    try {
      if (step === 1) {
        const { data, error } = await supabase
          .from('applications')
          .insert([{
            firstname: formData.firstName,
            lastname: formData.lastName,
            phone: formData.phone,
            email: formData.email
          }])
          .select('id')
          .single();

        if (error) throw error;
        if (data) setApplicationId(data.id);
        setStep(prev => prev + 1);
      } else if (step === 8) {
        const { error } = await supabase
          .from('applications')
          .update({
            bookingtimeline: formData.bookingTimeline
          })
          .eq('id', applicationId);

        if (error) throw error;
        setStep(9);
      } else {
        const updateData: any = {};
        if (step === 2) updateData.edition = formData.edition;
        if (step === 3) updateData.challenges = formData.challenges.join(", ");
        if (step === 4) updateData.peeves = formData.peeves.join(", ");
        if (step === 5) updateData.motivation = formData.motivation.join(", ");
        if (step === 6) updateData.celebrating = formData.celebrating;
        if (step === 7) {
          updateData.industry = formData.industry === 'Other' ? `Other: ${formData.otherIndustry}` : formData.industry;
          updateData.teamsize = formData.teamSize;
          updateData.website = formData.website;
          updateData.socials = formData.socials;
        }

        const { error } = await supabase
          .from('applications')
          .update(updateData)
          .eq('id', applicationId);

        if (error) throw error;
        setStep(prev => prev + 1);
      }
    } catch (error: any) {
      console.error("Supabase error:", error);
      alert("⚠️ Sync Error: " + error.message + "\n\nTip: Make sure you've added the UPDATE policy in your Supabase SQL editor!");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleBack = () => {
    if (step > 1) setStep(prev => prev - 1);
  }

  useEffect(() => {
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [formData.celebrating]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [step]);

  return (
    <main className="form-container">
      <header className="header">
        <h1>The Gathering: Founder's Edition</h1>
        <p className="subtitle">Fill this out and we'll handle the rest.</p>

        {step <= 8 && (
          <div className="progress-bar-container">
            <div className="progress-bar-bg">
              <div
                className="progress-bar-fill"
                style={{ width: `${(step / 8) * 100}%` }}
              ></div>
            </div>
            <div className="progress-info">
              <span>Step {step} of 8</span>
              {showError && <span className="error-message">Please fill in all required fields *</span>}
            </div>
          </div>
        )}
      </header>

      {step === 1 && (
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
      )}

      {step === 2 && (
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
      )}

      {step === 3 && (
        <section className="section" id="challenges-section">
          <div className="section-header">
            <span className="section-number">3</span>
            <h2 className="section-title">What are you currently navigating? *</h2>
          </div>
          <p className="section-description">Be honest. This helps us curate the right room.</p>
          <p className="sub-instruction">Choose as many as you like</p>
          <div className="mc-grid">
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
      )}

      {step === 4 && (
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
      )}

      {step === 5 && (
        <section className="section" id="motivation-section">
          <div className="section-header">
            <span className="section-number">5</span>
            <h2 className="section-title">What drew you here? *</h2>
          </div>
          <p className="section-description">Which part of The Gathering excites you most? We lean into your top interest for circle prompts and energy!</p>
          <p className="sub-instruction">Choose as many as you like</p>
          <div className="mc-grid">
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
      )}

      {step === 6 && (
        <section className="section" id="celebrating-section">
          <div className="section-header">
            <span className="section-number">6</span>
            <h2 className="section-title">Celebrating anything? *</h2>
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
      )}

      {step === 7 && (
        <section className="section" id="company-section">
          <div className="section-header">
            <span className="section-number">7</span>
            <h2 className="section-title">Tell us more about what you are building! *</h2>
          </div>
          <p className="section-description" style={{ fontStyle: 'normal' }}>Drop your company website and key social channels, for us to curate the entire experience better.</p>

          <div className="form-inner-group" style={{ marginLeft: 'var(--content-indent)', display: 'flex', flexDirection: 'column', gap: '3rem' }}>
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
                        onClick={() => { setFormData({ ...formData, industry: i, otherIndustry: i === 'Other' ? formData.otherIndustry : '' }); setIsIndustryOpen(false) }}
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {formData.industry === 'Other' && (
                <div className="input-group" style={{ marginTop: '1.5rem', animation: 'fadeIn 0.3s ease-out' }}>
                  <label className="label" style={{ fontSize: '0.9rem', fontWeight: '600' }}>Please specify your industry *</label>
                  <input
                    type="text"
                    className="input-underline"
                    placeholder="Tell us what you are building..."
                    value={formData.otherIndustry}
                    onChange={e => setFormData({ ...formData, otherIndustry: e.target.value })}
                    autoFocus
                  />
                </div>
              )}
            </div>

            <div className="inner-input-item">
              <label className="dropdown-label" style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1.5rem' }}>Your Squad Status - <span style={{ fontWeight: '400', color: 'var(--text-muted)', fontStyle: 'italic' }}>Team Size *</span></label>
              <div className="mc-grid" style={{ marginLeft: 0 }}>
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
      )}

      {step === 8 && (
        <section className="section" id="booking-section">
          <div className="section-header">
            <span className="section-number">8</span>
            <h2 className="section-title">If invited, when would you book? *</h2>
          </div>
          <p className="section-description" style={{ fontStyle: 'normal' }}>How quickly can you commit? Tell us how excited you are!</p>
          <div className="mc-grid">
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
      )}

      {step === 9 && (
        <section className="section success-page" style={{ textAlign: 'center', marginTop: '2rem' }}>
          <div style={{ fontSize: '4rem', marginBottom: '2rem' }}>✨</div>
          <h2 className="section-title" style={{ marginBottom: '1.5rem', marginLeft: 0 }}>Application Received!</h2>
          <p className="subtitle" style={{ color: 'var(--text-secondary)' }}>No lectures. Real peer fixes. The Gathering.</p>
          <button
            className="submit-small-btn"
            style={{ marginTop: '3rem' }}
            onClick={() => window.location.reload()}
          >
            Close
          </button>
        </section>
      )}

      {step <= 8 && (
        <footer style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '2rem', paddingBottom: '6rem', marginLeft: 'var(--content-indent)' }}>
          <button
            className="back-btn"
            disabled={step === 1 || isSubmitting}
            onClick={handleBack}
            style={{ opacity: step === 1 ? 0 : 1, pointerEvents: step === 1 ? 'none' : 'auto' }}
          >
            Back
          </button>
          <button
            className="submit-small-btn"
            disabled={isSubmitting}
            onClick={handleNext}
          >
            {isSubmitting ? "Saving..." : step === 8 ? "Submit" : "Next"}
          </button>
        </footer>
      )}
    </main>
  )
}

export default App
