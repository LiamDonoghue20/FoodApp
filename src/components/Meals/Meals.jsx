import useHttp from "../hooks/useHttp";
import MealItem from "./MealItem";
import Error from "../Error";
const requestConfig = {};
export default function Meals(){
    //call the custom hook to get the data regarding meals
 const {data: loadedMeals, isLoading, error} = useHttp('http://localhost:3000/meals', requestConfig, [])

//returned whilst loading
 if (isLoading){
    return <p className="center">Fetching meals...</p>
 }
//return incase of an error
 if (error) {
    return <Error  title="Failed to fetch meals" message={error}/>
 }

//map each of the meals returned by the endpoint to a meal item component
    return (
        <ul id="meals">
            {loadedMeals.map((meal) => (
                <MealItem
                    key={meal.id}
                    meal={meal}
                />
            ))}
        </ul>
    )
}