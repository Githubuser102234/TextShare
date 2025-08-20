// Add your Firebase configuration here
const firebaseConfig = {
    apiKey: "AIzaSyBO79GQNU79Iu1Cz001vX63FVp-d-0VFXI",
    authDomain: "textshare-1a502.firebaseapp.com",
    projectId: "textshare-1a502",
    storageBucket: "textshare-1a502.firebasestorage.app",
    messagingSenderId: "919298162474",
    appId: "1:919298162474:web:ef0ee80bcc290c3753e853",
    measurementId: "G-130PGMYVBC"
};

// Import and initialize Firebase products
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, getDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a reference to the main HTML elements
const formSection = document.getElementById('form-section');
const displaySection = document.getElementById('display-section');
const titleInput = document.getElementById('title-input'); // New title input
const textInput = document.getElementById('text-input');
const submitBtn = document.getElementById('submit-btn');
const titleOutput = document.getElementById('title-output'); // New title output
const textOutput = document.getElementById('text-output');

// Check the URL for an ID parameter
const urlParams = new URLSearchParams(window.location.search);
const textId = urlParams.get('id');

// Function to handle showing the form
const showForm = () => {
    formSection.classList.add('active');
    displaySection.classList.remove('active');
    submitBtn.classList.add('shimmer');
    if (titleInput) titleInput.classList.add('shimmer'); // Add shimmer to title input
    if (textInput) textInput.classList.add('shimmer'); // Add shimmer to text input
};

// Function to handle showing the text display
const showText = async (id) => {
    formSection.classList.remove('active');
    displaySection.classList.add('active');
    
    // Clear content and add shimmer to both title and text output
    titleOutput.textContent = '';
    textOutput.textContent = '';
    titleOutput.classList.add('shimmer');
    textOutput.classList.add('shimmer');

    try {
        const docRef = doc(db, "texts", id);
        const docSnap = await getDoc(docRef);

        // Remove shimmer from both outputs once content is loaded
        titleOutput.classList.remove('shimmer');
        textOutput.classList.remove('shimmer');

        if (docSnap.exists()) {
            const { title, content } = docSnap.data(); // Get title and content
            titleOutput.textContent = title || "Untitled"; // Display title or "Untitled" if none exists
            textOutput.textContent = content;
        } else {
            titleOutput.textContent = "Error";
            textOutput.textContent = "Oops! Text not found.";
        }
    } catch (error) {
        titleOutput.textContent = "Error";
        textOutput.textContent = "Error loading text. Please try again later.";
        console.error("Error getting document:", error);
    }
};

// If a textId exists in the URL, fetch and display the text
if (textId) {
    showText(textId);
} else {
    // Otherwise, show the text creation form
    showForm();
}

// Event listener for the form submission
submitBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim(); // Get the title value
    const text = textInput.value.trim();

    if (text === "") {
        alert("Please enter some text!");
        return;
    }
    
    // Add shimmer to the inputs and button when it's clicked
    submitBtn.classList.add('shimmer');
    titleInput.classList.add('shimmer');
    textInput.classList.add('shimmer');

    try {
        // Add a new document with both title and content
        const docRef = await addDoc(collection(db, "texts"), {
            title: title || "Untitled", // Save the title or "Untitled" if empty
            content: text,
            createdAt: new Date()
        });
        
        // Remove shimmer before redirecting
        submitBtn.classList.remove('shimmer');
        
        // Redirect to the new URL with the document ID
        window.location.href = `https://githubuser102234.github.io/TextShare/?id=${docRef.id}`;

    } catch (e) {
        console.error("Error adding document: ", e);
        alert("An error occurred. Please try again.");
    }
});

// A separate function to check for Firebase connection and remove shimmer
const checkFirebaseConnection = () => {
    setTimeout(() => {
        if (formSection.classList.contains('active')) {
            submitBtn.classList.remove('shimmer');
            if (titleInput) titleInput.classList.remove('shimmer'); // Remove shimmer from title input
            if (textInput) textInput.classList.remove('shimmer'); // Remove shimmer from text input
        }
    }, 1000); // 1-second delay to show the effect
};

// Run the check on initial page load
checkFirebaseConnection();
