import React, { useState, useEffect } from 'react';
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
  FormControlLabel
} from '@mui/material';
import { 
  ArrowForward, 
  FilterList as FilterIcon, 
  Close as CloseIcon 
} from '@mui/icons-material';
import Link from 'next/link';

export default function NewsGrid({ articles, error }) {
  const router = useRouter();

  // Import tags from news_tags.json
  const availableTags = allTags.filter(tag => tag !== 'Other');
  
  // State for tag filtering
  const [selectedTags, setSelectedTags] = useState([]);
  const [filterMode, setFilterMode] = useState('any');
  const [filteredArticles, setFilteredArticles] = useState(articles);
  
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
      const articleTags = article.tags.map(tag => Object.keys(tag)[0]);
      
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

  // Error handling
  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {`Error: ${error}`}
      </Typography>
    );
  }

  // Check if current route is /news
  const isNewsPage = router.pathname === '/news';

  return (
    <Box>
      {isNewsPage && (
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 2,
          flexWrap: 'wrap'
        }}>
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
              label={filterMode === 'any' ? 'Combine' : 'Any Tag'} 
              onClick={handleCombineToggle}
              color={filterMode === 'all' ? 'primary' : 'default'}
              sx={{ ml: 1 }}
            />
          )}
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
        {filteredArticles.length > 0 ? (
          filteredArticles.map((article) => (
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
                    {article.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {article.formattedDate}
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
                          label={Object.keys(tag)[0]}
                          sx={{
                            backgroundColor: `rgba(28, 123, 196, ${Math.max(((Object.values(tag)[0] - 40) / 60), 0) + 0.15})`,
                            color: `rgba(255, 255, 255, ${Math.max(((Object.values(tag)[0] - 20) / 30), 0) + 0.55})`,
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
                    {article.content}
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
              No articles match the selected tags.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
