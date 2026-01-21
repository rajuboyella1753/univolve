const express = require('express');
const router = express.Router();
const upload = require('../middlewares/multerConfig');
const { protect } = require('../middlewares/authMiddleware');
const {
  sellItem,
  getAllItems,
  updateItem,
  deleteItem,
} = require('../controllers/marketplaceController');

router.post('/sell', protect, upload.single('image'), sellItem);
router.get('/items', getAllItems);
router.put('/update/:id', protect, upload.single('image'), updateItem);
router.delete('/delete/:id', protect, deleteItem);

module.exports = router;
