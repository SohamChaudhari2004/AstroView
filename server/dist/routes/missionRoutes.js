"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Mission_1 = __importDefault(require("../models/Mission"));
const router = express_1.default.Router();
// Get all missions
router.get('/', async (req, res) => {
    try {
        const missions = await Mission_1.default.find().sort({ launchDate: 1 });
        res.json(missions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching missions' });
    }
});
// Get missions by status (upcoming/ongoing)
router.get('/status/:status', async (req, res) => {
    try {
        const { status } = req.params;
        const missions = await Mission_1.default.find({ status }).sort({ launchDate: 1 });
        res.json(missions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching missions by status' });
    }
});
// Get missions by organization
router.get('/organization/:org', async (req, res) => {
    try {
        const { org } = req.params;
        const missions = await Mission_1.default.find({
            organization: { $regex: new RegExp(org, 'i') }
        }).sort({ launchDate: 1 });
        res.json(missions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching missions by organization' });
    }
});
// Get list of organizations
router.get('/organizations', async (req, res) => {
    try {
        const organizations = await Mission_1.default.distinct('organization');
        res.json(organizations);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching organizations' });
    }
});
// Get mission by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const mission = await Mission_1.default.findById(id);
        if (!mission) {
            return res.status(404).json({ message: 'Mission not found' });
        }
        res.json(mission);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching mission' });
    }
});
// Initialize missions with sample data
router.post('/init', async (req, res) => {
    try {
        const sampleMissions = [
            // NASA Missions
            {
                name: 'Artemis III',
                organization: 'NASA',
                status: 'upcoming',
                destination: 'Moon',
                launchDate: new Date('2026-09-01'),
                description: 'First crewed lunar landing since Apollo 17, landing near the lunar south pole',
                crew: 4,
                progress: 75,
                missionType: 'Crewed Lunar Landing'
            },
            {
                name: 'Europa Clipper',
                organization: 'NASA',
                status: 'ongoing',
                destination: 'Jupiter - Europa',
                launchDate: new Date('2024-10-14'),
                description: 'Detailed reconnaissance of Jupiter\'s moon Europa',
                crew: 0,
                progress: 35,
                missionType: 'Planetary Science'
            },
            {
                name: 'Mars Sample Return',
                organization: 'NASA',
                status: 'planned',
                destination: 'Mars',
                launchDate: new Date('2028-01-01'),
                description: 'Return samples collected by Perseverance rover',
                crew: 0,
                progress: 20,
                missionType: 'Sample Return'
            },
            {
                name: 'PACE',
                organization: 'NASA',
                status: 'ongoing',
                destination: 'Earth Orbit',
                launchDate: new Date('2024-02-08'),
                description: 'Plankton, Aerosol, Cloud, ocean Ecosystem satellite',
                crew: 0,
                progress: 100,
                missionType: 'Earth Science'
            },
            // ISRO Missions
            {
                name: 'Gaganyaan',
                organization: 'ISRO',
                status: 'upcoming',
                destination: 'Low Earth Orbit',
                launchDate: new Date('2026-06-01'),
                description: 'India\'s first crewed spaceflight mission',
                crew: 3,
                progress: 85,
                missionType: 'Crewed Spaceflight'
            },
            {
                name: 'Chandrayaan-4',
                organization: 'ISRO',
                status: 'planned',
                destination: 'Moon',
                launchDate: new Date('2027-01-01'),
                description: 'Lunar sample return mission',
                crew: 0,
                progress: 30,
                missionType: 'Lunar Sample Return'
            },
            {
                name: 'Aditya-L1',
                organization: 'ISRO',
                status: 'ongoing',
                destination: 'Sun-Earth L1 Point',
                launchDate: new Date('2023-09-02'),
                description: 'India\'s first solar observatory mission',
                crew: 0,
                progress: 100,
                missionType: 'Solar Science'
            },
            {
                name: 'NISAR',
                organization: 'ISRO',
                status: 'upcoming',
                destination: 'Earth Orbit',
                launchDate: new Date('2026-03-01'),
                description: 'NASA-ISRO Synthetic Aperture Radar satellite',
                crew: 0,
                progress: 90,
                missionType: 'Earth Science'
            },
            // ESA Missions
            {
                name: 'JUICE',
                organization: 'ESA',
                status: 'ongoing',
                destination: 'Jupiter - Ganymede',
                launchDate: new Date('2023-04-14'),
                description: 'Jupiter Icy Moons Explorer',
                crew: 0,
                progress: 25,
                missionType: 'Planetary Science'
            },
            {
                name: 'Hera',
                organization: 'ESA',
                status: 'ongoing',
                destination: 'Didymos Asteroid',
                launchDate: new Date('2024-10-07'),
                description: 'Planetary defense mission to study DART impact',
                crew: 0,
                progress: 15,
                missionType: 'Planetary Defense'
            },
            // SpaceX Missions
            {
                name: 'Starship to Mars',
                organization: 'SpaceX',
                status: 'planned',
                destination: 'Mars',
                launchDate: new Date('2028-01-01'),
                description: 'First uncrewed Starship mission to Mars',
                crew: 0,
                progress: 45,
                missionType: 'Mars Exploration'
            },
            {
                name: 'Polaris Dawn',
                organization: 'SpaceX',
                status: 'ongoing',
                destination: 'High Earth Orbit',
                launchDate: new Date('2024-09-10'),
                description: 'Commercial spacewalk mission',
                crew: 4,
                progress: 100,
                missionType: 'Commercial Spaceflight'
            },
            // CNSA Missions
            {
                name: 'Tianwen-2',
                organization: 'CNSA',
                status: 'upcoming',
                destination: 'Near-Earth Asteroid',
                launchDate: new Date('2026-05-01'),
                description: 'Asteroid sample return mission',
                crew: 0,
                progress: 70,
                missionType: 'Sample Return'
            },
            {
                name: 'Chang\'e 7',
                organization: 'CNSA',
                status: 'upcoming',
                destination: 'Moon South Pole',
                launchDate: new Date('2026-01-01'),
                description: 'Lunar south pole exploration',
                crew: 0,
                progress: 80,
                missionType: 'Lunar Exploration'
            }
        ];
        for (const mission of sampleMissions) {
            await Mission_1.default.findOneAndUpdate({ name: mission.name }, mission, { upsert: true, new: true });
        }
        res.json({ message: 'Missions initialized', count: sampleMissions.length });
    }
    catch (error) {
        console.error('Error initializing missions:', error);
        res.status(500).json({ message: 'Error initializing missions' });
    }
});
exports.default = router;
