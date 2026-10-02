'use client';

import { useEffect } from 'react';

interface GlobalErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error('OCPR Global Root Error:', error);
  }, [error]);

  return (
    <html lang="fr">
      <body style={{
        margin: 0,
        padding: 0,
        backgroundColor: '#0d2e1a',
        color: '#f8fafc',
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          maxWidth: '560px',
          width: '90%',
          padding: '2.5rem',
          backgroundColor: '#123820',
          border: '1px solid rgba(42, 123, 68, 0.4)',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          textAlign: 'center'
        }}>
          {/* Logo Brand Title */}
          <div style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: '#DAA520',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            OCPR COMORES
          </div>

          <div style={{
            display: 'inline-block',
            padding: '0.25rem 0.75rem',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '9999px',
            color: '#fca5a5',
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '1rem'
          }}>
            Erreur Critique
          </div>

          <h1 style={{
            fontSize: '1.5rem',
            fontWeight: 800,
            color: '#ffffff',
            marginBottom: '0.75rem'
          }}>
            Une erreur critique est survenue
          </h1>

          <p style={{
            fontSize: '0.9rem',
            color: '#d1fae5',
            opacity: 0.8,
            lineHeight: 1.6,
            marginBottom: '2rem'
          }}>
            Le portail de l&apos;Office Comorien des Produits de Rente a rencontré un dysfonctionnement inattendu au niveau principal.
          </p>

          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            justifyContent: 'center'
          }}>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#DAA520',
                color: '#184E2A',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(218, 165, 32, 0.3)'
              }}
            >
              Réessayer
            </button>

            <a
              href="/"
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                textDecoration: 'none',
                display: 'inline-block'
              }}
            >
              Page d&apos;accueil
            </a>
          </div>

          {error?.digest && (
            <div style={{
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid rgba(42, 123, 68, 0.3)',
              fontSize: '0.75rem',
              color: '#94CBA3',
              fontFamily: 'monospace'
            }}>
              Code incident: {error.digest}
            </div>
          )}
        </div>
      </body>
    </html>
  );
}
