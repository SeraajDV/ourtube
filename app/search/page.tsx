interface SearchPageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
    const { query } = await searchParams

  return (
    <div>SearchPage: {query}</div>
  )
}
