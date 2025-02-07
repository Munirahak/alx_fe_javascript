// Array to store quotes
// const quotes = [
//     { text: "The only way to do great work is to love what you do.", category: "Motivation" },
//     { text: "Life is what happens when you're busy making other plans.", category: "Life" },
//     { text: "Do not watch the clock; do what it does. Keep going.", category: "Inspiration" },
//   ];
  
//   // Function to display a random quote
//   function showRandomQuote() {
//     const randomIndex = Math.floor(Math.random() * quotes.length);
//     const quote = quotes[randomIndex];
//     const quoteDisplay = document.getElementById("quoteDisplay");
//     quoteDisplay.innerHTML = `<p>${quote.text} - <strong>${quote.category}</strong></p>`;
//   }
  
//   // Event listener for showing a new random quote
//   document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
//   // Function to add a new quote
//   function addQuote() {
//     const quoteText = document.getElementById("newQuoteText").value.trim();
//     const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
//     if (quoteText && quoteCategory) {
//       quotes.push({ text: quoteText, category: quoteCategory });
//       alert("Quote added successfully!");
//       document.getElementById("newQuoteText").value = "";
//       document.getElementById("newQuoteCategory").value = "";
//     } else {
//       alert("Please fill in both the quote and the category.");
//     }
//   }
  
//   // Initialize by showing a random quote
//   showRandomQuote();
  
// Retrieve quotes from local storage or use default quotes
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
    { text: "The only way to do great work is to love what you do.", category: "Motivation" },
    { text: "Life is what happens when you're busy making other plans.", category: "Life" },
    { text: "Do not watch the clock; do what it does. Keep going.", category: "Inspiration" },
  ];
  
  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem("quotes", JSON.stringify(quotes));
  }
  
  // Function to display a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>${quote.text} - <strong>${quote.category}</strong></p>`;
    sessionStorage.setItem("lastViewedQuote", JSON.stringify(quote)); // Save last viewed quote in session storage
  }
  
  // Function to add a new quote
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes();
      alert("Quote added successfully!");
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
    } else {
      alert("Please fill in both the quote and the category.");
    }
  }
  
  // Function to export quotes as a JSON file
  function exportToJsonFile() {
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "quotes.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  
  // Function to import quotes from a JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Event listener for showing a new random quote
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Initialize by showing the last viewed quote or a random quote
  const lastViewedQuote = JSON.parse(sessionStorage.getItem("lastViewedQuote"));
  if (lastViewedQuote) {
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `<p>${lastViewedQuote.text} - <strong>${lastViewedQuote.category}</strong></p>`;
  } else {
    showRandomQuote();
  }


  // Function to populate categories dynamically in the dropdown
function populateCategories() {
    const categoryFilter = document.getElementById("categoryFilter");
    categoryFilter.innerHTML = '<option value="all">All Categories</option>'; // Reset options
  
    const uniqueCategories = [...new Set(quotes.map(quote => quote.category))];
    uniqueCategories.forEach(category => {
      const option = document.createElement("option");
      option.value = category;
      option.textContent = category;
      categoryFilter.appendChild(option);
    });
  
    // Restore the last selected category filter from local storage
    const lastSelectedCategory = localStorage.getItem("selectedCategory");
    if (lastSelectedCategory) {
      categoryFilter.value = lastSelectedCategory;
      filterQuotes(); // Apply the filter on page load
    }
  }
  
  // Function to filter quotes based on the selected category
  function filterQuotes() {
    const selectedCategory = document.getElementById("categoryFilter").value;
    const filteredQuotes = selectedCategory === "all"
      ? quotes
      : quotes.filter(quote => quote.category === selectedCategory);
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    if (filteredQuotes.length > 0) {
      const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
      const quote = filteredQuotes[randomIndex];
      quoteDisplay.innerHTML = `<p>${quote.text} - <strong>${quote.category}</strong></p>`;
    } else {
      quoteDisplay.innerHTML = `<p>No quotes available in this category.</p>`;
    }
  
    // Save the selected category in local storage
    localStorage.setItem("selectedCategory", selectedCategory);
  }
  
  // Update the addQuote function to include new categories in the dropdown
  function addQuote() {
    const quoteText = document.getElementById("newQuoteText").value.trim();
    const quoteCategory = document.getElementById("newQuoteCategory").value.trim();
  
    if (quoteText && quoteCategory) {
      quotes.push({ text: quoteText, category: quoteCategory });
      saveQuotes();
      populateCategories(); // Update the dropdown with the new category
      alert("Quote added successfully!");
      document.getElementById("newQuoteText").value = "";
      document.getElementById("newQuoteCategory").value = "";
    } else {
      alert("Please fill in both the quote and the category.");
    }
  }
  
  // Call populateCategories to initialize the dropdown on page load
  populateCategories();
  


const serverURL = "https://jsonplaceholder.typicode.com/posts"; // Simulated server

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(serverURL);
    const serverQuotes = await response.json();
    const newQuotes = serverQuotes.map(post => ({ text: post.body, category: "Server" }));

    // Check for new quotes not already in the local storage
    newQuotes.forEach(quote => {
      if (!quotes.some(localQuote => localQuote.text === quote.text)) {
        quotes.push(quote);
      }
    });

    saveQuotes(); // Update local storage with new quotes
    alert("Quotes synced with server!");
  } catch (error) {
    console.error("Error fetching quotes from the server:", error);
  }
}

// Function to post new quotes to the server
async function postQuotesToServer() {
  try {
    const unsyncedQuotes = quotes.filter(quote => !quote.synced);
    for (const quote of unsyncedQuotes) {
      await fetch(serverURL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: quote.text, category: quote.category }),
      });
      quote.synced = true; // Mark the quote as synced
    }
    saveQuotes(); // Save the updated state to local storage
    alert("Local quotes synced to the server!");
  } catch (error) {
    console.error("Error posting quotes to the server:", error);
  }
}

// Function to periodically sync data
function startDataSync() {
  setInterval(() => {
    fetchQuotesFromServer();
    postQuotesToServer();
  }, 60000); // Sync every 60 seconds
}

// Conflict resolution: Server's data takes precedence
function resolveConflict(localQuote, serverQuote) {
  // Example conflict resolution logic: Server quote replaces local quote
  return serverQuote;
}

// Handle manual conflict resolution (if needed)
function manualConflictResolution() {
  const conflictResolutionDiv = document.getElementById("conflictResolution");
  conflictResolutionDiv.style.display = "block"; // Show conflict resolution UI
}

// Start the data sync process
startDataSync();
