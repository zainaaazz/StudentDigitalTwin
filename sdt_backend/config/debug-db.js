// debug-db.js - Run this to test your connection and model
const mongoose = require('mongoose');
const DigitalTwin = require('../models/DigitalTwin'); // Adjust path as needed

async function debugDatabase() {
  try {
    // Connect to MongoDB
    const uri = process.env.MONGODB_URI || 'mongodb+srv://michael:stackmasters@sdt-db.s5ahebe.mongodb.net/sdt-db';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');

    // Check if collection exists
    const collections = await mongoose.connection.db.listCollections({ name: 'digitaltwin' }).toArray();
    console.log('📁 Collection exists:', collections.length > 0);

    // Get collection stats (skip stats method, just count)
    const collectionCount = await mongoose.connection.db.collection('digitaltwin').countDocuments();
    console.log('📊 Collection document count:', collectionCount);

    // Test basic query
    console.log('\n🔍 Testing basic queries...');
    
    const totalCount = await DigitalTwin.countDocuments();
    console.log('Total documents:', totalCount);

    if (totalCount > 0) {
      // Get one document to verify structure
      const sampleDoc = await DigitalTwin.findOne().lean();
      console.log('📄 Sample document structure:');
      console.log(Object.keys(sampleDoc));
      console.log('Sample values:', JSON.stringify(sampleDoc, null, 2));

      // Test specific student query
      const studentQuery = await DigitalTwin.findOne({ id_student: 11391 });
      console.log('🎓 Found student 11391:', !!studentQuery);
      if (studentQuery) {
        console.log('Student data:', {
          id: studentQuery.id_student,
          date: studentQuery.date,
          homepage: studentQuery.homepage,
          final_result: studentQuery.final_result
        });
      }

      // Test unique students method
      const uniqueStudents = await DigitalTwin.getUniqueStudents();
      console.log('👥 Unique students count:', uniqueStudents.length);
      console.log('First 5 students:', uniqueStudents.slice(0, 5));

    } else {
      console.log('❌ No documents found in collection');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the debug script
debugDatabase();