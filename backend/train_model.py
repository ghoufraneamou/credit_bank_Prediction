# train_model.py

import pandas as pd
import numpy as np
from collections import Counter

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import (
    classification_report,
    balanced_accuracy_score,
    roc_auc_score,
    average_precision_score,
    f1_score,
)

from imblearn.combine import SMOTETomek
import joblib


def main():
    # --------------------------------------------------------
    # 1. LOAD RAW DATA
    # --------------------------------------------------------
    df = pd.read_csv("micro_mar.csv")
    print("Raw shape:", df.shape)

    # --------------------------------------------------------
    # 2. DROP USELESS COLUMNS (same logic as notebook)
    # --------------------------------------------------------
    useless_prefixes = [
        "account_fin",
        "account_mob",
        "fin1_",
        "fin2",
        "fin4",
        "fin4a",
        "fin5",
        "fin6",
        "fin7",
        "fin8",
        "fin8a",
        "fin8b",
        "fin9",
        "fin9a",
        "fin10",
        "fin10a",
        "fin10b",
        "fin11",
        "fin11a",
        "fin11b",
        "fin11c",
        "fin11d",
        "fin11e",
        "fin11f",
        "fin11g",
        "fin11h",
        "fin13",
        "fin14",
        "fin14_1",
        "fin14_2",
        "fin14a",
        "fin14a1",
        "fin14b",
        "fin14c",
        "fin14c_2",
        "fin16",
        "fin17",
        "fin17a",
        "fin17a1",
        "fin17b",
        "fin20",
        "fin22",
        "fin22a",
        "fin22b",
        "fin22c",
        "fin24",
        "fin24a",
        "fin24b",
        "fin26",
        "fin27",
        "fin27c1",
        "fin27c2",
        "fin28",
        "fin29",
        "fin29_1",
        "fin29c1",
        "fin29c2",
        "fin30",
        "fin31",
        "fin31a",
        "fin31b",
        "fin31b1",
        "fin31c",
        "fin32",
        "fin33",
        "fin34",
        "fin34a",
        "fin34b",
        "fin34d",
        "fin34e",
        "fin35",
        "fin37",
        "fin38",
        "fin39",
        "fin39a",
        "fin39b",
        "fin39d",
        "fin39e",
        "fin42",
        "fin42a",
        "fin43a",
        "fin43b",
        "fin43d",
        "fin43e",
        "fin44a",
        "fin44b",
        "fin44c",
        "fin44d",
        "fin45",
        "fin45_1",
    ]

    china_suffix = "_China"

    drop_cols = []
    for col in df.columns:
        if any(col.startswith(prefix) for prefix in useless_prefixes):
            drop_cols.append(col)
        elif col.endswith(china_suffix):
            drop_cols.append(col)

    manual_drop = [
        "economy",
        "economycode",
        "wpid_random",
        "wgt",
        "urbanicity_f2f",
        "mobileowner",
    ]
    for col in manual_drop:
        if col in df.columns:
            drop_cols.append(col)

    df_clean = df.drop(columns=drop_cols)
    print("After dropping columns:", df_clean.shape)

    # --------------------------------------------------------
    # 3. BASIC CLEANING & TYPE FIXES
    # --------------------------------------------------------
    # Age
    df_clean["age"] = pd.to_numeric(df_clean["age"], errors="coerce")
    df_clean["age"] = df_clean["age"].fillna(df_clean["age"].median()).astype(int)

    # Binary flags
    binary_cols = ["account", "saved", "borrowed", "anydigpayment", "merchantpay_dig"]
    for col in binary_cols:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].astype(int)

    # Ordered categories
    ordered_cat_cols = ["educ", "inc_q"]
    for col in ordered_cat_cols:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].astype("category")

    # Nominal categories
    nominal_cat_cols = [
        "female",
        "emp_in",
        "receive_wages",
        "receive_transfers",
        "receive_pension",
        "receive_agriculture",
        "pay_utilities",
        "remittances",
        "internetaccess",
    ]
    for col in nominal_cat_cols:
        if col in df_clean.columns:
            df_clean[col] = df_clean[col].astype("category")

    # --------------------------------------------------------
    # 4. FEATURE ENGINEERING
    # --------------------------------------------------------
    # 4.1 Digital activity
    df_clean["digital_activity"] = (
        df_clean["anydigpayment"] + df_clean["merchantpay_dig"]
    )

    # 4.2 Income sources (has_* + count)
    income_cols = [
        "receive_wages",
        "receive_transfers",
        "receive_pension",
        "receive_agriculture",
        "remittances",
    ]

    yes_codes = {
        "receive_wages": {1, 2, 3},
        "receive_transfers": {1, 2, 3},
        "receive_pension": {1, 2, 3},
        "receive_agriculture": {1, 2, 3},
        "remittances": {1, 2, 3, 4},
    }

    def income_binary(x, col):
        try:
            xi = int(x)
        except (ValueError, TypeError):
            return 0
        return 1 if xi in yes_codes[col] else 0

    for c in income_cols:
        new_col = f"has_{c}"
        df_clean[new_col] = df_clean[c].apply(lambda x, col=c: income_binary(x, col))

    has_income_cols = [f"has_{c}" for c in income_cols]
    df_clean["num_income_sources"] = df_clean[has_income_cols].sum(axis=1)

    # 4.3 Financial stability
    df_clean["financial_stability"] = (
        df_clean["saved"] + df_clean["account"] + df_clean["num_income_sources"]
    )

    # 4.4 Rename columns for clarity
    rename_map = {
        "female": "gender",
        "educ": "education_level",
        "inc_q": "income_quintile",
        "emp_in": "worked_last_7_days",
        "saved": "saved_last_year",
        "borrowed": "borrowed_last_year",
    }
    df_clean = df_clean.rename(columns=rename_map)

    # --------------------------------------------------------
    # 5. CREATE TARGET (risk_label)
    # --------------------------------------------------------
    df_clean["risk_label"] = 0
    df_clean.loc[
        (df_clean["borrowed_last_year"] == 1)
        & (df_clean["saved_last_year"] == 0)
        & (df_clean["num_income_sources"] == 0),
        "risk_label",
    ] = 1

    print("\nClass distribution (risk_label):")
    print(df_clean["risk_label"].value_counts())

    # --------------------------------------------------------
    # 6. ONE-HOT ENCODE CATEGORICAL FEATURES
    # --------------------------------------------------------
    categorical_cols = [
        "gender",
        "education_level",
        "income_quintile",
        "worked_last_7_days",
        "receive_wages",
        "receive_transfers",
        "receive_pension",
        "receive_agriculture",
        "pay_utilities",
        "remittances",
        "internetaccess",
    ]

    df_model = pd.get_dummies(df_clean, columns=categorical_cols, drop_first=True)

    # convert bool dummies to int
    bool_cols = df_model.select_dtypes(include="bool").columns
    df_model[bool_cols] = df_model[bool_cols].astype(int)

    print("Model dataframe shape:", df_model.shape)

    # --------------------------------------------------------
    # 7. DEFINE FEATURES & TARGET (REMOVE LEAKAGE)
    # --------------------------------------------------------
    leakage_features = ["borrowed_last_year", "saved_last_year", "num_income_sources"]
    X = df_model.drop(columns=["risk_label"] + leakage_features)
    y = df_model["risk_label"]

    feature_names = X.columns.tolist()

    print(f"\nFeatures after removing leakage: {X.shape[1]}")
    print(f"Removed leakage features: {leakage_features}")

    # --------------------------------------------------------
    # 8. TRAIN/TEST SPLIT + SMOTETomek
    # --------------------------------------------------------
    X_train, X_test, y_train, y_test = train_test_split(
        X,
        y,
        test_size=0.2,
        random_state=42,
        stratify=y,
    )

    print("\nOriginal train distribution:", Counter(y_train))
    print("Test distribution:", Counter(y_test))

    smt = SMOTETomek(random_state=42)
    X_train_res, y_train_res = smt.fit_resample(X_train, y_train)

    print("\nAfter SMOTETomek (train only):", Counter(y_train_res))

    # --------------------------------------------------------
    # 9. SCALING + LOGISTIC REGRESSION TRAINING
    # --------------------------------------------------------
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train_res)
    X_test_scaled = scaler.transform(X_test)

    lr_model = LogisticRegression(random_state=42, max_iter=1000)
    lr_model.fit(X_train_scaled, y_train_res)

    # --------------------------------------------------------
    # 10. QUICK EVALUATION
    # --------------------------------------------------------
    y_pred = lr_model.predict(X_test_scaled)
    y_proba = lr_model.predict_proba(X_test_scaled)[:, 1]

    print("\n=== LOGISTIC REGRESSION EVALUATION ===")
    print(classification_report(y_test, y_pred, target_names=["Low Risk", "High Risk"]))

    metrics = {
        "Accuracy": (y_pred == y_test).mean(),
        "Balanced Accuracy": balanced_accuracy_score(y_test, y_pred),
        "F1 Score": f1_score(y_test, y_pred),
        "ROC-AUC": roc_auc_score(y_test, y_proba),
        "PR-AUC": average_precision_score(y_test, y_proba),
    }
    for k, v in metrics.items():
        print(f"{k:18s}: {v:.4f}")

    # --------------------------------------------------------
    # 11. SAVE ARTIFACTS FOR DEPLOYMENT
    # --------------------------------------------------------
    joblib.dump(lr_model, "credit_risk_lr.pkl")
    joblib.dump(scaler, "scaler.pkl")
    joblib.dump(feature_names, "feature_names.pkl")

    print("\nSaved:")
    print("  credit_risk_lr.pkl")
    print("  scaler.pkl")
    print("  feature_names.pkl")


if __name__ == "__main__":
    main()
