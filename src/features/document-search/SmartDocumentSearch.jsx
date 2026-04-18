import React, { useState, useMemo } from 'react';
import { Box, TextField, IconButton, Typography, Paper, Chip, Avatar, Tooltip, Divider, List, ListItem, ListItemText, ListItemAvatar } from '@mui/material';
import { Search, FileText, Sparkles, Filter, X, Highlight, Clock, Bookmark, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Document mock database - will connect to real backend index
const mockDocuments = [
  { id: 1, name: 'Calculus 1 Final Notes', course: 'MATH 101', pages: 42, uploadDate: '2 days ago', tags: ['math', 'calculus', 'derivatives'], preview: 'The derivative of a function measures the sensitivity to change of the function value...' },
  { id: 2, name: 'Physics Mechanics Summary', course: 'PHY 201', pages: 28, uploadDate: '1 week ago', tags: ['physics', 'mechanics', 'forces'], preview: 'Newton\'s three laws of motion describe the relationship between a body and the forces acting upon it...' },
  { id: 3, name: 'Organic Chemistry Reactions', course: 'CHEM 301', pages: 76, uploadDate: '3 days ago', tags: ['chemistry', 'organic', 'reactions'], preview: 'Nucleophilic substitution reactions are a class of reactions in which an electron rich nucleophile...' },
  { id: 4, name: 'Data Structures Cheat Sheet', course: 'CS 102', pages: 18, uploadDate: '5 days ago', tags: ['programming', 'algorithms', 'data structures'], preview: 'A linked list is a linear collection of data elements whose order is not given by their physical placement...' },
  { id: 5, name: 'Microeconomics Formulas', course: 'ECON 101', pages: 24, uploadDate: '1 day ago', tags: ['economics', 'micro', 'formulas'], preview: 'Price elasticity of demand is measured as the percentage change in quantity demanded divided...' },
];

const SmartDocumentSearch = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const filters = [
    'PDF Documents',
    'Notes',
    'Past Papers',
    'Flashcards',
    'Quizzes'
  ];

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];

    const query = searchQuery.toLowerCase();
    return mockDocuments.filter(doc =>
      doc.name.toLowerCase().includes(query) ||
      doc.course.toLowerCase().includes(query) ||
      doc.tags.some(tag => tag.includes(query)) ||
      doc.preview.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchHistory(prev => [searchQuery, ...prev.filter(q => q !== searchQuery).slice(0, 4)]);
    }
  };

  const highlightText = (text, query) => {
    if (!query.trim()) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase()
        ? <mark key={i} style={{ backgroundColor: 'rgba(139, 92, 246, 0.3)', padding: '2px 4px', borderRadius: 4 }}>{part}</mark>
        : part
    );
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: '#0f172a', p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, color: 'white', mb: 1 }}>
          Smart Document Search
        </Typography>
        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)' }}>
          Search across every word in all your uploaded documents, notes and textbooks
        </Typography>
      </Box>

      {/* Search Bar */}
      <form onSubmit={handleSearch}>
        <Paper elevation={0} sx={{
          p: 2,
          borderRadius: 3,
          bgcolor: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.1)',
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Search size={20} style={{ color: 'rgba(255,255,255,0.5)' }} />
          <TextField
            fullWidth
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search across all your documents..."
            variant="standard"
            autoFocus
            sx={{
              '& .MuiInput-underline:before': { borderBottom: 'none' },
              '& .MuiInput-underline:hover:before': { borderBottom: 'none' },
              '& .MuiInput-underline:after': { borderBottom: 'none' },
              '& .MuiInputBase-input': { color: 'white', fontSize: 16 }
            }}
          />
          {searchQuery && (
            <IconButton size="small" onClick={() => setSearchQuery('')}>
              <X size={16} style={{ color: 'rgba(255,255,255,0.5)' }} />
            </IconButton>
          )}
          <IconButton type="submit" sx={{ bgcolor: '#8b5cf6', color: 'white', '&:hover': { bgcolor: '#7c3aed' } }}>
            <Sparkles size={18} />
          </IconButton>
        </Paper>
      </form>

      {/* Filters */}
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mb: 3 }}>
        {filters.map(filter => (
          <Chip
            key={filter}
            label={filter}
            onClick={() => setSelectedFilters(prev =>
              prev.includes(filter) ? prev.filter(f => f !== filter) : [...prev, filter]
            )}
            sx={{
              bgcolor: selectedFilters.includes(filter) ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255,255,255,0.05)',
              color: selectedFilters.includes(filter) ? '#a78bfa' : 'rgba(255,255,255,0.7)',
              border: selectedFilters.includes(filter) ? '1px solid rgba(139, 92, 246, 0.4)' : '1px solid rgba(255,255,255,0.1)'
            }}
          />
        ))}
      </Box>

      {/* Search History */}
      {!searchQuery && searchHistory.length > 0 && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1, display: 'block' }}>
            Recent searches
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {searchHistory.map((query, i) => (
              <Chip
                key={i}
                icon={<Clock size={14} />}
                label={query}
                onClick={() => setSearchQuery(query)}
                size="small"
                sx={{ bgcolor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.7)' }}
              />
            ))}
          </Box>
        </Box>
      )}

      {/* Results */}
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <AnimatePresence>
          {searchQuery && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', mb: 2, display: 'block' }}>
                {searchResults.length} {searchResults.length === 1 ? 'result' : 'results'} found
              </Typography>

              <List>
                {searchResults.map((doc, index) => (
                  <motion.div
                    key={doc.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                  >
                    <Paper elevation={0} sx={{
                      mb: 2,
                      p: 2,
                      borderRadius: 2,
                      bgcolor: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      '&:hover': { bgcolor: 'rgba(255,255,255,0.06)' }
                    }}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: '#3b82f6' }}>
                            <FileText size={20} />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                              <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                                {highlightText(doc.name, searchQuery)}
                              </Typography>
                              <Chip label={doc.course} size="small" sx={{
                                bgcolor: 'rgba(59, 130, 246, 0.1)',
                                color: '#60a5fa',
                                border: 'none',
                                height: 20,
                                '& .MuiChip-label': { px: 0.7, fontSize: 11 }
                              }} />
                            </Box>
                          }
                          secondary={
                            <>
                              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.6)', mb: 1 }}>
                                {highlightText(doc.preview, searchQuery)}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1 }}>
                                {doc.tags.map(tag => (
                                  <Chip key={tag} label={tag} size="small" sx={{
                                    bgcolor: 'rgba(255,255,255,0.05)',
                                    color: 'rgba(255,255,255,0.5)',
                                    height: 20,
                                    '& .MuiChip-label': { px: 0.7, fontSize: 10 }
                                  }} />
                                ))}
                              </Box>
                            </>
                          }
                        />
                        <IconButton sx={{ color: 'rgba(255,255,255,0.3)' }}>
                          <ChevronRight size={18} />
                        </IconButton>
                      </ListItem>
                    </Paper>
                  </motion.div>
                ))}
              </List>

              {searchResults.length === 0 && (
                <Box sx={{ textAlign: 'center', py: 8 }}>
                  <Search size={48} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 16 }} />
                  <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    No results found
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                    Try different keywords or check your spelling
                  </Typography>
                </Box>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {!searchQuery && (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <FileText size={64} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: 24 }} />
            <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
              Search across your entire library
            </Typography>
            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>
              Find any word, phrase or concept across all your documents
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SmartDocumentSearch;