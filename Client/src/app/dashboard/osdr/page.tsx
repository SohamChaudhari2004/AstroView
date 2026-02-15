"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type SearchType = "datasets" | "missions" | "experiments";

interface SearchResult {
  [key: string]: any;
}

// Icon components
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

const DATA_SOURCES = [
  { value: "", label: "All Sources" },
  { value: "cgene", label: "NASA OSDR (cgene)" },
  { value: "nih_geo_gse", label: "NIH GEO" },
  { value: "ebi_pride", label: "EBI PRIDE" },
  { value: "mg_rast", label: "MG-RAST" },
];

const SORT_OPTIONS = [
  { value: "", label: "Relevance" },
  { value: "Study Public Release Date", label: "Release Date" },
  { value: "Study Title", label: "Title" },
  { value: "Accession", label: "Accession" },
];

const FILTER_FIELDS = [
  { value: "", label: "No Filter" },
  { value: "organism", label: "Organism" },
  { value: "Study Assay Technology Type", label: "Assay Technology" },
  { value: "Material Type", label: "Material Type" },
  { value: "Project Type", label: "Project Type" },
  { value: "Study Factor Name", label: "Factor Name" },
  { value: "Managing NASA Center", label: "NASA Center" },
  { value: "Flight Program", label: "Flight Program" },
  { value: "Experiment Platform", label: "Experiment Platform" },
];

export default function OSDRPage() {
  const [searchType, setSearchType] = useState<SearchType>("datasets");
  const [searchQuery, setSearchQuery] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [sortField, setSortField] = useState("");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("DESC");
  const [filterField, setFilterField] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [totalHits, setTotalHits] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [previewFile, setPreviewFile] = useState<{
    url: string;
    name: string;
    type: string;
  } | null>(null);
  const itemsPerPage = 10;

  const handleSearch = async () => {
    if (!searchQuery.trim() && searchType === "datasets") {
      setError("Please enter a search term");
      return;
    }

    setLoading(true);
    setError(null);
    setExpandedCard(null);
    setCurrentPage(1);

    try {
      let endpoint = "";

      if (searchType === "datasets") {
        const params = new URLSearchParams();
        params.set("term", searchQuery);
        params.set("size", "25");
        if (dataSource) params.set("type", dataSource);
        if (sortField) params.set("sort", sortField);
        if (sortField) params.set("order", sortOrder);
        if (filterField && filterValue) {
          params.set("ffield", filterField);
          params.set("fvalue", filterValue);
        }
        endpoint = `http://localhost:5001/api/osdr/search?${params.toString()}`;
      } else if (searchType === "missions") {
        endpoint = "http://localhost:5001/api/osdr/missions";
      } else if (searchType === "experiments") {
        endpoint = "http://localhost:5001/api/osdr/experiments";
      }

      const response = await fetch(endpoint);
      const data = await response.json();

      if (data.success) {
        let resultsArray: SearchResult[] = [];

        if (searchType === "datasets") {
          // OSDR search returns: data.hits.hits[]._source
          const hits = data.data?.hits?.hits || [];
          resultsArray = hits.map((hit: any) => ({
            ...hit._source,
            _id: hit._id,
            _score: hit._score,
          }));
          setTotalHits(data.data?.hits?.total || resultsArray.length);
        } else if (searchType === "missions") {
          // Backend now returns flat array of mission detail objects
          resultsArray = Array.isArray(data.data) ? data.data : [];
          setTotalHits(resultsArray.length);
        } else if (searchType === "experiments") {
          // Backend returns flat array of experiment objects
          // Each experiment has a `fields` array with the actual details
          const rawExperiments = Array.isArray(data.data) ? data.data : [];
          resultsArray = rawExperiments.map((exp: any) => {
            // Flatten the fields array into the experiment object for easier rendering
            const field = exp.fields?.[0] || {};
            return {
              ...exp,
              identifier: field.osID || exp.identifier || "Unknown",
              title: field.title || "",
              status: field.status || "",
              releaseDate: field.releaseDate || "",
              grantNumber: field.grantNumber || "",
              objectives: field.objectives || "",
              approach: field.approach || "",
              people: field.people || [],
              _field: field,
            };
          });
          setTotalHits(data.totalAvailable || resultsArray.length);
        }

        setResults(resultsArray);

        if (resultsArray.length === 0) {
          setError("No results found. Try different search terms or filters.");
        }
      } else {
        setError(data.error || "Failed to fetch data");
      }
    } catch (err: any) {
      console.error("Search error:", err);
      setError(err.message || "Failed to search. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleCard = (index: number) => {
    setExpandedCard(expandedCard === index ? null : index);
  };

  // Pagination functions
  const totalPages = Math.ceil(results.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentResults = results.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    setExpandedCard(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const formatOrganism = (org: any) => {
    if (Array.isArray(org)) return org.filter(Boolean).join(", ");
    return org || "";
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp || timestamp === "0000000000") return "";
    const num = typeof timestamp === "string" ? parseInt(timestamp) : timestamp;
    if (isNaN(num) || num === 0) return "";
    return new Date(num * 1000).toLocaleDateString();
  };

  const formatISODate = (dateStr: string) => {
    if (!dateStr) return "";
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes || bytes === 0) return "";
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    let size = bytes;
    while (size >= 1024 && i < units.length - 1) {
      size /= 1024;
      i++;
    }
    return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`;
  };

  const getFileName = (fullPath: string) => {
    if (!fullPath) return "";
    return fullPath.split("/").pop() || fullPath;
  };

  const getCategoryName = (category: any) => {
    if (!category) return "";
    return category.resource_name || category.resource_category_name || "";
  };

  const getFileDownloadUrl = (file: any) => {
    const path = file?.fullPath || file?.fileName || file?.name || "";
    if (!path) return "";
    return `http://localhost:5001/api/osdr/files/download?path=${encodeURIComponent(path)}`;
  };

  const getFilePreviewUrl = (file: any) => {
    const path = file?.fullPath || file?.fileName || file?.name || "";
    if (!path) return "";
    return `http://localhost:5001/api/osdr/files/preview?path=${encodeURIComponent(path)}`;
  };

  const isPreviewable = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    const previewableExts = [
      "pdf",
      "png",
      "jpg",
      "jpeg",
      "gif",
      "svg",
      "webp",
      "bmp",
      "txt",
      "csv",
      "tsv",
      "json",
      "xml",
      "html",
      "htm",
      "md",
      "log",
      "yaml",
      "yml",
      "mp4",
      "webm",
      "mp3",
      "wav",
    ];
    return previewableExts.includes(ext);
  };

  const getFilePreviewType = (fileName: string) => {
    const ext = fileName.split(".").pop()?.toLowerCase() || "";
    if (["png", "jpg", "jpeg", "gif", "svg", "webp", "bmp"].includes(ext))
      return "image";
    if (ext === "pdf") return "pdf";
    if (
      [
        "txt",
        "csv",
        "tsv",
        "json",
        "xml",
        "html",
        "htm",
        "md",
        "log",
        "yaml",
        "yml",
      ].includes(ext)
    )
      return "text";
    if (["mp4", "webm"].includes(ext)) return "video";
    if (["mp3", "wav"].includes(ext)) return "audio";
    return "unknown";
  };

  const openPreview = (file: any) => {
    const name = getFileName(file.fullPath || file.fileName || file.name || "");
    const url = getFilePreviewUrl(file);
    const type = getFilePreviewType(name);
    if (url) setPreviewFile({ url, name, type });
  };

  // Helper to render a simple text detail field
  const DetailField = ({
    label,
    value,
    fullWidth = false,
  }: {
    label: string;
    value: any;
    fullWidth?: boolean;
  }) => {
    if (
      !value ||
      (typeof value === "string" && !value.trim()) ||
      value === "0000000000"
    )
      return null;
    const displayValue = Array.isArray(value)
      ? value.filter(Boolean).join(", ")
      : typeof value === "object"
        ? JSON.stringify(value)
        : String(value);
    if (!displayValue.trim()) return null;
    return (
      <div
        className={`p-3 bg-white/5 rounded-lg ${fullWidth ? "md:col-span-2" : ""}`}
      >
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-medium text-sm break-words">
          {displayValue}
        </p>
      </div>
    );
  };

  const renderDatasetCard = (result: any, index: number) => {
    const isExpanded = expandedCard === index;
    const accession = result["Accession"] || result["_id"] || "Unknown";
    const title = result["Study Title"] || "No title available";
    const organisms = formatOrganism(result.organism);
    const dataSourceType = result["Data Source Type"] || "";
    const assayTech = result["Study Assay Technology Type"] || "";
    const materialType = result["Material Type"] || "";
    const releaseDate = formatDate(result["Study Public Release Date"]);
    const projectType = result["Project Type"] || "";

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 ${!isExpanded ? "cursor-pointer" : ""}`}
        onClick={() => !isExpanded && toggleCard(index)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-xl font-semibold text-white">
                  {accession}
                </h3>
                {dataSourceType && (
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs font-mono border border-indigo-500/30 uppercase">
                    {dataSourceType}
                  </span>
                )}
                {projectType && (
                  <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded text-xs font-medium border border-amber-500/30">
                    {projectType}
                  </span>
                )}
              </div>
              <p className="text-slate-300 mb-3 line-clamp-2">{title}</p>

              <div className="flex flex-wrap gap-2 mb-1">
                {organisms && (
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium border border-cyan-500/30">
                    {organisms}
                  </span>
                )}
                {assayTech && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                    {assayTech}
                  </span>
                )}
                {materialType && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/30">
                    {materialType}
                  </span>
                )}
                {releaseDate && (
                  <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-xs font-medium border border-white/10">
                    {releaseDate}
                  </span>
                )}
              </div>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 flex-shrink-0 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (isExpanded) setExpandedCard(null);
                else toggleCard(index);
              }}
            >
              <ChevronDownIcon />
            </motion.div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                  {/* Description */}
                  {result["Study Description"] && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-slate-400 text-xs mb-1">Description</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {result["Study Description"]}
                      </p>
                    </div>
                  )}

                  {/* Protocol Description */}
                  {result["Study Protocol Description"] && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-slate-400 text-xs mb-1">
                        Protocol Description
                      </p>
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {result["Study Protocol Description"]}
                      </p>
                    </div>
                  )}

                  {/* Core Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField
                      label="Study Identifier"
                      value={result["Study Identifier"]}
                    />
                    <DetailField
                      label="Accession"
                      value={result["Accession"]}
                    />
                    <DetailField
                      label="Data Source Type"
                      value={result["Data Source Type"]}
                    />
                    <DetailField
                      label="Data Source Accession"
                      value={result["Data Source Accession"]}
                    />
                    <DetailField label="Organism" value={organisms} />
                    <DetailField
                      label="Material Type"
                      value={result["Material Type"]}
                    />
                    <DetailField
                      label="Managing NASA Center"
                      value={result["Managing NASA Center"]}
                    />
                    <DetailField
                      label="Project Title"
                      value={result["Project Title"]}
                    />
                    <DetailField
                      label="Project Type"
                      value={result["Project Type"]}
                    />
                    <DetailField
                      label="Project Identifier"
                      value={result["Project Identifier"]}
                    />
                    <DetailField
                      label="Flight Program"
                      value={result["Flight Program"]}
                    />
                    <DetailField
                      label="Space Program"
                      value={result["Space Program"]}
                    />
                    <DetailField
                      label="Experiment Platform"
                      value={result["Experiment Platform"]}
                    />
                    <DetailField
                      label="ESA Acronym"
                      value={result["ESA Acronym"]}
                    />
                    <DetailField
                      label="Assay Technology Type"
                      value={result["Study Assay Technology Type"]}
                    />
                    <DetailField
                      label="Assay Technology Platform"
                      value={result["Study Assay Technology Platform"]}
                    />
                    <DetailField
                      label="Assay Measurement Type"
                      value={result["Study Assay Measurement Type"]}
                    />
                    <DetailField
                      label="Study Factor Name"
                      value={result["Study Factor Name"]}
                    />
                    <DetailField
                      label="Study Factor Type"
                      value={result["Study Factor Type"]}
                    />
                    <DetailField
                      label="Factor Value"
                      value={result["Factor Value"]}
                    />
                    <DetailField
                      label="Characteristics"
                      value={result["Characteristics"]}
                    />
                    <DetailField
                      label="Parameter Value"
                      value={result["Parameter Value"]}
                    />
                    <DetailField
                      label="Study Grant Number"
                      value={result["Study Grant Number"]}
                    />
                    <DetailField
                      label="Funding Agency"
                      value={result["Study Funding Agency"]}
                    />
                    <DetailField label="Release Date" value={releaseDate} />
                    <DetailField
                      label="Protocol Type"
                      value={result["Study Protocol Type"]}
                    />
                    <DetailField
                      label="Protocol Name"
                      value={result["Study Protocol Name"]}
                    />
                    {result["Mission"] && (
                      <>
                        <DetailField
                          label="Mission Name"
                          value={result["Mission"]?.Name}
                        />
                        <DetailField
                          label="Mission Start"
                          value={formatDate(result["Mission"]?.["Start Date"])}
                        />
                        <DetailField
                          label="Mission End"
                          value={formatDate(result["Mission"]?.["End Date"])}
                        />
                      </>
                    )}
                    {result["Study Person"] && (
                      <DetailField
                        label="Study Person"
                        value={`${result["Study Person"]?.["First Name"] || ""} ${result["Study Person"]?.["Middle Initials"] || ""} ${result["Study Person"]?.["Last Name"] || ""}`.trim()}
                      />
                    )}
                    <DetailField
                      label="Identifiers"
                      value={result["Identifiers"]}
                    />
                  </div>

                  {/* Publication & Authors */}
                  {(result["Study Publication Title"] ||
                    result["Study Publication Author List"]) && (
                    <div className="space-y-3">
                      {result["Study Publication Title"] && (
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-slate-400 text-xs mb-1">
                            Publication Title
                          </p>
                          <p className="text-slate-300 text-sm">
                            {result["Study Publication Title"]}
                          </p>
                        </div>
                      )}
                      {result["Study Publication Author List"] && (
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-slate-400 text-xs mb-1">Authors</p>
                          <p className="text-slate-300 text-sm">
                            {result["Study Publication Author List"]}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Acknowledgments */}
                  {result["Acknowledgments"] && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">
                        Acknowledgments
                      </p>
                      <p className="text-slate-300 text-sm">
                        {result["Acknowledgments"]}
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  {(result["Authoritative Source URL"] ||
                    result["Project Link"]) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {result["Authoritative Source URL"] && (
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-slate-400 text-xs mb-1">
                            Source URL
                          </p>
                          <p className="text-cyan-400 text-sm font-mono break-all">
                            {result["Authoritative Source URL"]}
                          </p>
                        </div>
                      )}
                      {result["Project Link"] && (
                        <div className="p-3 bg-white/5 rounded-lg">
                          <p className="text-slate-400 text-xs mb-1">
                            Project Link
                          </p>
                          <a
                            href={result["Project Link"]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 text-sm font-mono break-all hover:underline"
                          >
                            {result["Project Link"]}
                          </a>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Score */}
                  {result._score && (
                    <div className="p-3 bg-white/5 rounded-lg inline-block">
                      <p className="text-slate-400 text-xs mb-1">
                        Relevance Score
                      </p>
                      <p className="text-cyan-400 font-mono text-sm">
                        {result._score.toFixed(2)}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const renderMissionCard = (mission: any, index: number) => {
    const isExpanded = expandedCard === index;
    const vehicleName = mission.vehicle?.vehicle?.split("/").pop() || "";
    const peopleCount = mission.people?.length || 0;
    const filesCount = mission.files?.length || 0;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 ${!isExpanded ? "cursor-pointer" : ""}`}
        onClick={() => !isExpanded && toggleCard(index)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-xl font-semibold text-white">
                  {mission.identifier}
                </h3>
                {vehicleName && (
                  <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs font-medium border border-indigo-500/30">
                    {vehicleName}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {mission.startDate && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                    Start: {mission.startDate}
                  </span>
                )}
                {mission.endDate && (
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium border border-cyan-500/30">
                    End: {mission.endDate}
                  </span>
                )}
                {peopleCount > 0 && (
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs font-medium border border-emerald-500/30">
                    {peopleCount} Personnel
                  </span>
                )}
                {filesCount > 0 && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium border border-amber-500/30">
                    {filesCount} Files
                  </span>
                )}
              </div>

              {mission.aliases && mission.aliases.length > 0 && (
                <p className="text-slate-400 text-sm">
                  Also known as: {mission.aliases.join(", ")}
                </p>
              )}
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 flex-shrink-0 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (isExpanded) setExpandedCard(null);
                else toggleCard(index);
              }}
            >
              <ChevronDownIcon />
            </motion.div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                  {/* Core Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField
                      label="Mission ID"
                      value={mission.identifier}
                    />
                    <DetailField label="Internal ID" value={mission.id} />
                    <DetailField label="ES ID" value={mission.esID} />
                    <DetailField label="Vehicle" value={vehicleName} />
                    <DetailField label="Start Date" value={mission.startDate} />
                    <DetailField label="End Date" value={mission.endDate} />
                    {mission.aliases && mission.aliases.length > 0 && (
                      <DetailField
                        label="Aliases"
                        value={mission.aliases.join(", ")}
                        fullWidth
                      />
                    )}
                  </div>

                  {/* Version Info */}
                  {mission.versionInfo && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <DetailField
                        label="Version"
                        value={mission.versionInfo.version}
                      />
                      <DetailField
                        label="Document Key"
                        value={mission.versionInfo.documentKey}
                      />
                    </div>
                  )}

                  {/* Parents */}
                  {mission.parents && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-1">
                        Parent Program
                      </p>
                      <p className="text-cyan-400 text-sm font-mono break-all">
                        {mission.parents.parent || "N/A"}
                      </p>
                    </div>
                  )}

                  {/* Files */}
                  {mission.files && mission.files.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Files ({mission.files.length})
                      </p>
                      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {mission.files.map((file: any, idx: number) => {
                          const isObj =
                            typeof file === "object" && file !== null;
                          const fileName = isObj
                            ? getFileName(file.fullPath || file.name || "")
                            : String(file);
                          const size = isObj
                            ? formatFileSize(file.fileSize)
                            : "";
                          const desc = isObj ? file.description : "";
                          const cat = isObj
                            ? getCategoryName(file.category)
                            : "";
                          const created =
                            isObj && file.dateCreated
                              ? formatISODate(file.dateCreated)
                              : "";
                          return (
                            <div
                              key={idx}
                              className="p-3 bg-white/5 rounded-lg"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <svg
                                    className="w-4 h-4 text-cyan-400 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <p
                                    className="text-white text-sm font-medium truncate"
                                    title={isObj ? file.fullPath : fileName}
                                  >
                                    {fileName}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {size && (
                                    <span className="text-slate-400 text-xs font-mono whitespace-nowrap">
                                      {size}
                                    </span>
                                  )}
                                  {isObj && getFileDownloadUrl(file) && (
                                    <>
                                      {isPreviewable(fileName) && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openPreview(file);
                                          }}
                                          title={`Preview ${fileName}`}
                                          className="p-1 rounded hover:bg-white/10 text-purple-400 hover:text-purple-300 transition-colors"
                                        >
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
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                          </svg>
                                        </button>
                                      )}
                                      <a
                                        href={getFileDownloadUrl(file)}
                                        title={`Download ${fileName}`}
                                        className="p-1 rounded hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-colors"
                                      >
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
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                          />
                                        </svg>
                                      </a>
                                    </>
                                  )}
                                </div>
                              </div>
                              {desc && (
                                <p className="text-slate-400 text-xs mt-1.5 ml-6">
                                  {desc}
                                </p>
                              )}
                              <div className="flex gap-3 mt-1.5 ml-6">
                                {cat && (
                                  <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                                    {cat}
                                  </span>
                                )}
                                {created && (
                                  <span className="text-slate-500 text-xs">
                                    {created}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Personnel */}
                  {mission.people && mission.people.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Personnel ({mission.people.length})
                      </p>
                      <div className="max-h-96 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {mission.people.map((person: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs text-cyan-400 font-medium flex-shrink-0">
                              {person.person?.firstName?.[0]}
                              {person.person?.lastName?.[0]}
                            </div>
                            <div className="text-sm flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-white font-medium">
                                  {person.person?.firstName}{" "}
                                  {person.person?.middleName
                                    ? person.person.middleName + " "
                                    : ""}
                                  {person.person?.lastName}
                                </span>
                                {person.roles && person.roles.length > 0 && (
                                  <span className="text-slate-500 text-xs">
                                    · {person.roles.join(", ")}
                                  </span>
                                )}
                              </div>
                              {person.institution && (
                                <p className="text-slate-500 text-xs">
                                  {person.institution}
                                </p>
                              )}
                              {person.person?.emailAddress && (
                                <p className="text-cyan-400/70 text-xs font-mono">
                                  {person.person.emailAddress}
                                </p>
                              )}
                              {person.person?.phone && (
                                <p className="text-slate-500 text-xs">
                                  {person.person.phone}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  const renderExperimentCard = (experiment: any, index: number) => {
    const isExpanded = expandedCard === index;
    const field = experiment._field || {};
    const peopleCount = experiment.people?.length || 0;
    const filesCount = field.files?.length || 0;
    const missionsCount = field.missions?.length || 0;
    const payloadsCount = field.payloads?.length || 0;
    const subjectGroupsCount = field.subjectGroups?.length || 0;

    return (
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className={`rounded-2xl bg-white/[0.03] border border-white/10 overflow-hidden hover:bg-white/[0.06] hover:border-white/20 transition-all duration-300 ${!isExpanded ? "cursor-pointer" : ""}`}
        onClick={() => !isExpanded && toggleCard(index)}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-2 flex-wrap">
                <h3 className="text-xl font-semibold text-white">
                  {experiment.identifier}
                </h3>
                {experiment.status && (
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium border ${
                      experiment.status === "Public"
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                    }`}
                  >
                    {experiment.status}
                  </span>
                )}
                {field.version && (
                  <span className="px-2 py-0.5 bg-white/5 text-slate-400 rounded text-xs font-mono border border-white/10">
                    v{field.version}
                  </span>
                )}
              </div>
              <p className="text-slate-300 mb-3 line-clamp-2">
                {experiment.title || "No title available"}
              </p>
              <div className="flex flex-wrap gap-2">
                {experiment.releaseDate && (
                  <span className="px-3 py-1 bg-white/5 text-slate-400 rounded-full text-xs font-medium border border-white/10">
                    Released: {experiment.releaseDate}
                  </span>
                )}
                {experiment.grantNumber && (
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs font-medium border border-purple-500/30">
                    {experiment.grantNumber}
                  </span>
                )}
                {peopleCount > 0 && (
                  <span className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs font-medium border border-cyan-500/30">
                    {peopleCount} Personnel
                  </span>
                )}
                {filesCount > 0 && (
                  <span className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs font-medium border border-amber-500/30">
                    {filesCount} Files
                  </span>
                )}
                {payloadsCount > 0 && (
                  <span className="px-3 py-1 bg-rose-500/20 text-rose-300 rounded-full text-xs font-medium border border-rose-500/30">
                    {payloadsCount} Payloads
                  </span>
                )}
              </div>
            </div>

            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.3 }}
              className="ml-4 flex-shrink-0 cursor-pointer p-1 rounded-lg hover:bg-white/10 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                if (isExpanded) setExpandedCard(null);
                else toggleCard(index);
              }}
            >
              <ChevronDownIcon />
            </motion.div>
          </div>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-6 border-t border-white/10 space-y-4">
                  {/* Core Details Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <DetailField
                      label="Experiment ID"
                      value={field.experimentID}
                    />
                    <DetailField label="OS ID" value={field.osID} />
                    <DetailField label="Internal ID" value={field.id} />
                    <DetailField label="Status" value={field.status} />
                    <DetailField label="Version" value={field.version} />
                    <DetailField
                      label="Version Reason"
                      value={field.versionReason}
                    />
                    {field.versionReasonFreetext && (
                      <DetailField
                        label="Version Note"
                        value={field.versionReasonFreetext}
                      />
                    )}
                    <DetailField
                      label="Public"
                      value={field.public ? "Yes" : "No"}
                    />
                    <DetailField
                      label="Grant Number"
                      value={field.grantNumber}
                    />
                    <DetailField
                      label="Grant End Date"
                      value={field.grantEndDate}
                    />
                    <DetailField
                      label="Release Date"
                      value={field.releaseDate}
                    />
                    <DetailField label="Update Date" value={field.updateDate} />
                    {field.aliases && field.aliases.length > 0 && (
                      <DetailField
                        label="Aliases"
                        value={field.aliases.join(", ")}
                        fullWidth
                      />
                    )}
                  </div>

                  {/* Title */}
                  {field.title && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-slate-400 text-xs mb-1">Full Title</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {field.title}
                      </p>
                    </div>
                  )}

                  {/* Objectives */}
                  {field.objectives && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-slate-400 text-xs mb-1">Objectives</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {field.objectives}
                      </p>
                    </div>
                  )}

                  {/* Approach */}
                  {field.approach && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-slate-400 text-xs mb-1">Approach</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {field.approach}
                      </p>
                    </div>
                  )}

                  {/* Results */}
                  {field.results && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-slate-400 text-xs mb-1">Results</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {field.results}
                      </p>
                    </div>
                  )}

                  {/* Protocol */}
                  {field.protocol && (
                    <div className="p-4 bg-white/5 rounded-xl">
                      <p className="text-slate-400 text-xs mb-1">Protocol</p>
                      <p className="text-slate-300 text-sm leading-relaxed">
                        {field.protocol}
                      </p>
                    </div>
                  )}

                  {/* Sponsoring Agency */}
                  {field.sponsoringAgency && (
                    <DetailField
                      label="Sponsoring Agency"
                      value={
                        typeof field.sponsoringAgency === "object"
                          ? field.sponsoringAgency.annotationValue ||
                            JSON.stringify(field.sponsoringAgency)
                          : field.sponsoringAgency
                      }
                    />
                  )}

                  {/* Research Areas */}
                  {field.researchAreas && field.researchAreas.length > 0 && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-2">
                        Research Areas
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {field.researchAreas.map((area: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs border border-indigo-500/30"
                          >
                            {area.annotationValue || area}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* NASA Programs */}
                  {field.nasaPrograms && field.nasaPrograms.length > 0 && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-2">
                        NASA Programs
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {field.nasaPrograms.map((prog: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs border border-cyan-500/30"
                          >
                            {prog.annotationValue || prog}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Managing NASA Centers */}
                  {field.managingNasaCenters &&
                    field.managingNasaCenters.length > 0 && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-slate-400 text-xs mb-2">
                          Managing NASA Centers
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {field.managingNasaCenters.map(
                            (center: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-emerald-500/20 text-emerald-300 rounded-full text-xs border border-emerald-500/30"
                              >
                                {center.annotationValue || center}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Factors */}
                  {field.factors && field.factors.length > 0 && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-2">
                        Factors ({field.factors.length})
                      </p>
                      <div className="flex flex-wrap gap-2 max-h-60 overflow-y-auto scrollbar-thin">
                        {field.factors.map((factor: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-amber-500/20 text-amber-300 rounded-full text-xs border border-amber-500/30"
                          >
                            {factor.annotationValue ||
                              factor.name ||
                              JSON.stringify(factor)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Missions */}
                  {field.missions && field.missions.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Related Missions ({field.missions.length})
                      </p>
                      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {field.missions.map((m: any, idx: number) => (
                          <div key={idx} className="p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <span className="text-white font-medium text-sm">
                                {m.identifier}
                              </span>
                              {m.startDate && (
                                <span className="text-slate-400 text-xs">
                                  Start: {m.startDate}
                                </span>
                              )}
                              {m.endDate && (
                                <span className="text-slate-400 text-xs">
                                  End: {m.endDate}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Payloads */}
                  {field.payloads && field.payloads.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Payloads ({field.payloads.length})
                      </p>
                      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {field.payloads.map((p: any, idx: number) => (
                          <div key={idx} className="p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-white font-medium text-sm">
                                {p.identifier}
                              </span>
                              {p.payloadName && (
                                <span className="text-slate-300 text-sm">
                                  — {p.payloadName}
                                </span>
                              )}
                              {p.type?.annotationValue && (
                                <span className="px-2 py-0.5 bg-rose-500/20 text-rose-300 rounded text-xs border border-rose-500/30">
                                  {p.type.annotationValue}
                                </span>
                              )}
                            </div>
                            {p.description && (
                              <p className="text-slate-400 text-xs mt-1">
                                {p.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subject Groups */}
                  {field.subjectGroups && field.subjectGroups.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Subject Groups ({field.subjectGroups.length})
                      </p>
                      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {field.subjectGroups.map((sg: any, idx: number) => (
                          <div key={idx} className="p-3 bg-white/5 rounded-lg">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-white font-medium text-sm">
                                Group {sg.identifier}
                              </span>
                              {sg.scientificName?.annotationValue && (
                                <span className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-xs font-mono border border-cyan-500/30">
                                  {sg.scientificName.annotationValue}
                                </span>
                              )}
                              {sg.commonName?.annotationValue && (
                                <span className="text-slate-300 text-sm">
                                  ({sg.commonName.annotationValue})
                                </span>
                              )}
                            </div>
                            {sg.description && (
                              <p className="text-slate-400 text-xs mt-1">
                                {sg.description}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Publications */}
                  {field.publications && field.publications.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Publications ({field.publications.length})
                      </p>
                      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {field.publications.map((pub: any, idx: number) => {
                          const title =
                            typeof pub === "string"
                              ? pub
                              : pub.title || pub.annotationValue || "";
                          const authors = pub.authors || pub.author || "";
                          const journal = pub.journal || pub.source || "";
                          const year =
                            pub.year || pub.date || pub.publicationDate || "";
                          const doi = pub.doi || pub.DOI || "";
                          const pmid = pub.pmid || pub.PMID || "";
                          return (
                            <div
                              key={idx}
                              className="p-3 bg-white/5 rounded-lg"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500/20 to-cyan-500/20 border border-white/10 flex items-center justify-center text-xs text-purple-400 font-medium flex-shrink-0 mt-0.5">
                                  {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-white text-sm leading-relaxed">
                                    {title || JSON.stringify(pub)}
                                  </p>
                                  {authors && (
                                    <p className="text-slate-500 text-xs mt-1">
                                      {typeof authors === "string"
                                        ? authors
                                        : Array.isArray(authors)
                                          ? authors.join(", ")
                                          : ""}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap gap-2 mt-1.5">
                                    {journal && (
                                      <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 italic">
                                        {journal}
                                      </span>
                                    )}
                                    {year && (
                                      <span className="text-xs px-2 py-0.5 bg-white/5 text-slate-400 rounded border border-white/10">
                                        {year}
                                      </span>
                                    )}
                                    {doi && (
                                      <a
                                        href={`https://doi.org/${doi}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded border border-cyan-500/30 hover:bg-cyan-500/30 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        DOI: {doi}
                                      </a>
                                    )}
                                    {pmid && (
                                      <a
                                        href={`https://pubmed.ncbi.nlm.nih.gov/${pmid}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs px-2 py-0.5 bg-emerald-500/20 text-emerald-300 rounded border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        PMID: {pmid}
                                      </a>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Hardware */}
                  {field.hardware && field.hardware.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Hardware ({field.hardware.length})
                      </p>
                      <div className="max-h-96 overflow-y-auto space-y-3 pr-1 scrollbar-thin">
                        {field.hardware.map((hwEntry: any, idx: number) => {
                          const hw = hwEntry.hardware || hwEntry;
                          const versionName = hwEntry.versionName || "";
                          const versionDesc = hwEntry.versionDescription || "";
                          const name = hw.name || hw.annotationValue || "";
                          const desc = hw.description || "";
                          const identifier = hw.identifier || "";
                          const components = hw.components || [];
                          const hwFiles = hw.files || hwEntry.files || [];
                          return (
                            <div
                              key={idx}
                              className="p-4 bg-white/5 rounded-lg border border-white/5"
                            >
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
                                  <svg
                                    className="w-4 h-4 text-amber-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h4 className="text-white font-medium text-sm">
                                      {name || JSON.stringify(hwEntry)}
                                    </h4>
                                    {identifier && (
                                      <span className="text-xs px-1.5 py-0.5 bg-white/5 text-slate-500 rounded font-mono border border-white/10">
                                        #{identifier}
                                      </span>
                                    )}
                                  </div>
                                  {versionName && (
                                    <span className="inline-block mt-1 text-xs px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                                      {versionName}
                                    </span>
                                  )}
                                  {desc && (
                                    <p className="text-slate-400 text-xs mt-2 leading-relaxed">
                                      {desc}
                                    </p>
                                  )}
                                  {versionDesc && versionDesc !== desc && (
                                    <div className="mt-2 p-2 bg-white/5 rounded">
                                      <p className="text-slate-500 text-xs leading-relaxed">
                                        {versionDesc}
                                      </p>
                                    </div>
                                  )}
                                  {components.length > 0 && (
                                    <div className="mt-2">
                                      <p className="text-slate-500 text-xs mb-1">
                                        Components:
                                      </p>
                                      <div className="flex flex-wrap gap-1">
                                        {components.map(
                                          (c: any, ci: number) => (
                                            <span
                                              key={ci}
                                              className="text-xs px-2 py-0.5 bg-white/5 text-slate-400 rounded border border-white/10"
                                            >
                                              {typeof c === "string"
                                                ? c
                                                : c.name || JSON.stringify(c)}
                                            </span>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                                  {hwFiles.length > 0 && (
                                    <p className="text-slate-500 text-xs mt-1.5">
                                      {hwFiles.length} file
                                      {hwFiles.length !== 1 ? "s" : ""} attached
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Related Studies */}
                  {field.relatedStudies && field.relatedStudies.length > 0 && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-2">
                        Related Studies
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {field.relatedStudies.map((s: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs border border-indigo-500/30"
                          >
                            {typeof s === "string"
                              ? s
                              : s.identifier || JSON.stringify(s)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Related Experiments */}
                  {field.relatedExperiments &&
                    field.relatedExperiments.length > 0 && (
                      <div className="p-3 bg-white/5 rounded-lg">
                        <p className="text-slate-400 text-xs mb-2">
                          Related Experiments
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {field.relatedExperiments.map(
                            (e: any, idx: number) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                              >
                                {typeof e === "string"
                                  ? e
                                  : e.identifier || JSON.stringify(e)}
                              </span>
                            ),
                          )}
                        </div>
                      </div>
                    )}

                  {/* Files */}
                  {field.files && field.files.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Files ({field.files.length})
                      </p>
                      <div className="max-h-80 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {field.files.map((file: any, idx: number) => {
                          const isObj =
                            typeof file === "object" && file !== null;
                          const fileName = isObj
                            ? getFileName(
                                file.fullPath ||
                                  file.fileName ||
                                  file.name ||
                                  "",
                              )
                            : String(file);
                          const size = isObj
                            ? formatFileSize(file.fileSize)
                            : "";
                          const desc = isObj ? file.description : "";
                          const cat = isObj
                            ? getCategoryName(file.category)
                            : "";
                          const created =
                            isObj && file.dateCreated
                              ? formatISODate(file.dateCreated)
                              : "";
                          const modified =
                            isObj && file.dateModified
                              ? formatISODate(file.dateModified)
                              : "";
                          const version =
                            isObj && file.version ? `v${file.version}` : "";
                          return (
                            <div
                              key={idx}
                              className="p-3 bg-white/5 rounded-lg"
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex items-center gap-2 min-w-0 flex-1">
                                  <svg
                                    className="w-4 h-4 text-cyan-400 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                                    />
                                  </svg>
                                  <p
                                    className="text-white text-sm font-medium truncate"
                                    title={isObj ? file.fullPath : fileName}
                                  >
                                    {fileName}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2 flex-shrink-0">
                                  {size && (
                                    <span className="text-slate-400 text-xs font-mono whitespace-nowrap">
                                      {size}
                                    </span>
                                  )}
                                  {isObj && getFileDownloadUrl(file) && (
                                    <>
                                      {isPreviewable(fileName) && (
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openPreview(file);
                                          }}
                                          title={`Preview ${fileName}`}
                                          className="p-1 rounded hover:bg-white/10 text-purple-400 hover:text-purple-300 transition-colors"
                                        >
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
                                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                            />
                                            <path
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                              strokeWidth={2}
                                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                                            />
                                          </svg>
                                        </button>
                                      )}
                                      <a
                                        href={getFileDownloadUrl(file)}
                                        title={`Download ${fileName}`}
                                        className="p-1 rounded hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-colors"
                                      >
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
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                                          />
                                        </svg>
                                      </a>
                                    </>
                                  )}
                                </div>
                              </div>
                              {desc && (
                                <p className="text-slate-400 text-xs mt-1.5 ml-6">
                                  {desc}
                                </p>
                              )}
                              <div className="flex flex-wrap gap-3 mt-1.5 ml-6">
                                {cat && (
                                  <span className="text-xs px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded border border-indigo-500/30">
                                    {cat}
                                  </span>
                                )}
                                {version && (
                                  <span className="text-xs px-2 py-0.5 bg-white/5 text-slate-400 rounded border border-white/10">
                                    {version}
                                  </span>
                                )}
                                {created && (
                                  <span className="text-slate-500 text-xs">
                                    Created: {created}
                                  </span>
                                )}
                                {modified && modified !== created && (
                                  <span className="text-slate-500 text-xs">
                                    Modified: {modified}
                                  </span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Studies */}
                  {field.studies && field.studies.length > 0 && (
                    <div className="p-3 bg-white/5 rounded-lg">
                      <p className="text-slate-400 text-xs mb-2">
                        Studies ({field.studies.length})
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {field.studies.map((s: any, idx: number) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-cyan-500/20 text-cyan-300 rounded-full text-xs border border-cyan-500/30"
                          >
                            {typeof s === "string"
                              ? s
                              : s.identifier || JSON.stringify(s)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Personnel */}
                  {experiment.people && experiment.people.length > 0 && (
                    <div>
                      <p className="text-slate-400 text-xs mb-2">
                        Personnel ({experiment.people.length})
                      </p>
                      <div className="max-h-96 overflow-y-auto space-y-2 pr-1 scrollbar-thin">
                        {experiment.people.map((person: any, idx: number) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 p-3 bg-white/5 rounded-lg"
                          >
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center text-xs text-cyan-400 font-medium flex-shrink-0">
                              {person.person?.firstName?.[0]}
                              {person.person?.lastName?.[0]}
                            </div>
                            <div className="text-sm flex-1 min-w-0">
                              <div className="flex items-baseline gap-2 flex-wrap">
                                <span className="text-white font-medium">
                                  {person.person?.firstName}{" "}
                                  {person.person?.middleName
                                    ? person.person.middleName + " "
                                    : ""}
                                  {person.person?.lastName}
                                </span>
                                {person.roles && person.roles.length > 0 && (
                                  <span className="text-slate-500 text-xs">
                                    ·{" "}
                                    {person.roles
                                      .map((r: any) => r.annotationValue || r)
                                      .join(", ")}
                                  </span>
                                )}
                              </div>
                              {person.institution?.annotationValue && (
                                <p className="text-slate-500 text-xs">
                                  {person.institution.annotationValue}
                                </p>
                              )}
                              {person.person?.emailAddress && (
                                <p className="text-cyan-400/70 text-xs font-mono">
                                  {person.person.emailAddress}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-white">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/15 via-transparent to-cyan-900/10" />
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <svg
                  className="w-6 h-6 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                  />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  Open Science Data Repository
                </h1>
                <p className="text-sm text-slate-400">
                  Search space biology datasets, missions &amp; experiments
                </p>
              </div>
            </div>

            {/* Type Tabs */}
            <div className="flex gap-2 p-1 rounded-xl bg-white/5 border border-white/10">
              {(["datasets", "missions", "experiments"] as SearchType[]).map(
                (type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSearchType(type);
                      setResults([]);
                      setError(null);
                      setTotalHits(0);
                    }}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
                      searchType === type
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "text-slate-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {type}
                  </button>
                ),
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Search Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-sm">
            <div className="space-y-4">
              {/* Dataset Search */}
              {searchType === "datasets" && (
                <>
                  <div className="flex gap-3">
                    <div className="flex-1 relative">
                      <SearchIcon />
                      <input
                        type="text"
                        placeholder="Search terms (e.g., 'mouse liver', 'cancer', 'spaceflight')"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full pl-4 pr-4 py-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 transition-all"
                      />
                    </div>
                    <button
                      onClick={handleSearch}
                      disabled={loading}
                      className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 transition-all"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                          Searching...
                        </span>
                      ) : (
                        "Search"
                      )}
                    </button>
                  </div>

                  {/* Toggle Filters */}
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-sm text-slate-400 hover:text-cyan-400 transition-colors"
                  >
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
                        d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                      />
                    </svg>
                    {showFilters ? "Hide Filters" : "Show Filters"}
                  </button>

                  {/* Advanced Filters */}
                  <AnimatePresence>
                    {showFilters && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                          {/* Data Source */}
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                              Data Source
                            </label>
                            <select
                              value={dataSource}
                              onChange={(e) => setDataSource(e.target.value)}
                              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-all"
                            >
                              {DATA_SOURCES.map((ds) => (
                                <option
                                  key={ds.value}
                                  value={ds.value}
                                  className="bg-[#0B0F1A] text-white"
                                >
                                  {ds.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Sort */}
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                              Sort By
                            </label>
                            <div className="flex gap-2">
                              <select
                                value={sortField}
                                onChange={(e) => setSortField(e.target.value)}
                                className="flex-1 px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-all"
                              >
                                {SORT_OPTIONS.map((opt) => (
                                  <option
                                    key={opt.value}
                                    value={opt.value}
                                    className="bg-[#0B0F1A] text-white"
                                  >
                                    {opt.label}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() =>
                                  setSortOrder(
                                    sortOrder === "ASC" ? "DESC" : "ASC",
                                  )
                                }
                                className="px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm hover:border-cyan-500/50 transition-all"
                                title={
                                  sortOrder === "ASC"
                                    ? "Ascending"
                                    : "Descending"
                                }
                              >
                                {sortOrder === "ASC" ? "↑" : "↓"}
                              </button>
                            </div>
                          </div>

                          {/* Filter Field */}
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                              Filter By
                            </label>
                            <select
                              value={filterField}
                              onChange={(e) => setFilterField(e.target.value)}
                              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none transition-all"
                            >
                              {FILTER_FIELDS.map((ff) => (
                                <option
                                  key={ff.value}
                                  value={ff.value}
                                  className="bg-[#0B0F1A] text-white"
                                >
                                  {ff.label}
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Filter Value */}
                          <div>
                            <label className="block text-xs font-medium text-slate-400 mb-1.5">
                              Filter Value
                            </label>
                            <input
                              type="text"
                              value={filterValue}
                              onChange={(e) => setFilterValue(e.target.value)}
                              placeholder={
                                filterField
                                  ? "e.g., Mus musculus"
                                  : "Select filter first"
                              }
                              disabled={!filterField}
                              className="w-full px-3 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-500 focus:outline-none disabled:opacity-30 transition-all"
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )}

              {/* Mission / Experiment Load */}
              {(searchType === "missions" || searchType === "experiments") && (
                <button
                  onClick={handleSearch}
                  disabled={loading}
                  className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50 transition-all"
                >
                  <SearchIcon />
                  {loading
                    ? "Loading..."
                    : `Load All ${searchType === "missions" ? "Missions" : "Experiments"}`}
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-300 flex items-start gap-3"
            >
              <svg
                className="w-5 h-5 flex-shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.07 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="p-5 rounded-2xl bg-white/[0.03] border border-white/10 animate-pulse"
                >
                  <div className="space-y-3">
                    <div className="h-6 bg-white/10 rounded w-1/3" />
                    <div className="h-4 bg-white/10 rounded w-3/4" />
                    <div className="flex gap-2">
                      <div className="h-6 bg-white/10 rounded-full w-24" />
                      <div className="h-6 bg-white/10 rounded-full w-32" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-4"
            >
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-cyan-400 font-medium mb-4 flex items-center gap-2"
              >
                <SearchIcon />
                Found {results.length} result{results.length !== 1 ? "s" : ""} •
                Showing {startIndex + 1}-{Math.min(endIndex, results.length)}
                {searchType === "datasets" && totalHits > results.length && (
                  <span className="text-slate-500">
                    {" "}
                    (from {totalHits.toLocaleString()} total matches)
                  </span>
                )}
              </motion.p>

              {currentResults.map((result, index) => {
                if (searchType === "missions") {
                  return renderMissionCard(result, index);
                } else if (searchType === "experiments") {
                  return renderExperimentCard(result, index);
                } else {
                  return renderDatasetCard(result, index);
                }
              })}

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mt-8 flex items-center justify-center gap-2"
                >
                  <button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeftIcon />
                  </button>

                  <div className="flex gap-2">
                    {getPageNumbers().map((page, index) =>
                      typeof page === "number" ? (
                        <button
                          key={index}
                          onClick={() => goToPage(page)}
                          className={`min-w-[44px] px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                            currentPage === page
                              ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                              : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10 hover:text-white"
                          }`}
                        >
                          {page}
                        </button>
                      ) : (
                        <span key={index} className="px-2 py-2 text-slate-500">
                          {page}
                        </span>
                      ),
                    )}
                  </div>

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronRightIcon />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ) : (
            !loading &&
            !error && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                {/* Trending Research Topics */}
                <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <svg
                      className="w-6 h-6 text-emerald-400"
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
                      Trending Research Areas
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {[
                      {
                        query: "spaceflight",
                        icon: "🚀",
                        desc: "Spaceflight Effects",
                        count: "234 datasets",
                      },
                      {
                        query: "microgravity",
                        icon: "🌌",
                        desc: "Microgravity Studies",
                        count: "189 datasets",
                      },
                      {
                        query: "radiation",
                        icon: "☢️",
                        desc: "Radiation Research",
                        count: "156 datasets",
                      },
                      {
                        query: "mouse",
                        icon: "🐁",
                        desc: "Mouse Studies",
                        count: "421 datasets",
                      },
                      {
                        query: "muscle",
                        icon: "💪",
                        desc: "Muscle Atrophy",
                        count: "98 datasets",
                      },
                      {
                        query: "gene expression",
                        icon: "🧬",
                        desc: "Gene Expression",
                        count: "312 datasets",
                      },
                    ].map((topic) => (
                      <button
                        key={topic.query}
                        onClick={() => {
                          setSearchQuery(topic.query);
                          setTimeout(handleSearch, 100);
                        }}
                        className="p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-gradient-to-br hover:from-emerald-500/10 hover:to-cyan-500/10 hover:border-emerald-500/30 transition-all text-left group"
                      >
                        <div className="flex items-start gap-3">
                          <span className="text-2xl">{topic.icon}</span>
                          <div className="flex-1">
                            <p className="font-medium text-white group-hover:text-emerald-400 transition-colors">
                              {topic.desc}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {topic.count}
                            </p>
                          </div>
                          <svg
                            className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors"
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
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Search Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🧪</span>
                      <h4 className="text-lg font-semibold text-white">
                        Organisms
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Mus musculus",
                        "Arabidopsis",
                        "C. elegans",
                        "Human",
                        "Drosophila",
                      ].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setTimeout(handleSearch, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-emerald-500/10 hover:text-emerald-400 hover:border-emerald-500/30 border border-transparent transition-all text-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🔬</span>
                      <h4 className="text-lg font-semibold text-white">
                        Assay Types
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {[
                        "RNA sequencing",
                        "Proteomics",
                        "Metabolomics",
                        "Microarray",
                        "Mass spectrometry",
                      ].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setTimeout(handleSearch, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 border border-transparent transition-all text-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/[0.03] border border-white/10 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-2xl">🏢</span>
                      <h4 className="text-lg font-semibold text-white">
                        NASA Centers
                      </h4>
                    </div>
                    <div className="space-y-2">
                      {[
                        "Ames Research Center",
                        "Kennedy Space Center",
                        "Johnson Space Center",
                        "Glenn Research Center",
                        "Marshall Space Flight",
                      ].map((term) => (
                        <button
                          key={term}
                          onClick={() => {
                            setSearchQuery(term);
                            setTimeout(handleSearch, 100);
                          }}
                          className="w-full text-left px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-purple-500/10 hover:text-purple-400 hover:border-purple-500/30 border border-transparent transition-all text-sm"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )
          )}
        </AnimatePresence>
      </main>

      {/* File Preview Modal */}
      <AnimatePresence>
        {previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            onClick={() => setPreviewFile(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-5xl max-h-[90vh] rounded-2xl bg-white/[0.03] border border-white/10 backdrop-blur-xl overflow-hidden flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <div className="flex items-center gap-3 min-w-0">
                  <svg
                    className="w-5 h-5 text-purple-400 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <h3 className="text-white font-medium text-sm truncate">
                    {previewFile.name}
                  </h3>
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded border border-purple-500/30 flex-shrink-0">
                    {previewFile.type}
                  </span>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <a
                    href={previewFile.url.replace("/preview?", "/download?")}
                    className="p-2 rounded-lg hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-colors"
                    title="Download file"
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                  </a>
                  <a
                    href={previewFile.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-slate-300 transition-colors"
                    title="Open in new tab"
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
                        d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                      />
                    </svg>
                  </a>
                  <button
                    onClick={() => setPreviewFile(null)}
                    className="p-2 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    title="Close preview"
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
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Content */}
              <div
                className="flex-1 overflow-auto p-1 min-h-0"
                style={{ maxHeight: "calc(90vh - 64px)" }}
              >
                {previewFile.type === "image" && (
                  <div className="flex items-center justify-center h-full p-4">
                    <img
                      src={previewFile.url}
                      alt={previewFile.name}
                      className="max-w-full max-h-full object-contain rounded-lg"
                    />
                  </div>
                )}
                {previewFile.type === "pdf" && (
                  <iframe
                    src={previewFile.url}
                    className="w-full h-full min-h-[70vh] rounded-lg"
                    title={previewFile.name}
                  />
                )}
                {previewFile.type === "text" && (
                  <iframe
                    src={previewFile.url}
                    className="w-full h-full min-h-[70vh] rounded-lg bg-white"
                    title={previewFile.name}
                  />
                )}
                {previewFile.type === "video" && (
                  <div className="flex items-center justify-center h-full p-4">
                    <video
                      controls
                      className="max-w-full max-h-full rounded-lg"
                    >
                      <source src={previewFile.url} />
                      Your browser does not support video playback.
                    </video>
                  </div>
                )}
                {previewFile.type === "audio" && (
                  <div className="flex items-center justify-center h-full p-8">
                    <audio controls className="w-full max-w-lg">
                      <source src={previewFile.url} />
                      Your browser does not support audio playback.
                    </audio>
                  </div>
                )}
                {previewFile.type === "unknown" && (
                  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
                    <svg
                      className="w-16 h-16 text-slate-500 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-slate-400 text-sm">
                      Preview not available for this file type
                    </p>
                    <p className="text-slate-500 text-xs mt-1">
                      Use the download button to save the file
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
