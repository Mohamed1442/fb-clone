/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

import express from "express";
import { register, login } from "../controllers/auth.controller";

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered
 *         content:
 *           application/json:
 *             example:
 *               message: User registered
 *               user:
 *                 id: 1
 *                 name: John Doe
 *                 email: john@example.com
 *       400:
 *         description: Email already exists
 */
// @ts-ignores
router.post("/register", register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             example:
 *               message: Login successful
 *               token: jwt-token-here
 *               user:
 *                 id: 1
 *                 name: John Doe
 *                 email: john@example.com
 *       404:
 *         description: User not found
 *       401:
 *         description: Invalid credentials
 */
// @ts-ignore
router.post("/login", login);

export default router;
