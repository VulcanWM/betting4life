import mongoose, {Schema} from 'mongoose'

const BetSchema = new mongoose.Schema({
  title: String,
  desc: String,
  amount: Number,
  starter: String,
  acceptor: String,
  guarantor: String,
  status: Boolean
})

export default mongoose.models.Bet || mongoose.model('Bet', BetSchema);