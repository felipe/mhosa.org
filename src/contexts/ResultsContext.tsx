'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

import { Database } from '@/database.types';

type Result = {
  id: number;
  position: number;
  time: string;
  race: {
    name: string;
    date: string;
  };
  driver: {
    name: string;
  };
};

type RawResult = {
  id: number;
  position: number;
  time: string;
  race: {
    name: string;
    date: string;
  }[];
  driver: {
    name: string;
  }[];
};

type ResultsContextType = {
  results: Result[];
  loading: boolean;
  error: string | null;
};

const ResultsContext = createContext<ResultsContextType>({
  results: [],
  loading: true,
  error: null,
});

export function ResultsProvider({ children }: { children: React.ReactNode }) {
  const [results, setResults] = useState<Result[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchResults() {
      try {
        const { data, error } = await supabase
          .from('race_results')
          .select(`
            id,
            position,
            time,
            race:race_id(name, date),
            driver:driver_id(name)
          `)
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Transform the raw data into the correct format
        const transformedResults: Result[] = (data || []).map((item: RawResult) => ({
          id: item.id,
          position: item.position,
          time: item.time,
          race: {
            name: item.race[0]?.name || '',
            date: item.race[0]?.date || '',
          },
          driver: {
            name: item.driver[0]?.name || '',
          }
        }));

        setResults(transformedResults);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch results');
      } finally {
        setLoading(false);
      }
    }

    fetchResults();
  }, [supabase]);

  return (
    <ResultsContext.Provider value={{ results, loading, error }}>
      {children}
    </ResultsContext.Provider>
  );
}

export function useResults() {
  const context = useContext(ResultsContext);
  if (context === undefined) {
    throw new Error('useResults must be used within a ResultsProvider');
  }
  return context;
}
