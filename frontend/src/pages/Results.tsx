import { useLocation, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ScrollReveal, RiskGauge, MoroccanPattern, FloatingOrbs } from "@/components/decorative/MoroccanElements";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  ArrowRight,
  Download,
  RefreshCw,
  TrendingUp,
  Shield,
  FileText,
  Lightbulb,
} from "lucide-react";

const Results = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const score = location.state?.score || 35;
  const formData = location.state?.formData || {};

  useEffect(() => {
    if (!location.state?.score) {
      navigate("/predict");
      return;
    }

    // Animate score from 0 to actual value
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score, navigate, location.state]);

  const getRiskLevel = (score: number) => {
    if (score <= 30) return { level: "Low Risk", color: "emerald", icon: CheckCircle };
    if (score <= 60) return { level: "Medium Risk", color: "saffron", icon: AlertTriangle };
    if (score <= 80) return { level: "High Risk", color: "terracotta", icon: AlertTriangle };
    return { level: "Very High Risk", color: "destructive", icon: XCircle };
  };

  const riskInfo = getRiskLevel(score);
  const RiskIcon = riskInfo.icon;

  const recommendations = score <= 30 
    ? [
        "Applicant shows strong creditworthiness indicators",
        "Recommend standard loan terms with competitive rates",
        "Consider for premium customer programs",
        "Low risk of default based on financial profile"
      ]
    : score <= 60
    ? [
        "Consider requesting additional collateral",
        "Recommend shorter loan term to reduce exposure",
        "Verify income sources with documentation",
        "Monthly monitoring advised for first 6 months"
      ]
    : [
        "High risk - recommend declining or reduced amount",
        "Require substantial collateral if proceeding",
        "Consider alternative financing options",
        "Extensive documentation and verification required"
      ];

  const factors = [
    { name: "Income Stability", score: Math.min(100, 100 - score + 20), weight: "High" },
    { name: "Debt-to-Income Ratio", score: Math.min(100, 100 - score + 10), weight: "High" },
    { name: "Employment History", score: Math.min(100, 100 - score + 15), weight: "Medium" },
    { name: "Savings Buffer", score: Math.min(100, 100 - score + 5), weight: "Medium" },
    { name: "Loan Purpose Viability", score: Math.min(100, 100 - score + 25), weight: "Low" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="relative pt-20 pb-12 min-h-screen">
        <MoroccanPattern />
        <FloatingOrbs />
        
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <ScrollReveal>
            <div className="text-center mb-12">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4 ${
                riskInfo.color === "emerald" ? "bg-emerald/10 text-emerald" :
                riskInfo.color === "saffron" ? "bg-saffron/10 text-saffron" :
                riskInfo.color === "terracotta" ? "bg-terracotta/10 text-terracotta" :
                "bg-destructive/10 text-destructive"
              }`}>
                <RiskIcon className="w-5 h-5" />
                <span className="font-semibold">{riskInfo.level}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-display font-bold mb-4">
                Assessment <span className="text-saffron">Results</span>
              </h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Based on the information provided, here is the credit risk analysis 
                for {formData.fullName || "the applicant"}.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Risk Gauge Card */}
            <div className="lg:col-span-1">
              <ScrollReveal>
                <Card variant="glass" className="text-center">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-center gap-2">
                      <TrendingUp className="w-5 h-5 text-saffron" />
                      Risk Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-col items-center">
                    <RiskGauge score={animatedScore} size={240} />
                    
                    <div className="w-full mt-8 pt-6 border-t border-border space-y-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Assessment ID</span>
                        <span className="font-mono">CR-{Date.now().toString().slice(-6)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Date</span>
                        <span>{new Date().toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Model Version</span>
                        <span>v2.4.1</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </ScrollReveal>
            </div>

            {/* Main Results */}
            <div className="lg:col-span-2 space-y-6">
              {/* Contributing Factors */}
              <ScrollReveal>
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5 text-saffron" />
                      Contributing Factors
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {factors.map((factor) => (
                      <div key={factor.name}>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="font-medium">{factor.name}</span>
                          <div className="flex items-center gap-2">
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              factor.weight === "High" ? "bg-primary/10 text-primary" :
                              factor.weight === "Medium" ? "bg-saffron/10 text-saffron" :
                              "bg-muted text-muted-foreground"
                            }`}>
                              {factor.weight}
                            </span>
                            <span className="font-semibold">{factor.score}%</span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              factor.score >= 70 ? "bg-emerald" :
                              factor.score >= 40 ? "bg-saffron" :
                              "bg-terracotta"
                            }`}
                            style={{ width: `${factor.score}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Recommendations */}
              <ScrollReveal>
                <Card variant="moroccan">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-saffron" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {recommendations.map((rec, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <CheckCircle className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            score <= 30 ? "text-emerald" :
                            score <= 60 ? "text-saffron" :
                            "text-terracotta"
                          }`} />
                          <span className="text-sm">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </ScrollReveal>

              {/* Actions */}
              <ScrollReveal>
                <div className="flex flex-wrap gap-4">
                  <Button variant="moroccan" className="flex items-center gap-2">
                    <Download className="w-4 h-4" />
                    Download Report
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2" asChild>
                    <Link to="/predict">
                      <RefreshCw className="w-4 h-4" />
                      New Assessment
                    </Link>
                  </Button>
                  <Button variant="glass" className="flex items-center gap-2" asChild>
                    <Link to="/dashboard">
                      <FileText className="w-4 h-4" />
                      View Dashboard
                    </Link>
                  </Button>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Results;
