/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import axios from "axios";
import { SiteDetailsProps } from "@/app/_models/site.model";

const useFetchSites = () => {
  const [siteLists, setSiteLists] = useState<SiteDetailsProps[] | null>([]); // Adjust the type as needed
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const baseUrl = process.env.EXPO_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchAllSites = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/site/all-sites`);

        setSiteLists(response.data);
      } catch (error: any) {
        setError(error.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchAllSites();
  }, []);

  return { siteLists, loading, error };
};

export default useFetchSites;
