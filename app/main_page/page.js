import React from "react";
import { Grid } from '@mui/material';
import { useRouter } from 'next/navigation'
import Button from '@mui/material/Button';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import './style.css';


export default function Homepage() {
  const router = useRouter()
  const [searchName, setSearchName] = React.useState("")
  const [selectedType, setSelectedType] = React.useState("movie");
  const [alert, setAlert] = React.useState(false);
  const [alertContent, setAlertContent] = React.useState('');

  const setSearchType = (event) => {
    setSelectedType(event.target.value);
  };

  function search() {
    if (searchName) {
      if (selectedType == "movie")
        router.push(`/movie_list?searchValue=${searchName}`)
      else if (selectedType == "actor")
        router.push(`/actor_list?searchValue=${searchName}`)
      else
        setAlertContent("An error happened");
        setAlert(true);
    } else {
      setAlertContent("Name cannot be empty");
      setAlert(true);
    }
  }

  return (
    <main>
      <Grid container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ minHeight: '100vh' }}>
        <Grid container direction="row" justifyContent="center">
            <p className='spacious'>I'm looking for a </p>
            <FormControl>
              <InputLabel id="demo-simple-select-label">Type</InputLabel>
              <Select value={selectedType} label="Type" sx={{ color: "white" }} onChange={setSearchType}>
                <MenuItem value={"movie"}>Movie</MenuItem>
                <MenuItem value={"actor"}>Actor</MenuItem>
              </Select>
            </FormControl>
            <p className={'spacious'}> that is called </p>
            <div>
              <TextField fullWidth id="standard-basic" label="Search for a name" variant="standard" sx={{ input: { color: 'white' } }} className="rounded-md bg-sky-500 h-10 px-1" onChange={(e) => setSearchName(e.target.value)}/>
              {alert ? <Alert severity='error'>{alertContent}</Alert> : <></> }
            </div>
            <Button onClick={() => search()} className="bg-sky-500 rounded-full h-10 px-6">Search</Button>
        </Grid>
      </Grid>
    </main>
  )
}
