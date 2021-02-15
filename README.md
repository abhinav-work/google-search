# Google-Search

## Follow the following steps to fetch all the `NEWS ARTICLES` originating from `CANADA` results with respect to query search of `COVID`
  1. `Clone the repository` by performing the following command on the terminal :- git clone https://github.com/abhinav-work/google-search/
  2. Navigate through terminal inside the root folder of the repository i.e. google-search
  3. Perform the installation of Node Modules via following command :- npm i 
  4. After the installation, run the following command to start the server :- `nodemon` 
  5. Hit the following URL in with `GET` method in postman or simply run the following URL in the browser to save the `COVID` related `NEWS ARTICLES` from the `PAST 2 DAYS` originating from `CANADA` :- `localhost:3000/`

## Here is the sample result in MongoDB <br>
<img src="https://i.ibb.co/VJX9Npp/Screenshot-2021-02-15-at-4-07-24-PM.png" alt="Screenshot-2021-02-15-at-4-07-24-PM" border="0">

### P.S. As the `GOOGLE API` is of free tier, there is a limitted amount of hits available per day. To counter the same, I have deliberately limitted the no. of hits so that threshold is never crossed. Comment the LINE 31 if you need to fetch ALL the relevant results. 
