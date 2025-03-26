
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatCardsProps {
  stats: {
    userCount: number;
    ideaCount: number;
    expertCount: number;
    investorCount: number;
  };
}

export function DashboardStatCards({ stats }: DashboardStatCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Users</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.userCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Total Ideas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.ideaCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Experts</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.expertCount}</p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Investors</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{stats.investorCount}</p>
        </CardContent>
      </Card>
    </div>
  );
}
