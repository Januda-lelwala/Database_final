const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Booking', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    bookingId: {
      type: DataTypes.STRING,
      unique: true,
      defaultValue: () => 'BK' + Date.now() + Math.floor(Math.random() * 1000)
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    routeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'routes',
        key: 'id'
      }
    },
    vehicleId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'vehicles',
        key: 'id'
      }
    },
    pickupLocationName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pickupLocationLat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pickupLocationLng: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pickupAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dropLocationName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dropLocationLat: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    dropLocationLng: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    dropAddress: {
      type: DataTypes.STRING,
      allowNull: true
    },
    bookingDate: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    travelDate: {
      type: DataTypes.DATE,
      allowNull: false
    },
    departureTime: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        is: {
          args: /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/,
          msg: 'Departure time must be in HH:MM format'
        }
      }
    },
    passengers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: { args: [1], msg: 'At least 1 passenger is required' }
      }
    },
    baseFare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    taxes: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    discount: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    paymentStatus: {
      type: DataTypes.STRING,
      defaultValue: 'pending',
      validate: {
        isIn: {
          args: [['pending', 'paid', 'failed', 'refunded']],
          msg: 'Invalid payment status'
        }
      }
    },
    paymentMethod: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        isIn: {
          args: [['cash', 'card', 'upi', 'wallet', 'netbanking']],
          msg: 'Invalid payment method'
        }
      }
    },
    bookingStatus: {
      type: DataTypes.STRING,
      defaultValue: 'confirmed',
      validate: {
        isIn: {
          args: [['confirmed', 'cancelled', 'completed', 'no_show']],
          msg: 'Invalid booking status'
        }
      }
    },
    seatNumbers: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: []
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        min: { args: [1], msg: 'Rating must be at least 1' },
        max: { args: [5], msg: 'Rating cannot exceed 5' }
      }
    },
    feedback: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    timestamps: true,
    underscored: true,
    tableName: 'bookings',
    indexes: [
      {
        fields: ['user_id', 'booking_date']
      },
      {
        fields: ['vehicle_id', 'travel_date']
      },
      {
        fields: ['booking_status']
      }
    ]
  });

  // Define associations
  Booking.associate = (models) => {
    Booking.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
    
    Booking.belongsTo(models.Route, {
      foreignKey: 'routeId',
      as: 'route'
    });
    
    // Vehicle model removed
    // Booking.belongsTo(models.Vehicle, {
    //   foreignKey: 'vehicleId',
    //   as: 'vehicle'
    // });
  };

  return Booking;
};
