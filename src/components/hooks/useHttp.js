import { useState, useEffect, useCallback } from "react";

async function sendHttpRequest(url, config){
    //send request with the url and config passed to the hook
    const response = await fetch(url, config);

    const resData = await response.json();
    //if the response isn't ok throw na error
    if(!response.ok){
        throw new Error(resData || 'Something went wrong!')
    }
    //return the data from the response
    return resData;
}

export default function useHttp(url, config, initialData){
    const [data, setData] = useState([]);
    const [error, setError] = useState();
    const [isLoading, setIsLoading] = useState(false);
    //used to clear the data upon successfully sending checkout info
    function clearData() {
        setData(initialData)
    }
    //function to send the API request
    const sendRequest = useCallback(async function sendRequest(data){
        setIsLoading(true)
        try{
            const resData = await sendHttpRequest(url, {...config, body: data});
            setData(resData)
        } catch (error) {
            setError(error.message || 'Something went wrong!')
        }
        setIsLoading(false)
    }, [url, config])

    useEffect(() => {
        if (config && (config.method ==='GET' || !config.method) || !config){
            sendRequest();
        }
    }, [sendRequest, config])

    return {
        data,
        isLoading,
        error,
        sendRequest,
        clearData
    }
}