import axios from "axios";

export async function returnQuote() {

  const quotes = [

    "The only limit to our realization of tomorrow is our doubts of today. - Franklin D. Roosevelt",
    "In the middle of every difficulty lies opportunity. - Albert Einstein",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston S. Churchill",
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt",
    "It does not matter how slowly you go as long as you do not stop. - Confucius",
    "You are never too old to set another goal or to dream a new dream. - C.S. Lewis",
    "The best way to predict the future is to create it. - Peter Drucker",
    "Believe you can and you're halfway there. - Theodore Roosevelt",
    "Act as if what you do makes a difference. - William James",
    "Success usually comes to those who are too busy to be looking for it. - Henry David Thoreau",
    "Don't watch the clock; do what it does. Keep going. - Sam Levenson",
    "The only way to do great work is to love what you do. - Steve Jobs",
    "You miss 100% of the shots you don't take. - Wayne Gretzky",
    "The only impossible journey is the one you never begin. - Tony Robbins",
    "Your time is limited, so don't waste it living someone else's life. - Steve Jobs",
    "The best revenge is massive success. - Frank Sinatra",
    "Success is walking from failure to failure with no loss of enthusiasm. - Winston S. Churchill",
    "What lies behind us and what lies before us are tiny matters compared to what lies within us. - Ralph Waldo Emerson",
    "The only way to achieve the impossible is to believe it is possible. - Charles Kingsleigh (Alice in Wonderland)",
    "The only person you are destined to become is the person you decide to be. - Ralph Waldo Emerson",
    "The future depends on what you do today. - Mahatma Gandhi",
    "It is never too late to be what you might have been. - George Eliot",
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "You cannot change your future, but you can change your habits, and surely your habits will change your future. - A.P.J. Abdul Kalam",
    "The only thing we have to fear is fear itself. - Franklin D. Roosevelt", 
    "That's one small step for a man, one giant leap for mankind. - Neil Armstrong",
    "I think, therefore I am. - René Descartes",
    "To be or not to be, that is the question. - William Shakespeare",
    "All the world's a stage, and all the men and women merely players. - William Shakespeare",
    "Ask not what your country can do for you, ask what you can do for your country. - John F. Kennedy ",
    "Life is like riding a bicycle. To keep your balance, you must keep moving. - Albert Einstein", 
    "Not all those who wander are lost. - J.R.R. Tolkien ",
    "The only impossible journey is the one you never begin. - Tony Robbins ",    
    "Love all, trust a few, do wrong to none. - William Shakespeare", 
    "The greatest happiness of life is the conviction that we are loved; loved for ourselves, or rather, loved in spite of ourselves. - Victor Hugo ",
    "Love is friendship that has caught fire. - Ann Landers ",
    "Being deeply loved by someone gives you strength, while loving someone deeply gives you courage. - Lao Tzu ",    
    "I have a dream. - Martin Luther King Jr.", 
    "The only way to do great work is to love what you do. - Steve Jobs ",
    "Believe you can and you're halfway there. - Theodore Roosevelt", 
    "Strive not to be a success, but rather to be of value. - Albert Einstein", 
    "The future belongs to those who believe in the beauty of their dreams. - Eleanor Roosevelt", 
    "The only limit to our realization of tomorrow will be our doubts of today. - Franklin D. Roosevelt",
    "A friend is one who knows you and loves you just the same. - Elbert Hubbard ",
    "Friendship is the only cement that will ever hold the world together. - Woodrow Wilson",
    "Success is not final, failure is not fatal: It is the courage to continue that counts. - Winston Churchill",
    "The difference between ordinary and extraordinary is that little extra. - Jimmy Johnson", 
    "The only place where success comes before work is in the dictionary. - Vidal Sassoon", 
    "Genius is one percent inspiration and ninety-nine percent perspiration. - Thomas Edison"
  ];

  // Select a random quote from the array
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];

}

export async function returnJoke() {
  

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: 'https://official-joke-api.appspot.com/random_joke',
    headers: { 
      'Accept': 'application/json'
    }
  };

  let jokeResponse = "No joke found";

  await axios.request(config).then((resp) => {
    console.info("resp\n" + JSON.stringify(resp.data, null, 2));
    jokeResponse = resp.data.setup + " - " + resp.data.punchline;
  });
  
  return jokeResponse;

}


export async function returnCityFromZip(zip) {
  
  let zipUrl = `https://api.zippopotam.us/us/${zip}`;

  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: zipUrl,
    headers: { 
      'Accept': 'application/json'
    }
  };

  let zipResponse = "Zip Code not found";

  await axios.request(config).then((resp) => {
    console.info("resp\n" + JSON.stringify(resp.data, null, 2));
    zipResponse = resp.data ? resp.data.places[0]['place name'] + ", " + resp.data.places[0]['state'] : "Zip Code not found";
  });
  
  return zipResponse;

}