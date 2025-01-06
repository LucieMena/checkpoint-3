import { useRouter } from "next/router";
import { useQuery, gql } from "@apollo/client";
import CountryDetails from "../../components/CountryDetails/CountryDetails";

// GraphQL query to fetch a country by ID
const GET_COUNTRY_BY_ID = gql`
  query GetCountryById($id: Int!) {
    country(id: $id) {
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

const CountryPage = () => {
  const router = useRouter();
  const { id } = router.query; // Extract the country ID from the URL

  const { data, loading, error } = useQuery(GET_COUNTRY_BY_ID, {
    variables: { id: id ? parseInt(id as string) : 0 }, // Parse ID as an integer
    skip: !id, // Don't run the query until the `id` is available
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading country: {error.message}</p>;

  // If country data is available
  if (data && data.country) {
    const country = data.country;

    return <CountryDetails country={country} />;
  }

  return <p>No country found</p>;
};

export default CountryPage;
