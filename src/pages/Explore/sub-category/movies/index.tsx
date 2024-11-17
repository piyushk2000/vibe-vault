import { Box } from "@mui/material"
import MediaCard from "../../../../components/cards"
import { useDispatch, useSelector } from "react-redux"
import { decrement, increment, incrementByAmount } from "../../../../redux/counterSlice"
import React from "react"

const AnimeList = () => {
  const count = useSelector((state: any) => state.counter.value)
  const searchText = useSelector((state: any) => state.searchText.value) // Ensure this line is correct
  const dispatch = useDispatch()
  const [incrementAmount, setIncrementAmount] = React.useState('2')

  return (
    <>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem' }}>
        {/* <MediaCard />  */}
        <div>
          {searchText}
          <div>
            <button
              aria-label="Increment value"
              onClick={() => dispatch(increment())}
            >
              Increment
            </button>
            <span>{count}</span>
            <button
              aria-label="Decrement value"
              onClick={() => dispatch(decrement())}
            >
              Decrement
            </button>
          </div>
          
          <input
            aria-label="Set increment amount"
            value={incrementAmount}
            onChange={(e) => setIncrementAmount(e.target.value)}/>

          <button
            onClick={() => dispatch(incrementByAmount(Number(incrementAmount) || 0))} >
            Add Amount
          </button>

            
        </div>
      </Box>
    </>
  )
}

export default AnimeList