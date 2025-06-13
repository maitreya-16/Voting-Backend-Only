import mongoose from 'mongoose';
import express from 'express';
import Candidate from '../models/candidate.js';
import User from '../models/user.js';
import { JwtAuthMiddleware } from '../jwt.js';

const router = express.Router();

// Utility function to check if user is admin
const checkAdminRole = async (userId) => {
    const user = await User.findById(userId);
    return user && user.roles === "admin";
};

// Create a new candidate (Admin only)
router.post('/', JwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        if (!(await checkAdminRole(userId))) {
            return res.status(403).json({ message: "Admin role required" });
        }

        const newCandidate = new Candidate(req.body);
        await newCandidate.save();

        return res.status(201).json({ message: "Candidate details saved" });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Update candidate details (Admin only)
router.put('/:candidateID', JwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        if (!(await checkAdminRole(userId))) {
            return res.status(403).json({ error: "Admin role required" });
        }

        const candidateID = req.params.candidateID;
        const updatedCandidateData = req.body;

        const response = await Candidate.findByIdAndUpdate(candidateID, updatedCandidateData, {
            new: true,
            runValidators: true
        });

        if (!response) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        return res.status(200).json({ response, message: "Candidate updated" });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Delete candidate (Admin only)
router.delete('/:candidateID', JwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id;
        if (!(await checkAdminRole(userId))) {
            return res.status(403).json({ error: "Admin role required" });
        }

        const candidateID = req.params.candidateID;
        const response = await Candidate.findByIdAndDelete(candidateID);

        if (!response) {
            return res.status(404).json({ error: "Candidate not found" });
        }

        return res.status(200).json({ message: "Candidate deleted" });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Vote for a candidate
router.post('/vote/:candidateID', JwtAuthMiddleware, async (req, res) => {
    try {
        const candidateID = req.params.candidateID;
        const userId = req.user.id;

        const candidate = await Candidate.findById(candidateID);
        if (!candidate) {
            return res.status(404).json({ message: "Candidate not found" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        if (user.isVoted) {
            return res.status(400).json({ message: "User has already voted" });
        }
        if (user.roles === 'admin') {
            return res.status(403).json({ message: "Admin is not allowed to vote" });
        }

        // Mark user as voted and update candidate's vote count
        user.isVoted = true;
        await user.save();

        candidate.votes.push({ user: userId });
        candidate.voteCount++;
        await candidate.save();

        return res.status(200).json({ message: "Vote successfully recorded" });
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Get vote count for all candidates
router.get('/vote/count', async (req, res) => {
    try {
        const candidates = await Candidate.find().sort({ voteCount: 'desc' });

        const record = candidates.map((data) => ({
            name: data.name,
            party: data.party,
            voteCount: data.voteCount
        }));

        return res.status(200).json(record);
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

// Get all candidates
router.get('/', async (req, res) => {
    try {
        const candidates = await Candidate.find();
        const record = candidates.map((data) => ({
            name: data.name,
            party: data.party
        }));

        return res.status(200).json(record);
    } catch (err) {
        return res.status(500).json({ error: "Internal Server Error", details: err.message });
    }
});

export default router;
