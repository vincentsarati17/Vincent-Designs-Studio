
'use client';

import { BarChart, TrendingUp, Users } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  BarChart as RechartsBarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Bar,
} from 'recharts';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';
import { getAnalyticsData, AnalyticsData } from '@/services/analytics';
import { useToast } from '@/hooks/use-toast';
import { subMonths, format } from 'date-fns';

const chartConfig = {
  visits: {
    label: 'Visits',
    color: 'hsl(var(--primary))',
  },
}

export default function AnalyticsPageClient() {
  const [data, setData] = React.useState<AnalyticsData | null>(null);
  const { toast } = useToast();

  React.useEffect(() => {
    async function fetchData() {
      try {
        const analyticsData = await getAnalyticsData();
        setData(analyticsData);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not load analytics data.",
        });
      }
    }
    fetchData();
  }, [toast]);

  const totalVisits = data?.totalVisits ?? 0;
  const dateRange = `${format(subMonths(new Date(), 5), 'MMMM yyyy')} - ${format(new Date(), 'MMMM yyyy')}`;

  return (
    <>
      <h1 className="text-3xl font-bold tracking-tight">Analytics & Reports</h1>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 my-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <BarChart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {data ? (
              <div className="text-2xl font-bold">{totalVisits.toLocaleString()}</div>
            ) : (
              <Skeleton className="h-8 w-24" />
            )}
            <p className="text-xs text-muted-foreground">Total visits in the last 6 months</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             {data ? (
                <div className="text-2xl font-bold">+{data.newLeads}</div>
             ) : (
                <Skeleton className="h-8 w-12" />
             )}
             <p className="text-xs text-muted-foreground">New leads this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            {data ? (
              <div className="text-2xl font-bold">{data.conversionRate}%</div>
            ) : (
              <Skeleton className="h-8 w-16" />
            )}
            <p className="text-xs text-muted-foreground">Contact form submissions last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Website Traffic</CardTitle>
          <CardDescription>{dateRange}</CardDescription>
        </CardHeader>
        <CardContent>
            <div className="h-[300px] w-full">
              {data ? (
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <RechartsBarChart data={data.trafficData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Bar dataKey="visits" fill={chartConfig.visits.color} radius={4} />
                  </RechartsBarChart>
                </ChartContainer>
              ) : (
                <Skeleton className="w-full h-full" />
              )}
            </div>
        </CardContent>
      </Card>
    </>
  );
}
