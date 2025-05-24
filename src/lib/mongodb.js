import mongoose from 'mongoose';

console.log('MONGODB_URI:', process.env.MONGODB_URI);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Adicione MONGODB_URI no .env.local");
}

let cached = global.mongoose || { conn: null, promise: null };

export async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
      return mongoose;
    });
  }

  cached.conn = await cached.promise;
  global.mongoose = cached;
  return cached.conn;
}

export async function testConnection() {
  try {
    await connectDB();
    console.log('✅ Conexão com MongoDB estabelecida!');
  } catch (error) {
    console.error('❌ Erro na conexão com MongoDB:', error);
  }
}
