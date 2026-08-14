import { SearchPanel } from "@/components/search/search-panel";

export function SearchPage() {
  return (
    <div className="flex h-full w-full overflow-hidden">
      <div className="flex-1 overflow-y-auto p-6 md:p-8">
        <div className="max-w-[1200px] mx-auto w-full">
          <SearchPanel />
        </div>
      </div>
    </div>
  );
}
export default SearchPage;
