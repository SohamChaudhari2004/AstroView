"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ──────────────────────────────────────────────────────────────────

type MediaType = "" | "image" | "video" | "audio";

interface NASAMediaItem {
  data: Array<{
    center?: string;
    date_created?: string;
    description?: string;
    description_508?: string;
    keywords?: string[];
    location?: string;
    media_type?: string;
    nasa_id?: string;
    photographer?: string;
    secondary_creator?: string;
    title?: string;
    album?: string[];
  }>;
  links?: Array<{
    href?: string;
    rel?: string;
    render?: string;
  }>;
  href?: string;
}

interface AssetFile {
  href: string;
}

// ─── Icon Components ────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ChevronDownIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 19l-7-7 7-7"
    />
  </svg>
);

const ChevronRightIcon = () => (
  <svg
    className="w-5 h-5 text-slate-400"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 5l7 7-7 7"
    />
  </svg>
);

const ImageIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const VideoIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
    />
  </svg>
);

const AudioIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
    />
  </svg>
);

const PlayIcon = () => (
  <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

const CloseIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M6 18L18 6M6 6l12 12"
    />
  </svg>
);

const ExternalLinkIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
    />
  </svg>
);

const DownloadIcon = () => (
  <svg
    className="w-4 h-4"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

// ─── Helpers ────────────────────────────────────────────────────────────────

const MEDIA_TYPE_OPTIONS: {
  value: MediaType;
  label: string;
  icon: React.ReactNode;
}[] = [
  { value: "", label: "All Media", icon: null },
  { value: "image", label: "Images", icon: <ImageIcon /> },
  { value: "video", label: "Videos", icon: <VideoIcon /> },
  { value: "audio", label: "Audio", icon: <AudioIcon /> },
];

function getMediaTypeColor(type?: string): string {
  switch (type) {
    case "image":
      return "from-cyan-500/20 to-cyan-500/5 border-cyan-500/30";
    case "video":
      return "from-purple-500/20 to-purple-500/5 border-purple-500/30";
    case "audio":
      return "from-amber-500/20 to-amber-500/5 border-amber-500/30";
    default:
      return "from-slate-500/20 to-slate-500/5 border-slate-500/30";
  }
}

function getMediaTypeBadgeColor(type?: string): string {
  switch (type) {
    case "image":
      return "bg-cyan-500/20 text-cyan-400 border-cyan-500/30";
    case "video":
      return "bg-purple-500/20 text-purple-400 border-purple-500/30";
    case "audio":
      return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    default:
      return "bg-slate-500/20 text-slate-400 border-slate-500/30";
  }
}

function getMediaTypeIcon(type?: string) {
  switch (type) {
    case "image":
      return <ImageIcon />;
    case "video":
      return <VideoIcon />;
    case "audio":
      return <AudioIcon />;
    default:
      return <ImageIcon />;
  }
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function truncateText(text: string, maxLen: number): string {
  if (text.length <= maxLen) return text;
  return text.slice(0, maxLen) + "...";
}

function getThumbnailUrl(item: NASAMediaItem): string | null {
  if (item.links && item.links.length > 0) {
    const thumb = item.links.find(
      (l) => l.rel === "preview" || l.render === "image",
    );
    if (thumb?.href) return thumb.href;
    if (item.links[0]?.href) return item.links[0].href;
  }
  return null;
}

function getFileExtension(url: string): string {
  const parts = url.split(".");
  return parts[parts.length - 1]?.split("?")[0]?.toUpperCase() || "";
}

// ─── Main Page Component ────────────────────────────────────────────────────

const ITEMS_PER_PAGE = 12;

export default function NASAMediaPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mediaType, setMediaType] = useState<MediaType>("");
  const [yearStart, setYearStart] = useState("");
  const [yearEnd, setYearEnd] = useState("");
  const [results, setResults] = useState<NASAMediaItem[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedCard, setExpandedCard] = useState<string | null>(null);
  const [assetFiles, setAssetFiles] = useState<Record<string, AssetFile[]>>({});
  const [loadingAssets, setLoadingAssets] = useState<Record<string, boolean>>(
    {},
  );
  const [previewItem, setPreviewItem] = useState<NASAMediaItem | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // ─── Search ─────────────────────────────────────────────────────────────

  const performSearch = useCallback(
    async (page: number = 1) => {
      if (!searchQuery.trim()) {
        setError("Please enter a search query");
        return;
      }

      setLoading(true);
      setError("");

      try {
        const params = new URLSearchParams();
        params.set("q", searchQuery.trim());
        if (mediaType) params.set("media_type", mediaType);
        if (yearStart) params.set("year_start", yearStart);
        if (yearEnd) params.set("year_end", yearEnd);
        params.set("page", page.toString());

        const response = await fetch(
          `http://localhost:5001/api/nasa-media/search?${params.toString()}`,
        );
        const json = await response.json();

        if (!json.success) {
          throw new Error(json.error || "Search failed");
        }

        const collection = json.data?.collection;
        if (!collection) {
          throw new Error("Invalid response structure");
        }

        const items: NASAMediaItem[] = collection.items || [];
        const total = collection.metadata?.total_hits || items.length;

        setResults(items);
        setTotalHits(total);
        setCurrentPage(page);
        setExpandedCard(null);
      } catch (err: any) {
        console.error("Search error:", err);
        setError(err.message || "Failed to search NASA media library");
        setResults([]);
        setTotalHits(0);
      } finally {
        setLoading(false);
      }
    },
    [searchQuery, mediaType, yearStart, yearEnd],
  );

  const handleSearch = () => {
    performSearch(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch();
  };

  // ─── Assets ─────────────────────────────────────────────────────────────

  const fetchAssets = async (nasaId: string) => {
    if (assetFiles[nasaId]) return; // already fetched
    setLoadingAssets((prev) => ({ ...prev, [nasaId]: true }));
    try {
      const response = await fetch(
        `http://localhost:5001/api/nasa-media/asset/${encodeURIComponent(nasaId)}`,
      );
      const json = await response.json();
      if (json.success && json.data?.collection?.items) {
        setAssetFiles((prev) => ({
          ...prev,
          [nasaId]: json.data.collection.items,
        }));
      }
    } catch (err) {
      console.error("Error fetching assets:", err);
    } finally {
      setLoadingAssets((prev) => ({ ...prev, [nasaId]: false }));
    }
  };

  // ─── Card Toggle ────────────────────────────────────────────────────────

  const toggleCard = (nasaId: string) => {
    if (expandedCard === nasaId) {
      setExpandedCard(null);
    } else {
      setExpandedCard(nasaId);
      fetchAssets(nasaId);
    }
  };

  // ─── Preview Modal ─────────────────────────────────────────────────────

  const openPreview = (item: NASAMediaItem) => {
    const data = item.data?.[0];
    const thumb = getThumbnailUrl(item);
    setPreviewItem(item);

    if (data?.media_type === "image" && thumb) {
      // try to get a higher res version
      const hiRes = thumb
        .replace("~thumb", "~medium")
        .replace("~small", "~medium");
      setPreviewUrl(hiRes);
    } else if (data?.media_type === "video" && thumb) {
      setPreviewUrl(thumb);
    } else {
      setPreviewUrl(thumb);
    }
  };

  const closePreview = () => {
    setPreviewItem(null);
    setPreviewUrl(null);
  };

  // ─── Pagination ─────────────────────────────────────────────────────────

  const totalPages = Math.ceil(totalHits / 100); // NASA API returns 100 per page
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/15 via-transparent to-purple-900/10" />
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 2 + 1,
              height: Math.random() * 2 + 1,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 0.6, 0.1] }}
            transition={{ duration: Math.random() * 4 + 2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Header */}
      <header className="relative z-20 border-b border-white/10 backdrop-blur-xl bg-[#0B0F1A]/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
                NASA Image &amp; Video Library
              </h1>
              <p className="text-sm text-slate-400">
                Search NASA&apos;s vast collection of images, videos &amp; audio
                files
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm p-5">
            {/* Main search row */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <SearchIcon />
                </div>
                <input
                  type="text"
                  placeholder="Search NASA media (e.g., Mars, Apollo 11, Hubble, ISS)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white text-sm placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500/50 transition-all"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white font-semibold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Searching...
                  </span>
                ) : (
                  "Search"
                )}
              </button>
            </div>

            {/* Filters row */}
            <div className="flex flex-wrap items-center gap-4">
              {/* Media type filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Type:
                </span>
                <div className="flex gap-1">
                  {MEDIA_TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setMediaType(opt.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                        mediaType === opt.value
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                          : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Year range */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 uppercase tracking-wider font-medium">
                  Year:
                </span>
                <input
                  type="number"
                  placeholder="From"
                  value={yearStart}
                  onChange={(e) => setYearStart(e.target.value)}
                  min="1920"
                  max="2025"
                  className="w-20 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
                <span className="text-slate-500 text-xs">to</span>
                <input
                  type="number"
                  placeholder="To"
                  value={yearEnd}
                  onChange={(e) => setYearEnd(e.target.value)}
                  min="1920"
                  max="2025"
                  className="w-20 px-2 py-1.5 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-7xl mx-auto mb-6"
            >
              <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-6 py-4 text-red-400 text-sm">
                {error}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results Count */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto mb-6"
          >
            <div className="flex items-center justify-between">
              <p className="text-slate-400 text-sm">
                Showing{" "}
                <span className="text-white font-semibold">
                  {results.length}
                </span>{" "}
                results
                {totalHits > 0 && (
                  <>
                    {" "}
                    of{" "}
                    <span className="text-white font-semibold">
                      {totalHits.toLocaleString()}
                    </span>{" "}
                    total
                  </>
                )}
                {" · Page "}
                <span className="text-white font-semibold">{currentPage}</span>
                {totalPages > 0 && (
                  <>
                    {" "}
                    of{" "}
                    <span className="text-white font-semibold">
                      {totalPages.toLocaleString()}
                    </span>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        )}

        {/* Loading Skeleton */}
        {loading && (
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden animate-pulse"
                >
                  <div className="h-48 bg-white/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="h-3 bg-white/5 rounded w-full" />
                    <div className="h-3 bg-white/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Results Grid */}
        {!loading && results.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-7xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {results.map((item, idx) => {
                const data = item.data?.[0];
                if (!data) return null;
                const nasaId = data.nasa_id || `item-${idx}`;
                const isExpanded = expandedCard === nasaId;
                const thumb = getThumbnailUrl(item);
                const mediaColor = getMediaTypeColor(data.media_type);
                const badgeColor = getMediaTypeBadgeColor(data.media_type);

                return (
                  <motion.div
                    key={nasaId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.03 }}
                    layout
                    className={`rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 cursor-pointer ${
                      isExpanded ? "col-span-1 sm:col-span-2 lg:col-span-3" : ""
                    }`}
                    onClick={() => toggleCard(nasaId)}
                  >
                    {/* Collapsed Card */}
                    {!isExpanded && (
                      <>
                        {/* Thumbnail */}
                        <div className="relative h-48 overflow-hidden group">
                          {thumb ? (
                            <img
                              src={thumb}
                              alt={data.title || "NASA Media"}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              loading="lazy"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  "none";
                              }}
                            />
                          ) : (
                            <div
                              className={`w-full h-full bg-gradient-to-br ${mediaColor} flex items-center justify-center`}
                            >
                              <div className="text-slate-400 opacity-40 scale-150">
                                {getMediaTypeIcon(data.media_type)}
                              </div>
                            </div>
                          )}

                          {/* Media type overlay badge */}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor} backdrop-blur-sm`}
                            >
                              {data.media_type || "unknown"}
                            </span>
                          </div>

                          {/* Play button for video */}
                          {data.media_type === "video" && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                                <PlayIcon />
                              </div>
                            </div>
                          )}

                          {/* Gradient overlay */}
                          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#0d1117] to-transparent" />
                        </div>

                        {/* Card Info */}
                        <div className="p-5">
                          <h3 className="text-white font-semibold text-sm leading-snug mb-2 line-clamp-2">
                            {data.title || "Untitled"}
                          </h3>
                          {data.description && (
                            <p className="text-slate-400 text-xs leading-relaxed line-clamp-2 mb-3">
                              {data.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {data.center && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/10">
                                  {data.center}
                                </span>
                              )}
                              {data.date_created && (
                                <span className="text-[10px] text-slate-500">
                                  {formatDate(data.date_created)}
                                </span>
                              )}
                            </div>
                            <div className="text-slate-500 hover:text-cyan-400 transition-colors">
                              <ChevronDownIcon />
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {/* Expanded Card */}
                    {isExpanded && (
                      <div className="p-6">
                        {/* Header row */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="flex items-start gap-4 flex-1 min-w-0">
                            {thumb && (
                              <img
                                src={thumb}
                                alt={data.title || ""}
                                className="w-32 h-24 object-cover rounded-xl border border-white/10 flex-shrink-0 cursor-pointer hover:ring-2 hover:ring-cyan-500/50 transition-all"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openPreview(item);
                                }}
                              />
                            )}
                            <div className="min-w-0">
                              <h2 className="text-xl font-bold text-white mb-1">
                                {data.title || "Untitled"}
                              </h2>
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <span
                                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${badgeColor}`}
                                >
                                  {data.media_type}
                                </span>
                                {data.center && (
                                  <span className="text-xs text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                                    📡 {data.center}
                                  </span>
                                )}
                                {data.date_created && (
                                  <span className="text-xs text-slate-500">
                                    📅 {formatDate(data.date_created)}
                                  </span>
                                )}
                              </div>
                              {data.nasa_id && (
                                <p className="text-[10px] text-slate-500 font-mono">
                                  NASA ID: {data.nasa_id}
                                </p>
                              )}
                            </div>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setExpandedCard(null);
                            }}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors text-slate-400 hover:text-white flex-shrink-0"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 15l7-7 7 7"
                              />
                            </svg>
                          </button>
                        </div>

                        {/* Description */}
                        {data.description && (
                          <div className="mb-6">
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                              Description
                            </h4>
                            <p className="text-slate-300 text-sm leading-relaxed max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                              {data.description}
                            </p>
                          </div>
                        )}

                        {/* 508 Description */}
                        {data.description_508 &&
                          data.description_508 !== data.description && (
                            <div className="mb-6">
                              <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                                508 Description
                              </h4>
                              <p className="text-slate-400 text-sm leading-relaxed">
                                {data.description_508}
                              </p>
                            </div>
                          )}

                        {/* Metadata Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                          {data.photographer && (
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                                Photographer
                              </p>
                              <p className="text-white text-sm">
                                {data.photographer}
                              </p>
                            </div>
                          )}
                          {data.secondary_creator && (
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                                Secondary Creator
                              </p>
                              <p className="text-white text-sm">
                                {data.secondary_creator}
                              </p>
                            </div>
                          )}
                          {data.location && (
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                                Location
                              </p>
                              <p className="text-white text-sm">
                                {data.location}
                              </p>
                            </div>
                          )}
                          {data.date_created && (
                            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
                              <p className="text-[10px] uppercase tracking-wider text-slate-500 mb-1">
                                Date Created
                              </p>
                              <p className="text-white text-sm">
                                {formatDate(data.date_created)}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Keywords */}
                        {data.keywords && data.keywords.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                              Keywords
                            </h4>
                            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                              {data.keywords.map((kw, ki) => (
                                <span
                                  key={ki}
                                  className="px-2.5 py-1 rounded-full text-[10px] bg-white/5 text-slate-300 border border-white/10 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 cursor-pointer transition-all"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(kw);
                                    performSearch(1);
                                  }}
                                >
                                  {kw}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Albums */}
                        {data.album && data.album.length > 0 && (
                          <div className="mb-6">
                            <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-2 font-semibold">
                              Albums
                            </h4>
                            <div className="flex flex-wrap gap-1.5">
                              {data.album.map((a, ai) => (
                                <span
                                  key={ai}
                                  className="px-2.5 py-1 rounded-full text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20"
                                >
                                  {a}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Asset Files */}
                        <div className="mb-4">
                          <h4 className="text-xs uppercase tracking-wider text-slate-500 mb-3 font-semibold">
                            Available Files
                          </h4>
                          {loadingAssets[nasaId] ? (
                            <div className="flex items-center gap-2 text-slate-400 text-sm">
                              <svg
                                className="animate-spin w-4 h-4"
                                fill="none"
                                viewBox="0 0 24 24"
                              >
                                <circle
                                  className="opacity-25"
                                  cx="12"
                                  cy="12"
                                  r="10"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                />
                                <path
                                  className="opacity-75"
                                  fill="currentColor"
                                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                                />
                              </svg>
                              Loading asset files...
                            </div>
                          ) : assetFiles[nasaId] &&
                            assetFiles[nasaId].length > 0 ? (
                            <div className="max-h-48 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 space-y-1.5">
                              {assetFiles[nasaId].map((file, fi) => {
                                const ext = getFileExtension(file.href);
                                return (
                                  <a
                                    key={fi}
                                    href={file.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 hover:border-cyan-500/30 transition-all group"
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <DownloadIcon />
                                      <span className="text-slate-300 text-xs truncate group-hover:text-white transition-colors">
                                        {decodeURIComponent(
                                          file.href.split("/").pop() ||
                                            file.href,
                                        )}
                                      </span>
                                    </div>
                                    {ext && (
                                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/10 text-slate-400 font-mono flex-shrink-0">
                                        {ext}
                                      </span>
                                    )}
                                    <ExternalLinkIcon />
                                  </a>
                                );
                              })}
                            </div>
                          ) : (
                            <p className="text-slate-500 text-xs">
                              No asset files found
                            </p>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-white/10">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              openPreview(item);
                            }}
                            className="px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 rounded-lg text-xs font-medium border border-cyan-500/20 transition-all flex items-center gap-2"
                          >
                            <ImageIcon />
                            Preview
                          </button>
                          {data.nasa_id && (
                            <a
                              href={`https://images.nasa.gov/details/${data.nasa_id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium border border-purple-500/20 transition-all flex items-center gap-2"
                            >
                              <ExternalLinkIcon />
                              View on NASA
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-4 mt-10">
                <button
                  onClick={() => canGoPrev && performSearch(currentPage - 1)}
                  disabled={!canGoPrev}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeftIcon />
                  Previous
                </button>
                <div className="flex items-center gap-1">
                  {/* Show page numbers around current page */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          pageNum !== currentPage && performSearch(pageNum)
                        }
                        className={`w-9 h-9 rounded-lg text-xs font-medium transition-all ${
                          pageNum === currentPage
                            ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                            : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => canGoNext && performSearch(currentPage + 1)}
                  disabled={!canGoNext}
                  className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium text-slate-400 hover:text-white border border-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                >
                  Next
                  <ChevronRightIcon />
                </button>
              </div>
            )}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && results.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-7xl mx-auto space-y-6"
          >
            {/* Trending Searches */}
            <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg
                  className="w-6 h-6 text-cyan-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                  />
                </svg>
                <h3 className="text-xl font-semibold text-white">
                  Trending Searches
                </h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {[
                  { query: "James Webb", icon: "🔭", count: "2.1K images" },
                  {
                    query: "Mars Perseverance",
                    icon: "🔴",
                    count: "1.8K images",
                  },
                  { query: "ISS", icon: "🛰️", count: "3.5K images" },
                  { query: "Artemis", icon: "🌙", count: "892 images" },
                  { query: "Black Hole", icon: "⚫", count: "1.2K images" },
                  { query: "Hubble", icon: "🌌", count: "4.3K images" },
                  { query: "Earth", icon: "🌍", count: "5.7K images" },
                  { query: "Nebula", icon: "🌠", count: "2.9K images" },
                ].map((item) => (
                  <button
                    key={item.query}
                    onClick={() => {
                      setSearchQuery(item.query);
                      setTimeout(() => performSearch(1), 0);
                    }}
                    className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-gradient-to-br hover:from-cyan-500/10 hover:to-purple-500/10 hover:border-cyan-500/30 transition-all text-left group"
                  >
                    <div className="flex flex-col gap-2">
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <p className="font-medium text-white group-hover:text-cyan-400 transition-colors text-sm">
                          {item.query}
                        </p>
                        <p className="text-xs text-slate-500 mt-0.5">
                          {item.count}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Explore by Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🚀</span>
                  <h4 className="text-lg font-semibold text-white">Missions</h4>
                </div>
                <div className="space-y-2">
                  {[
                    "Apollo 11",
                    "Apollo 13",
                    "Voyager",
                    "Cassini",
                    "New Horizons",
                  ].map((mission) => (
                    <button
                      key={mission}
                      onClick={() => {
                        setSearchQuery(mission);
                        setTimeout(() => performSearch(1), 0);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 border border-transparent transition-all text-sm"
                    >
                      {mission}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🪐</span>
                  <h4 className="text-lg font-semibold text-white">
                    Planets & Bodies
                  </h4>
                </div>
                <div className="space-y-2">
                  {["Mars", "Jupiter", "Saturn", "Venus", "Moon"].map(
                    (body) => (
                      <button
                        key={body}
                        onClick={() => {
                          setSearchQuery(body);
                          setTimeout(() => performSearch(1), 0);
                        }}
                        className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 border border-transparent transition-all text-sm"
                      >
                        {body}
                      </button>
                    ),
                  )}
                </div>
              </div>

              <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl">🌌</span>
                  <h4 className="text-lg font-semibold text-white">
                    Phenomena
                  </h4>
                </div>
                <div className="space-y-2">
                  {[
                    "Solar Eclipse",
                    "Supernova",
                    "Galaxy",
                    "Comet",
                    "Aurora",
                  ].map((phenomenon) => (
                    <button
                      key={phenomenon}
                      onClick={() => {
                        setSearchQuery(phenomenon);
                        setTimeout(() => performSearch(1), 0);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/30 border border-transparent transition-all text-sm"
                    >
                      {phenomenon}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Preview Modal */}
      <AnimatePresence>
        {previewItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
            onClick={closePreview}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl max-h-[90vh] w-full rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button
                onClick={closePreview}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white/70 hover:text-white transition-all"
              >
                <CloseIcon />
              </button>

              {/* Preview content */}
              <div className="p-6">
                {(() => {
                  const data = previewItem.data?.[0];
                  const type = data?.media_type;

                  if (type === "image" && previewUrl) {
                    return (
                      <div className="flex flex-col items-center">
                        <img
                          src={previewUrl}
                          alt={data?.title || "NASA Image"}
                          className="max-w-full max-h-[70vh] object-contain rounded-xl"
                          onError={(e) => {
                            // fallback to thumbnail
                            const thumb = getThumbnailUrl(previewItem);
                            if (
                              thumb &&
                              (e.target as HTMLImageElement).src !== thumb
                            ) {
                              (e.target as HTMLImageElement).src = thumb;
                            }
                          }}
                        />
                        <p className="text-white font-medium mt-4 text-center">
                          {data?.title}
                        </p>
                        {data?.description && (
                          <p className="text-slate-400 text-sm mt-2 text-center max-w-2xl line-clamp-3">
                            {data.description}
                          </p>
                        )}
                      </div>
                    );
                  }

                  if (type === "video") {
                    return (
                      <div className="flex flex-col items-center">
                        {previewUrl ? (
                          <img
                            src={previewUrl}
                            alt={data?.title || "Video Preview"}
                            className="max-w-full max-h-[60vh] object-contain rounded-xl"
                          />
                        ) : (
                          <div className="w-full h-64 bg-white/5 rounded-xl flex items-center justify-center">
                            <VideoIcon />
                          </div>
                        )}
                        <p className="text-white font-medium mt-4 text-center">
                          {data?.title}
                        </p>
                        <p className="text-slate-500 text-xs mt-1">
                          For video playback, download the video file from the
                          expanded card.
                        </p>
                        {data?.nasa_id && (
                          <a
                            href={`https://images.nasa.gov/details/${data.nasa_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-3 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium border border-purple-500/20 transition-all flex items-center gap-2"
                          >
                            <ExternalLinkIcon />
                            Watch on NASA
                          </a>
                        )}
                      </div>
                    );
                  }

                  if (type === "audio") {
                    return (
                      <div className="flex flex-col items-center py-12">
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/20 flex items-center justify-center mb-6">
                          <div className="scale-[2] text-amber-400">
                            <AudioIcon />
                          </div>
                        </div>
                        <p className="text-white font-medium text-center text-lg">
                          {data?.title}
                        </p>
                        <p className="text-slate-500 text-xs mt-2">
                          Download the audio file from the expanded card to
                          listen.
                        </p>
                        {data?.nasa_id && (
                          <a
                            href={`https://images.nasa.gov/details/${data.nasa_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 px-4 py-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg text-xs font-medium border border-purple-500/20 transition-all flex items-center gap-2"
                          >
                            <ExternalLinkIcon />
                            Listen on NASA
                          </a>
                        )}
                      </div>
                    );
                  }

                  return (
                    <div className="flex flex-col items-center py-12">
                      <p className="text-slate-400">
                        Preview not available for this media type
                      </p>
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
