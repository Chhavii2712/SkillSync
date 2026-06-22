import { 
  collection, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy 
} from 'firebase/firestore'
import { db, firebaseConfig } from './config'

import hubsData from '../data/hubs.json'
import milestonesData from '../data/milestones.json'
import jobsData from '../data/jobs.json'

const isDemo = import.meta.env.VITE_DEMO_MODE === 'true' || firebaseConfig.apiKey === 'demo-key'

export const getHubs = async () => {
  if (isDemo) return hubsData
  const snapshot = await getDocs(collection(db, 'hubs'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getSkills = async () => {
  const snapshot = await getDocs(collection(db, 'skills'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getTestimonials = async () => {
  const snapshot = await getDocs(collection(db, 'testimonials'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getMilestones = async () => {
  if (isDemo) return milestonesData
  const q = query(collection(db, 'milestones'), orderBy('year', 'asc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const getJobs = async () => {
  const snapshot = await getDocs(collection(db, 'jobs'))
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
}

export const submitInquiry = async (data: any) => {
  return await addDoc(collection(db, 'inquiries'), {
    ...data,
    createdAt: serverTimestamp()
  })
}

export const submitJobApplication = async (data: any) => {
  return await addDoc(collection(db, 'applications'), {
    ...data,
    createdAt: serverTimestamp()
  })
}
