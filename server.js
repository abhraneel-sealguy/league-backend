const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// 1. DATABASE & CONFIG (Stored in computer memory for this setup)
const ADMIN_PASSWORD = "admin123"; // 👈 Set your secret admin password here

let approvedStudents = [
    { studentId: "LEAGUE-101" },
    { studentId: "LEAGUE-102" },
    { studentId: "LEAGUE-103" }
];

let studyMaterials = [
    { id: "1", title: "Mathematics Chapter 1", url: "https://w3.org" },
    { id: "2", title: "Physics Lab Manual", url: "https://w3.org" }
];

// 2. STUDENT LOGIN ROUTE
app.post('/api/login', (req, res) => {
    const { id } = req.body;
    const studentExists = approvedStudents.find(s => s.studentId === id);
    
    if (studentExists) {
        res.json({ success: true, message: "Access granted!" });
    } else {
        res.status(403).json({ success: false, message: "Access Denied: Invalid ID Number." });
    }
});

// 3. ADMIN LOGIN ROUTE
app.post('/api/admin/login', (req, res) => {
    const { password } = req.body;

    if (password === ADMIN_PASSWORD) {
        res.json({ success: true, message: "Admin authentication successful!" });
    } else {
        res.status(401).json({ success: false, message: "Invalid Admin Password." });
    }
});

// 4. FETCH MATERIALS ROUTE
app.get('/api/materials', (req, res) => {
    res.json(studyMaterials);
});

// 5. ADMIN UPLOAD ROUTE
app.post('/api/admin/upload', (req, res) => {
    const { title, url } = req.body;
    if (!title || !url) {
        return res.status(400).json({ success: false, message: "Missing title or URL" });
    }
    const newMaterial = {
        id: Date.now().toString(),
        title: title,
        url: url
    };
    studyMaterials.push(newMaterial);
    res.json({ success: true, message: "Material uploaded!", data: newMaterial });
});

// 6. ADMIN REMOVE ROUTE
app.delete('/api/admin/remove/:id', (req, res) => {
    const { id } = req.params;
    studyMaterials = studyMaterials.filter(item => item.id !== id);
    res.json({ success: true, message: "Material removed successfully!" });
});

// START THE SERVER
// 👈 CHANGED: Uses Render's dynamic port environment variable, or falls back to 5000 locally
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`League backend server running on port ${PORT}`);
});