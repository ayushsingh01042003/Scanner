import axios from "axios"
async function remainingRequest(){
    try{
        const url = 'https://api.github.com/rate_limit';
        const config = {
            headers: {
              'Authorization': `token ${process.env.GITHUB_TOKEN}`
            }
          };

        const response = await axios.get(url, config)
        const remaining_request = response.data.rate.remaining;
        return remaining_request

    } catch(err){
        console.log("Error fetching remaining request")
        return NaN;
    }
}

export default remainingRequest