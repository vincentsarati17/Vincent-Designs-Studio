
'use server';

import { initializeFirebase } from '@/firebase';
import { collection, getDocs, query, where, Timestamp, getCountFromServer } from 'firebase/firestore';
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns';

export interface TrafficDataPoint {
  date: string;
  visits: number;
}

export interface AnalyticsData {
  trafficData: TrafficDataPoint[];
  totalVisits: number;
  newLeads: number;
  conversionRate: number;
}

async function getMonthlyTraffic(startDate: Date, endDate: Date): Promise<TrafficDataPoint[]> {
    const firebase = initializeFirebase();
    if (!firebase) return [];
    const { db } = firebase;
    const pageViewsRef = collection(db, 'page_views');
    const q = query(
        pageViewsRef,
        where('timestamp', '>=', startDate),
        where('timestamp', '<=', endDate)
    );

    const snapshot = await getDocs(q);
    
    // Aggregate by month
    const monthlyCounts: { [key: string]: number } = {};
    snapshot.docs.forEach(doc => {
        const timestamp = (doc.data().timestamp as Timestamp).toDate();
        const monthKey = format(timestamp, 'MMM');
        monthlyCounts[monthKey] = (monthlyCounts[monthKey] || 0) + 1;
    });

    // Create a list of all months in the range
    const trafficData: TrafficDataPoint[] = [];
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const monthKey = format(currentDate, 'MMM');
        trafficData.push({
            date: monthKey,
            visits: monthlyCounts[monthKey] || 0
        });
        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return trafficData;
}


export async function getAnalyticsData(): Promise<AnalyticsData> {
  try {
    const sixMonthsAgo = startOfMonth(subMonths(new Date(), 5));
    const today = new Date();

    const trafficPromise = getMonthlyTraffic(sixMonthsAgo, today);
    
    const firebase = initializeFirebase();
    if (!firebase) throw new Error("Firebase not initialized");
    const { db } = firebase;

    const totalVisitsQuery = query(collection(db, 'page_views'), where('timestamp', '>=', sixMonthsAgo));
    const totalVisitsPromise = getCountFromServer(totalVisitsQuery);
    
    const newLeadsQuery = query(collection(db, 'submissions'), where('createdAt', '>=', startOfMonth(today)));
    const newLeadsPromise = getCountFromServer(newLeadsQuery);

    const [trafficData, totalVisitsSnapshot, newLeadsSnapshot] = await Promise.all([
      trafficPromise,
      totalVisitsPromise,
      newLeadsPromise
    ]);

    const totalVisits = totalVisitsSnapshot.data().count;
    const newLeads = newLeadsSnapshot.data().count;
    
    // Calculate conversion rate (submissions / total visits in last month)
    const lastMonthStart = startOfMonth(subMonths(new Date(), 1));
    const lastMonthEnd = endOfMonth(subMonths(new Date(), 1));
    const visitsLastMonthQuery = query(collection(db, 'page_views'), where('timestamp', '>=', lastMonthStart), where('timestamp', '<=', lastMonthEnd));
    const submissionsLastMonthQuery = query(collection(db, 'submissions'), where('createdAt', '>=', lastMonthStart), where('createdAt', '<=', lastMonthEnd));
    
    const [visitsLastMonthSnapshot, submissionsLastMonthSnapshot] = await Promise.all([
        getCountFromServer(visitsLastMonthQuery),
        getCountFromServer(submissionsLastMonthQuery),
    ]);

    const visitsLastMonth = visitsLastMonthSnapshot.data().count;
    const submissionsLastMonth = submissionsLastMonthSnapshot.data().count;
    
    const conversionRate = visitsLastMonth > 0 ? parseFloat(((submissionsLastMonth / visitsLastMonth) * 100).toFixed(1)) : 0;
    
    return {
      trafficData,
      totalVisits,
      newLeads,
      conversionRate,
    };

  } catch (error) {
    console.error('Error fetching analytics data:', error);
    // Return empty/default data on error so the app doesn't crash
    return {
        trafficData: [],
        totalVisits: 0,
        newLeads: 0,
        conversionRate: 0,
    };
  }
}
