🇲🇦 Credit Risk Prediction for Micro-Loans in MoroccoAn end-to-end Machine Learning pipeline and web application designed to evaluate credit risk for micro-loan applicants in Morocco using alternative financial, socio-economic, and digital behavioral data.📋 Executive SummaryIn developing economies like Morocco, traditional credit scoring models often fail microfinance applicants due to a lack of formal credit histories ("thin-file" borrowers). This project addresses financial inclusion by predicting loan default risk based on alternative data indicators—such as digital payment usage, income stream diversity, mobile metadata proxies, and savings behavior.Using the World Bank Global Financial Inclusion (Global Findex) 2021 Dataset, we formulated a supervised binary classification task to categorize applicants into Low Risk (0) or High Risk (1). The system includes an offline training pipeline, leak-free preprocessing, state-of-the-art imbalanced learning using SMOTETomek, explainable AI evaluation (XAI), and a full-stack deployment architecture via a Render API backend and a Vercel frontend interface.👥 Authors & Academic ContextDouae LaanayaGhoufrane AamoumourNoha LakhmartiCourse: CSC 3347 — Machine Learning and Data MiningInstitution: School of Science and Engineering (SSE), Al Akhawayn University in Ifrane (AUI)Date: Fall 2025 (December 12th, 2025)🏗 System Architecture & WorkflowThe architecture is decoupled into an Offline Training Environment and a Real-Time Online Inference System.+-----------------------------------------------------------------------------------------------+
|                                 OFFLINE TRAINING ENVIRONMENT                                  |
|                                                                                               |
|  [World Bank Morocco Dataset] ---> [Cleaning & Feature Eng.] ---> [Train/Test Stratified Split]|
|                                                                               |               |
|  [Model Export (.joblib)]    <--- [Model Evaluation & XAI]  <--- [SMOTETomek Resampling]      |
+-----------------------------------------------|-----------------------------------------------+
                                                |
                                                v (Model Artifact Deployment)
+-----------------------+     HTTPS POST /predict     +-----------------------------------------+
|    VERCEL FRONTEND    | --------------------------> |           RENDER BACKEND API            |
|  (Interactive UI)     |                             |          (FastAPI / Flask)              |
|                       | <-------------------------- |  [Data Validation & Preprocessing]       |
|  [Loan Officer Dashboard]      JSON Response        |  [Model Inference & Probability Score]  |
+-----------------------+                             +-----------------------------------------+
Operational Workflow:Frontend Request: Loan officer fills out applicant details on the Vercel-hosted web interface.API Payload Transfer: Form input is sanitized and sent via HTTPS POST request to the Render REST API endpoint /predict.Backend Pipeline Execution: The backend applies identical feature transformations (one-hot encoding, feature scaling, aggregate feature generation) as defined during training.Inference & Scoring: The trained model calculates the default probability score $P(y=1\vert{}X)$ and determines the final risk decision threshold.Response & Audit: The decision and risk probabilities are returned to the frontend and logged for ongoing auditing and fairness tracking.📁 Dataset & Feature Engineering Pipeline1. Source & ScaleDataset: World Bank Global Financial Inclusion (Global Findex) Database 2021 — Morocco SubsetSample Size: 1,000 survey respondentsDimensionality: 114 original survey attributes reduced to 22 modeling features.2. Target Variable Formulation (risk_label)The target binary variable was engineered to capture high financial vulnerability:$$\text{risk\_label} = \begin{cases} 1 (\text{High Risk}), & \text{if } \text{borrowed\_last\_year} = 1 \land \text{saved\_last\_year} = 0 \land \text{num\_income\_sources} = 0 \\ 0 (\text{Low Risk}), & \text{otherwise} \end{cases}$$# Target Engineering Python Implementation
df_clean['risk_label'] = 0
df_clean.loc[
    (df_clean['borrowed_last_year'] == 1) & 
    (df_clean['saved_last_year'] == 0) & 
    (df_clean['num_income_sources'] == 0),
    'risk_label'
] = 1
Class Distribution:Low Risk (Class 0): 893 samples (89.3%)High Risk (Class 1): 107 samples (10.7%)Imbalance Ratio: $8.35 : 1$3. Feature Engineering & Selection MatrixCategoryFeature NameTypeDescriptionDemographicsageContinuousAge of applicant (Imputed with median = 38)genderCategoricalBinary gender (One-hot encoded)education_levelOrdinalEducation level (Ranked 1 to 5)worked_last_7_daysCategoricalEmployment activity flagEconomicincome_quintileOrdinalSocio-economic income tier (1 to 5)accountBinaryFormal financial bank account ownershiphas_receive_wagesBinaryReceives regular employment wageshas_remittancesBinaryReceives international/domestic remittancesDigital ActivityanydigpaymentBinaryHas performed digital payment transactionsmerchantpay_digBinaryUses digital payments at merchant storesinternetaccessCategoricalAccess to personal internet connectionEngineereddigital_activityDiscreteSum of digital payments ($\text{anydigpayment} + \text{merchantpay\_dig}$)num_income_sourcesDiscreteTotal count of income streams ($0-5$)financial_stabilityCompositeScore ($\text{saved} + \text{account} + \text{num\_income\_sources}$)⚠️ Strict Data Leakage Prevention: To ensure unbiased evaluation, raw variables directly used to formulate the target (borrowed_last_year, saved_last_year, num_income_sources) were completely removed from the training feature set $X$.🔬 Model Development & Imbalance HandlingWe benchmarked three machine learning algorithms representing baseline linear models, bagging ensembles, and gradient-boosted trees:Logistic Regression (Baseline Model):Predicts probability using the sigmoid function $\sigma(z) = \frac{1}{1 + e^{-z}}$.Configured with $L_2$ penalty to reduce variance: penalty='l2', C=1.0, max_iter=1000.Random Forest Classifier (Ensemble Comparator):Aggregates predictions across multi-depth decision trees using bootstrap aggregation (bagging).Configured with n_estimators=100, max_depth=10, random_state=42.XGBoost Classifier (Gradient Boosting):Sequential boosting minimizing loss via gradient descent optimization.Configured with n_estimators=100, learning_rate=0.1, max_depth=6, eval_metric='logloss'.Resampling with SMOTETomekTo prevent the models from defaulting to predicting the majority class, we applied SMOTETomek—a hybrid technique combining Synthetic Minority Over-sampling Technique (SMOTE) with Tomek Links undersampling.Split Strategy: 80% Training / 20% Stratified Hold-Out Test Set.Leakage Avoidance: SMOTETomek was applied only to the training set after performing the split.Data SplitLow Risk (Class 0)High Risk (Class 1)Total SamplesRaw Training Set71486800Resampled Training Set (SMOTETomek)7147141,428Hold-Out Test Set (Unseen)17921200📈 Performance Benchmarks & ResultsModel performance was evaluated on the unseen hold-out test set ($N=200$) using metrics robust to class imbalance:Evaluation Metrics MatrixModelAccuracyBalanced AccuracyF1-ScoreROC-AUCPR-AUCLogistic Regression0.8950.7940.5710.9400.567Random Forest0.8500.8740.5590.9140.467XGBoost0.8800.7860.5380.9280.575Key Trade-off Analysis:Logistic Regression achieved the highest overall linear separation ($\text{ROC-AUC} = 0.940$) and overall F1-score ($0.571$).XGBoost recorded the best Precision-Recall AUC ($0.575$), demonstrating stability when penalizing false positives in high-risk predictions.Random Forest achieved the highest Balanced Accuracy ($0.874$), showing optimal recall for detecting true default cases.Top Predictive Features (Feature Importance Analysis)Feature importance extracted from XGBoost and Random Forest highlighted that:financial_stability (Composite Index)account (Bank Account Ownership)has_remittances (Remittance Income Stream)merchantpay_dig (Digital Merchant Payment Adoption)⚡ Real-Time API Endpoint DocumentationThe Render-deployed backend exposes the following prediction endpoint:POST /predictRequest Payload Example:{
  "age": 34,
  "gender": 2,
  "education_level": 3,
  "worked_last_7_days": 1,
  "income_quintile": 4,
  "account": 1,
  "anydigpayment": 1,
  "merchantpay_dig": 1,
  "internetaccess": 1,
  "has_receive_wages": 1,
  "has_receive_transfers": 0,
  "has_remittances": 1
}
Successful Response Payload:{
  "status": "success",
  "prediction": 0,
  "risk_group": "Low Risk",
  "probability_score": 0.1245,
  "decision_confidence": "87.55%",
  "timestamp": "2025-12-12T14:32:10Z"
}
💻 Local Setup & Installation GuidePrerequisitesPython 3.9, 3.10, or 3.11gitpip / virtual environment tool1. Clone the Repositorygit clone https://github.com/your-username/credit-risk-morocco.git
cd credit-risk-morocco
2. Set Up Python Virtual Environment# On Linux/macOS
python3 -m venv venv
source venv/bin/activate

# On Windows
python -m venv venv
venv\Scripts\activate
3. Install Dependenciespip install --upgrade pip
pip install -r requirements.txt
4. Run Experimentation NotebookTo re-run data processing, training, SMOTETomek balancing, and feature importance generation:jupyter notebook notebooks/ML_Project_Report.ipynb
5. Launch Backend API Locallycd api
python app.py
The API will start locally at http://127.0.0.1:5000 (or http://localhost:8000).📁 Repository Structurecredit-risk-morocco/
│
├── data/
│   ├── raw/
│   │   └── microfinance_morocco_findex2021.csv  # Raw World Bank survey data
│   └── processed/
│       └── cleaned_features.csv                 # Preprocessed dataset
│
├── notebooks/
│   └── ML_Project_Report.ipynb                  # Complete training pipeline & XAI
│
├── models/
│   ├── logistic_regression_model.pkl            # Production model checkpoint
│   ├── xgboost_model.pkl                        # Champion boosting model checkpoint
│   └── scaler.pkl                               # MinMax / Standard Feature Scaler
│
├── api/
│   ├── app.py                                   # REST API application file (FastAPI/Flask)
│   ├── preprocessing_utils.py                   # Data transformation helper routines
│   └── requirements.txt                         # Production API dependencies
│
├── frontend/
│   ├── index.html                               # Dashboard web page UI
│   ├── styles.css                               # UI Layout Styling
│   └── app.js                                   # Fetch API integration scripts
│
├── docs/
│   └── ML_Project_Report.pdf                    # Full research project paper
│
├── .gitignore
├── LICENSE
└── README.md                                    # Documentation file
⚖️ Ethics, Transparency & Bias MitigationAlternative credit scoring systems introduce potential ethical considerations. Our system addresses these concerns through the following safeguards:Strict Anonymization: Data features are stripped of direct demographic indicators and sensitive PII to align with global privacy standards (GDPR / CNDP Morocco).Proxy Discrimination Monitoring: Feature importance metrics are regularly monitored to prevent variables like gender or age from acting as hidden proxies for unvetted credit rejection.Explainable AI (XAI): Linear coefficients and SHAP/tree feature importances are made visible to operators, ensuring loan officers can explain credit denials to applicants transparently.
