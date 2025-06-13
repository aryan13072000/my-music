import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  Box,
  Stack,
} from '@mui/material';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../context/AuthContext';
import { searchTracks } from '../spotiy';
import { useNavigate } from 'react-router-dom';

interface Playlist {
  id: string;
  name: string;
  description: string;
  songs: Track[];
}

interface Track {
  id: string;
  name: string;
  artists: { name: string }[];
  album: { name: string };
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth(); 
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const handleLogout = () => {
    logout();           // clears auth context or localStorage
    navigate("/login"); // redirect to login page
  };

  const LOCAL_KEY = `playlists_${user}`;

  useEffect(() => {
    const saved = localStorage.getItem(LOCAL_KEY);
    if (saved) {
      setPlaylists(JSON.parse(saved));
    }
  }, [LOCAL_KEY]);

  const savePlaylists = (updated: Playlist[]) => {
    setPlaylists(updated);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
  };

  const handleAddPlaylist = () => {
    if (!name.trim()) return alert('Playlist name is required');

    const newPlaylist: Playlist = {
      id: uuidv4(),
      name,
      description,
      songs: [],
    };

    const updated = [...playlists, newPlaylist];
    savePlaylists(updated);
    setName('');
    setDescription('');
  };

  const handleDeletePlaylist = (id: string) => {
    const updated = playlists.filter((p) => p.id !== id);
    savePlaylists(updated);
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    const results = await searchTracks(searchQuery);
    setSearchResults(results);
  };

  const handleAddSongToPlaylist = (song: Track, playlistId: string) => {
    const updated = playlists.map((playlist) => {
      if (playlist.id === playlistId) {
        const alreadyExists = playlist.songs.find((s) => s.id === song.id);
        if (alreadyExists) return playlist;
        return {
          ...playlist,
          songs: [...playlist.songs, song],
        };
      }
      return playlist;
    });
    savePlaylists(updated);
  };

  const handleRemoveSongFromPlaylist = (playlistId: string, songId: string) => {
    const updated = playlists.map((playlist) =>
      playlist.id === playlistId
        ? {
            ...playlist,
            songs: playlist.songs.filter((s) => s.id !== songId),
          }
        : playlist
    );
    savePlaylists(updated);
  };

  return (
    <Container maxWidth="md">
      <Box mt={4}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="h4">Welcome, {user}</Typography>
          <Button variant="outlined" color="secondary" onClick={handleLogout}>
            Logout
          </Button>
        </Stack>

        {/* Create Playlist */}
        <Box mt={4}>
          <Typography variant="h6">Create New Playlist</Typography>
          <TextField
            fullWidth
            label="Playlist Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddPlaylist}
            sx={{ mt: 2 }}
          >
            Add Playlist
          </Button>
        </Box>

        {/* Playlist List */}
        <Box mt={4}>
          <Typography variant="h6">Your Playlists</Typography>
          {playlists.length === 0 ? (
            <Typography mt={2}>No playlists yet.</Typography>
          ) : (
            playlists.map((playlist) => (
              <Card key={playlist.id} sx={{ mt: 2 }}>
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Box>
                      <Typography variant="h6">{playlist.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {playlist.description}
                      </Typography>

                      {playlist.songs.length > 0 && (
                        <Box mt={1}>
                          <Typography fontWeight="bold">Songs:</Typography>
                          {playlist.songs.map((song) => (
                            <Box
                              key={song.id}
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ mb: 1 }}
                            >
                              <Typography variant="body2">
                                🎵 {song.name} — {song.artists.map((a) => a.name).join(', ')}
                              </Typography>
                              <Button
                                variant="text"
                                size="small"
                                color="error"
                                onClick={() =>
                                  handleRemoveSongFromPlaylist(playlist.id, song.id)
                                }
                              >
                                Remove
                              </Button>
                            </Box>
                          ))}
                        </Box>
                      )}
                    </Box>
                    <IconButton color="error" onClick={() => handleDeletePlaylist(playlist.id)}>
                      DELETE
                    </IconButton>
                  </Stack>
                </CardContent>
              </Card>
            ))
          )}
        </Box>

        {/* Spotify Search */}
        <Box mt={6}>
          <Typography variant="h6">Search Songs (Spotify)</Typography>
          <TextField
            fullWidth
            label="Search for a song..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            margin="normal"
          />
          <Button variant="contained" onClick={handleSearch}>
            Search
          </Button>

          {searchResults.map((track) => (
            <Card key={track.id} sx={{ mt: 2 }}>
              <CardContent>
                <Typography variant="h6">{track.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {track.artists.map((a) => a.name).join(', ')} — {track.album.name}
                </Typography>
                {playlists.map((playlist) => (
                  <Button
                    key={playlist.id}
                    variant="outlined"
                    size="small"
                    sx={{ mt: 1, mr: 1 }}
                    onClick={() => handleAddSongToPlaylist(track, playlist.id)}
                  >
                    Add to {playlist.name}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default Dashboard;
