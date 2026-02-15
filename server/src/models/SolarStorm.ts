import mongoose, { Schema, Document } from 'mongoose';

export interface ISolarStorm extends Document {
  gstID: string;
  startTime: string;
  kpIndex: number;
  observedTime: string;
  source: string;
}

const SolarStormSchema: Schema = new Schema({
  gstID: { type: String, required: true, unique: true },
  startTime: { type: String, required: true },
  kpIndex: { type: Number, required: true },
  observedTime: { type: String, required: true },
  source: { type: String, required: true }
});

export default mongoose.model<ISolarStorm>('SolarStorm', SolarStormSchema);
