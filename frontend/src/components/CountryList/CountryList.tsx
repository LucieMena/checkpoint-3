// CountryList.tsx
import { useQuery, gql } from "@apollo/client";
import styles from "./CountryList.module.css";
import { Country } from "../../../../backend/src/entities/Country";
// GraphQL query for fetching all countries
const GET_COUNTRIES_QUERY = gql`
  query GetCountries {
    countries {
      id
      name
      code
      emoji
      continent {
        id
        name
      }
    }
  }
`;

export default function CountryList() {
  const { data, loading, error } = useQuery(GET_COUNTRIES_QUERY);

  if (loading) return <p>Loading countries...</p>;
  if (error) return <p>Error loading countries: {error.message}</p>;

  return (
    <div className={styles.countryList}>
      <h2 className={styles.heading}>Countries List</h2>
      <table className={styles.countryTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Code</th>
            <th>Emoji</th>
            <th>Continent</th>
          </tr>
        </thead>
        <tbody>
          {data.countries.map((country: Country) => (
            <tr key={country.id}>
              <td>{country.name}</td>
              <td>{country.code}</td>
              <td>{country.emoji}</td>
              <td>
                {country.continent ? country.continent.name : "No Continent"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
