"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { POKE_API, PAGE_SIZE } from "./lib/pokeapi";
import PokemonCard from "./components/PokemonCard";
import PokemonDetail from "./components/PokemonDetail";
import Pagination from "./components/Pagination";
import styles from "./page.module.css";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const urlPage = parseInt(searchParams.get("page") || "1", 10);
  const [pokemon, setPokemon] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const setPage = (newPage) => {
    router.push(`?page=${newPage}`);
  };

  useEffect(() => {
    async function loadPokemon() {
      setLoading(true);
      setError(null);

      try {
        const offset = (urlPage - 1) * PAGE_SIZE;
        const res = await fetch(`${POKE_API}?limit=${PAGE_SIZE}&offset=${offset}`);

        if (!res.ok) {
          throw new Error(`Request failed with status ${res.status}`);
        }

        const data = await res.json();
        setPokemon(data.results);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadPokemon();
  }, [urlPage]);

  const filteredPokemon = pokemon.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Pokédex</h1>
        <p className={styles.subtitle}>Click on a Pokémon to see its details.</p>
        
        <input
          type="text"
          placeholder="Search Pokémon on this page..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={styles.searchInput}
        />
      </header>

      {loading && (
        <div className={styles.grid}>
          {Array.from({ length: PAGE_SIZE }).map((_, index) => (
            <div key={index} className={styles.skeletonCard}>
              <div className={styles.skeletonImage}></div>
              <div className={styles.skeletonId}></div>
              <div className={styles.skeletonName}></div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className={styles.errorBox}>
          <strong>Oops! We couldn&apos;t load the Pokémon.</strong>
          <p className={styles.errorText}>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          <div className={styles.grid}>
            {filteredPokemon.map((p) => (
              <PokemonCard key={p.name} pokemon={p} onSelect={setSelected} />
            ))}
          </div>

          <Pagination
            page={urlPage}
            onPrev={() => setPage(Math.max(1, urlPage - 1))}
            onNext={() => setPage(urlPage + 1)}
          />
        </>
      )}

      {selected && (
        <PokemonDetail pokemon={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}