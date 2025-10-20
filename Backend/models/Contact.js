const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema(
  {
    // User Details
    name: {
      type: String,
      trim: true,
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email',
      ],
    },
    website: {
      type: String,
      trim: true,
      match: [
        /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/,
        'Please enter a valid website URL',
      ],
      default: '',
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },

    // Metadata (Auto-generated)
    ipAddress: {
      type: String,
      trim: true,
      default: '',
    },
    userAgent: {
      type: String,
      trim: true,
      default: '',
    },
    referrer: {
      type: String,
      trim: true,
      default: '',
    },

    // Status Tracking
    status: {
      type: String,
      enum: ['pending', 'read', 'replied'],
      default: 'pending',
    },
    repliedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries
contactSchema.index({ email: 1 });
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });

// Pre-save middleware (removed spam check to allow empty messages)
contactSchema.pre('save', function (next) {
  next(); // No validation to allow all submissions
});

module.exports = mongoose.model('Contact', contactSchema);
