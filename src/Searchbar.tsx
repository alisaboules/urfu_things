import { useEffect, useRef, useState } from 'react';
import { IoIosSearch } from 'react-icons/io';
import { TbCameraAi } from 'react-icons/tb';
import { FaRegHourglassHalf } from 'react-icons/fa6';
import { toast } from 'react-toastify';
import { getSearchHistory, getSearchSuggestions, saveSearchQuery, searchByImage } from './Api/Api';

type SearchbarProps = {
  search: string;
  setSearch: React.Dispatch<React.SetStateAction<string>>;
  onImageSearch?: (ids: string[]) => void;
};

function Searchbar({ search, setSearch, onImageSearch }: SearchbarProps) {
  const [history, setHistory] = useState<string[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const data = await getSearchHistory();
        setHistory(data);
      } catch (e) {
        console.error(e);
      }
    };

    loadHistory();
  }, []);

  useEffect(() => {
    const loadSuggestions = async () => {
      try {
        if (!search.trim()) {
          setSuggestions(history.slice(0, 5));
          return;
        }

        const data = await getSearchSuggestions(search);
        setSuggestions(data.slice(0, 5));
      } catch (e) {
        console.error(e);
      }
    };

    loadSuggestions();
  }, [search, history]);

  const firstSuggestion = suggestions.find((s) => s.toLowerCase().startsWith(search.toLowerCase()));

  const saveSearch = async (query: string) => {
    try {
      await saveSearchQuery(query);
      const historyData = await getSearchHistory();
      setHistory(historyData);
    } catch (e) {
      console.error(e);
    }
  };
  const handleImageSearch = async (file: File) => {
    if (!file) return;
    setIsSearching(true);
    try {
      const results = await searchByImage(file);
      console.log('Результаты поиска по фото:', results);
      // results: [{ id: "img1", distance: 0.2 }, ...]
      const filtered = results.filter((r: { distance: number }) => r.distance > 0.8);
      const ids = filtered.map((r: { id: string }) => String(r.id));

      if (ids.length === 0) {
        toast.warning('Похожих фото не найдено.', { className: 'custom-toast-warning' });
        onImageSearch?.([]);
      } else {
        onImageSearch?.(ids);
      }
    } catch (err) {
      console.error('Ошибка поиска по фото', err);
      toast.error('Не удалось выполнить поиск по фото.', { className: 'custom-toast-error' });
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="search">
      <div className="search-wrapper">
        {firstSuggestion && search && (
          <div className="ghost">
            {search}
            <span className="ghost-rest">{firstSuggestion.slice(search.length)}</span>
          </div>
        )}

        <div className="search-icon-wrapper">
          <IoIosSearch className="icon-search" />
        </div>

        <input
          type="text"
          placeholder="Поиск"
          value={search}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && search.trim()) {
              saveSearch(search);
              setShowSuggestions(false);
            }
          }}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            if (e.target.files?.[0]) {
              handleImageSearch(e.target.files[0]);
            }
          }}
        />

        <button
          className="search-by-image-btn"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSearching}>
          {isSearching ? (
            <FaRegHourglassHalf className="ai-icon" />
          ) : (
            <TbCameraAi className="ai-icon" />
          )}
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="search-suggestion"
              onClick={() => {
                setSearch(suggestion);
                saveSearch(suggestion);
                setShowSuggestions(false);
              }}>
              {suggestion}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export { Searchbar };
