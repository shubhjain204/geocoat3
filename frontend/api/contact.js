const nodemailer = require("nodemailer");

const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "admin.geocoat@gmail.com";

function clean(value) {
    return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

module.exports = async function handler(req, res) {
    if (req.method !== "POST") {
        res.setHeader("Allow", "POST");
        return res.status(405).json({ message: "Method not allowed" });
    }

    const name = clean(req.body?.name);
    const email = clean(req.body?.email);
    const phone = clean(req.body?.phone);
    const message = clean(req.body?.message);

    if (!name || !email || !message || !isValidEmail(email)) {
        return res.status(400).json({ message: "Please provide a valid name, email and message." });
    }

    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
        return res.status(500).json({ message: "Email service is not configured yet." });
    }

    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_APP_PASSWORD,
            },
        });

        const submittedAt = new Date().toLocaleString("en-IN", {
            timeZone: "Asia/Kolkata",
            dateStyle: "medium",
            timeStyle: "short",
        });

        const text = [
            "New GeoCoat website enquiry",
            "",
            `Name: ${name}`,
            `Email: ${email}`,
            phone ? `Phone: ${phone}` : null,
            `Submitted: ${submittedAt}`,
            "",
            "Message:",
            message,
        ].filter(Boolean).join("\n");

        await transporter.sendMail({
            from: `GeoCoat Website <${process.env.GMAIL_USER}>`,
            to: CONTACT_TO_EMAIL,
            replyTo: email,
            subject: `GeoCoat enquiry from ${name}`,
            text,
        });

        return res.status(200).json({ message: "Enquiry sent successfully." });
    } catch (error) {
        console.error("Contact email failed", error);
        return res.status(500).json({ message: "Could not send your enquiry right now." });
    }
};