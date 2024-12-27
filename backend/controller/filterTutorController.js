const { Op, Sequelize } = require('sequelize');
const User = require('../models/user.js');

exports.filterTutors = async (req, res) => {
    try {
        const { subjectsTaught, gradesHandled, availability, hourlyRates, city } = req.query;
        let conditions = [];
        conditions.push({ role: 'tutor' });

        // Filter by subjectsTaught with regex
        if (subjectsTaught) {
            conditions.push({
                subjectsTaught: {
                    [Op.regexp]: subjectsTaught, // Regex matching for subjects
                },
            });
        }

        // Filter by gradesHandled with regex
        if (gradesHandled) {
            conditions.push({
                gradesHandled: {
                    [Op.regexp]: gradesHandled, // Regex matching for grades
                },
            });
        }

        // Filter by city with case-insensitive regex
        if (city) {
            conditions.push({
                city: {
                    [Op.regexp]: `(?i)${city}`, // Regex matching for city
                },
            });
        }

        // Filter by availability with regex
        if (availability) {
            let availabilityList;
            try {
                availabilityList = typeof availability === 'string' ? JSON.parse(availability) : availability;
            } catch (error) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid availability format. It must be a valid JSON string representing an array.',
                });
            }

            const availabilityRegex = availabilityList
                .map(item => `${item.day}.*${item.time}`) // Create regex for each day/time pair
                .join('|');

            conditions.push({
                availability: {
                    [Op.regexp]: availabilityRegex, // Regex matching for availability
                },
            });
        }

        // Filter by hourlyRates (exact match)
        if (hourlyRates) {
            const parsedRate = parseFloat(hourlyRates);
            if (isNaN(parsedRate)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid hourly rate. It must be a valid number.',
                });
            }

            conditions.push({
                hourlyRates: {
                    [Op.eq]: parsedRate, // Exact match for hourly rate
                },
            });
        }

        // Query the database
        const tutors = await User.findAll({
            where: {
                [Op.and]: conditions, // Ensure all conditions must match
            },
        });

        if (tutors.length > 0) {
            return res.status(200).json({
                success: true,
                data: tutors,
            });
        } else {
            return res.status(404).json({
                success: false,
                message: 'No tutors found for the specified criteria',
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message,
        });
    }
};
