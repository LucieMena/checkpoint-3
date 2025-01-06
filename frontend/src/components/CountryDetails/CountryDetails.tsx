import React from "react";
import styles from "./CountryDetails.module.css";
import { Country } from "../../../../backend/src/entities/Country";

interface CountryDetailsProps {
  country: Country;
}

const CountryDetails: React.FC<CountryDetailsProps> = ({ country }) => {
  return (
    <div className={styles.countryDetails}>
      <h1>{country.name}</h1>
      <p>
        <strong>Code:</strong> {country.code}
      </p>
      <p>
        <strong>Emoji:</strong> {country.emoji}
      </p>
      <p>
        <strong>Continent:</strong>{" "}
        {country.continent ? country.continent.name : "No continent assigned"}
      </p>
    </div>
  );
};

export default CountryDetails;
