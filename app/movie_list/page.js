'use client'

import React from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Grid } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Unstable_NumberInput as BaseNumberInput, NumberInputProps, numberInputClasses } from '@mui/base/Unstable_NumberInput';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function MovieListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false);
  const [searchName, setSearchName] = React.useState("")
  const [movieList, setMovieList] = React.useState([])
  const [selectedMovie, setSelectedMovie] = React.useState([])
  const [selectedYear, setSelectedYear] = React.useState(2000);

  React.useEffect(() => {
    fetchResultsFromApi(searchParams.get('searchValue'))
  }, []);

  function goBack() {
    router.push('/')
  }

  function fetchResultsFromApi(query) {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'search/movie?api_key=' + process.env.NEXT_PUBLIC_API_KEY + '&query=' + query)
      .then((res) => res.json())
      .then((data) => {
        setMovieList(data.results)
        setSearchName(query)
    })
  }

  function search() {
    fetchResultsFromApi(searchName)
  }

  function selectMovie(movie) {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'movie/' + movie.id + '?api_key=' + process.env.NEXT_PUBLIC_API_KEY)
      .then((res) => res.json())
      .then((data) => {
        setSelectedMovie(data)
    })
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  function applyFilters(e) {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'search/movie?api_key=' + process.env.NEXT_PUBLIC_API_KEY + '&primary_release_year=' + selectedYear + '&query=' + searchName)
      .then((res) => res.json())
      .then((data) => {
        handleClose()
        setMovieList(data.results)
    })
  }

  return (
      <Grid container alignItems="center" justifyContent="center" direction="column" spacing={2} >
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <Button onClick={() => goBack()} className="rounded-full bg-sky-500 h-10 px-6">Back</Button>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth  id="standard-basic" label="Search for a movie name" variant="standard" onChange={(e) => setSearchName(e.target.value)}/>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={() => search()} className="bg-sky-500 rounded-full h-10 px-6">Search</Button>
          </Grid>
          <Grid item xs={2}>
            <Button variant="outlined" onClick={handleClickOpen} className="rounded-full bg-sky-500 h-10 px-6">Filters</Button>
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>Filter</DialogTitle>
              <DialogContent>
                <p>Year of diffusion</p>
                <BaseNumberInput
                  aria-label="Year input"
                  placeholder="Choose a year"
                  value={selectedYear}
                  onChange={(event, val) => setSelectedYear(val)}
                  slotProps={{
                    incrementButton: {
                      children: '▴',
                    },
                    decrementButton: {
                      children: '▾',
                    },
                  }}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>Cancel</Button>
                <Button onClick={(e) => applyFilters(e)}>Filter</Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={4}>
            {movieList.map(movie => (
              <ul key={movie.id}>
                <li key={movie.id} onClick={(e) => selectMovie(movie)}>{movie.title}</li>
              </ul>
            ))}
          </Grid>
          {selectedMovie.length!= 0 ? (
            <Grid item container xs={8} spacing={1}>
                <Grid item xs={4}>
                  <Image src={process.env.NEXT_PUBLIC_IMG_URL + selectedMovie.poster_path} width={500} height={500} alt="Picture of the movie"/>
                </Grid>
                <Grid item xs={8}>
                  <h2>{selectedMovie.title}</h2>
                  <ul>
                    <li>{selectedMovie.release_date}</li>
                    <li>{selectedMovie.genres.map(({name}) => `${name}`).join(', ')}</li>
                    <li>{selectedMovie.overview}</li>
                  </ul>
                </Grid>
            </Grid>
          ) :
            (null)
          }
        </Grid>
      </Grid>
  )
}
