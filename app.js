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
const titleInput = document.getElementById('title-input');
const textInput = document.getElementById('text-input');
const submitBtn = document.getElementById('submit-btn');
const titleOutput = document.getElementById('title-output');
const timestampOutput = document.getElementById('timestamp-output');
const textOutput = document.getElementById('text-output');
const shareBtn = document.getElementById('share-btn');
const copyBtn = document.getElementById('copy-btn'); // New copy button
const homeBtn = document.getElementById('home-btn');

// Check the URL for an ID parameter
const urlParams = new URLSearchParams(window.location.search);
const textId = urlParams.get('id');

// Function to handle showing the form
const showForm = () => {
    formSection.classList.add('active');
    displaySection.classList.remove('active');
    submitBtn.classList.add('shimmer');
    if (titleInput) titleInput.classList.add('shimmer');
    if (textInput) textInput.classList.add('shimmer');
};

// Function to calculate time ago
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;

    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
};

// Function to format the full date
const formatDate = (date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(2);
    let hours = date.getHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // The hour '0' should be '12'
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}${ampm}`;
    return `${mm}/${dd}/${yy} ${time}`;
};

// Function to handle showing the text display
const showText = async (id) => {
    formSection.classList.remove('active');
    displaySection.classList.add('active');
    
    // Set both outputs and timestamp to shimmer initially
    titleOutput.classList.add('shimmer');
    textOutput.classList.add('shimmer');
    timestampOutput.classList.add('shimmer');
    shareBtn.classList.add('shimmer');
    copyBtn.classList.add('shimmer');
    homeBtn.classList.add('shimmer');

    // Add placeholder content to shimmer
    titleOutput.textContent = '';
    textOutput.textContent = '';
    timestampOutput.innerHTML = `<span class="timestamp-placeholder shimmer"></span>`;

    // Hide title initially
    titleOutput.classList.add('hidden');

    try {
        const docRef = doc(db, "texts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            const { title, content, createdAt } = data;

            // Remove shimmer from all outputs
            titleOutput.classList.remove('shimmer');
            textOutput.classList.remove('shimmer');
            timestampOutput.classList.remove('shimmer');
            shareBtn.classList.remove('shimmer');
            copyBtn.classList.remove('shimmer');
            homeBtn.classList.remove('shimmer');
            
            // Check if title exists and display it
            if (title && title.trim() !== "") {
                titleOutput.textContent = title;
                titleOutput.classList.remove('hidden');
            } else {
                titleOutput.classList.add('hidden');
            }

            // Display formatted timestamp and time ago
            const date = createdAt.toDate();
            timestampOutput.textContent = `${formatDate(date)} • ${timeAgo(date)}`;
            
            textOutput.textContent = content;
        } else {
            // Invalid link case: show "not found" message and shimmer buttons
            titleOutput.classList.add('hidden');
            textOutput.textContent = "Oops! Text not found.";
        }
    } catch (error) {
        // Error case: show error message and shimmer buttons
        titleOutput.classList.add('hidden');
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
    const title = titleInput.value.trim();
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
            title: title,
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

// Event listener for the Share button
shareBtn.addEventListener('click', () => {
    if (navigator.share) {
        navigator.share({
            title: document.title,
            text: document.title,
            url: window.location.href
        }).then(() => {
            console.log('Successfully shared');
        }).catch(error => {
            console.error('Error sharing:', error);
        });
    } else {
        alert("Web Share API is not supported in your browser.");
    }
});

// Event listener for the Copy button
copyBtn.addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
        alert("Link copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        alert("Failed to copy link.");
    });
});

// Event listener for the Go Home button
homeBtn.addEventListener('click', () => {
    window.location.href = `https://githubuser102234.github.io/TextShare/`;
});

// A separate function to check for Firebase connection and remove shimmer
const checkFirebaseConnection = () => {
    setTimeout(() => {
        if (formSection.classList.contains('active')) {
            submitBtn.classList.remove('shimmer');
            if (titleInput) titleInput.classList.remove('shimmer');
            if (textInput) textInput.classList.remove('shimmer');
        }
    }, 1000); // 1-second delay to show the effect
};

// Run the check on initial page load
checkFirebaseConnection();
