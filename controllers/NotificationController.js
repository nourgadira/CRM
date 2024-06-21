const NotificationModel = require('../models/Notification');


const GetNotifications = async (req, res) => {
  const userId = req.user.id
  try {
    const Notifications = await NotificationModel.find({ receiver: userId }).sort({ createdAt: 'desc' })
    return res.send(Notifications)
  } catch (error) {
    console.log(error)
    res.status(500).send("error")
  }
}


const ReadNotifications = async (req, res) => {
  const id = req.body.id
  try {
    const Notifications = await NotificationModel.findOneAndUpdate({ _id: id }, { $set: { isRead: true }, new: true })
    return res.send(Notifications)
  } catch (error) {
    res.status(500).send("error")
  }
}


module.exports.notificationController = {
  GetNotifications,
  ReadNotifications
}

