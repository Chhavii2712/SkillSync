import { initializeApp } from 'firebase/app'
import { getFirestore, collection, addDoc } from 'firebase/firestore'
import hubs from '../src/data/hubs.json'
import skills from '../src/data/skills.json'
import testimonials from '../src/data/testimonials.json'
import milestones from '../src/data/milestones.json'
import jobs from '../src/data/jobs.json'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env' })

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID
}

const db = getFirestore(initializeApp(firebaseConfig))

async function seedCollection(name: string, items: any[]) {
  for (const item of items) {
    await addDoc(collection(db, name), item)
  }
  console.log(`Seeded ${items.length} docs into ${name}`)
}

async function run() {
  await seedCollection('hubs', hubs)
  await seedCollection('skills', skills)
  await seedCollection('testimonials', testimonials)
  await seedCollection('milestones', milestones)
  await seedCollection('jobs', jobs)
}

run()
