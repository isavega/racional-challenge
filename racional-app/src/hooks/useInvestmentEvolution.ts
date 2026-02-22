/**
 * useInvestmentEvolution — Real-time Firestore listener for investment evolution data.
 *
 * FIRESTORE DOCUMENT: investmentEvolutions/user1
 *
 * Actual document shape (as retrieved from Firestore):
 * {
 *   array: Array<{
 *     date: Timestamp,            // Firestore Timestamp
 *     portfolioValue: number,     // Current portfolio value
 *     dailyReturn: number,        // Daily return as decimal (e.g. 0.0047 = 0.47%)
 *     contributions: number,      // Total contributions to date
 *     portfolioIndex: number      // Portfolio index value (base 100)
 *   }>
 * }
 *
 * Note: There is no "currency" field in the document. We default to "CLP"
 * based on the value range (~1,000,000).
 *
 * HOW TO ADAPT IF THE STRUCTURE CHANGES:
 * --------------------------------------
 * 1. If the array field is renamed, update `EVOLUTION_FIELD`.
 * 2. If entry keys change, update the `mapEntry` function.
 * 3. If a currency field is added, update `CURRENCY_FIELD` and `parseDocument`.
 * 4. If the document path changes, update `COLLECTION` and `DOCUMENT_ID`.
 */

import { useEffect, useState } from 'react';
import { doc, onSnapshot, Timestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type {
  Currency,
  EvolutionEntry,
  InvestmentEvolutionState,
} from '../types/investment.types';

const COLLECTION = 'investmentEvolutions';
const DOCUMENT_ID = 'user1';

const EVOLUTION_FIELD = 'array';
const CURRENCY_FIELD: string | null = null;
const DEFAULT_CURRENCY: Currency = 'CLP';

function toISODate(raw: unknown): string {
  if (raw instanceof Timestamp) {
    return raw.toDate().toISOString().split('T')[0];
  }
  if (raw && typeof raw === 'object' && 'seconds' in raw) {
    const seconds = (raw as { seconds: number }).seconds;
    return new Date(seconds * 1000).toISOString().split('T')[0];
  }
  if (typeof raw === 'string') {
    return raw.length >= 10 ? raw.slice(0, 10) : raw;
  }
  return '';
}

function mapEntry(raw: Record<string, unknown>): EvolutionEntry {
  return {
    date: toISODate(raw['date']),
    value: Number(raw['portfolioValue'] ?? 0),
    dailyReturn: Number(raw['dailyReturn'] ?? 0),
    contributions: Number(raw['contributions'] ?? 0),
    portfolioIndex: Number(raw['portfolioIndex'] ?? 0),
  };
}

function parseDocument(
  data: Record<string, unknown>,
): { evolution: EvolutionEntry[]; currency: Currency } {
  const rawEvolution = data[EVOLUTION_FIELD];

  if (!Array.isArray(rawEvolution)) {
    throw new Error(
      `Field "${EVOLUTION_FIELD}" is missing or not an array in the Firestore document.`,
    );
  }

  const evolution = rawEvolution
    .map((entry: unknown) => mapEntry(entry as Record<string, unknown>))
    .filter((e) => e.date && !isNaN(e.value))
    .sort((a, b) => a.date.localeCompare(b.date));

  const currency: Currency =
    CURRENCY_FIELD && typeof data[CURRENCY_FIELD] === 'string'
      ? (data[CURRENCY_FIELD] as Currency)
      : DEFAULT_CURRENCY;

  return { evolution, currency };
}

export function useInvestmentEvolution(): InvestmentEvolutionState {
  const [state, setState] = useState<InvestmentEvolutionState>({
    data: null,
    currency: DEFAULT_CURRENCY,
    loading: true,
    error: null,
    lastUpdated: null,
  });

  useEffect(() => {
    const docRef = doc(db, COLLECTION, DOCUMENT_ID);

    const unsubscribe = onSnapshot(
      docRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setState({
            data: null,
            currency: DEFAULT_CURRENCY,
            loading: false,
            error: null,
            lastUpdated: new Date(),
          });
          return;
        }

        try {
          const raw = snapshot.data() as Record<string, unknown>;
          const { evolution, currency } = parseDocument(raw);

          setState({
            data: evolution,
            currency,
            loading: false,
            error: null,
            lastUpdated: new Date(),
          });
        } catch (err) {
          setState((prev) => ({
            ...prev,
            loading: false,
            error:
              err instanceof Error
                ? err.message
                : 'Error al procesar los datos del documento.',
            lastUpdated: new Date(),
          }));
        }
      },
      (err) => {
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || 'Error de conexión con Firestore.',
          lastUpdated: new Date(),
        }));
      },
    );

    return () => unsubscribe();
  }, []);

  return state;
}
