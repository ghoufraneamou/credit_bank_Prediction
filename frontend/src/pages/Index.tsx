import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { MoroccanPattern, FloatingOrbs, AnimatedCounter, ScrollReveal } from "@/components/decorative/MoroccanElements";
import { 
  TrendingUp, 
  Shield, 
  Zap, 
  Users, 
  ChartBar, 
  CheckCircle,
  ArrowRight,
  Sparkles
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: Zap,
      title: "Instant Analysis",
      description: "Get credit risk predictions in seconds using advanced machine learning algorithms."
    },
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your data is protected with enterprise-level encryption and security protocols."
    },
    {
      icon: ChartBar,
      title: "Detailed Insights",
      description: "Comprehensive risk breakdown with actionable recommendations for each assessment."
    },
    {
      icon: Users,
      title: "Local Expertise",
      description: "Model trained on Moroccan market data for accurate local risk assessment."
    }
  ];

  const stats = [
    { value: 50000, label: "Loans Assessed", suffix: "+" },
    { value: 98, label: "Accuracy Rate", suffix: "%" },
    { value: 150, label: "Partner Institutions", suffix: "+" },
    { value: 24, label: "Hour Support", suffix: "/7" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <FloatingOrbs />
        <MoroccanPattern />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-saffron/10 border border-saffron/20 mb-8 animate-slide-down">
              <Sparkles className="w-4 h-4 text-saffron" />
              <span className="text-sm font-medium text-saffron">AI-Powered Risk Assessment</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-bold leading-tight mb-6 animate-slide-up">
              <span className="text-foreground">Predict Credit Risk</span>
              <br />
              <span className="text-saffron">with Confidence</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: "0.1s" }}>
              Empowering Moroccan microfinance institutions with intelligent credit risk 
              assessment. Make informed lending decisions faster and more accurately.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <Button variant="hero" size="xl" asChild>
                <Link to="/predict" className="flex items-center gap-2">
                  Start Predicting
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button variant="glass" size="xl" asChild>
                <Link to="/dashboard">View Dashboard</Link>
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 flex flex-wrap justify-center gap-8 text-muted-foreground animate-slide-up" style={{ animationDelay: "0.3s" }}>
              {["Bank Al-Maghrib Compliant", "GDPR Ready", "ISO 27001"].map((item) => (
                <div key={item} className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-emerald" />
                  <span className="text-sm font-medium">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Curved Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path
              d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
              fill="hsl(var(--card))"
            />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-card py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <ScrollReveal key={stat.label}>
                <div 
                  className="text-center"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary mb-2">
                    <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                  </div>
                  <div className="text-muted-foreground font-medium">{stat.label}</div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 relative">
        <MoroccanPattern />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold mb-4">
                Why Choose <span className="text-saffron">CreditRisk?</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Built specifically for the Moroccan microfinance sector with cutting-edge AI technology.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <ScrollReveal key={feature.title}>
                <Card 
                  variant="elevated" 
                  className="h-full hover-lift group"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-moroccan-blue-light flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.description}</p>
                  </CardContent>
                </Card>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-primary to-moroccan-blue-light relative overflow-hidden">
        <div className="absolute inset-0 moroccan-pattern opacity-20" />
        <FloatingOrbs />
        
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <ScrollReveal>
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-saffron/20 mb-6">
              <TrendingUp className="w-8 h-8 text-saffron" />
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-bold text-primary-foreground mb-6">
              Ready to Transform Your Risk Assessment?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
              Join 150+ Moroccan financial institutions already using our AI-powered platform 
              to make smarter lending decisions.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                variant="gold" 
                size="xl" 
                className="text-foreground"
                asChild
              >
                <Link to="/predict">
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              <Button 
                variant="outline" 
                size="xl" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                asChild
              >
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

