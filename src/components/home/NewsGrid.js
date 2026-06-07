import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/router';
import allTags from '../../../scripts/news_tags.json';
import { 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardActions, 
  IconButton, 
  Box,
  Chip, 
  Menu, 
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormControl,
  Select
} from '@mui/material';
import { 
  ArrowForward, 
  FilterList as FilterIcon, 
  Close as CloseIcon,
  ArrowUpward,
  ArrowDownward,
  AutoAwesome
} from '@mui/icons-material';
import Link from 'next/link';
import { formatDisplayDate, getText } from '../../utils/i18n';

export default function NewsGrid({ articles, error, locale }) {
  const router = useRouter();
  const text = getText(locale);
  const sortOptions = [
    { value: 'fresh', label: text.newsGrid.fresh },
    { value: 'archive', label: text.newsGrid.archive },
    { value: 'trending', label: text.newsGrid.trending },
  ];

  const getTagLabel = (tag) => {
    if (!tag || typeof tag !== 'object') {
      return '';
    }
    if ('label' in tag) {
      return tag.label;
    }
    return Object.keys(tag)[0] || '';
  };

  const getTagValue = (tag) => {
    if (!tag || typeof tag !== 'object') {
      return 0;
    }
    if ('value' in tag) {
      return Number(tag.value) || 0;
    }
    return Number(Object.values(tag)[0]) || 0;
  };

  // Import tags from news_tags.json
  const availableTags = allTags.filter(tag => tag !== 'Other');
  
  // State for tag filtering
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterMode, setFilterMode] = useState('any');
  const [filteredArticles, setFilteredArticles] = useState(articles);
  const [sortMode, setSortMode] = useState('fresh');
  
  // Anchor for dropdown menu
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  // Filtering logic
  useEffect(() => {
    if (selectedTags.length === 0) {
      setFilteredArticles(articles);
      return;
    }

    const filtered = articles.filter(article => {
      const articleTags = (article.tags || []).map((tag) => getTagLabel(tag)).filter(Boolean);
      
      if (filterMode === 'any') {
        // At least one selected tag is present
        return selectedTags.some(tag => articleTags.includes(tag));
      } else {
        // All selected tags are present
        return selectedTags.every(tag => articleTags.includes(tag));
      }
    });

    setFilteredArticles(filtered);
  }, [selectedTags, filterMode, articles]);

  // Handle tag selection
  const handleTagToggle = (tag) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  // Open filter menu
  const handleFilterClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Close filter menu
  const handleFilterClose = () => {
    setAnchorEl(null);
  };

  // Remove tag
  const handleRemoveTag = (tag) => {
    setSelectedTags(prev => prev.filter(t => t !== tag));
  };

  // Toggle combine mode
  const handleCombineToggle = () => {
    setFilterMode(prev => prev === 'any' ? 'all' : 'any');
  };

  const sortedArticles = useMemo(() => {
    const list = [...filteredArticles];

    if (sortMode === 'archive') {
      return list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    if (sortMode === 'trending') {
      return list.sort((a, b) => {
        const viewDiff = (Number(b.views) || 0) - (Number(a.views) || 0);
        if (viewDiff !== 0) {
          return viewDiff;
        }
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
    }

    return list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [filteredArticles, sortMode]);

  const currentSortOption = sortOptions.find((option) => option.value === sortMode) || sortOptions[0];

  const SortModeIcon = sortMode === 'trending'
    ? AutoAwesome
    : sortMode === 'archive'
      ? ArrowDownward
      : ArrowUpward;

  // Error handling
  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {`Error: ${error}`}
      </Typography>
    );
  }

  const hasActiveFilters = selectedTags.length > 0;

  // Check if current route is /news
  const isNewsPage = router.pathname === '/news';

  return (
    <Box>
      {isNewsPage && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center', 
          mb: 2,
          flexWrap: 'wrap',
          gap: 1,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            <IconButton onClick={handleFilterClick} sx={{ mr: 2 }}>
              <FilterIcon />
            </IconButton>

            {selectedTags.length > 0 && (
              <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
                {selectedTags.map(tag => (
                  <Chip
                    key={tag}
                    label={tag}
                    onDelete={() => handleRemoveTag(tag)}
                    deleteIcon={<CloseIcon />}
                    sx={{ m: 0.5 }}
                  />
                ))}
              </Box>
            )}

            {selectedTags.length > 1 && (
              <Chip 
                label={filterMode === 'any' ? text.newsGrid.combine : text.newsGrid.anyTag} 
                onClick={handleCombineToggle}
                color={filterMode === 'all' ? 'primary' : 'default'}
                sx={{ ml: 1 }}
              />
            )}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <FormControl size="small" sx={{ width: { xs: 170, sm: 185 } }}>
              <Select
                value={sortMode}
                onChange={(event) => setSortMode(event.target.value)}
                variant="standard"
                disableUnderline
                renderValue={() => (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
                    <SortModeIcon sx={{ fontSize: 18, color: '#106EBE' }} />
                    <Typography
                      sx={{
                        fontSize: '0.95rem',
                        fontWeight: 700,
                        color: '#106EBE',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        maxWidth: '130px',
                      }}
                    >
                      {currentSortOption.label}
                    </Typography>
                  </Box>
                )}
                sx={{
                  px: 0.25,
                  '& .MuiSelect-icon': {
                    color: '#106EBE',
                  },
                }}
              >
                {sortOptions.map((option) => {
                  const OptionIcon = option.value === 'trending'
                    ? AutoAwesome
                    : option.value === 'archive'
                      ? ArrowDownward
                      : ArrowUpward;

                  return (
                    <MenuItem key={option.value} value={option.value}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <OptionIcon sx={{ fontSize: 18 }} />
                        <span>{option.label}</span>
                      </Box>
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}

      {isNewsPage && (
        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleFilterClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
        >
          <Box sx={{ 
            maxHeight: '300px', 
            overflowY: 'auto', 
            width: '250px', 
            p: 2 
          }}>
            {availableTags.map(tag => (
              <MenuItem key={tag} sx={{ p: 0 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedTags.includes(tag)}
                      onChange={() => handleTagToggle(tag)}
                    />
                  }
                  label={tag}
                  sx={{ width: '100%', m: 0 }}
                />
              </MenuItem>
            ))}
          </Box>
        </Menu>
      )}

      {/* Articles Grid */}
      <Grid container spacing={3}>
        {sortedArticles.length > 0 ? (
          sortedArticles.map((article) => (
            <Grid item xs={12} sm={6} md={4} key={article.slug}>
              <Card
                sx={{
                  height: '370px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                  },
                }}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    component="h2"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      mb: 1,
                    }}
                  >
                    {locale === 'bg' && article.titleBg ? article.titleBg : article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {formatDisplayDate(article.date, locale)}
                  </Typography>
                  {/* Tags section */}
                  {article.tags && article.tags.length > 0 && (
                    <Box
                      sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 1,
                        mt: 1,
                        p: 1,
                        borderRadius: 'px',
                      }}
                    >
                      {article.tags.map((tag, index) => (
                        <Chip
                          key={index}
                          label={getTagLabel(tag)}
                          sx={{
                            backgroundColor: `rgba(28, 123, 196, ${Math.max(((getTagValue(tag) - 40) / 60), 0) + 0.15})`,
                            color: `rgba(255, 255, 255, ${Math.max(((getTagValue(tag) - 20) / 30), 0) + 0.55})`,
                            fontWeight: 'bold',
                          }}
                        />
                      ))}
                    </Box>
                  )}
                  <Typography
                    variant="body1"
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      opacity: 0.7,
                    }}
                  >
                    {locale === 'bg' && article.contentBg ? article.contentBg : article.content}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <Link href={`/news/${article.slug}`} passHref>
                    <IconButton color="primary">
                      <ArrowForward />
                    </IconButton>
                  </Link>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center">
              {hasActiveFilters
                ? text.newsGrid.noFilteredArticles
                : text.newsGrid.noArticles}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
