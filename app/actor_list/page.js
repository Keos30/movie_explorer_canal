'use client'

import React from "react";
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Grid } from '@mui/material';
import { Unstable_NumberInput as BaseNumberInput, NumberInputProps, numberInputClasses } from '@mui/base/Unstable_NumberInput';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

export default function ActorListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [searchName, setSearchName] = React.useState("")
  const [actorList, setActorList] = React.useState([])
  const [selectedActor, setSelectedActor] = React.useState([])

  React.useEffect(() => {
    fetchResultsFromApi(searchParams.get('searchValue'))
  }, []);

  function goBack() {
    router.push('/')
  }

  function fetchResultsFromApi(query) {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'search/person?language=en-US&page=1&api_key=' + process.env.NEXT_PUBLIC_API_KEY + '&query=' + query)
      .then((res) => res.json())
      .then((data) => {
        setActorList(data.results)
        setSearchName(query)
    })
  }

  function search() {
    fetchResultsFromApi(searchName)
  }

  function selectActor(actor) {
    fetch(process.env.NEXT_PUBLIC_API_URL + 'person/' + actor.id + '?api_key=' + process.env.NEXT_PUBLIC_API_KEY)
      .then((res) => res.json())
      .then((data) => {
        setSelectedActor(data)
    })
  }

  return (
      <Grid container alignItems="center" justifyContent="center" direction="column" spacing={2} >
        <Grid container item xs={12}>
          <Grid item xs={2}>
            <Button onClick={() => goBack()} className="rounded-full bg-sky-500 h-10 px-6">Back</Button>
          </Grid>
          <Grid item xs={6}>
            <TextField fullWidth  id="standard-basic" label="Search for an actor name" variant="standard" onChange={(e) => setSearchName(e.target.value)}/>
          </Grid>
          <Grid item xs={2}>
            <Button onClick={() => search()} className="bg-sky-500 rounded-full h-10 px-6">Search</Button>
          </Grid>
        </Grid>
        <Grid container item>
          <Grid item xs={4}>
            {actorList.map(actor => (
              <ul key={actor.id}>
                <li key={actor.id} onClick={(e) => selectActor(actor)}>{actor.name}</li>
              </ul>
            ))}
          </Grid>
          {selectedActor.length!= 0 ? (
            <Grid item container xs={8} spacing={1}>
                <Grid item xs={4}>
                  {selectedActor.profile_path != null ? (
                    <Image src={process.env.NEXT_PUBLIC_IMG_URL + selectedActor.profile_path} width={500} height={500} alt="Picture of the actor"/>
                  ) : (
                    <Image src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" width={500} height={500} alt="Empty profile picture"/>
                  )}
                </Grid>
                <Grid item xs={8}>
                  <h2>{selectedActor.name}</h2>
                  <ul>
                    <li>{selectedActor.also_known_as.join(', ')}</li>
                    <li>{selectedActor.birthday != null ? selectedActor.birthday : "Unknown"} - {selectedActor.deathday != null ? selectedActor.deathday : "Unknown"}</li>
                    <li>{selectedActor.biography}</li>
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
