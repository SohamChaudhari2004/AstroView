import mongoose, { Schema, Document } from 'mongoose';

export interface IMission extends Document {
  name: string;
  organization: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'planned';
  destination: string;
  launchDate: Date;
  description: string;
  crew: number;
  progress: number;
  missionType: string;
  imageUrl?: string;
  lastUpdated: Date;
}

const MissionSchema: Schema = new Schema({
  name: { type: String, required: true, unique: true },
  organization: { type: String, required: true, index: true },
  status: { 
    type: String, 
    enum: ['upcoming', 'ongoing', 'completed', 'planned'],
    required: true 
  },
  destination: { type: String, required: true },
  launchDate: { type: Date, required: true },
  description: { type: String },
  crew: { type: Number, default: 0 },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  missionType: { type: String, required: true },
  imageUrl: { type: String },
  lastUpdated: { type: Date, default: Date.now }
});

export default mongoose.model<IMission>('Mission', MissionSchema);
