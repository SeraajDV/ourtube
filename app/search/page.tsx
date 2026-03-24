import { getSearchResults } from "../actions/search";
import {
  RawVideo,
  SearchResultsGrid,
} from "../../components/search/search-results-grid";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;
  const searchQuery = Array.isArray(query) ? (query[0] ?? "") : (query ?? "");
  const result = await getSearchResults(searchQuery);
  const videos = (
    Array.isArray(result.videos) ? result.videos : []
  ) as RawVideo[];

  return <SearchResultsGrid searchQuery={searchQuery} videos={videos} />;
}
