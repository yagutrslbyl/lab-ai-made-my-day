"use client";

import { useEffect, useState } from "react";
import { getPokemonId, getPokemonImage } from "../lib/pokeapi";
import styles from "./PokemonDetail.module.css";

const typeColors = {
  fire: "#ef5350",
  water: "#29b6f6",
  grass: "#66bb6a",
  poison: "#ab47bc",
  flying: "#90caf9",
  bug: "#d4e157",
  normal: "#bdbdbd",
  electric: "#ffca28",
  ground: "#caa14c",
  fairy: "#f48fb1",
  fighting: "#d32f2f",
  psychic: "#ec407a",
  rock: "#8d6e63",
  steel: "#b0bec5",
  ice: "#26c6da",
  ghost: "#7e57c2",
  dragon: "#5c6bc0",
  dark: "#263238"
};

export default function PokemonDetail({ pokemon, onClose }) {
  const [details, setDetails] = useState(null);

  useEffect(() => {
    async function loadDetails() {
      const res = await fetch(pokemon.url);
      const data = await res.json();
      setDetails(data);
    }
    loadDetails();
  }, [pokemon]);

  const rawId = getPokemonId(pokemon.url);
  const paddedId = `#${String(rawId).padStart(3, "0")}`;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>

        <img
          src={getPokemonImage(rawId)}
          alt={pokemon.name}
          className={styles.pokemonImg}
        />

        <h2 className={styles.pokemonName}>{pokemon.name}</h2>
        <p className={styles.pokemonId}>{paddedId}</p>

        {!details ? (
          <p className={styles.loadingText}>Loading details…</p>
        ) : (
          <div className={styles.detailsContainer}>
            <div className={styles.typesGrid}>
              {details.types.map((t) => (
                <span
                  key={t.type.name}
                  className={styles.typeBadge}
                  style={{ backgroundColor: typeColors[t.type.name] || "#bdbdbd" }}
                >
                  {t.type.name}
                </span>
              ))}
            </div>

            <p className={styles.infoRow}>
              <strong>Height:</strong> {details.height / 10} m
            </p>
            <p className={styles.infoRow}>
              <strong>Weight:</strong> {details.weight / 10} kg
            </p>

            <h3 className={styles.statsHeading}>Base stats</h3>
            {details.stats.map((s) => (
              <div key={s.stat.name} className={styles.statRow}>
                <span className={styles.statName}>{s.stat.name}</span>
                <span className={styles.statValue}>{s.base_stat}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}