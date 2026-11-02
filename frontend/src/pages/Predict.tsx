import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

type PredictionResponse = {
  risk_label: number;
  risk_probability: number;
};

const Predict = () => {
  const { toast } = useToast();

  // These keys MUST match what the backend expects (we tested with curl)
  const [form, setForm] = useState({
    age: 30,
    account: 1,
    saved_last_year: 0,
    borrowed_last_year: 0,
    anydigpayment: 0,
    merchantpay_dig: 0,
    digital_activity: 0,
    financial_stability: 0,
    has_remittances: 0, // optional extra feature if you want to use it later
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResponse | null>(null);

  const handleNumberChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof form
  ) => {
    const value = Number(e.target.value);
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleBinaryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    key: keyof typeof form
  ) => {
    const value = e.target.checked ? 1 : 0;
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data: PredictionResponse = await response.json();
      setResult(data);

      toast({
        title: "Prediction complete",
        description:
          data.risk_label === 1
            ? "High risk of micro-loan default."
            : "Low risk of micro-loan default.",
      });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Prediction failed",
        description: err.message ?? "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Credit Risk Prediction – Moroccan Micro-Loans
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            {/* Age */}
            <div className="space-y-1">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                min={18}
                max={100}
                value={form.age}
                onChange={(e) => handleNumberChange(e, "age")}
              />
            </div>

            {/* Account */}
            <div className="flex items-center space-x-2">
              <input
                id="account"
                type="checkbox"
                checked={form.account === 1}
                onChange={(e) => handleBinaryChange(e, "account")}
              />
              <Label htmlFor="account">Has a formal bank account</Label>
            </div>

            {/* Saved last year */}
            <div className="flex items-center space-x-2">
              <input
                id="saved_last_year"
                type="checkbox"
                checked={form.saved_last_year === 1}
                onChange={(e) => handleBinaryChange(e, "saved_last_year")}
              />
              <Label htmlFor="saved_last_year">Saved money in the last year</Label>
            </div>

            {/* Borrowed last year */}
            <div className="flex items-center space-x-2">
              <input
                id="borrowed_last_year"
                type="checkbox"
                checked={form.borrowed_last_year === 1}
                onChange={(e) => handleBinaryChange(e, "borrowed_last_year")}
              />
              <Label htmlFor="borrowed_last_year">
                Borrowed money in the last year
              </Label>
            </div>

            {/* Digital payments */}
            <div className="flex items-center space-x-2">
              <input
                id="anydigpayment"
                type="checkbox"
                checked={form.anydigpayment === 1}
                onChange={(e) => handleBinaryChange(e, "anydigpayment")}
              />
              <Label htmlFor="anydigpayment">
                Uses any form of digital payment
              </Label>
            </div>

            {/* Merchant digital payments */}
            <div className="flex items-center space-x-2">
              <input
                id="merchantpay_dig"
                type="checkbox"
                checked={form.merchantpay_dig === 1}
                onChange={(e) => handleBinaryChange(e, "merchantpay_dig")}
              />
              <Label htmlFor="merchantpay_dig">
                Pays merchants digitally (QR / card / mobile money)
              </Label>
            </div>

            {/* Digital activity score (0–2) */}
            <div className="space-y-1">
              <Label htmlFor="digital_activity">Digital activity score (0–2)</Label>
              <Input
                id="digital_activity"
                type="number"
                min={0}
                max={2}
                value={form.digital_activity}
                onChange={(e) => handleNumberChange(e, "digital_activity")}
              />
            </div>

            {/* Financial stability score */}
            <div className="space-y-1">
              <Label htmlFor="financial_stability">
                Financial stability score (0–10)
              </Label>
              <Input
                id="financial_stability"
                type="number"
                min={0}
                max={10}
                value={form.financial_stability}
                onChange={(e) => handleNumberChange(e, "financial_stability")}
              />
            </div>

            {/* Optional: remittances */}
            <div className="flex items-center space-x-2">
              <input
                id="has_remittances"
                type="checkbox"
                checked={form.has_remittances === 1}
                onChange={(e) => handleBinaryChange(e, "has_remittances")}
              />
              <Label htmlFor="has_remittances">
                Receives remittances from abroad
              </Label>
            </div>

            <Button type="submit" disabled={loading} className="w-full mt-4">
              {loading ? "Predicting..." : "Predict Risk"}
            </Button>
          </form>

          {result && (
            <div className="mt-6 p-4 rounded-md border bg-slate-50">
              <p className="font-semibold">
                Predicted Risk:{" "}
                {result.risk_label === 1 ? "High Risk" : "Low Risk"}
              </p>
              <p className="text-sm text-slate-600">
                Probability of High Risk:{" "}
                {(result.risk_probability * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Predict;
