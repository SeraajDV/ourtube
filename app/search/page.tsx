import SearchBar from "@/components/layout/search-bar";

interface SearchPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { query } = await searchParams;
  const queryString = Array.isArray(query) ? query[0] : query;

  return (
    <div>
      <div className="flex md:hidden px-4 pt-4 mb-4">
        <SearchBar defaultValue={queryString} />
      </div>
      <div className="px-4">SearchPage: {query}</div>
    </div>
  );
}
