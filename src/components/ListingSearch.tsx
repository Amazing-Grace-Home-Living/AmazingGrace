import React, { useState, useMemo } from 'react';
import { listings } from '../data/listings';

export default function ListingSearch() {
  const [query, setQuery] = useState('');

  const filteredListings = useMemo(() => {
    const q = query.toLowerCase();
    return listings.filter(
      l =>
        l.address.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
    );
  }, [query]);

  return (
    <div className="listing-search-container">
      <div className="search-bar" style={{ marginBottom: '2rem' }}>
        <input
          type="text"
          placeholder="Search by address or city..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: '1px solid var(--border)',
            background: 'var(--surface)',
            color: 'var(--text)',
            fontSize: '1rem',
            outline: 'none',
            transition: 'border-color 0.2s'
          }}
        />
        <p style={{ color: 'var(--muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
          Found {filteredListings.length} matching locations
        </p>
      </div>

      <div className="property-grid">
        {filteredListings.map((l) => (
          <article key={l.id} className="property-card" style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: '1rem',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Main Image Banner */}
            <a href={l.image} target="_blank" rel="noopener noreferrer" style={{ display: 'block', overflow: 'hidden' }}>
              <img
                src={l.image}
                alt={l.address}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '220px',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.3s'
                }}
              />
            </a>

            {/* Scrollable Gallery Strip */}
            {l.gallery && l.gallery.length > 0 && (
              <div
                className="property-card-gallery"
                style={{
                  display: 'flex',
                  overflowX: 'auto',
                  gap: '0.5rem',
                  padding: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.02)',
                  borderBottom: '1px solid var(--border)',
                  scrollbarWidth: 'thin'
                }}
              >
                {l.gallery.map((imgUrl, idx) => (
                  <a
                    key={idx}
                    href={imgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flexShrink: 0, display: 'inline-block' }}
                  >
                    <img
                      src={imgUrl}
                      alt={`${l.address} gallery photo ${idx + 2}`}
                      loading="lazy"
                      style={{
                        height: '60px',
                        width: '90px',
                        borderRadius: '0.375rem',
                        objectFit: 'cover',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        display: 'block',
                        transition: 'transform 0.2s, border-color 0.2s'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.borderColor = 'var(--accent)';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
                      }}
                    />
                  </a>
                ))}
              </div>
            )}

            {/* Card Content Details */}
            <div className="property-card-content" style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ margin: '0 0 0.5rem 0', color: 'var(--text)', fontSize: '1.25rem' }}>
                {l.address} — {l.city}, {l.state}
              </h3>
              <p className="property-meta" style={{ margin: '0 0 1rem 0', color: 'var(--accent)', fontWeight: 'bold', fontSize: '0.95rem' }}>
                {l.city}, {l.state} · ${l.price}/mo
              </p>
              <p className="property-copy" style={{ margin: '0 0 1.25rem 0', color: 'var(--muted)', fontSize: '0.9rem', lineHeight: '1.6', flex: 1 }}>
                {l.description}
              </p>
              <ul className="property-amenities" style={{
                margin: '0 0 1.5rem 0',
                padding: '0 0 0 1.25rem',
                color: 'var(--muted)',
                fontSize: '0.85rem',
                lineHeight: '1.5'
              }}>
                {l.amenities.map((a, i) => (
                  <li key={i}>{a}</li>
                ))}
              </ul>
              <div className="property-cta" style={{ marginTop: 'auto' }}>
                <a
                  href="./contact/"
                  className="btn-primary"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    textDecoration: 'none',
                    padding: '0.75rem',
                    borderRadius: '0.5rem',
                    background: 'var(--accent)',
                    color: '#000000',
                    fontWeight: 'bold',
                    fontSize: '0.9rem',
                    transition: 'opacity 0.2s'
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.opacity = '0.9')}
                  onMouseOut={(e) => (e.currentTarget.style.opacity = '1')}
                >
                  Ask about this room
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
