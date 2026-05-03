import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, TrendingUp, TrendingDown, PiggyBank, Target, Calendar, BarChart3 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import ExpensePieChart from '../components/charts/ExpensePieChart';
import IncomePieChart from '../components/charts/IncomePieChart';
import SpendingBarChart from '../components/charts/SpendingBarChart';
import DailySpendingChart from '../components/charts/DailySpendingChart';
import TopCategoriesChart from '../components/charts/TopCategoriesChart';
import WeeklyPatternChart from '../components/charts/WeeklyPatternChart';
import IncomeExpenseLineChart from '../components/charts/IncomeExpenseLineChart';
import AddTransactionModal from '../components/modals/AddTransactionModal';
import api from '../services/api';
import { formatCurrency } from '../utils/formatters';
import { formatDate } from '../utils/formatters';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [timeFrame, setTimeFrame] = useState('monthly');

  useEffect(() => {
    fetchDashboardData(timeFrame);
  }, [timeFrame]);

  const fetchDashboardData = async (range = timeFrame) => {
    try {
      const [statsData, transactionsData] = await Promise.all([
        api.getStats({ range }),
        api.getTransactions({ limit: 5 })
      ]);
      
      setStats(statsData);
      setRecentTransactions(transactionsData.transactions);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleTransactionAdded = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-muted rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-muted rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Showing data for {timeFrame === 'all' ? 'all time' : timeFrame}.</p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label htmlFor="timeframe" className="text-sm font-medium text-muted-foreground">Period</label>
          <select
            id="timeframe"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="yearly">Yearly</option>
            <option value="all">All Time</option>
          </select>
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Balance</p>
                <p className={`text-2xl font-bold ${stats.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.balance)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Balance</p>
                <p className={`text-2xl font-bold ${stats.totalBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(stats.totalBalance)}
                </p>
              </div>
              <PiggyBank className="w-8 h-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Income (This Month)</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(stats.income)}
                </p>
                {stats.lastMonthIncome > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {((stats.income - stats.lastMonthIncome) / stats.lastMonthIncome * 100).toFixed(1)}% from last month
                  </p>
                )}
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Expenses (This Month)</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(stats.expenses)}
                </p>
                {stats.lastMonthExpenses > 0 && (
                  <p className="text-xs text-muted-foreground">
                    {((stats.expenses - stats.lastMonthExpenses) / stats.lastMonthExpenses * 100).toFixed(1)}% from last month
                  </p>
                )}
              </div>
              <TrendingDown className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Savings Rate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.savingsRate.toFixed(1)}%
                </p>
                <p className="text-xs text-muted-foreground">
                  Of monthly income saved
                </p>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Avg Daily Spending</p>
                <p className="text-2xl font-bold text-orange-600">
                  {stats.dailySpending.length > 0 ? formatCurrency(stats.dailySpending.reduce((sum, day) => sum + day.total, 0) / stats.dailySpending.length) : '$0'}
                </p>
                <p className="text-xs text-muted-foreground">
                  Last 30 days average
                </p>
              </div>
              <Calendar className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Top Category</p>
                <p className="text-2xl font-bold text-purple-600">
                  {stats.topCategories.length > 0 ? stats.topCategories[0]._id : 'None'}
                </p>
                <p className="text-xs text-muted-foreground">
                  {stats.topCategories.length > 0 ? formatCurrency(stats.topCategories[0].total) : '$0'} total spent
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <ExpensePieChart data={stats.expenseByCategory.map(item => ({ category: item._id, total: item.total }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Income Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <IncomePieChart data={stats.incomeByCategory.map(item => ({ category: item._id, total: item.total }))} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Last 7 Days Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <SpendingBarChart data={stats.spendingTrend} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last 30 Days Daily Spending</CardTitle>
          </CardHeader>
          <CardContent>
            <DailySpendingChart data={stats.dailySpending.map(item => ({ date: item._id, total: item.total }))} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Spending Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <TopCategoriesChart data={stats.topCategories.map(item => ({ category: item._id, total: item.total, count: item.count }))} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Weekly Spending Pattern</CardTitle>
          </CardHeader>
          <CardContent>
            <WeeklyPatternChart data={stats.weeklyPattern.map(item => ({ day: item._id, total: item.total, count: item.count }))} />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Income vs Expenses (Last 6 Months)</CardTitle>
        </CardHeader>
        <CardContent>
          <IncomeExpenseLineChart data={stats.monthlyComparison} />
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction._id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    transaction.type === 'income' ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                  <div>
                    <p className="font-medium">{transaction.category}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(transaction.date)} • {transaction.note || 'No note'}
                    </p>
                  </div>
                </div>
                <p className={`font-semibold ${
                  transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </p>
              </div>
            ))}
            {recentTransactions.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No transactions yet. Add your first transaction!
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <AddTransactionModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={handleTransactionAdded}
      />
    </motion.div>
  );
};

export default Dashboard;