import { Schema, model, Document } from 'mongoose';

const ActivitySchema = new Schema({
  time: String,
  title: String,
  description: String,
  location: String,
  cost: String,
});

const DayPlanSchema = new Schema({
  dayNumber: Number,
  date: String,
  activities: [ActivitySchema],
});

const TripSchema = new Schema({
  title: { type: String, required: true },
  destination: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  budget: { type: String, enum: ['budget', 'moderate', 'luxury'], default: 'moderate' },
  travelStyle: { type: String, required: true },
  itinerary: [DayPlanSchema],
  status: { type: String, enum: ['planning', 'upcoming', 'completed'], default: 'planning' },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

export const Trip = model('Trip', TripSchema);
export default Trip;
