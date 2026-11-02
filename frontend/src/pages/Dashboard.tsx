import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { AnimatedCounter, ScrollReveal, MoroccanPattern } from "@/components/decorative/MoroccanElements";
import {
  TrendingUp,
  TrendingDown,
  Users,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  ArrowRight,
  Activity,
  PieChart,
} from "lucide-react";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Assessments",
      value: 1247,
      change: "+12.5%",
      trend: "up",
      icon: FileText,
      color: "primary",
    },
    {
      title: "Approved Loans",
      value: 892,
      change: "+8.2%",
      trend: "up",
      icon: CheckCircle,
      color: "emerald",
    },
    {
      title: "Pending Reviews",
      value: 156,
      change: "-3.1%",
      trend: "down",
      icon: Clock,
      color: "saffron",
    },
    {
      title: "High Risk Flagged",
      value: 43,
      change: "+2.4%",
      trend: "up",
      icon: AlertTriangle,
      color: "terracotta",
    },
  ];

  const recentAssessments = [
    { id: "CR-2024-001", name: "Ahmed Benali", amount: "45,000 MAD", risk: "Low", status: "Approved" },
    { id: "CR-2024-002", name: "Fatima Zahra", amount: "120,000 MAD", risk: "Medium", status: "Pending" },
    { id: "CR-2024-003", name: "Mohammed Alaoui", amount: "75,000 MAD", risk: "Low", status: "Approved" },
    { id: "CR-2024-004", name: "Khadija El Amrani", amount: "200,000 MAD", risk: "High", status: "Review" },
    { id: "CR-2024-005", name: "Youssef Mansouri", amount: "30,000 MAD", risk: "Low", status: "Approved" },
  ];

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low": return "text-emerald bg-emerald/10";
      case "Medium": return "text-saffron bg-saffron/10";
      case "High": return "text-terracotta bg-terracotta/10";
      default: return "text-muted-foreground bg-muted";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Approved": return "text-emerald";
      case "Pending": return "text-saffron";
      case "Review": return "text-terracotta";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-20 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-8">
            <ScrollReveal>
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2">
                Dashboard
              </h1>
              <p className="text-muted-foreground">
                Welcome back! Here's your credit risk assessment overview.
              </p>
            </ScrollReveal>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.title}>
                <Card variant="elevated" className="hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{stat.title}</p>
                        <p className="text-3xl font-display font-bold">
                          <AnimatedCounter end={stat.value} duration={1500} />
                        </p>
                        <div className={`flex items-center gap-1 mt-2 text-sm ${
                          stat.trend === "up" ? "text-emerald" : "text-terracotta"
                        }`}>
                          {stat.trend === "up" ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          {stat.change} from last month
                        </div>
                      </div>
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                        stat.color === "primary" ? "bg-primary/10 text-primary" :
                        stat.color === "emerald" ? "bg-emerald/10 text-emerald" :
                        stat.color === "saffron" ? "bg-saffron/10 text-saffron" :
                        "bg-terracotta/10 text-terracotta"
                      }`}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Recent Assessments */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <Card variant="elevated">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-saffron" />
                      Recent Assessments
                    </CardTitle>
                    <Button variant="ghost" size="sm" asChild>
                      <Link to="/predict" className="flex items-center gap-1">
                        View All
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-border">
                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">ID</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Applicant</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Amount</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Risk</th>
                            <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {recentAssessments.map((assessment) => (
                            <tr key={assessment.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                              <td className="py-4 px-2 text-sm font-mono">{assessment.id}</td>
                              <td className="py-4 px-2 text-sm font-medium">{assessment.name}</td>
                              <td className="py-4 px-2 text-sm">{assessment.amount}</td>
                              <td className="py-4 px-2">
                                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getRiskColor(assessment.risk)}`}>
                                  {assessment.risk}
                                </span>
                              </td>
                              <td className={`py-4 px-2 text-sm font-medium ${getStatusColor(assessment.status)}`}>
                                {assessment.status}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Quick Actions & Risk Distribution */}
            <div className="space-y-6">
              <ScrollReveal>
                <Card variant="moroccan">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-saffron" />
                      Risk Distribution
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { label: "Low Risk", percentage: 72, color: "bg-emerald" },
                        { label: "Medium Risk", percentage: 21, color: "bg-saffron" },
                        { label: "High Risk", percentage: 7, color: "bg-terracotta" },
                      ].map((item) => (
                        <div key={item.label}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">{item.label}</span>
                            <span className="font-medium">{item.percentage}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${item.color} rounded-full transition-all duration-1000`}
                              style={{ width: `${item.percentage}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>

              <ScrollReveal>
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button variant="moroccan" className="w-full justify-start" asChild>
                      <Link to="/predict">
                        <TrendingUp className="w-5 h-5 mr-2" />
                        New Assessment
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="w-5 h-5 mr-2" />
                      View Applicants
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <FileText className="w-5 h-5 mr-2" />
                      Generate Report
                    </Button>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Dashboard;
