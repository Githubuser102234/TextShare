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
import { getFirestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get a reference to the main HTML elements
const formSection = document.getElementById('form-section');
const displaySection = document.getElementById('display-section');
const tokenSection = document.getElementById('token-section');
const editSection = document.getElementById('edit-section');
const passwordPromptSection = document.getElementById('password-prompt');

const titleInput = document.getElementById('title-input');
const passwordInput = document.getElementById('password-input');
const textInput = document.getElementById('text-input');
const submitBtn = document.getElementById('submit-btn');

const titleOutput = document.getElementById('title-output');
const timestampOutput = document.getElementById('timestamp-output');
const textOutput = document.getElementById('text-output');
const shareBtn = document.getElementById('share-btn');
const copyBtn = document.getElementById('copy-btn');
const homeBtn = document.getElementById('home-btn');

const keyIcon = document.getElementById('key-icon');
const accessToken = document.getElementById('access-token');
const tokenContinueBtn = document.getElementById('token-continue-btn');

const titleEdit = document.getElementById('title-edit');
const passwordEdit = document.getElementById('password-edit');
const textEdit = document.getElementById('text-edit');
const saveBtn = document.getElementById('save-btn');
const deleteBtn = document.getElementById('delete-btn');

const passwordPromptInput = document.getElementById('password-prompt-input');
const passwordPromptBtn = document.getElementById('password-prompt-btn');

// NEW: Get a reference to the report icon and the new menu elements
const reportIcon = document.getElementById('report-icon');
const reportMenu = document.getElementById('report-menu');
const reportReason = document.getElementById('report-reason');
const submitReportBtn = document.getElementById('submit-report-btn');
const cancelReportBtn = document.getElementById('cancel-report-btn');

let currentNoteData = null; // To store note data for quick access

// Check the URL for an ID parameter
const urlParams = new URLSearchParams(window.location.search);
const textId = urlParams.get('id');

// Function to handle showing the form
const showForm = () => {
    formSection.classList.add('active');
    displaySection.classList.remove('active');
    editSection.classList.remove('active');
    tokenSection.classList.remove('active');
    passwordPromptSection.classList.remove('active');
    submitBtn.classList.add('shimmer');
    if (titleInput) titleInput.classList.add('shimmer');
    if (textInput) textInput.classList.add('shimmer');
    if (passwordInput) passwordInput.classList.add('shimmer');
};

// Function to calculate time ago
const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + " years ago";
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + " months ago";
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + " days ago";
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + " hours ago";
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + " minutes ago";
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
    hours = hours ? hours : 12;
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const time = `${hours}:${minutes}${ampm}`;
    return `${mm}/${dd}/${yy} ${time}`;
};

// Function to handle showing the text display
const showText = async (id, password = null) => {
    formSection.classList.remove('active');
    tokenSection.classList.remove('active');
    editSection.classList.remove('active');
    passwordPromptSection.classList.remove('active');
    displaySection.classList.add('active');
    keyIcon.classList.remove('hidden');

    titleOutput.classList.add('shimmer');
    textOutput.classList.add('shimmer');
    timestampOutput.classList.add('shimmer');
    shareBtn.classList.add('shimmer');
    copyBtn.classList.add('shimmer');
    homeBtn.classList.add('shimmer');
    keyIcon.classList.add('shimmer');

    titleOutput.textContent = '';
    textOutput.textContent = '';
    timestampOutput.innerHTML = `<span class="timestamp-placeholder shimmer"></span>`;
    titleOutput.classList.add('hidden');

    try {
        const docRef = doc(db, "texts", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            currentNoteData = docSnap.data();

            // If there's a password, prompt for it
            if (currentNoteData.password && currentNoteData.password !== password) {
                showPasswordPrompt();
                return;
            }

            // Remove shimmer from all outputs
            titleOutput.classList.remove('shimmer');
            textOutput.classList.remove('shimmer');
            timestampOutput.classList.remove('shimmer');
            shareBtn.classList.remove('shimmer');
            copyBtn.classList.remove('shimmer');
            homeBtn.classList.remove('shimmer');
            keyIcon.classList.remove('shimmer');

            const { title, content, createdAt } = currentNoteData;
            
            if (title && title.trim() !== "") {
                titleOutput.textContent = title;
                titleOutput.classList.remove('hidden');
            } else {
                titleOutput.classList.add('hidden');
            }
            const date = createdAt.toDate();
            timestampOutput.textContent = `${formatDate(date)} • ${timeAgo(date)}`;
            
            // Use marked.js to convert the markdown to HTML
            textOutput.innerHTML = marked.parse(content);
            
        } else {
            titleOutput.classList.add('hidden');
            textOutput.textContent = "Oops! Text not found.";
        }
    } catch (error) {
        titleOutput.classList.add('hidden');
        textOutput.textContent = "Error loading text. Please try again later.";
        console.error("Error getting document:", error);
    }
};

const showPasswordPrompt = () => {
    displaySection.classList.remove('active');
    passwordPromptSection.classList.add('active');
};

const switchToEditMode = (data) => {
    displaySection.classList.remove('active');
    editSection.classList.add('active');
    keyIcon.classList.add('hidden');
    passwordPromptSection.classList.remove('active');

    titleEdit.value = data.title || '';
    passwordEdit.value = data.password || '';
    textEdit.value = data.content || '';
};

// Initial check
if (textId) {
    showText(textId);
} else {
    showForm();
}

// Function to generate a random token
const generateToken = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 20; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

// Event listener for the form submission
submitBtn.addEventListener('click', async () => {
    const title = titleInput.value.trim();
    const password = passwordInput.value.trim();
    const text = textInput.value.trim();
    const token = generateToken();

    if (text === "") {
        alert("Please enter some text!");
        return;
    }
    
    submitBtn.classList.add('shimmer');
    titleInput.classList.add('shimmer');
    passwordInput.classList.add('shimmer');
    textInput.classList.add('shimmer');

    try {
        const docRef = await addDoc(collection(db, "texts"), {
            title: title,
            password: password,
            content: text,
            token: token,
            createdAt: new Date()
        });
        
        submitBtn.classList.remove('shimmer');
        formSection.classList.remove('active');
        tokenSection.classList.add('active');
        accessToken.textContent = token;

        tokenContinueBtn.addEventListener('click', () => {
            window.location.href = `https://githubuser102234.github.io/TextShare/?id=${docRef.id}`;
        });

    } catch (e) {
        console.error("Error adding document: ", e);
        alert("An error occurred. Please try again.");
    }
});

// Event listener for the Key Icon
keyIcon.addEventListener('click', async () => {
    const userToken = prompt("Enter your permanent access token to edit this note:");
    if (!userToken) return;

    try {
        const docRef = doc(db, "texts", textId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            if (data.token === userToken) {
                switchToEditMode(data);
            } else {
                alert("Invalid token. You do not have permission to edit this note.");
            }
        } else {
            alert("Note not found.");
        }
    } catch (error) {
        alert("An error occurred while validating the token.");
        console.error("Error validating token:", error);
    }
});

// Event listener for the Save button
saveBtn.addEventListener('click', async () => {
    const newTitle = titleEdit.value.trim();
    const newPassword = passwordEdit.value.trim();
    const newText = textEdit.value.trim();

    if (newText === "") {
        alert("Please enter some text!");
        return;
    }

    try {
        const docRef = doc(db, "texts", textId);
        await updateDoc(docRef, {
            title: newTitle,
            password: newPassword,
            content: newText
        });
        alert("Note saved successfully!");
        window.location.reload();
    } catch (error) {
        console.error("Error updating document:", error);
        alert("An error occurred while saving the note.");
    }
});

// Event listener for the Delete button
deleteBtn.addEventListener('click', async () => {
    if (confirm("Are you sure you want to delete this note? This action cannot be undone.")) {
        try {
            const docRef = doc(db, "texts", textId);
            await deleteDoc(docRef);
            alert("Note deleted successfully!");
            window.location.href = `https://githubuser102234.github.io/TextShare/`;
        } catch (error) {
            console.error("Error deleting document:", error);
            alert("An error occurred while deleting the note.");
        }
    }
});

// Event listener for the Password Prompt button
passwordPromptBtn.addEventListener('click', () => {
    const enteredPassword = passwordPromptInput.value.trim();
    if (enteredPassword === currentNoteData.password) {
        showText(textId, enteredPassword);
    } else {
        alert("Incorrect password.");
        passwordPromptInput.value = '';
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

// NEW: Event listener for the Report Icon
reportIcon.addEventListener('click', () => {
    reportMenu.classList.add('active');
});

// NEW: Event listener for the Cancel button on the report menu
cancelReportBtn.addEventListener('click', () => {
    reportMenu.classList.remove('active');
    reportReason.value = ''; // Clear the text field
});

// NEW: Event listener for the Submit button on the report menu
submitReportBtn.addEventListener('click', async () => {
    const reason = reportReason.value.trim();
    if (reason === "") {
        alert("Please provide a reason for the report.");
        return;
    }

    // Add a new document to the 'reports' collection
    try {
        await addDoc(collection(db, "reports"), {
            noteId: textId,
            reason: reason,
            reportedAt: new Date()
        });
        alert("Thank you for your report! We'll look into it.");
        reportMenu.classList.remove('active');
        reportReason.value = ''; // Clear the text field after submission
    } catch (e) {
        console.error("Error adding report document: ", e);
        alert("An error occurred while submitting the report. Please try again.");
    }
});

// A separate function to check for Firebase connection and remove shimmer
const checkFirebaseConnection = () => {
    setTimeout(() => {
        if (formSection.classList.contains('active')) {
            submitBtn.classList.remove('shimmer');
            if (titleInput) titleInput.classList.remove('shimmer');
            if (textInput) textInput.classList.remove('shimmer');
            if (passwordInput) passwordInput.classList.remove('shimmer'); // Fix applied here
        }
    }, 1000);
};

// Hide the Share button if not supported
if (!navigator.share) {
    shareBtn.classList.add('hidden');
}

// Run the check on initial page load
checkFirebaseConnection();
