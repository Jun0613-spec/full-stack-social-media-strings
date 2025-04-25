"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const prisma_1 = require("../lib/prisma");
const register = async (req, res) => {
    const { email, password, firstName, lastName, username } = req.body;
    try {
        const existingUser = await prisma_1.prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        });
        if (existingUser) {
            if (existingUser.email === email) {
                res.status(409).json({ message: "Email already in use" });
                return;
            }
            if (existingUser.username === username) {
                res.status(409).json({ message: "Username already in use" });
                return;
            }
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 12);
        const newUser = await prisma_1.prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                firstName,
                lastName,
                username
            }
        });
        res.status(200).json({
            message: "User has been created",
            newUser
        });
    }
    catch (error) {
        console.error("Registration error:", error);
        res.status(400).json({ message: "Failed to sign up" });
    }
};
exports.register = register;
const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await prisma_1.prisma.user.findUnique({
            where: { email }
        });
        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        if (!user.password) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            // maxAge: 1000 * 60 * 60 // 1 hour
            maxAge: 1000 * 60 * 60 * 24 // 1 day
        });
        res.status(200).json({
            message: "Login successful",
            user,
            token
        });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(400).json({ message: "Failed to login" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
        });
        res.status(200).json({ message: "Logout successful" });
    }
    catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Failed to logout" });
    }
};
exports.logout = logout;
