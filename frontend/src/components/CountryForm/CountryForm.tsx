import { useState } from "react";
import { useMutation, useQuery, gql } from "@apollo/client";
import styles from "./CountryForm.module.css";
import { Continent } from "../../../../backend/src/entities/Continent";

// GraphQL mutation for adding a country
const ADD_COUNTRY_MUTATION = gql`
  mutation AddCountry($data: NewCountryInput!) {
    addCountry(data: $data) {
      id
      name
      emoji
      code
      continent {
        id
      }
    }
  }
`;

// GraphQL query for fetching continents
const GET_CONTINENTS_QUERY = gql`
  query GetContinents {
    continents {
      id
      name
    }
  }
`;

export default function CountryForm() {
  const [formData, setFormData] = useState({
    name: "",
    emoji: "",
    code: "",
    continent: "", // Store just the continent ID
  });
  const [submittedCountry, setSubmittedCountry] = useState<any>(null);

  // Apollo mutation hook for adding a country
  const [addCountry, { loading, error }] = useMutation(ADD_COUNTRY_MUTATION, {
    onCompleted: (data) => {
      setSubmittedCountry(data.addCountry);
    },
  });

  // Apollo query hook for fetching continents
  const {
    data: continentsData,
    loading: continentsLoading,
    error: continentsError,
  } = useQuery(GET_CONTINENTS_QUERY);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    // If continent is being selected, update the continent ID only
    if (name === "continent") {
      setFormData({
        ...formData,
        continent: value, // Store the continent ID (not the full object)
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Basic form validation
    if (
      !formData.name ||
      !formData.emoji ||
      !formData.code ||
      !formData.continent
    ) {
      alert("Please fill in all fields, including selecting a continent.");
      return;
    }

    try {
      // Send the mutation with the continent as just the ID
      await addCountry({
        variables: {
          data: {
            name: formData.name,
            emoji: formData.emoji,
            code: formData.code,
            continent: formData.continent, // Just pass the continent ID
          },
        },
      });
    } catch (err) {
      console.error("Error adding country:", err);
    }
  };

  // Show loading or error while fetching continents
  if (continentsLoading) return <p>Loading continents...</p>;
  if (continentsError)
    return <p>Error loading continents: {continentsError.message}</p>;

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div>
        <label htmlFor="name">Country Name:</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="emoji">Country Emoji:</label>
        <input
          type="text"
          id="emoji"
          name="emoji"
          value={formData.emoji}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="code">Country Code:</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="continent">Continent:</label>
        <select
          id="continent"
          name="continent"
          value={formData.continent}
          onChange={handleChange}
        >
          <option value="">Select a continent</option>
          {continentsData.continents.map((continent : Continent) => (
            <option key={continent.id} value={continent.id}>
              {continent.name}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Submitting..." : "Submit"}
      </button>

      {error && <p>Error: {error.message}</p>}
      {submittedCountry && (
        <div>
          <h3>Submitted Country:</h3>
          <p>Name: {submittedCountry.name}</p>
          <p>Emoji: {submittedCountry.emoji}</p>
          <p>Code: {submittedCountry.code}</p>
          <p>Continent ID: {submittedCountry.continent.id}</p>
        </div>
      )}
    </form>
  );
}
