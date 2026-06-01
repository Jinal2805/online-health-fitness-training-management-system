const express = require("express");
const Contact = require("../models/Contact");
const nodemailer = require("nodemailer");

const router = express.Router();


/* ---------------- CREATE CONTACT (FIX) ---------------- */
router.post("/", async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        const newContact = await Contact.create({
            name,
            email,
            subject,
            message,
        });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: newContact
        });

    } catch (error) {
        console.log("CREATE CONTACT ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

/* ---------------- GET ALL ---------------- */
router.get("/", async (req, res) => {
    try {
        const { search = "", page = 1, limit = 5 } = req.query;

        const query = {
            $or: [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { subject: { $regex: search, $options: "i" } },
            ],
        };

        const messages = await Contact.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const total = await Contact.countDocuments(query);

        // 🔥 UNREAD COUNT (IMPORTANT)
        const unreadCount = await Contact.countDocuments({
            $or: [
                { isRead: false },
                { isRead: { $exists: false } }, // 🔥 handles old records
            ],
        });

        res.json({
            messages,
            total,
            unreadCount,
            page: Number(page),
            pages: Math.ceil(total / limit),
        });

    } catch (error) {
        console.log("GET CONTACT ERROR:", error);
        res.status(500).json({ messages: [], error: error.message });
    }
});

/* ---------------- MARK AS READ ---------------- */
router.patch("/read/:id", async (req, res) => {
    try {
        await Contact.findByIdAndUpdate(req.params.id, {
            isRead: true,
        });

        res.json({ message: "Marked as read" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ---------------- DELETE ---------------- */
router.delete("/:id", async (req, res) => {
    try {
        await Contact.findByIdAndDelete(req.params.id);
        res.json({ message: "Deleted" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/* ---------------- REPLY EMAIL (ONLY ONE) ---------------- */
router.post("/reply/:id", async (req, res) => {
    try {
        const { replyMessage } = req.body;

        const contact = await Contact.findById(req.params.id);

        if (!contact) {
            return res.status(404).json({ message: "Message not found" });
        }

        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS,
            },
        });

        await transporter.sendMail({
            from: process.env.EMAIL,
            to: contact.email,
            subject: `Re: ${contact.subject}`,
            text: replyMessage,
        });

        res.json({ message: "Email sent successfully" });

    } catch (error) {
        console.log("EMAIL ERROR:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;