// const VacationRequest = require('../models/VacationRequest');
// const User = require('../models/User');
// const moment = require('moment');
// const axios = require('axios'); 


// exports.createVacationRequest = async (req, res) => {
//   try {
//       const { userId, startDate, endDate, type } = req.body;
//       if (!userId || !startDate || !endDate || !type) {
//           return res.status(400).json({ error: 'Missing required fields' });
//       }

//       const formattedStartDate = moment(startDate, 'YYYY-MM-DD').toDate();
//       const formattedEndDate = moment(endDate, 'YYYY-MM-DD').toDate();
//       const today = moment().startOf('day').toDate();

//       if (formattedStartDate < today) {
//           return res.status(400).json({ error: 'Start date must be today or later' });
//       }

//       const period = moment(formattedEndDate).diff(moment(formattedStartDate), 'days') + 1;

//       if (period <= 0) {
//           return res.status(400).json({ error: 'Invalid date range' });
//       }

//       const response = await axios.get(http://localhost:8080/api/users/${userId}/remainingDays);
//       const remainingDays = response.data.remainingDays;

//       if (remainingDays === undefined) {
//           throw new Error('Failed to fetch remaining days');
//       }

//       if (period > remainingDays) {
//           return res.status(400).json({ error: 'You are requesting more days than your remaining vacation days.' });
//       }

//       const newRequest = await VacationRequest.create({
//           userId,
//           period: period.toString(),
//           startDate: formattedStartDate,
//           endDate: formattedEndDate,
//           type,
//           createdAt: new Date(),
//           status: 'waiting'
//       });

//       res.status(201).json({ message: 'Vacation request created successfully', newRequest });
//   } catch (error) {
//       console.error('Error creating vacation request:', error.message);
//       res.status(500).json({ error: 'Failed to create vacation request', details: error.message });
//   }
// };
// exports.getRemainingVacationDays = async (req, res) => {
//   try {
//       const { userId } = req.params;
//       if (!userId) {
//           return res.status(400).json({ error: 'Missing userId' });
//       }

//       const approvedVacations = await VacationRequest.find({ userId, status: 'approved' });
//       const consumedDays = approvedVacations.reduce((total, vacation) => total + parseInt(vacation.period, 10), 0);
//       const remainingDays = 21 - consumedDays;

//       res.status(200).json({ remainingDays });
//   } catch (error) {
//       console.error('Error fetching remaining vacation days:', error.message);
//       res.status(500).json({ error: 'Failed to get remaining vacation days', details: error.message });
//   }
// };
// // Autres méthodes (getAllVacationRequests, getVacationRequestsByUser, rejectVacationRequest, approveVacationRequest) restent inchangées







// // exports.getAllVacationRequests = async (req, res) => {
// //     try {
// //       const requests = await VacationRequest.find().populate('userId', 'name email','image: request.userId.image'); // Remplacez 'userId' par le champ approprié pour l'employé
// //       res.json(requests);
// //     } catch (error) {
// //       res.status(500).json({ error: 'Failed to get vacation requests', details: error.message });
// //     }
// //   };

// exports.getAllVacationRequests = async (req, res) => {
//   const status = req.query.status
//     try {
//       const requests = status === 'all' ? await VacationRequest.find().populate({
//         path: 'userId',
//         select: 'name email image' // Sélectionnez les champs de l'utilisateur que vous souhaitez inclure
//       })  : await VacationRequest.find({status: status}).populate({
//         path: 'userId',
//         select: 'name email image' // Sélectionnez les champs de l'utilisateur que vous souhaitez inclure
//       }) 
//       res.json(requests);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to get vacation requests', details: error.message });
//     }
//   };


//   exports.getVacationRequestsByUser = async (req, res) => {
//     try {
//         const { userId } = req.params;
//         const requests = await VacationRequest.find({ userId });

//         // Formatage des dates pour l'affichage
//         const formattedRequests = requests.map(request => ({
//             ...request.toObject(),
//             startDate: moment(request.startDate).format('YYYY-MM-DD'),
//             endDate: moment(request.endDate).format('YYYY-MM-DD')
//         }));

//         res.json({ message: 'List of vacation requests retrieved successfully', requests: formattedRequests });
//     } catch (error) {
//         res.status(500).json({ error: 'Failed to get vacation requests', details: error.message });
//     }
// };



// //nv fcté

// // Contrôleur pour rejeter une demande de vacances
// exports.rejectVacationRequest = async (req, res) => {
//     try {
//       const { requestId } = req.params;
//       const request = await VacationRequest.findById(requestId);
//       if (!request) {
//         return res.status(404).json({ error: 'Vacation request not found' });
//       }
//       request.status = 'rejected';
//       await request.save();
//       res.json({ message: 'Vacation request rejected successfully', request });
//     } catch (error) {
//       console.error('Error rejecting vacation request:', error.message);
//       res.status(500).json({ error: 'Failed to reject vacation request', details: error.message });
//     }
//   };

//   exports.approveVacationRequest = async (req, res) => {
//     try {
//       const { requestId } = req.params;
//       const request = await VacationRequest.findById(requestId);
//       if (!request) {
//         return res.status(404).json({ error: 'Vacation request not found' });
//       }
//       request.status = 'approved';
//       await request.save();
//       res.json({ message: 'Vacation request approved successfully', request });
//     } catch (error) {
//       console.error('Error approving vacation request:', error.message);
//       res.status(500).json({ error: 'Failed to approve vacation request', details: error.message });
//     }
//   };

const mongoose = require('mongoose');

const VacationRequest = require('../models/VacationRequest');
const User = require('../models/User');
const moment = require('moment');
const axios = require('axios');

exports.createVacationRequest = async (req, res) => {
    try {
        const { userId, startDate, endDate, type } = req.body;
        if (!userId || !startDate || !endDate || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const formattedStartDate = moment(startDate, 'YYYY-MM-DD').toDate();
        const formattedEndDate = moment(endDate, 'YYYY-MM-DD').toDate();
        const today = moment().startOf('day').toDate();

        if (formattedStartDate < today) {
            return res.status(400).json({ error: 'Start date must be today or later' });
        }

        const period = moment(formattedEndDate).diff(moment(formattedStartDate), 'days') + 1;

        if (period <= 0) {
            return res.status(400).json({ error: 'Invalid date range' });
        }

        const response = await axios.get(`http://localhost:8080/api/users/${userId}/remainingDays`);
        const remainingDays = response.data.remainingDays;

        if (remainingDays === undefined) {
            throw new Error('Failed to fetch remaining days');
        }

        if (period > remainingDays) {
            return res.status(400).json({ error: 'You are requesting more days than your remaining vacation days.' });
        }

        const newRequest = await VacationRequest.create({
            userId,
            period: period.toString(),
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            type,
            createdAt: new Date(),
            status: 'waiting'
        });

        res.status(201).json({ message: 'Vacation request created successfully', newRequest });
    } catch (error) {
        console.error('Error creating vacation request:', error.message);
        res.status(500).json({ error: 'Failed to create vacation request', details: error.message });
    }
};

exports.getRemainingVacationDays = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'Missing userId' });
        }

        const approvedVacations = await VacationRequest.find({ userId, status: 'approved' });
        const consumedDays = approvedVacations.reduce((total, vacation) => total + parseInt(vacation.period, 10), 0);
        const remainingDays = 21 - consumedDays;

        res.status(200).json({ remainingDays });
    } catch (error) {
        console.error('Error fetching remaining vacation days:', error.message);
        res.status(500).json({ error: 'Failed to get remaining vacation days', details: error.message });
    }
};
// Autres méthodes (getAllVacationRequests, getVacationRequestsByUser, rejectVacationRequest, approveVacationRequest) restent inchangées







// exports.getAllVacationRequests = async (req, res) => {
//     try {
//       const requests = await VacationRequest.find().populate('userId', 'name email','image: request.userId.image'); // Remplacez 'userId' par le champ approprié pour l'employé
//       res.json(requests);
//     } catch (error) {
//       res.status(500).json({ error: 'Failed to get vacation requests', details: error.message });
//     }
//   };

exports.getAllVacationRequests = async (req, res) => {
    const status = req.query.status
    try {
        const requests = status === 'all' ? await VacationRequest.find().populate({
            path: 'userId',
            select: 'name email image' // Sélectionnez les champs de l'utilisateur que vous souhaitez inclure
        }) : await VacationRequest.find({ status: status }).populate({
            path: 'userId',
            select: 'name email image' // Sélectionnez les champs de l'utilisateur que vous souhaitez inclure
        })
        res.json(requests);
    } catch (error) {
        res.status(500).json({ error: 'Failed to get vacation requests', details: error.message });
    }
};


exports.getVacationRequestsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const requests = await VacationRequest.find({ userId });

        // Formatage des dates pour l'affichage
        const formattedRequests = requests.map(request => ({
            ...request.toObject(),
            startDate: moment(request.startDate).format('YYYY-MM-DD'),
            endDate: moment(request.endDate).format('YYYY-MM-DD')
        }));

        res.json({ message: 'List of vacation requests retrieved successfully', requests: formattedRequests });
    } catch (error) {
        res.status(500).json({ error: 'Failed to get vacation requests', details: error.message });
    }
};



//nv fcté

// Contrôleur pour rejeter une demande de vacances
// Contrôleur pour rejeter une demande de vacances
exports.rejectVacationRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ error: 'Invalid requestId' });
        }

        const request = await VacationRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Vacation request not found' });
        }

        request.status = 'rejected';
        await request.save();
        res.json({ message: 'Vacation request rejected successfully', request });
    } catch (error) {
        console.error('Error rejecting vacation request:', error.message);
        res.status(500).json({ error: 'Failed to reject vacation request', details: error.message });
    }
};
// Contrôleur pour approuver une demande de vacances
exports.approveVacationRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(requestId)) {
            return res.status(400).json({ error: 'Invalid requestId' });
        }

        // Vérifiez l'ID extrait
        console.log('Extracted requestId:', requestId);

        const request = await VacationRequest.findById(requestId);
        if (!request) {
            return res.status(404).json({ error: 'Vacation request not found' });
        }

        request.status = 'approved';
        await request.save();
        res.json({ message: 'Vacation request approved successfully', request });
    } catch (error) {
        console.error('Error approving vacation request:', error.message);
        res.status(500).json({ error: 'Failed to approve vacation request', details: error.message });
    }
};
