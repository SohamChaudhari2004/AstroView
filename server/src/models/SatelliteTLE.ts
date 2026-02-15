import mongoose, { Schema, Document } from 'mongoose';

export interface ISatelliteTLE extends Document {
  satelliteName: string;
  line1: string;
  line2: string;
  source: string;
  lastUpdated: Date;
}

const SatelliteTLESchema: Schema = new Schema({
  satelliteName: { type: String, required: true, unique: true },
  line1: { type: String, required: true },
  line2: { type: String, required: true },
  source: { type: String, default: 'CelesTrak' },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<ISatelliteTLE>('SatelliteTLE', SatelliteTLESchema);
