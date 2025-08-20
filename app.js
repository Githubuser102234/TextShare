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
    submitBtn.classList.add('shimmer'); // Add shimmer to the button on form load 💡
};

// Function to handle showing the text display
const showText = async (id) => {
    formSection.classList.remove('active');
    displaySection.classList.add('active');
    
    // Clear the content and add the shimmer effect
    textOutput.textContent = '';
    textOutput.classList.add('shimmer');

    try {
        const docRef = doc(db, "texts", id);
        const docSnap = await getDoc(docRef);

        // Remove the shimmer effect once content is loaded
        textOutput.classList.remove('shimmer');

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
    
    // Add shimmer to the button when it's clicked
    submitBtn.classList.add('shimmer'); // 💡

    try {
        // Add a new document to the "texts" collection
        const docRef = await addDoc(collection(db, "texts"), {
            content: text,
            createdAt: new Date()
        });
        
        // Remove shimmer before redirecting
        submitBtn.classList.remove('shimmer'); // 💡
        
        // Redirect to the new URL with the document ID
        window.location.href = `https://githubuser102234.github.io/TextShare/?id=${docRef.id}`;

    } catch (e) {
        console.error("Error adding document: ", e);
        alert("An error occurred. Please try again.");
    }
});

// A separate function to check for Firebase connection and remove shimmer
const checkFirebaseConnection = () => {
    // A simple check to see if the Firebase app is initialized and ready
    // You can't rely on the async calls being complete, so this is a heuristic
    // to remove the shimmer after a brief moment to show it works
    setTimeout(() => {
        if (formSection.classList.contains('active')) {
            submitBtn.classList.remove('shimmer');
        }
    }, 1000); // 1-second delay to show the effect 💡
};

// Run the check on initial page load
checkFirebaseConnection();
