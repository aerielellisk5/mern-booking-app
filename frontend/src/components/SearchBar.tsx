import { FormEvent, useState } from "react";
import { useSearchContext } from "../context/SearchContext"
import { Md10K, MdTravelExplore } from "react-icons/md";

const SearchBar = () => {
    const search = useSearchContext();

    const [destination, setDestination] = useState<string>(search.destination)
    const [checkIn, setCheckIn] = useState<Date>(search.checkIn)
    const [checkOut, setCheckOut] = useState<Date>(search.checkOut)
    const [adultCount, setAdultCount] = useState<number>(search.adultCount)
    const [childCount, setChildCount] = useState<number>(search.childCount)

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        search.saveSearchValues(
            destination, 
            checkIn, 
            checkOut, 
            adultCount, 
            childCount
        )
    }

    return(
        <form onSubmit={handleSubmit} className="-mt-8 p-3 bg-orange-400 rounded shadow-md grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 items-center gap-4">
            <div className="flex flex-row items-center flex-1 bg-white p-2">
                <MdTravelExplore size={25} className="mr-2" />
                <input placeholder="Where are you going" className="text-md w-full focus:outline-none" value={destination} onChange={(event)=> setDestination(event.target.value)} />
            </div>

            <div className="flex bg-white px-2 py-1 gap-2">
                <label className="items-center flex">
                    Adults:
                    <input className="q-full p-1 focus:outline-none font-bold" type="number" min={1} max={20} value={adultCount} onChange={(event)=> setAdultCount(parseInt(event.target.value))} />
                </label>
                <label className="items-center flex">
                    Children:
                    <input className="q-full p-1 focus:outline-none font-bold" type="number" min={0} max={20} value={childCount} onChange={(event)=> setChildCount(parseInt(event.target.value))} />
                </label>
            </div>
            {/* Date picker */}
            <div></div>
        </form>
    )
}

export default SearchBar;