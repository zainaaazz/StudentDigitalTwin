
import os
import math
import pandas as pd
import numpy as np
import itertools
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Input, LSTM, Dropout, Dense
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.utils import to_categorical
from sklearn.model_selection import train_test_split
from tqdm import tqdm
from sklearn.metrics import (
    accuracy_score,
    classification_report,
    confusion_matrix,
    roc_auc_score
)

# ── Configuration ────────────────────────────────────────────────────────────────
DATA_PATH       = r"C:\Users\USER-PC\Desktop\HumanDigitalTwin_LSTM\Training Iteration #11 - ANN time series\data.csv"
LABEL_COL       = 'final_result'
LABEL_MAP       = {'Withdrawn':0, 'Fail':1, 'Pass':2, 'Distinction':3}
MODEL_SAVE_DIR  = os.path.dirname(DATA_PATH)
MODEL_SAVE_PATH = os.path.join(MODEL_SAVE_DIR, "Train11Model")
VAL_SPLIT       = 0.20
CHUNKSIZE       = 5000   # rows per streaming batch
EPOCHS          = 100

# ── 1) Auto-detect feature columns ────────────────────────────────────────────────
cols_all     = pd.read_csv(DATA_PATH, nrows=0).columns.tolist()
exclude      = {'Unnamed: 0', 'student_id', 'time_step', LABEL_COL}
feature_cols = [c for c in cols_all if c not in exclude]
print(f"Detected {len(feature_cols)} feature columns.")

# ── 2) Compute total_chunks and split counts ──────────────────────────────────────
total_chunks = sum(
    1 for _ in pd.read_csv(
        DATA_PATH,
        usecols=feature_cols + [LABEL_COL],
        chunksize=CHUNKSIZE
    )
)
train_chunks = math.floor(total_chunks * (1 - VAL_SPLIT))
val_chunks   = total_chunks - train_chunks
steps_per_epoch   = train_chunks
validation_steps  = val_chunks
print(f"Total chunks: {total_chunks}, Train: {train_chunks}, Val: {val_chunks}")

# ── 3) Pre-fit MinMaxScaler on a sample ───────────────────────────────────────────
sample = pd.read_csv(DATA_PATH, usecols=feature_cols, nrows=5000)
scaler = MinMaxScaler().fit(sample)

# ── 4) Build ANN-LSTM model ───────────────────────────────────────────────────────
model = Sequential([
    Input(shape=(1, len(feature_cols))),
    LSTM(200),
    Dropout(0.2),
    Dense(100, activation='relu'),
    Dropout(0.2),
    Dense(len(LABEL_MAP), activation='softmax')
])
model.compile(
    loss='categorical_crossentropy',
    optimizer=Adam(learning_rate=1e-3),
    metrics=['categorical_accuracy']
)
model.summary()

# ── 5) CSV generator for train/val ───────────────────────────────────────────────
def csv_generator(path, chunk_size, train=True):
    usecols = feature_cols + [LABEL_COL]
    for chunk in pd.read_csv(path, usecols=usecols, chunksize=chunk_size):
        X = scaler.transform(chunk[feature_cols]).reshape(-1, 1, len(feature_cols))
        y = to_categorical(
            chunk[LABEL_COL].map(LABEL_MAP).values,
            num_classes=len(LABEL_MAP)
        )
        X_tr, X_val, y_tr, y_val = train_test_split(
            X, y,
            test_size=VAL_SPLIT,
            random_state=42,
            stratify=np.argmax(y, axis=1)
        )
        if train:
            yield X_tr, y_tr
        else:
            yield X_val, y_val

# ── 6) Wrap slices in actual generator functions ─────────────────────────────────
def train_generator():
    return itertools.islice(csv_generator(DATA_PATH, CHUNKSIZE, train=True), train_chunks)

def val_generator():
    return itertools.islice(csv_generator(DATA_PATH, CHUNKSIZE, train=False), val_chunks)

# ── 7) Train with callbacks ───────────────────────────────────────────────────────
callbacks = [
    EarlyStopping(monitor='val_loss', patience=8, restore_best_weights=True),
    ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=4)
]

print("\n=== Starting training (iteration 11) ===")
model.fit(
    train_generator(),            # note the () to create a generator
    steps_per_epoch=steps_per_epoch,
    epochs=EPOCHS,
    validation_data=val_generator(),  
    validation_steps=validation_steps,
    callbacks=callbacks,
    verbose=2
)

# ── 8) Final evaluation ───────────────────────────────────────────────────────────
print("\n=== Starting final evaluation over the full dataset… ===")
y_true = []
y_prob = []
for chunk in tqdm(
    pd.read_csv(DATA_PATH, usecols=feature_cols + [LABEL_COL], chunksize=CHUNKSIZE),
    total=total_chunks,
    desc="Evaluating"
):
    X = scaler.transform(chunk[feature_cols]).reshape(-1, 1, len(feature_cols))
    y = to_categorical(
        chunk[LABEL_COL].map(LABEL_MAP).values,
        num_classes=len(LABEL_MAP)
    )
    preds = model.predict(X, verbose=0)
    y_prob.extend(preds)
    y_true.extend(np.argmax(y, axis=1))

y_true = np.array(y_true)
y_prob = np.array(y_prob)
y_pred = np.argmax(y_prob, axis=1)

acc    = accuracy_score(y_true, y_pred)
report = classification_report(y_true, y_pred, target_names=list(LABEL_MAP.keys()))
cm     = confusion_matrix(y_true, y_pred)
try:
    auc = roc_auc_score(pd.get_dummies(y_true), y_prob, multi_class='ovr')
except ValueError:
    auc = None

print("\n======== Final Model Evaluation Report ========")
print(f"Accuracy       : {acc:.4f}")
if auc is not None:
    print(f"ROC AUC (ovr)  : {auc:.4f}")
print("\nClassification Report:\n", report)
print("Confusion Matrix:\n", cm)

# ── 9) Export the trained model ────────────────────────────────────────────────────
os.makedirs(MODEL_SAVE_PATH, exist_ok=True)
model.export(MODEL_SAVE_PATH)
print(f"\nModel exported to: {MODEL_SAVE_PATH}")
