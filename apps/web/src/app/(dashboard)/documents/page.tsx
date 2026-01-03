'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FileText,
  Upload,
  Search,
  Filter,
  MoreHorizontal,
  Download,
  Trash2,
  Eye,
  Share2,
  Folder,
  File,
  Image,
  FileImage,
  Plus,
  ChevronDown,
  Check,
  X,
  Clock,
  Calendar,
  Tag,
  Cloud,
  Shield,
  AlertCircle,
} from 'lucide-react';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'doc' | 'other';
  category: string;
  size: string;
  uploadedAt: string;
  tripId?: string;
  tripName?: string;
  status: 'verified' | 'pending' | 'expired';
  expiryDate?: string;
}

const mockDocuments: Document[] = [
  { id: '1', name: 'Flight Confirmation - Tokyo.pdf', type: 'pdf', category: 'flights', size: '245 KB', uploadedAt: '2024-03-10', tripId: '1', tripName: 'Japan Adventure', status: 'verified' },
  { id: '2', name: 'Hotel Booking - Park Hyatt.pdf', type: 'pdf', category: 'hotels', size: '180 KB', uploadedAt: '2024-03-08', tripId: '1', tripName: 'Japan Adventure', status: 'verified' },
  { id: '3', name: 'JR Pass Voucher.pdf', type: 'pdf', category: 'transport', size: '120 KB', uploadedAt: '2024-03-05', tripId: '1', tripName: 'Japan Adventure', status: 'pending' },
  { id: '4', name: 'Travel Insurance Policy.pdf', type: 'pdf', category: 'insurance', size: '340 KB', uploadedAt: '2024-03-01', status: 'verified', expiryDate: '2024-06-01' },
  { id: '5', name: 'Passport Scan.jpg', type: 'image', category: 'identity', size: '1.2 MB', uploadedAt: '2024-02-15', status: 'verified', expiryDate: '2028-05-20' },
  { id: '6', name: 'Visa Approval.pdf', type: 'pdf', category: 'visa', size: '85 KB', uploadedAt: '2024-02-20', status: 'verified', expiryDate: '2024-09-15' },
  { id: '7', name: 'Emergency Contacts.pdf', type: 'pdf', category: 'other', size: '45 KB', uploadedAt: '2024-02-01', status: 'verified' },
  { id: '8', name: 'Vaccination Certificate.jpg', type: 'image', category: 'health', size: '520 KB', uploadedAt: '2024-01-15', status: 'verified' },
];

const categories = [
  { id: 'all', name: 'All Documents', icon: Folder },
  { id: 'flights', name: 'Flights', icon: FileText },
  { id: 'hotels', name: 'Hotels', icon: FileText },
  { id: 'transport', name: 'Transport', icon: FileText },
  { id: 'insurance', name: 'Insurance', icon: Shield },
  { id: 'identity', name: 'Identity', icon: FileImage },
  { id: 'visa', name: 'Visa', icon: FileText },
  { id: 'health', name: 'Health', icon: FileText },
  { id: 'other', name: 'Other', icon: File },
];

const typeIcons = {
  pdf: FileText,
  image: Image,
  doc: FileText,
  other: File,
};

const typeColors = {
  pdf: 'red',
  image: 'blue',
  doc: 'violet',
  other: 'slate',
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function DocumentsPage() {
  const [selectedCategory, setSelectedCategory] = React.useState('all');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [viewMode, setViewMode] = React.useState<'grid' | 'list'>('grid');
  const [selectedDocs, setSelectedDocs] = React.useState<string[]>([]);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  const filteredDocuments = mockDocuments.filter((doc) => {
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch = searchQuery === '' || doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleSelection = (docId: string) => {
    setSelectedDocs((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const getStatusBadge = (doc: Document) => {
    const isExpiringSoon = doc.expiryDate && new Date(doc.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    
    if (doc.status === 'expired' || (doc.expiryDate && new Date(doc.expiryDate) < new Date())) {
      return (
        <span className="flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <AlertCircle className="h-3 w-3" />
          Expired
        </span>
      );
    }
    if (isExpiringSoon) {
      return (
        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock className="h-3 w-3" />
          Expiring Soon
        </span>
      );
    }
    if (doc.status === 'pending') {
      return (
        <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock className="h-3 w-3" />
          Pending
        </span>
      );
    }
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
        <Check className="h-3 w-3" />
        Verified
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-20 dark:bg-slate-950">
      {/* Header */}
      <div className="border-b border-slate-200 bg-white px-4 py-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                Documents
              </h1>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {mockDocuments.length} documents • {mockDocuments.filter((d) => d.status === 'verified').length} verified
              </p>
            </div>
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 px-6 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-105"
            >
              <Upload className="h-4 w-4" />
              Upload Document
            </button>
          </div>

          {/* Search and Filters */}
          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search documents..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:focus:bg-slate-800"
              />
            </div>
            
            {selectedDocs.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {selectedDocs.length} selected
                </span>
                <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
                  <Download className="h-4 w-4" />
                </button>
                <button className="rounded-lg p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Sidebar Categories */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 rounded-2xl bg-white p-4 shadow-sm dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                Categories
              </h3>
              <div className="mt-3 space-y-1">
                {categories.map((cat) => {
                  const count = cat.id === 'all' 
                    ? mockDocuments.length 
                    : mockDocuments.filter((d) => d.category === cat.id).length;
                  const Icon = cat.icon;
                  
                  return (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
                        selectedCategory === cat.id
                          ? 'bg-primary-50 text-primary-600 dark:bg-primary-900/20 dark:text-primary-400'
                          : 'text-slate-600 hover:bg-slate-50 dark:text-slate-400 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4" />
                        <span>{cat.name}</span>
                      </div>
                      <span className="text-xs text-slate-400">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick Stats */}
              <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
                <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                  Storage
                </h3>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-500 dark:text-slate-400">Used</span>
                    <span className="font-medium text-slate-900 dark:text-white">2.8 MB</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className="h-full w-1/4 rounded-full bg-primary-500" />
                  </div>
                  <p className="mt-1 text-xs text-slate-400">
                    2.8 MB of 100 MB used
                  </p>
                </div>
              </div>

              {/* Cloud Sync */}
              <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800">
                <div className="flex items-center gap-2">
                  <Cloud className="h-5 w-5 text-emerald-500" />
                  <div>
                    <p className="text-sm font-medium text-slate-900 dark:text-white">
                      Cloud Synced
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Last sync: 2 min ago
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Grid */}
          <div className="lg:col-span-3">
            {filteredDocuments.length === 0 ? (
              <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 py-16 dark:border-slate-700">
                <FileText className="h-16 w-16 text-slate-300 dark:text-slate-600" />
                <h3 className="mt-4 text-lg font-medium text-slate-900 dark:text-white">
                  No documents found
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {searchQuery ? 'Try adjusting your search' : 'Upload your first document'}
                </p>
                <button
                  onClick={() => setShowUploadModal(true)}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-700"
                >
                  <Upload className="h-4 w-4" />
                  Upload Document
                </button>
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
              >
                {filteredDocuments.map((doc) => {
                  const Icon = typeIcons[doc.type];
                  const color = typeColors[doc.type];
                  const isSelected = selectedDocs.includes(doc.id);

                  return (
                    <motion.div
                      key={doc.id}
                      variants={itemVariants}
                      className={`group relative rounded-xl border-2 bg-white p-4 transition-all hover:shadow-md dark:bg-slate-900 ${
                        isSelected
                          ? 'border-primary-500 ring-2 ring-primary-500/20'
                          : 'border-slate-100 dark:border-slate-800'
                      }`}
                    >
                      {/* Selection Checkbox */}
                      <button
                        onClick={() => toggleSelection(doc.id)}
                        className={`absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded border transition-colors ${
                          isSelected
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-slate-300 bg-white opacity-0 group-hover:opacity-100 dark:border-slate-600 dark:bg-slate-800'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                      </button>

                      {/* Document Icon */}
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${color}-100 text-${color}-600 dark:bg-${color}-900/30 dark:text-${color}-400`}
                        >
                          <Icon className="h-6 w-6" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="truncate font-medium text-slate-900 dark:text-white">
                            {doc.name}
                          </h4>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {doc.size} • {new Date(doc.uploadedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      {/* Trip Tag */}
                      {doc.tripName && (
                        <div className="mt-3 flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                          <Tag className="h-3 w-3" />
                          {doc.tripName}
                        </div>
                      )}

                      {/* Status & Expiry */}
                      <div className="mt-3 flex items-center justify-between">
                        {getStatusBadge(doc)}
                        {doc.expiryDate && (
                          <span className="flex items-center gap-1 text-xs text-slate-400">
                            <Calendar className="h-3 w-3" />
                            Exp: {new Date(doc.expiryDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                        <button className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                          <Eye className="h-3.5 w-3.5" />
                          View
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                          <Download className="h-3.5 w-3.5" />
                          Download
                        </button>
                        <button className="flex flex-1 items-center justify-center gap-1 rounded-lg py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800">
                          <Share2 className="h-3.5 w-3.5" />
                          Share
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      <AnimatePresence>
        {showUploadModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
            onClick={() => setShowUploadModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  Upload Document
                </h3>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  // Handle file drop
                }}
                className={`mt-6 flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                  isDragging
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : 'border-slate-200 dark:border-slate-700'
                }`}
              >
                <Upload className="h-12 w-12 text-slate-300 dark:text-slate-600" />
                <p className="mt-4 text-center font-medium text-slate-900 dark:text-white">
                  Drop files here or click to upload
                </p>
                <p className="mt-1 text-center text-sm text-slate-500 dark:text-slate-400">
                  PDF, JPG, PNG up to 10MB
                </p>
                <button className="mt-4 rounded-xl bg-primary-600 px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-700">
                  Select Files
                </button>
              </div>

              {/* Category Selection */}
              <div className="mt-6">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  {categories.filter((c) => c.id !== 'all').map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Trip Association */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                  Associate with Trip (optional)
                </label>
                <select className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                  <option value="">No trip association</option>
                  <option value="1">Japan Adventure</option>
                  <option value="2">European Summer</option>
                </select>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button className="flex-1 rounded-xl bg-gradient-to-r from-primary-600 to-violet-600 py-3 text-sm font-medium text-white shadow-lg transition-transform hover:scale-[1.02]">
                  Upload
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
