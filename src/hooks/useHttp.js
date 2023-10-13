import { useCallback } from "react";

const useHttp = () => {
  const fetchRequest = useCallback(async (req = {}) => {
    try {
      const endPoint = req.endPoint ? `/${req.endPoint}` : "";
      const url = req.url || 
        `https://oct-2023-a573a-default-rtdb.firebaseio.com/mailbox/${endPoint}.json`;

      console.log(url,"useHttp");
      const response = await fetch(url,{
        method: req.method || 'GET',
        body: req.body ? JSON.stringify(req.body) : null,
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        if(errData.error.message) {
          throw new Error(errData.error.message);
        }
        throw new Error(errData.error);
      }
      
      const data = await response.json();
      console.log(data,endPoint,"useHttp");
      return data;
      
    } catch (error) {
      throw new Error(error);
    }
  }, []); 

  return fetchRequest;
};

export default useHttp;
