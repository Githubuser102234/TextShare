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
const textInput = document.getElementById('text-input');
const submitBtn = document.getElementById('submit-btn');
const textOutput = document.getElementById('text-output');

// Check the URL for an ID parameter
const urlParams = new URLSearchParams(window.location.search);
const textId = urlParams.get('id');

// Function to handle showing the form
const showForm = () => {
    formSection.classList.add('active');
    displaySection.classList.remove('active');
};

// Function to handle showing the text display
const showText = async (id) => {
    formSection.classList.remove('active');
    displaySection.classList.add('active');
    
    // Show a loading message
    textOutput.innerHTML = '<p class="loading-message">Loading text...</p>';

    try {
        const docRef = doc(db, "texts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const textContent = docSnap.data().content;
            textOutput.textContent = textContent;
        } else {
            textOutput.textContent = "Oops! Text not found.";
        }
    } catch (error) {
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
    const text = textInput.value.trim();

    if (text === "") {
        alert("Please enter some text!");
        return;
    }

    try {
        // Add a new document to the "texts" collection
        const docRef = await addDoc(collection(db, "texts"), {
            content: text,
            createdAt: new Date()
        });
        
        // Redirect to the new URL with the document ID
        window.location.href = `/?id=${docRef.id}`;

    } catch (e) {
        console.error("Error adding document: ", e);
        alert("An error occurred. Please try again.");
    }
});
