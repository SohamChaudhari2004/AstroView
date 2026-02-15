import mongoose, { Schema, Document } from 'mongoose';

export interface IAsteroid extends Document {
  nasaId: string;
  name: string;
  isHazardous: boolean;
  closeApproachDate: string;
  missDistanceKm: number;
  relativeVelocityKph: number;
  lastUpdated: Date;
}

const AsteroidSchema: Schema = new Schema({
  nasaId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  isHazardous: { type: Boolean, required: true },
  closeApproachDate: { type: String, required: true },
  missDistanceKm: { type: Number, required: true },
  relativeVelocityKph: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IAsteroid>('Asteroid', AsteroidSchema);
