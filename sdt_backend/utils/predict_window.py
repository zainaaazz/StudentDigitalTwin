import json
import sys
import os


def main():
    try:
        import numpy as np
        import pickle
        try:
            import sklearn  # noqa: F401
        except Exception:
            pass
        from tensorflow.keras.models import load_model
    except Exception as e:  # noqa: BLE001
        err = {
            "success": False,
            "error": f"Python runtime missing dependencies: {e}",
        }
        print(json.dumps(err))
        return

    try:
        payload = json.loads(sys.stdin.read())
        model_dir = payload["model_dir"]
        scaler_path = payload["scaler_path"]
        feats_path = payload["feats_path"]
        student_id = int(payload["student_id"])
        start_day = int(payload["start_day"])
        end_day = int(payload["end_day"])
        labels = payload.get("labels") or ["Distinction", "Fail", "Pass", "Withdrawn"]
        rows = payload.get("rows", [])

        # Load scaler + feature columns
        with open(scaler_path, "rb") as f:
            scaler = pickle.load(f)
        with open(feats_path, "rb") as f:
            feature_cols = pickle.load(f)

        # Ensure feature columns list
        if not isinstance(feature_cols, (list, tuple)):
            feature_cols = list(feature_cols)

        # Convert rows to dicts for the requested student
        rows = [r for r in rows if int(r.get("id_student", -1)) == student_id]

        # Pre-aggregate rows into exactly one vector per calendar day (int(date)).
        # Many datasets contain multiple interactions per day; models were trained
        # on day-level windows, so we sum features per day to build a stable sequence.
        def row_to_vec(r):
            vec = []
            for c in feature_cols:
                v = r.get(c, 0.0)
                try:
                    v = float(v)
                except Exception:
                    v = 0.0
                vec.append(v)
            return vec

        agg_by_day = {}
        for r in rows:
            try:
                d = int(float(r.get("date", 0)))
            except Exception:
                continue
            if d not in agg_by_day:
                agg_by_day[d] = row_to_vec(r)
            else:
                # Sum features for the day
                prev = agg_by_day[d]
                cur = row_to_vec(r)
                agg_by_day[d] = [float(prev[i]) + float(cur[i]) for i in range(len(prev))]

        def prepare_input_sequence(day: int):
            # Build a strict day-level matrix of shape (day, n_features)
            mats = []
            for d in range(1, day + 1):
                if d in agg_by_day:
                    mats.append(agg_by_day[d])
                else:
                    mats.append([0.0] * len(feature_cols))

            X = np.array(mats, dtype=float)
            # Scale per row if scaler is available and X has data
            if X.size:
                X = scaler.transform(X)
            else:
                X = np.zeros((0, len(feature_cols)), dtype=float)

            # Adjust sequence length to exactly `day`
            # If we have fewer than `day` timesteps, pad at the beginning
            if X.shape[0] < day:
                if X.shape[0] == 0:
                    pad_row = np.zeros((1, len(feature_cols)), dtype=float)
                else:
                    pad_row = X[:1, :]
                pad_len = day - X.shape[0]
                X = np.vstack([np.repeat(pad_row, pad_len, axis=0), X])
            # If we have more than `day` timesteps (e.g., multiple rows per calendar day),
            # keep the most recent `day` rows so the shape matches (day, n_features)
            elif X.shape[0] > day:
                X = X[-day:, :]

            # Reshape to (1, time_steps, n_features)
            X = X.reshape(1, day, len(feature_cols))
            return X

        out = []
        for day in range(start_day, end_day + 1):
            model_path = os.path.join(model_dir, f"model_day_{day}.h5")
            exists = os.path.exists(model_path)
            if not exists:
                out.append({
                    "day": day,
                    "model_available": False,
                    "pred_label": None,
                    "pred_index": None,
                    "confidence": None,
                })
                continue

            try:
                model = load_model(model_path, compile=False)
                X = prepare_input_sequence(day)
                y = model.predict(X, verbose=0)
                # Support both (1, day, C) and (1, C)
                if y.ndim == 3:
                    probs = y[0, -1, :]
                else:
                    probs = y[0]
                probs = np.array(probs).astype(float)
                idx = int(np.argmax(probs))
                conf = float(probs[idx])
                label = labels[idx] if 0 <= idx < len(labels) else f"class_{idx}"
                out.append({
                    "day": day,
                    "model_available": True,
                    "pred_label": label,
                    "pred_index": idx,
                    "confidence": conf,
                })
            except Exception as e:  # noqa: BLE001
                out.append({
                    "day": day,
                    "model_available": True,
                    "pred_label": f"ERROR: {e}",
                    "pred_index": None,
                    "confidence": None,
                })

        print(json.dumps({"success": True, "data": out}))
    except Exception as e:  # noqa: BLE001
        print(json.dumps({"success": False, "error": str(e)}))


if __name__ == "__main__":
    main()
